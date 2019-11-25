import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";
import * as wallet from "wallet";
import { push as pushHistory } from "react-router-redux";
import { hexReversedHashToArray, reverseRawHash } from "helpers";
import { setPoliteiaPath, getEligibleTickets, saveEligibleTickets, savePiVote, getProposalWalletVote, removeCachedProposals } from "main_dev/paths";

// Proposal vote status codes from politeiawww's v1.PropVoteStatusT
// PropVoteStatusInvalid       PropVoteStatusT = 0 // Invalid vote status
// PropVoteStatusNotAuthorized PropVoteStatusT = 1 // Vote has not been authorized by author
// PropVoteStatusAuthorized    PropVoteStatusT = 2 // Vote has been authorized by author
// PropVoteStatusStarted       PropVoteStatusT = 3 // Proposal vote has been started
// PropVoteStatusFinished      PropVoteStatusT = 4 // Proposal vote has been finished
// PropVoteStatusDoesntExist   PropVoteStatusT = 5 // Proposal doesn't exist
//
// source: https://github.com/decred/politeia/blob/master/politeiawww/api/www/v1/v1.go

export const VOTESTATUS_ACTIVEVOTE = 3;
export const VOTESTATUS_FINISHEDVOTE = 4;
export const PROPOSALSTATUS_ABANDONED = 6;

// Aux function to parse the vote status of a single proposal, given a response
// for the /votesStatus or /proposal/P/voteStatus api calls, then fill the
// proposal object with the results.
const fillVoteSummary = (proposal, voteSummary, blockTimestampFromNow) => {
  proposal.quorumPass = false;
  proposal.voteResult = "declined";
  proposal.endTimestamp = blockTimestampFromNow(parseInt(voteSummary.endheight));
  proposal.voteCounts = {};
  proposal.voteOptions = [];
  proposal.startVoteHeight = voteSummary.endheight - voteSummary.duration;

  let totalVotes = 0;
  if (voteSummary.results) {
    voteSummary.results.forEach(o => {
      proposal.voteOptions.push(o.option);
      proposal.voteCounts[o.option.id] = o.votesreceived;
      totalVotes += o.votesreceived;
    });
  }

  const quorum = voteSummary.quorumpercentage ? voteSummary.quorumpercentage : 20;
  const eligibleVotes = voteSummary.eligibletickets;
  const passPercentage = voteSummary.passpercentage ? voteSummary.passpercentage : 60;
  proposal.quorumMinimumVotes = eligibleVotes * (quorum / 100);
  proposal.voteStatus = voteSummary.status;

  if (totalVotes > proposal.quorumMinimumVotes) {
    proposal.quorumPass = true;
  }

  if (proposal.voteCounts["yes"] / totalVotes > passPercentage / 100) {
    proposal.voteResult = "passed";
  }
};

// getProposalEligibleTickets gets the wallet eligible tickets from a specific proposal.
// if the proposal directory already exists it only returns the cached information,
// otherwise it gets the eligible tickets from politeia and caches it.
const getProposalEligibleTickets = async (token, allEligibleTickets, shouldCache, walletService) => {
  // Aux function to get the tickets from the wallet that are eligible to vote
  // (committed tickets) for a given proposal (given a list of eligible tickets
  // returned from an activevotes call)
  const getWalletEligibleTickets = async (eligibleTickets, walletService) => {
    const ticketHashesToByte = (hashes) => hashes.map(hexReversedHashToArray);
    const commitedTicketsResp = await wallet.committedTickets(
      walletService, ticketHashesToByte(eligibleTickets)
    );
    let tickets = commitedTicketsResp.getTicketaddressesList();

    tickets = tickets.map(t => ({
      ticket: reverseRawHash(t.getTicket()),
      address: t.getAddress()
    }));

    const ticketsArray = tickets.reduce((tickets, t) => {
      tickets.push(t);
      return tickets;
    }, []);
    return ticketsArray;
  };

  const eligibleTicketsObj = getEligibleTickets(token);
  if (eligibleTicketsObj) {
    const { eligibleTickets } = eligibleTicketsObj;
    return await getWalletEligibleTickets(eligibleTickets, walletService);
  }

  if (shouldCache) {
    saveEligibleTickets(token, { eligibleTickets: allEligibleTickets });
  }

  return await getWalletEligibleTickets(allEligibleTickets, walletService);
};

