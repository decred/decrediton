import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";
import * as wallet from "wallet";
// import { replace } from "fp";
// import { getWalletCfg } from "../config";
import { push as pushHistory } from "react-router-redux";
import { hexReversedHashToArray, reverseRawHash } from "helpers";

// Proposal vote status codes from politeiawww's v1.PropVoteStatusT
// source: https://github.com/decred/politeia/blob/master/politeiawww/api/www/v1/v1.go
// PropVoteStatusInvalid       PropVoteStatusT = 0 // Invalid vote status
// PropVoteStatusNotAuthorized PropVoteStatusT = 1 // Vote has not been authorized by author
// PropVoteStatusAuthorized    PropVoteStatusT = 2 // Vote has been authorized by author
// PropVoteStatusStarted       PropVoteStatusT = 3 // Proposal vote has been started
// PropVoteStatusFinished      PropVoteStatusT = 4 // Proposal vote has been finished
// PropVoteStatusDoesntExist   PropVoteStatusT = 5 // Proposal doesn't exist
export const VOTESTATUS_ACTIVEVOTE = 3;
export const VOTESTATUS_FINISHEDVOTE = 4;
export const VOTESTATUS_ABANDONED = 6;

// Aux function to parse the vote status of a single proposal, given a response
// for the /votesStatus or /proposal/P/voteStatus api calls, then fill the
// proposal object with the results.
const fillVoteSummary = (proposal, voteSummary, blockTimestampFromNow) => {
  proposal.quorumPass = false;
  proposal.voteResult = "declined";
  proposal.endTimestamp = blockTimestampFromNow(parseInt(voteSummary.endheight));
  proposal.voteCounts = {};
  proposal.voteOptions = [];

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

  if (totalVotes > proposal.quorumMinimumVotes) {
    proposal.quorumPass = true;
  }

  if (proposal.voteCounts["yes"] / totalVotes > passPercentage / 100) {
    proposal.voteResult = "passed";
  }
};

// Aux function to parse the votes information of a single proposal, given a
// response to that proposal's /votes api call and fill the proposal object.
const fillVotes = async (data, walletService) => {
  if (!data) {
    return;
  }

  const proposal = {};
  const eligibleTickets = data.startvotereply && await getWalletCommittedTickets(data.startvotereply.eligibletickets, walletService);
  const eligibleTicketsByHash = eligibleTickets && eligibleTickets.reduce( (m, t) => { m[t.ticket] = true; return m; }, {});
  
  proposal.eligibleTickets = eligibleTickets;
  proposal.hasEligibleTickets = eligibleTickets && eligibleTickets.length > 0;
  proposal.currentVoteChoice = "abstain";
  proposal.startBlockHeight = data.startvotereply ? parseInt(data.startvotereply.startblockheight) : null;

  // Find out if this wallet has voted in this prop and what was the choice.
  // This assumes the wallet will cast all available votes the same way.
  data.castvotes && data.castvotes.some(vote => {
    proposal.voteBit = parseInt(vote.votebit);
    // proposal.voteCounts.abstain -= 1; // TODO: support abstain
  });

  return proposal;
};

// Aux function to get the tickets from the wallet that are eligible to vote
// (committed tickets) for a given proposal (given a list of eligible tickets
// returned from an activevotes call)
const getWalletCommittedTickets = async (eligibleTickets, walletService) => {
  const ticketHashesToByte = (hashes) => hashes.map(hexReversedHashToArray);

  const commitedTicketsResp = await wallet.committedTickets(walletService,
    ticketHashesToByte(eligibleTickets));
  const tickets = commitedTicketsResp.getTicketaddressesList();

  return tickets.map(t => ({
    ticket: reverseRawHash(t.getTicket()),
    address: t.getAddress(),
  }));
};

// TODO call this function only once and cache result
// Aux function to fill the vote result information on a given proposal.
const getProposalVoteResults = async (proposal, piURL, walletService) => {
  const request = await pi.getProposalVotes(piURL, proposal.token);
  let results;
  if (request && request.data) {
    results = await fillVotes(request.data, walletService);
  }

  return results;
};

export const GETTOKEN_INVENTORY_ATTEMPT = "GETTOKEN_INVENTORY_ATTEMPT";
export const GETTOKEN_INVENTORY_SUCCESS = "GETTOKEN_INVENTORY_SUCCESS";
export const GETTOKEN_INVENTORY_FAILED = "GETTOKEN_INVENTORY_FAILED";

export const getTokenInventory = () => async (dispatch, getState) => {
  dispatch({ type: GETTOKEN_INVENTORY_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  try {
    const { data } = await pi.getTokenInventory(piURL);
    const inventoryTabs = {
      activeVote: [],
      abandonedVote: [],
      finishedVote: [],
      preVote: [],
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

const findProposal = (proposals, token) =>
  proposals.find( proposal => proposal.censorshiprecord.token === token ? proposal : null );

export const GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT = "GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT";
export const GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS = "GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS";
export const GETPROPROSAL_UPDATEVOTESTATUS_FAILED = "GETPROPROSAL_UPDATEVOTESTATUS_FAILED";

export const getProposalsAndUpdateVoteStatus = (tokensBatch) => async (dispatch, getState) => {
  // tokensBatch batch legnth can not exceed politeia's proposallistpagesize limit
  // otherwise it will return ErrorStatusMaxProposalsExceededPolicy

  dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT });
  let proposalsUpdated = {
    activeVote: [],
    abandonedVote: [],
    finishedVote: [],
    preVote: [],
  };

  const blockTimestampFromNow = sel.blockTimestampFromNow(getState());
  const piURL = sel.politeiaURL(getState());
  const oldProposals = sel.proposals(getState());

  try {
    const { proposals } = await getProposalsBatch(tokensBatch,piURL);
    const { summaries } = await getProposalsVotestatusBatch(tokensBatch, piURL);
    const { bestBlock } = summaries;
    tokensBatch.forEach( token => {
      const proposalSummary = summaries[token];
      const { status } = proposalSummary;
      const prop = findProposal(proposals, token);

      fillVoteSummary(prop, proposalSummary, blockTimestampFromNow);

      prop.voteStatus = status;
      prop.token = prop.censorshiprecord.token;

      switch (status) {
      case VOTESTATUS_ABANDONED:
        proposalsUpdated.abandoned.push(prop);
        break;
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
    });

    Object.keys(proposalsUpdated).forEach( key =>
      proposalsUpdated[key] = oldProposals[key].concat(proposalsUpdated[key])
    );
    return dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS, proposals: proposalsUpdated, bestBlock } );
  } catch (error) {
    dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_FAILED, error });
    throw error;
  }
};

