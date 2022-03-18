import { push as pushHistory } from "connected-react-router";
import { wallet, politeia as pi } from "wallet-preload-shim";
import { cloneDeep } from "fp";
import * as sel from "selectors";
import { hexReversedHashToArray, parseRawProposal } from "helpers";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_METADATA_FILE,
  PROPOSAL_VOTE_METADATA_FILE
} from "constants";
import { unlockAcctAndExecFn } from "./ControlActions";

const {
  setPoliteiaPath,
  getEligibleTickets,
  saveEligibleTickets,
  savePiVote,
  getProposalWalletVote,
  removeCachedProposals
} = pi;

// defaultInventory is how inventory and proposals are stored at our redux state.
const defaultInventory = {
  activeVote: [],
  abandonedVote: [],
  finishedVote: [],
  preVote: [],
  approvedVote: [],
  rejectedVote: []
};

// getDefaultInventory gets the inventory default's state.
const getDefaultInventory = () => cloneDeep(defaultInventory);

// Aux function to parse the vote status of a single proposal, given the
// proposal and it's vote summary, it fills the proposal object with the results.
const fillVoteSummary = (
  proposal,
  voteSummary,
  blockTimestampFromNow,
  blocksFromBestBlock
) => {
  proposal.quorumPass = false;
  proposal.voteResult = "declined";
  proposal.blocksLeft = blocksFromBestBlock(
    parseInt(voteSummary.endblockheight)
  );
  proposal.endTimestamp = blockTimestampFromNow(
    parseInt(voteSummary.endblockheight)
  );
  proposal.voteCounts = {};
  proposal.voteOptions = [];
  proposal.startVoteHeight = voteSummary.endblockheight - voteSummary.duration;

  let totalVotes = 0;
  if (voteSummary.results) {
    voteSummary.results.forEach(({ id, votes, votebit: bit }) => {
      proposal.voteOptions.push({ id, bit });
      proposal.voteCounts[id] = votes;
      totalVotes += votes;
    });
  }

  const quorum = voteSummary.quorumpercentage
    ? voteSummary.quorumpercentage
    : 20;
  const eligibleVotes = voteSummary.eligibletickets;
  const passPercentage = voteSummary.passpercentage
    ? voteSummary.passpercentage
    : 60;
  proposal.quorumMinimumVotes = Math.round(eligibleVotes * (quorum / 100));
  proposal.voteStatus = voteSummary.status;
  proposal.approved = voteSummary.approved;

  if (totalVotes > proposal.quorumMinimumVotes) {
    proposal.quorumPass = true;
  }

  if (
    proposal.quorumPass &&
    proposal.voteCounts["yes"] / totalVotes > passPercentage / 100
  ) {
    proposal.voteResult = "passed";
  }
  proposal.totalVotes = totalVotes;
};

const ticketHashesToByte = (hashes) =>
  hashes && hashes.map(hexReversedHashToArray);