export const GETTOKEN_INVENTORY_ATTEMPT = "GETTOKEN_INVENTORY_ATTEMPT";
export const GETTOKEN_INVENTORY_SUCCESS = "GETTOKEN_INVENTORY_SUCCESS";
export const GETTOKEN_INVENTORY_FAILED = "GETTOKEN_INVENTORY_FAILED";

const getTokenInventory = () => async (dispatch, getState) => {
  dispatch({ type: GETTOKEN_INVENTORY_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  try {
    const { data } = await pi.getTokenInventory(piURL);
    const inventoryTabs = {
      activeVote: [],
      abandonedVote: [],
      finishedVote: [],
      preVote: []
    };

    inventoryTabs.preVote = data.pre;
    inventoryTabs.activeVote = data.active;
    inventoryTabs.finishedVote = [ ...data.approved, ...data.rejected ];
    inventoryTabs.abandonedVote = data.abandoned;

    dispatch({ type: GETTOKEN_INVENTORY_SUCCESS, inventory: inventoryTabs });
  } catch (error) {
    dispatch({ error, GETTOKEN_INVENTORY_FAILED });
  }
};

// getInitialBatch Gets the first pre and active proposals batch
const getInitialBatch = () => async (dispatch, getState) => {
  const inventory = sel.inventory(getState());
  const proposallistpagesize = sel.proposallistpagesize(getState());
  if (!inventory) return;
  if (!inventory.activeVote && !inventory.preVote) return;

  let activeVoteProposalNumber = proposallistpagesize;
  let preVoteProposalNumber = proposallistpagesize;
  if (inventory.activeVote.length < proposallistpagesize) {
    activeVoteProposalNumber = inventory.activeVote.length;
  }
  if (inventory.preVote.length < proposallistpagesize) {
    preVoteProposalNumber = inventory.preVote.length;
  }
  const activeVoteBatch = inventory.activeVote.slice(0, activeVoteProposalNumber);
  const preVoteBatch = inventory.preVote.slice(0, preVoteProposalNumber);
  await dispatch(getProposalsAndUpdateVoteStatus(activeVoteBatch));
  await dispatch(getProposalsAndUpdateVoteStatus(preVoteBatch));
};

// getVoteOption gets the wallet vote if cached or return abstain.
const getVoteOption = (token, proposal, castVotes, walletEligibleTickets, testnet, walletName) => {
  // We assume all tickets have vote the same bit
  const vote = getProposalWalletVote(token, testnet, walletName);
  if (vote) {
    return vote.voteChoice;
  }

  if (!castVotes || (!walletEligibleTickets || walletEligibleTickets.length === 0)) return;

  const voteChoice = castVotes.find((vote) => {
    if(vote.ticket === walletEligibleTickets[0].ticket) {
      return true;
    }
    return false;
  });

  if (!voteChoice) return;

  const currentVoteChoice = proposal.voteOptions.find(option =>
    // votebit is all lowercase as it comes from pi api.
    voteChoice.votebit === "" + option.bits
  );

  return currentVoteChoice;
};

export const getTokenAndInitialBatch = () => async (dispatch, getState) => {
  setPoliteiaPath();
  await dispatch(getTokenInventory());
  const inventory = sel.inventory(getState());
  // remove proposals cache which are not in the inventory activeVote
  removeCachedProposals(inventory.activeVote);
  await dispatch(getInitialBatch());
};

export const DISABLE_POLITEIA_SUCCESS = "DISABLE_POLITEIA_SUCCESS";

export const resetInventoryAndProposals = () => dispatch => {
  dispatch({ type: DISABLE_POLITEIA_SUCCESS });
};

export const GET_PROPOSAL_BATCH_ATTEMPT = "GET_PROPOSAL_BATCH_ATTEMPT";
export const GET_PROPOSAL_BATCH_SUCCESS = "GET_PROPOSAL_BATCH_SUCCESS";
export const GET_PROPOSAL_BATCH_FAILED = "GET_PROPOSAL_BATCH_FAILED";

const getProposalsBatch = async (tokensBatch, piURL) => {
  const requestResponse = await pi.getProposalsBatch(piURL, tokensBatch);
  return requestResponse.data;
};

export const GET_PROPOSALS_VOTESTATUS_BATCH_ATTEMPT = "GET_PROPOSALS_VOTESTATUS_BATCH_ATTEMPT";
export const GET_PROPOSALS_VOTESTATUS_BATCH_SUCCESS = "GET_PROPOSALS_VOTESTATUS_BATCH_SUCCESS";
export const GET_PROPOSALS_VOTESTATUS_BATCH_FAILED = "GET_PROPOSALS_VOTESTATUS_BATCH_FAILED";

const getProposalsVotestatusBatch = async (tokensBatch, piURL) => {
  const requestResponse = await pi.getProposalsVoteStatusBatch(piURL, tokensBatch);
  return requestResponse.data;
};

export const GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT = "GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT";
export const GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS = "GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS";
export const GETPROPROSAL_UPDATEVOTESTATUS_FAILED = "GETPROPROSAL_UPDATEVOTESTATUS_FAILED";

// getProposalsAndUpdateVoteStatus gets a proposal batch and its vote summary
// and concat with proposals from getState
export const getProposalsAndUpdateVoteStatus = (tokensBatch) => async (dispatch, getState) => {
  // tokensBatch batch legnth can not exceed politeia's proposallistpagesize limit
  // otherwise it will return ErrorStatusMaxProposalsExceededPolicy

  const findProposal = (proposals, token) =>
    proposals.find( proposal => proposal.censorshiprecord.token === token ? proposal : null );

  const concatProposals = (oldProposals, newProposals) => {
    const response = {};
    // We copy oldProposals in order to avoid modifying it triggering render
    const oldProposalsCopy = Object.assign({}, oldProposals);
    Object.keys(oldProposalsCopy).forEach( key => {
      if (oldProposalsCopy[key] && oldProposalsCopy[key].length > 0) {
        for (let i = 0; i < newProposals[key].length; i++) {
          const newProp = newProposals[key][i];
          if (findProposal(oldProposalsCopy[key], newProp.token)) {
            oldProposalsCopy[key][i] = newProp;
            continue;
          }
          oldProposalsCopy[key].push(newProp);
        }
        response[key] = oldProposalsCopy[key];
      } else {
        response[key] = newProposals[key];
      }
    });

    return response;
  };

  dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT });
  let proposalsUpdated = {
    activeVote: [],
    abandonedVote: [],
    finishedVote: [],
    preVote: []
  };

  const blockTimestampFromNow = sel.blockTimestampFromNow(getState());
  const piURL = sel.politeiaURL(getState());
  const oldProposals = sel.proposals(getState());
  const lastPoliteiaAccessTime = sel.lastPoliteiaAccessTime(getState());
  const walletName = sel.getWalletName(getState());
  const testnet = sel.isTestNet(getState());
  const lastPoliteiaAccessBlock = sel.lastPoliteiaAccessBlock(getState());

  try {
    const { proposals } = await getProposalsBatch(tokensBatch,piURL);
    const { summaries } = await getProposalsVotestatusBatch(tokensBatch, piURL);
    const { bestBlock } = summaries;
    tokensBatch.forEach( token => {
      const proposalSummary = summaries[token];
      const { status } = proposalSummary;
      const prop = findProposal(proposals, token);
      prop.token = token;
      prop.proposalStatus = prop.status;

      fillVoteSummary(prop, proposalSummary, blockTimestampFromNow);
      prop.currentVoteChoice = getVoteOption(token, prop, null, null, testnet, walletName);

      if (prop.timestamp > lastPoliteiaAccessTime) {
        prop.modifiedSinceLastAccess = true;
      }
      if (prop.startVoteHeight > lastPoliteiaAccessBlock) {
        prop.votingSinceLastAccess = true;
      }

      // if proposal is not abandoned we check its votestatus
      if (prop.proposalStatus === PROPOSALSTATUS_ABANDONED) {
        proposalsUpdated.abandonedVote.push(prop);
      } else {
        switch (status) {
        case VOTESTATUS_ACTIVEVOTE:
          proposalsUpdated.activeVote.push(prop);
          break;
        case VOTESTATUS_FINISHEDVOTE:
          proposalsUpdated.finishedVote.push(prop);
          break;
        default:
          proposalsUpdated.preVote.push(prop);
          break;
        }
      }
    });

    // concat new proposals list array to old proposals list array
    const concatedProposals = concatProposals(oldProposals, proposalsUpdated);
    return dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS, proposals: concatedProposals, bestBlock } );
  } catch (error) {
    dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_FAILED, error });
    throw error;
  }
};

