import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";
import * as wallet from "wallet";
import { replace } from "fp";
import { getWalletCfg } from "../config";
import { push as pushHistory } from "react-router-redux";
import { hexReversedHashToArray, reverseRawHash } from "helpers";

// enum values from politeiawww's v1.PropVoteStatusT
export const VOTESTATUS_ACTIVEVOTE = 3;
export const VOTESTATUS_VOTED = 4;
export const VOTESTATUS_ABANDONED = 6;

// Aux function to parse the optionsresult member of a votestatus call into
// structures to use within a proposal data.
const parseOptionsResult = optionsresult => {
  if (!optionsresult) return null;

  const voteOptions = [];
  const voteCounts = {};
  optionsresult.forEach(o => {
    voteOptions.push(o.option);
    voteCounts[o.option.id] = o.votesreceived;
  });

  return { voteOptions, voteCounts };
};

// Aux function to parse the vote status of a single proposal, given a response
// for the /votesStatus or /proposal/P/voteStatus api calls, then fill the
// proposal object with the results.
const fillVoteStatus = (proposal, voteStatus, blockTimestampFromNow) => {
  proposal.quorumPass = false;
  proposal.voteResult = "declined";
  proposal.endTimestamp = blockTimestampFromNow(parseInt(voteStatus.endheight));

  proposal.voteCounts = voteStatus.optionsresult ? voteStatus.optionsresult.reduce((counts, opt) => {
    counts[opt.option.id] = opt.votesreceived;
    return counts;
  }, {}) : {};

  const quorum = voteStatus.quorumpercentage ? voteStatus.quorumpercentage : 20;
  const totalVotes = voteStatus.totalvotes;
  const eligibleVotes = voteStatus.numofeligiblevotes;
  const passPercentage = voteStatus.passPercentage ? voteStatus.passPercentage : 60;

  if (totalVotes / eligibleVotes > quorum / 100) {
    proposal.quorumPass = true;
  }

  if (proposal.voteCounts["yes"] / totalVotes > passPercentage / 100) {
    proposal.voteResult = "passed";
  }
};