// getProposalEligibleTickets gets the wallet eligible tickets for a specific
// proposal.
// if the proposal directory already exists it only returns the cached
// information, otherwise it gets the eligible tickets from politeia and caches
// it.
const getProposalEligibleTickets = async (
  token,
  allEligibleTickets,
  shouldCache,
  walletService
) => {
  // Aux function to get the tickets from the wallet that are eligible to vote
  // (committed tickets) for a given proposal (given a list of eligible tickets
  // returned from an activevotes call)
  const getWalletEligibleTickets = async (eligibleTickets, walletService) => {
    const commitedTicketsResp = await wallet.committedTickets(
      walletService,
      ticketHashesToByte(eligibleTickets)
    );
    return commitedTicketsResp.ticketAddresses;
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

// updateInventoryFromApiData receives politeia data from getVotesInventory and
// put it in decrediton's inventory format.
// @param data - data from getVotesInventory api.
const updateInventoryFromApiData = (data) => {
  const inventory = getDefaultInventory();
  inventory.preVote = [
    ...((data && data.vetted && data.vetted.authorized) || []),
    ...((data && data.vetted && data.vetted.unauthorized) || [])
  ];
  inventory.activeVote = (data && data.vetted && data.vetted.started) || [];
  inventory.abandonedVote =
    (data && data.vetted && data.vetted.ineligible) || [];
  inventory.approvedVote = (data && data.vetted && data.vetted.approved) || [];
  inventory.rejectedVote = (data && data.vetted && data.vetted.rejected) || [];
  inventory.finishedVote = [
    ...inventory.approvedVote,
    ...inventory.rejectedVote
  ];

  return inventory;
};

export const GETVOTES_INVENTORY_ATTEMPT = "GETVOTES_INVENTORY_ATTEMPT";
export const GETVOTES_INVENTORY_SUCCESS = "GETVOTES_INVENTORY_SUCCESS";
export const GETVOTES_INVENTORY_FAILED = "GETVOTES_INVENTORY_FAILED";

const getVotesInventory = () => async (dispatch, getState) => {
  dispatch({ type: GETVOTES_INVENTORY_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  try {
    const { data } = await pi.getVotesInventory({ piURL });
    const inventory = updateInventoryFromApiData(data);

    dispatch({ type: GETVOTES_INVENTORY_SUCCESS, inventory });

    return inventory;
  } catch (error) {
    dispatch({ error, type: GETVOTES_INVENTORY_FAILED });
    throw error;
  }
};

export const COMPARE_INVENTORY_ATTEMPT = "COMPARE_INVENTORY_ATTEMPT";
export const COMPARE_INVENTORY_SUCCESS = "COMPARE_INVENTORY_SUCCESS";
export const COMPARE_INVENTORY_FAILED = "COMPARE_INVENTORY_FAILED";
export const REMOVED_PROPOSALS_FROM_LIST = "REMOVED_PROPOSALS_FROM_LIST";

// compareInventory compares the state's inventory with a fresh new inventory.
// If they are different, we get the batch of tokens and update the proposal list.
// return the different hashes for each key if the inventories are different.
// Return null otherwise.
// @param inventory -> is an inventory object the same type of defaultInventory.
export const compareInventory = () => async (dispatch, getState) => {
  dispatch({ type: COMPARE_INVENTORY_ATTEMPT });
  try {
    const oldInventory = sel.inventory(getState());
    const piURL = sel.politeiaURL(getState());
    const oldProposals = sel.proposals(getState());
    const newProposalsList = getDefaultInventory();

    const { data } = await pi.getVotesInventory({ piURL });
    const inventory = updateInventoryFromApiData(data);

    let isDifferent = false;

    // Check if old proposals list have had some proposal removed from inventory and
    // also remove it from proposal's list. As we modify oldInventory object,
    // we make a copy of it to avoid side effects.
    const oInventoryCopy = Object.assign({}, oldInventory);
    Object.keys(oldProposals).forEach((key) => {
      newProposalsList[key] = oldProposals[key].reduce((acc, p) => {
        if (inventory[key].includes(p.token)) {
          acc.push(p);
        } else {
          // Remove token from old inventory so we can re-fetch it.
          oInventoryCopy[key].splice(oInventoryCopy[key].indexOf(p.token), 1);
          isDifferent = true;
        }
        return acc;
      }, []);
    });
    if (isDifferent) {
      dispatch({
        type: REMOVED_PROPOSALS_FROM_LIST,
        proposals: newProposalsList
      });
    }

    // create array with all old inventory and inventory token's values
    const flatOldProps = [
      oInventoryCopy.activeVote,
      oInventoryCopy.abandonedVote,
      oInventoryCopy.finishedVote,
      oInventoryCopy.preVote,
      oInventoryCopy.approvedVote,
      oInventoryCopy.rejectedVote
    ].reduce((acc, v) => {
      v.forEach((p) => {
        return (acc[p] = p);
      });
      return acc;
    }, {});
    const flatNewProps = [
      inventory.activeVote,
      inventory.abandonedVote,
      inventory.finishedVote,
      inventory.preVote,
      inventory.approvedVote,
      inventory.rejectedVote
    ].reduce((acc, v) => {
      v.forEach((p) => (acc[p] = p));
      return acc;
    }, {});

    // Get difference between new inventory and old one, so we can bring a batch
    // of new proposals.
    const diffHashes = [];
    Object.keys(flatNewProps).map((token) =>
      !flatOldProps[token] ? diffHashes.push(token) : null
    );
    if (diffHashes.length > 0) {
      dispatch(getProposalsAndUpdateVoteStatus(diffHashes));
    }

    dispatch({ type: COMPARE_INVENTORY_SUCCESS, inventory });
  } catch (error) {
    dispatch({ type: COMPARE_INVENTORY_FAILED, error });
  }
};

// getInitialBatch Gets the first pre and active proposals batch
const getInitialBatch = () => async (dispatch, getState) => {
  const inventory = sel.inventory(getState());
  if (!inventory || (!inventory.activeVote && !inventory.preVote)) return;

  const proposallistpagesize = sel.proposallistpagesize(getState());
  const { activeVote: active, preVote: pre } = inventory;

  const activeVoteBatch = active.slice(0, proposallistpagesize);
  const preVoteBatch = pre.slice(0, proposallistpagesize);
  const activeAndPreVoteBatch = [...activeVoteBatch, ...preVoteBatch];
  if (
    activeAndPreVoteBatch.length &&
    activeAndPreVoteBatch.length < proposallistpagesize
  ) {
    await dispatch(getProposalsAndUpdateVoteStatus(activeAndPreVoteBatch));
    return;
  }
  if (activeVoteBatch.length)
    await dispatch(getProposalsAndUpdateVoteStatus(activeVoteBatch));
  if (preVoteBatch.length)
    await dispatch(getProposalsAndUpdateVoteStatus(preVoteBatch));
};

// getVoteOption gets the wallet vote if cached or return abstain.
const getVoteOption = (
  token,
  proposal,
  castVotes,
  walletEligibleTickets,
  testnet,
  walletName
) => {
  // We assume all tickets have vote the same bit
  const vote = getProposalWalletVote(token, testnet, walletName);
  if (vote) {
    return vote.voteChoice;
  }

  if (
    !castVotes ||
    !walletEligibleTickets ||
    walletEligibleTickets.length === 0
  )
    return;

  const voteChoice = castVotes.find((vote) => {
    if (vote.ticket === walletEligibleTickets[0].ticket) {
      return true;
    }
    return false;
  });

  if (!voteChoice) return;

  const currentVoteChoice = proposal.voteOptions.find(
    (option) =>
      // votebit is all lowercase as it comes from pi api.
      voteChoice.votebit === "" + option.bit
  );

  return currentVoteChoice;
};

export const getTokenAndInitialBatch = () => async (dispatch, getState) => {
  setPoliteiaPath();
  try {
    await dispatch(getVotesInventory());
    const inventory = sel.inventory(getState());
    // remove proposals cache which are not in the inventory activeVote
    removeCachedProposals(inventory.activeVote);
    await dispatch(getInitialBatch());
  } catch (error) {
    dispatch({ error, type: GETVOTES_INVENTORY_FAILED });
    throw error;
  }
};

export const DISABLE_POLITEIA_SUCCESS = "DISABLE_POLITEIA_SUCCESS";

export const resetInventoryAndProposals = () => (dispatch) => {
  dispatch({ type: DISABLE_POLITEIA_SUCCESS });
};

export const GET_PROPOSAL_BATCH_ATTEMPT = "GET_PROPOSAL_BATCH_ATTEMPT";
export const GET_PROPOSAL_BATCH_SUCCESS = "GET_PROPOSAL_BATCH_SUCCESS";
export const GET_PROPOSAL_BATCH_FAILED = "GET_PROPOSAL_BATCH_FAILED";

const getProposalsBatch = async (tokens, piURL) => {
  const { data } = await pi.getProposalsBatch({
    piURL,
    requests: tokens.map((token) => ({
      token,
      filenames: [PROPOSAL_METADATA_FILE, PROPOSAL_VOTE_METADATA_FILE]
    }))
  });
  return data;
};

export const GET_PROPOSALS_VOTESTATUS_BATCH_ATTEMPT =
  "GET_PROPOSALS_VOTESTATUS_BATCH_ATTEMPT";
export const GET_PROPOSALS_VOTESTATUS_BATCH_SUCCESS =
  "GET_PROPOSALS_VOTESTATUS_BATCH_SUCCESS";
export const GET_PROPOSALS_VOTESTATUS_BATCH_FAILED =
  "GET_PROPOSALS_VOTESTATUS_BATCH_FAILED";

const getProposalsVoteSummaryBatch = async (tokensBatch, piURL) => {
  const { data } = await pi.getProposalsVoteSummaryBatch({
    piURL,
    tokens: tokensBatch
  });
  return data;
};

export const GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT =
  "GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT";
export const GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS =
  "GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS";
export const GETPROPROSAL_UPDATEVOTESTATUS_FAILED =
  "GETPROPROSAL_UPDATEVOTESTATUS_FAILED";

// getProposalsAndUpdateVoteStatus gets a proposal batch and its vote summary
// and concat with proposals from getState.
//
// tokensBatch length can not exceed politeia's proposallistpagesize
// limit; otherwise it will return ErrorStatusMaxProposalsExceededPolicy.
export const getProposalsAndUpdateVoteStatus = (tokensBatch) => async (
  dispatch,
  getState
) => {
  const findProposal = (proposals, token) =>
    proposals.find((proposal) =>
      proposal.censorshiprecord.token === token ? proposal : null
    );

  const concatProposals = (oldProposals, newProposals) => {
    const response = {};
    // We copy oldProposals in order to avoid modifying it triggering render
    const oldProposalsCopy = Object.assign({}, oldProposals);
    Object.keys(oldProposalsCopy).forEach((key) => {
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

  dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT, tokensBatch });
  const proposalsUpdated = getDefaultInventory();
  const blockTimestampFromNow = sel.blockTimestampFromNow(getState());
  const blocksFromBestBlock = sel.blocksFromBestBlock(getState());
  const piURL = sel.politeiaURL(getState());
  // If proposals is null at our redux state, it probably means first starting or
  // the wallet was closed.
  const oldProposals =
    sel.proposals(getState()) === null
      ? getDefaultInventory()
      : sel.proposals(getState());
  const lastPoliteiaAccessTime = sel.lastPoliteiaAccessTime(getState());
  const walletName = sel.getWalletName(getState());
  const testnet = sel.isTestNet(getState());
  const lastPoliteiaAccessBlock = sel.lastPoliteiaAccessBlock(getState());

  try {
    const { records } = await getProposalsBatch(tokensBatch, piURL);
    const { summaries } = await getProposalsVoteSummaryBatch(
      tokensBatch,
      piURL
    );
    tokensBatch.forEach((token) => {
      const proposalSummary = summaries[token];
      const { status } = proposalSummary;
      const prop = parseRawProposal(records[token]);
      prop.token = token;
      prop.proposalStatus = prop.status;

      // Fill vote information in proposal object.
      fillVoteSummary(
        prop,
        proposalSummary,
        blockTimestampFromNow,
        blocksFromBestBlock
      );
      prop.currentVoteChoice =
        (walletName &&
          getVoteOption(token, prop, null, null, testnet, walletName)) ||
        "abstain";

      if (prop.timestamp > lastPoliteiaAccessTime) {
        prop.modifiedSinceLastAccess = true;
      }
      if (prop.startVoteHeight > lastPoliteiaAccessBlock) {
        prop.votingSinceLastAccess = true;
      }

      // if proposal is not abandoned we check its votestatus
      if (prop.proposalStatus === PROPOSAL_STATUS_ABANDONED) {
        proposalsUpdated.abandonedVote.push(prop);
      } else {
        switch (status) {
          case PROPOSAL_VOTING_ACTIVE:
            proposalsUpdated.activeVote.push(prop);
            break;
          case PROPOSAL_VOTING_REJECTED:
          case PROPOSAL_VOTING_APPROVED:
            proposalsUpdated.finishedVote.push(prop);
            if (status === PROPOSAL_VOTING_APPROVED) {
              proposalsUpdated.approvedVote.push(prop);
            } else {
              proposalsUpdated.rejectedVote.push(prop);
            }
            break;
          default:
            proposalsUpdated.preVote.push(prop);
            break;
        }
      }
    });

    // concat new proposals list array to old proposals list array
    const concatedProposals = concatProposals(oldProposals, proposalsUpdated);
    return dispatch({
      type: GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS,
      proposals: concatedProposals
    });
  } catch (error) {
    dispatch({ type: GETPROPROSAL_UPDATEVOTESTATUS_FAILED, error });
    throw error;
  }
};

export const GETPROPOSAL_ATTEMPT = "GETPROPOSAL_ATTEMPT";
export const GETPROPOSAL_FAILED = "GETPROPOSAL_FAILED";
export const GETPROPOSAL_SUCCESS = "GETPROPOSAL_SUCCESS";

const getProposalFromMap = (proposals, token) => {
  let proposal;
  const keys = Object.keys(proposals);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    proposal = proposals[key].find((p) => p.token === token);
    if (proposal) return proposal;
  }
};

const fetchProposalDetails = async (token, piURL) => {
  const { data } = await pi.getProposalDetails({ piURL, token });
  return data;
};

export const getProposalDetails = (token) => async (dispatch, getState) => {
  dispatch({ type: GETPROPOSAL_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  const walletName = sel.getWalletName(getState());
  const testnet = sel.isTestNet(getState());
  let walletEligibleTickets;
  let hasEligibleTickets = false;
  let currentVoteChoice;

  try {
    const { record } = await fetchProposalDetails(token, piURL);

    const p = parseRawProposal(record);
    const proposals = getState().governance.proposals;
    let proposal = getProposalFromMap(proposals, token);
    proposal = {
      ...proposal,
      ...p,
      token,
      hasEligibleTickets: false
    };

    // If proposal vote is active or finished prepare vote & eligible tickets
    // info.
    // Also, if voteAndEligibleTickets are already cached we just get them.
    // Otherwise we get them from politea server and cache.
    const isProposalVoteActive = proposal.voteStatus === PROPOSAL_VOTING_ACTIVE;
    const isProposalVoteFinished =
      proposal.voteStatus === PROPOSAL_VOTING_FINISHED ||
      proposal.voteStatus === PROPOSAL_VOTING_REJECTED ||
      proposal.voteStatus === PROPOSAL_VOTING_APPROVED;
    const isVoteActiveOrFinished =
      isProposalVoteActive || isProposalVoteFinished;

    if (isVoteActiveOrFinished) {
      const voteAndEligibleTickets = getProposalWalletVote(
        token,
        testnet,
        walletName
      );

      if (voteAndEligibleTickets) {
        walletEligibleTickets = voteAndEligibleTickets.walletEligibleTickets;
        currentVoteChoice = voteAndEligibleTickets.voteChoice;
        hasEligibleTickets =
          walletEligibleTickets && walletEligibleTickets.length > 0;
      } else {
        const { data: voteDetails } = await pi.getProposalVoteDetails({
          piURL,
          token
        });
        const { vote } = voteDetails;
        const { walletService } = getState().grpc;
        walletEligibleTickets = await getProposalEligibleTickets(
          proposal.token,
          vote.eligibletickets,
          isProposalVoteActive,
          walletService
        );
        const { data: voteResults } = await pi.getProposalVoteResults({
          piURL,
          token
        });
        const { votes } = voteResults;
        currentVoteChoice =
          getVoteOption(
            token,
            proposal,
            votes,
            walletEligibleTickets,
            testnet,
            walletName
          ) || "abstain";
        hasEligibleTickets =
          walletEligibleTickets && walletEligibleTickets.length > 0;
        if (currentVoteChoice !== "abstain") {
          const votesToCache = {
            token,
            walletEligibleTickets,
            voteChoice: currentVoteChoice
          };
          savePiVote(votesToCache, token, testnet, walletName);
        }
      }
    }

    // update proposal reference from proposals state
    Object.keys(proposals).forEach((key) =>
      proposals[key].find((p, i) => {
        if (p.token === token) {
          proposal = {
            ...proposal,
            modifiedSinceLastAccess: false,
            votingSinceLastAccess: false,
            walletEligibleTickets,
            hasEligibleTickets,
            eligibleTicketCount: walletEligibleTickets
              ? walletEligibleTickets.length
              : 0,
            currentVoteChoice
          };
          return (proposals[key][i] = { ...proposal });
        }
      })
    );

    dispatch({ token, proposal, proposals, type: GETPROPOSAL_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETPROPOSAL_FAILED });
    throw error;
  }
};

export const viewProposalDetails = (token) => (dispatch) =>
  dispatch(pushHistory(`/proposal/details/${token}`));

export const viewAgendaDetails = (name) => (dispatch) =>
  dispatch(pushHistory(`/agenda/details/${name}`));

export const UPDATEVOTECHOICE_ATTEMPT = "UPDATEVOTECHOICE_ATTEMPT";
export const UPDATEVOTECHOICE_SUCCESS = "UPDATEVOTECHOICE_SUCCESS";
export const UPDATEVOTECHOICE_FAILED = "UPDATEVOTECHOICE_FAILED";

// updateVoteChoice cast vote into pi server, if success we cache the vote
// information updates the proposal vote summary and dispatch it with its new
// result.
export const updateVoteChoice = (
  proposal,
  newVoteChoiceID,
  passphrase
) => async (dispatch, getState) => {
  const { walletService } = getState().grpc;
  const blockTimestampFromNow = sel.blockTimestampFromNow(getState());
  const blocksFromBestBlock = sel.blocksFromBestBlock(getState());
  const piURL = sel.politeiaURL(getState());
  const walletName = sel.getWalletName(getState());
  const testnet = sel.isTestNet(getState());
  const { walletEligibleTickets, token } = proposal;

  const voteChoice = proposal.voteOptions.find((o) => o.id === newVoteChoiceID);
  if (!voteChoice) throw "Unknown vote choice for proposal";

  // get account number. We consider all votes come from same account.
  const address = walletEligibleTickets[0].address;
  const response = await wallet.validateAddress(
    sel.walletService(getState()),
    address
  );
  const accountNumber = response.accountNumber;
  // msg here needs to follow the same syntax as what is defined on
  // politeiavoter.
  const messages = walletEligibleTickets.map((t) => ({
    address: t.address,
    message: `${token}${t.ticket}${voteChoice.bit.toString(16)}`
  }));

  const updatePropRef = (proposals, token, newProposal) => {
    const keys = Object.keys(proposals);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let j;
      const proposal = proposals[key].find((p, ind) => {
        j = ind;
        return p.token === token;
      });
      if (proposal) {
        newProposal.currentVoteChoice = voteChoice;
        return (proposals[key][j] = { ...newProposal });
      }
    }
  };

  dispatch({ type: UPDATEVOTECHOICE_ATTEMPT });
  try {
    const signed = await dispatch(
      unlockAcctAndExecFn(passphrase, [accountNumber], () =>
        wallet.signMessages(walletService, messages)
      )
    );

    const votes = [];
    const votesToCache = { token, walletEligibleTickets, voteChoice };
    const sigs = signed.replies;
    walletEligibleTickets.forEach((t, i) => {
      const { signature } = sigs[i];
      if (signature.error) {
        throw signature.error;
      }
      const votebit = voteChoice.bit.toString(16);
      const vote = { token, ticket: t.ticket, votebit, signature };
      votes.push(vote);
    });

    // cast vote into pi server
    const response = await pi.castBallot({ piURL, votes });
    const { errorcontext: voteCastError } =
      response.data.receipts.find(({ errorcontext }) => errorcontext) || {};

    if (voteCastError) {
      throw voteCastError;
    }

    // cache information locally so we can show them without querying from
    // pi server.
    savePiVote(votesToCache, token, testnet, walletName);

    // update proposal vote status, so we can see our vote counting towards
    // the totals.
    const newProposal = { ...proposal };
    const { summaries } = await getProposalsVoteSummaryBatch([token], piURL);
    fillVoteSummary(
      newProposal,
      summaries[token],
      blockTimestampFromNow,
      blocksFromBestBlock
    );

    const proposals = getState().governance.proposals;
    await updatePropRef(proposals, token, newProposal);

    dispatch({
      votes,
      proposals,
      proposal: newProposal,
      token,
      type: UPDATEVOTECHOICE_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: UPDATEVOTECHOICE_FAILED });
    throw error;
  }
};