export const GETPROPOSAL_ATTEMPT = "GETPROPOSAL_ATTEMPT";
export const GETPROPOSAL_FAILED = "GETPROPOSAL_FAILED";
export const GETPROPOSAL_SUCCESS = "GETPROPOSAL_SUCCESS";

export const getProposalDetails = (token) => async (dispatch, getState) => {
  const decodeFilePayload = (f) => {
    switch (f.mime) {
    case "text/plain; charset=utf-8":
      return atob(f.payload);
    default:
      return f.payload;
    }
  };

  const getProposal = async (proposals, token) => {
    let proposal;
    const keys = Object.keys(proposals);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      proposal = proposals[key].find(p => p.token === token);
      if (proposal) return proposal;
    }
  };

  dispatch({ type: GETPROPOSAL_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  const walletName = sel.getWalletName(getState());
  const testnet = sel.isTestNet(getState());
  let walletEligibleTickets;
  let hasEligibleTickets = false;
  let currentVoteChoice;

  try {
    const request = await pi.getProposal(piURL, token);

    const { walletService } = getState().grpc;
    const proposals = getState().governance.proposals;
    let proposal = await getProposal(proposals, token);

    const p = request.data.proposal;
    const files = p.files.map(f => {
      return {
        digest: f.digest,
        mime: f.mime,
        name: f.name,
        payload: decodeFilePayload(f)
      };
    });

    proposal = {
      ...proposal,
      creator: p.username,
      token: token,
      version: p.version,
      name: p.name,
      numComments: p.numcomments,
      timestamp: p.timestamp,
      files: files,
      hasDetails: true,
      hasEligibleTickets: false
    };

    const voteAndEligibleTickets = getProposalWalletVote(token, testnet, walletName);
    if (voteAndEligibleTickets) {
      walletEligibleTickets = voteAndEligibleTickets.walletEligibleTickets;
      currentVoteChoice = voteAndEligibleTickets.voteChoice;
      hasEligibleTickets = walletEligibleTickets && walletEligibleTickets.length > 0;
    } else {
      const voteReq = await pi.getProposalVotes(piURL, token);
      const { startvotereply, castvotes  } = voteReq.data;
      if (proposal.voteStatus === VOTESTATUS_ACTIVEVOTE) {
        walletEligibleTickets = await getProposalEligibleTickets(proposal.token, startvotereply.eligibletickets, true, walletService);
      } else if (proposal.voteStatus === VOTESTATUS_FINISHEDVOTE) {
        walletEligibleTickets = await getProposalEligibleTickets(proposal.token, startvotereply.eligibletickets, false, walletService);
      }
      currentVoteChoice = getVoteOption(token, proposal, castvotes, walletEligibleTickets, testnet, walletName) || "abstain";
      hasEligibleTickets = walletEligibleTickets && walletEligibleTickets.length > 0;
      if (currentVoteChoice !== "abstain") {
        const votesToCache = { token, walletEligibleTickets, voteChoice: currentVoteChoice };
        savePiVote(votesToCache, token, testnet, walletName);
      }
    }

    // update proposal reference from proposals state
    Object.keys(proposals).forEach(key => proposals[key].find( (p, i) => {
      if (p.token === token) {
        proposal = { ...proposal,
          modifiedSinceLastAccess: false,
          votingSinceLastAccess: false,
          walletEligibleTickets, hasEligibleTickets, currentVoteChoice
        };
        return proposals[key][i] = { ...proposal };
      }
    }));

    dispatch({ token, proposal, proposals, type: GETPROPOSAL_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETPROPOSAL_FAILED });
    throw error;
  }
};

export const viewProposalDetails = (token) => (dispatch, getState) => {
  const details = sel.proposalsDetails(getState());
  if (!details[token] || !details[token].hasDetails) {
    dispatch(getProposalDetails(token));
  }
  dispatch(pushHistory("/governance/proposals/details/" + token));
};

export const UPDATEVOTECHOICE_ATTEMPT = "UPDATEVOTECHOICE_ATTEMPT";
export const UPDATEVOTECHOICE_SUCCESS = "UPDATEVOTECHOICE_SUCCESS";
export const UPDATEVOTECHOICE_FAILED = "UPDATEVOTECHOICE_FAILED";

// updateVoteChoice cast vote into pi server, if success we cache the vote information
// updates the proposal vote summary and dispatch it with its new result.
export const updateVoteChoice = (proposal, newVoteChoiceID, passphrase) => async (dispatch, getState) => {
  const { walletService } = getState().grpc;
  const blockTimestampFromNow = sel.blockTimestampFromNow(getState());
  const piURL = sel.politeiaURL(getState());
  const walletName = sel.getWalletName(getState());
  const testnet = sel.isTestNet(getState());
  const { token } = proposal;
  const { walletEligibleTickets } = proposal;

  const voteChoice = proposal.voteOptions.find(o => o.id === newVoteChoiceID);
  if (!voteChoice) throw "Unknown vote choice for proposal";

  const messages = walletEligibleTickets.map(t => {
    // msg here needs to follow the same syntax as what is defined on
    // politeiavoter.
    const msg = token + t.ticket + voteChoice.bits.toString(16);
    return { address: t.address, message: msg };
  });

  const updatePropRef = async (proposals, token, newProposal) => {
    const keys = Object.keys(proposals);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let proposal, j;
      proposal = proposals[key].find( (p, ind) => {
        j = ind;
        return p.token === token;
      });
      if (proposal) {
        newProposal.currentVoteChoice = voteChoice;
        return proposals[key][j] = { ...newProposal };
      }
    }
  };

  dispatch({ type: UPDATEVOTECHOICE_ATTEMPT });
  try {
    const signed = await wallet.signMessages(walletService, passphrase, messages);

    const votes = [];
    const votesToCache = { token, walletEligibleTickets, voteChoice };
    const sigs = signed.getRepliesList();
    proposal.walletEligibleTickets.forEach((t, i) => {
      const signature = sigs[i];
      if (signature.getError() != "") {
        return;
      }
      const hexSig = Buffer.from(signature.getSignature()).toString("hex");

      const voteBit = voteChoice.bits.toString(16);
      const vote = { token, ticket: t.ticket, voteBit, signature: hexSig };
      votes.push(vote);
    });

    // cast vote into pi server
    await pi.castVotes(piURL, votes);
    // cache information locally so we can show them without querying from
    // pi server.
    savePiVote(votesToCache, token, testnet, walletName);

    // update proposal vote status, so we can see our vote counting towards
    // the totals.
    const newProposal = { ...proposal };
    const { summaries } = await getProposalsVotestatusBatch([ token ], piURL);
    fillVoteSummary(newProposal, summaries[token], blockTimestampFromNow);

    const proposals = getState().governance.proposals;
    await updatePropRef(proposals, token, newProposal);

    dispatch({ votes, proposals, proposal: newProposal, token, type: UPDATEVOTECHOICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: UPDATEVOTECHOICE_FAILED });
    throw error;
  }
};