// Aux function to parse the votes information of a single proposal, given a
// response to that proposal's /votes api call and fill the proposal object.
const fillVotes = async (proposal, propVotes, walletService) => {

  // aux map from bit to vote choice id
  const voteBitToChoice = proposal.voteOptions.reduce((m, o) => {
    m[o.bits] = o.id;
    return m;
  }, {});

  const eligibleTickets = propVotes && propVotes.data && propVotes.data.startvotereply
    ? await getWalletCommittedTickets(propVotes.data.startvotereply.eligibletickets, walletService)
    : [];
  const eligibleTicketsByHash = eligibleTickets.reduce( (m, t) => { m[t.ticket] = true; return m; }, {});

  proposal.eligibleTickets = eligibleTickets;
  proposal.hasEligibleTickets = eligibleTickets.length > 0;
  proposal.currentVoteChoice = "abstain";
  proposal.startBlockHeight = propVotes.data.startvotereply ? parseInt(propVotes.data.startvotereply.startblockheight) : null;

  // Find out if this wallet has voted in this prop and what was the choice.
  // This assumes the wallet will cast all available votes the same way.
  propVotes.data.castvotes.some(vote => {
    const choiceID = voteBitToChoice[parseInt(vote.votebit)];
    if (!choiceID) { throw "ERRRRR: choiceID not found on vote", vote; }
    // proposal.voteCounts.abstain -= 1; // TODO: support abstain
    if (eligibleTicketsByHash[vote.ticket]) {
      proposal.currentVoteChoice = choiceID;
      return true;
    }
  });
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

const getProposalVotes = async (proposal, piURL, walletService) => {
  const propVotes = await pi.getProposalVotes(piURL, proposal.token);
  if (propVotes && propVotes.data) {
    await fillVotes(proposal, propVotes, walletService);
  }
  return proposal;
};

// Aux function to fill the vote result information on a given proposal.
const getProposalVoteResults = async (proposal, piURL, walletService, blockTimestampFromNow) => {

  const propVotes = await pi.getProposalVotes(piURL, proposal.token);
  if (propVotes && propVotes.data) {
    await fillVotes(proposal, propVotes, walletService);
  }

  const propVoteStatus = await pi.getProposalVoteStatus(piURL, proposal.token);
  if (propVoteStatus && propVoteStatus.data) {
    fillVoteStatus(proposal, propVoteStatus.data, blockTimestampFromNow);
  }

  return proposal;
};

export const GETVETTED_ATTEMPT = "GETVETTED_ATTEMPT";
export const GETVETTED_FAILED = "GETVETTED_FAILED";
export const GETVETTED_SUCCESS = "GETVETTED_SUCCESS";
export const GETVETTED_CANCELED = "GETVETTED_CANCELED";
export const GETVETTED_UPDATEDVOTERESULTS_SUCCESS = "GETVETTED_UPDATEDVOTERESULTS_SUCCESS";
export const GETVETTED_UPDATEDVOTERESULTS_FAILED = "GETVETTED_UPDATEDVOTERESULTS_FAILED";

export const getVettedProposals = () => async (dispatch, getState) => {
  dispatch({ type: GETVETTED_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  const oldProposals = sel.proposalsDetails(getState());
  const currentBlockHeight = sel.currentBlockHeight(getState());
  const chainParams = sel.chainParams(getState());

  const cfg = getWalletCfg(sel.isTestNet(getState()), sel.getWalletName(getState()));
  const lastAccessTime = cfg.get("politeia_last_access_time") || 0;
  const lastAccessBlock = cfg.get("politeia_last_access_block") || 0;

  const originalWalletService = getState().grpc.walletService;

  // resulting data
  let proposals = [], preVote = [], activeVote = [], voted = [], abandoned = [], byToken = {};

  try {
    const [ vetted, votesStatus ] = await Promise.all(
      [ pi.getVetted(piURL), pi.getVotesStatus(piURL) ]);

    const { walletService } = getState().grpc;
    if (walletService !== originalWalletService) {
      // wallet has shutdown/changed and the request took too long to complete.
      // just ignore it.
      dispatch({ type: GETVETTED_CANCELED });
      return;
    }

    // helpers
    const blockTimestampFromNow = sel.blockTimestampFromNow(getState());
    const defaultVoteStatus = { status: 0, totalvotes: 0, optionsresult: null };

    // aux maps
    const statusByToken = votesStatus.data.votesstatus ? votesStatus.data.votesstatus.reduce((m, r) => {
      m[r.token] = r;
      return m;
    }, {}) : [];
    for (let p of vetted.data.proposals) {
      const voteStatus = statusByToken[p.censorshiprecord.token] || defaultVoteStatus;
      if (p.status == VOTESTATUS_ABANDONED) voteStatus.status = VOTESTATUS_ABANDONED;
      const voteData = parseOptionsResult(voteStatus.optionsresult);
      const oldProposal = oldProposals[p.censorshiprecord.token];

      const publishedTimestamp = p.publishedat || p.timestamp || 0;

      const proposal = {
        hasDetails: false,
        ...oldProposal,
        creator: p.username,
        name: p.name,
        version: p.version,
        token: p.censorshiprecord.token,
        numComments: p.numcomments,
        timestamp: p.timestamp,
        voteStatus: voteStatus.status,
        totalVotes: voteStatus.totalvotes,
        files: [],
        hasEligibleTickets: 0,
        eligibleTickets: [],
        modifiedSinceLastAccess: (publishedTimestamp*1000) > lastAccessTime,
        votingSinceLastAccess: false,
        ...voteData,
      };
      fillVoteStatus(proposal, voteStatus, blockTimestampFromNow);
      proposals.push(proposal);
    }
    proposals.sort((a, b) => a.timestamp - b.timestamp);

    proposals.forEach(p => {
      switch (p.voteStatus) {
      case VOTESTATUS_ABANDONED: abandoned.push(p); break;
      case VOTESTATUS_ACTIVEVOTE: activeVote.push(p); break;
      case VOTESTATUS_VOTED: voted.push(p); break;
      default:
        preVote.push(p); break;
      }

      byToken[p.token] = p;
    });

    dispatch({ proposals: byToken, preVote, activeVote, abandoned, voted, type: GETVETTED_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETVETTED_FAILED });
    return;
  }

  // grab the votes (including the wallet's voted choice) for voted/voting
  // proposals asynchronously so we don't block the user from viewing the
  // tentative proposal lists. We need to recreate all lists after this, due to
  // (possibly) this being a long time after the GETVETTED_SUCCESS has been
  // processed.

  try {
    const { walletService } = getState().grpc;

    const votedWithVotes = await Promise.all([ ...activeVote, ...voted ]
      .map(prop => getProposalVotes({ ...prop }, piURL, walletService)));
    activeVote = [];
    voted = [];
    byToken = { ...byToken };

    votedWithVotes.forEach(p => {
      switch (p.voteStatus) {
      case VOTESTATUS_ACTIVEVOTE:
        var startVoteBh = p.startBlockHeight || 0;
        p.votingSinceLastAccess = startVoteBh >= (lastAccessBlock - chainParams.TicketMaturity);
        activeVote.push(p);
        break;

      case VOTESTATUS_VOTED:
        voted.push(p);
        break;

      default:
        voted.push(p); break;
      }
      byToken[p.token] = p;
    });
    voted.sort((a, b) => a.timestamp - b.timestamp);
    activeVote.sort((a, b) => a.timestamp - b.timestamp);

    dispatch({ proposals: byToken, activeVote, voted, type: GETVETTED_UPDATEDVOTERESULTS_SUCCESS });
  } catch (error) {
    const { walletService } = getState().grpc;
    if (walletService !== originalWalletService) {
      // wallet has shutdown/changed and the request took too long to complete.
      // just ignore the error here in this case.
      return;
    }

    dispatch({ error, type: GETVETTED_UPDATEDVOTERESULTS_FAILED });
    return;
  }

  cfg.set("politeia_last_access_time", (new Date()).getTime());
  cfg.set("politeia_last_access_block", currentBlockHeight);
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
    const resp = await pi.getProposal(piURL, token);

    const { walletService } = getState().grpc;
    const proposals = getState().governance.proposals;
    let proposal = proposals[token];

    const p = resp.data.proposal;
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

    if (markViewed) {
      proposal.modifiedSinceLastAccess = false;
      proposal.votingSinceLastAccess = false;
    }

    if ([ VOTESTATUS_VOTED, VOTESTATUS_ACTIVEVOTE ].includes(proposal.voteStatus)) {
      await getProposalVoteResults(proposal, piURL, walletService, blockTimestampFromNow);
    }

    let { preVote, activeVote, voted, abandoned } = getState().governance;
    preVote = replace(preVote, p => p.token === token, proposal);
    activeVote = replace(activeVote, p => p.token === token, proposal);
    voted = replace(voted, p => p.token === token, proposal);
    abandoned = replace(abandoned, p => p.token === token, proposal);

    dispatch({ token, proposal, preVote, activeVote, voted, abandoned, type: GETPROPOSAL_SUCCESS });
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