export const GETPROPOSAL_ATTEMPT = "GETPROPOSAL_ATTEMPT";
export const GETPROPOSAL_FAILED = "GETPROPOSAL_FAILED";
export const GETPROPOSAL_SUCCESS = "GETPROPOSAL_SUCCESS";

export const getProposalDetails = (token, markViewed) => async (dispatch, getState) => {
  const decodeFilePayload = (f) => {
    switch (f.mime) {
    case "text/plain; charset=utf-8":
      return atob(f.payload);
    default:
      return f.payload;
    }
  };

  dispatch({ type: GETPROPOSAL_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  const blockTimestampFromNow = sel.blockTimestampFromNow(getState());

  try {
    const request = await pi.getProposal(piURL, token);

    const { walletService } = getState().grpc;
    const proposals = getState().governance.proposals;
    let proposal;

    Object.keys(proposals).forEach(key =>
      proposals[key].find( p => p.token === token ? proposal = p : null ));

    const p = request.data.proposal;
    const files = p.files.map(f => {
      return {
        digest: f.digest,
        mime: f.mime,
        name: f.name,
        payload: decodeFilePayload(f),
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
      hasEligibleTickets: false,
      eligibleTickets: []
    };
    
    // // aux map from bit to vote choice id
    // const voteBitToChoice = proposal.voteOptions.reduce((m, o) => {
    //   m[o.bits] = o.id;
    //   return m;
    // }, {});
    // const choiceID = voteBitToChoice[parseInt(vote.votebit)];
    // if (!choiceID) { throw "Error: choiceID not found on vote when getting proposal votes"; }

    if (markViewed) {
      proposal.modifiedSinceLastAccess = false;
      proposal.votingSinceLastAccess = false;
    }

    if ([ VOTESTATUS_FINISHEDVOTE, VOTESTATUS_ACTIVEVOTE ].includes(proposal.voteStatus)) {
      const voteResult = await getProposalVoteResults(proposal, piURL, walletService, blockTimestampFromNow);
      proposal = {
        ...proposal,
        ...voteResult,
      }
    }

    dispatch({ token, proposal, type: GETPROPOSAL_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETPROPOSAL_FAILED });
    throw error;
  }
};

export const viewProposalDetails = (token) => (dispatch, getState) => {
  const details = sel.proposalsDetails(getState());
  if (!details[token] || !details[token].hasDetails) {
    dispatch(getProposalDetails(token, true));
  }
  dispatch(pushHistory("/governance/proposals/details/" + token));
};

export const UPDATEVOTECHOICE_ATTEMPT = "UPDATEVOTECHOICE_ATTEMPT";
export const UPDATEVOTECHOICE_SUCCESS = "UPDATEVOTECHOICE_SUCCESS";
export const UPDATEVOTECHOICE_FAILED = "UPDATEVOTECHOICE_FAILED";

export const updateVoteChoice = (proposal, newVoteChoiceID, passphrase) =>
  async (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const blockTimestampFromNow = sel.blockTimestampFromNow(getState());

    const voteChoice = proposal.voteOptions.find(o => o.id === newVoteChoiceID);
    if (!voteChoice) throw "Unknown vote choice for proposal";

    dispatch({ type: UPDATEVOTECHOICE_ATTEMPT });

    const messages = proposal.eligibleTickets.map(t => {
      // msg here needs to follow the same syntax as what is defined on
      // politeiavoter.
      const msg = proposal.token + t.ticket + voteChoice.bits.toString(16);
      return { address: t.address, message: msg };
    });

    try {
      const signed = await wallet.signMessages(walletService, passphrase, messages);

      const votes = [];
      const sigs = signed.getRepliesList();
      proposal.eligibleTickets.forEach((t, i) => {
        const signature = sigs[i];
        if (signature.getError() != "") {
          return;
        }
        const hexSig = Buffer.from(signature.getSignature()).toString("hex");

        votes.push(pi.Vote(proposal.token, t.ticket, voteChoice.bits, hexSig));
      });

      const piURL = sel.politeiaURL(getState());
      await pi.castVotes(piURL, votes);

      // update the vote count for the proposal from pi, so we can see our
      // vote counting towards the totals
      const newProposal = { ...proposal };
      await getProposalVoteResults(newProposal, piURL, walletService, blockTimestampFromNow);

      const existProposals = getState().governance.proposals;
      const proposals = {
        ...existProposals,
        [proposal.token]: newProposal
      };

      dispatch({ votes, proposals, type: UPDATEVOTECHOICE_SUCCESS });
    } catch (error) {
      dispatch({ error, type: UPDATEVOTECHOICE_FAILED });
    }
  };
