import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";
import * as wallet from "wallet";
import { push as pushHistory } from "react-router-redux";
import { hexReversedHashToArray, reverseRawHash } from "helpers";

export const VOTESTATUS_PREVOTE = 1;
export const VOTESTATUS_ACTIVEVOTE = 2;
export const VOTESTATUS_VOTED = 3;

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

// Aux function to parse the result of a single active vote proposal response
// into a voteDetails structure to use within a proposal data
const parseVoteInfo = (voteInfo, blockTimestampFromNow) => {
  if (!voteInfo) return null;

  return {
    eligibleTickets: voteInfo.startvotereply.eligibletickets,

    startBlockHeight: parseInt(voteInfo.startvotereply.startblockheight),
    endBlockHeight: parseInt(voteInfo.startvotereply.endheight),

    // start/end timestamp are only estimations based on target block time
    startTimestamp: blockTimestampFromNow(parseInt(voteInfo.startvotereply.startblockheight)),
    endTimestamp: blockTimestampFromNow(parseInt(voteInfo.startvotereply.endheight)),
  };
};

// Aux function to get the tickets from the wallet that are eligible to vote
// (commited tickets) for a given proposal (given a list of eligible tickets
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

// Aux function to fill the vote result information on a given proposal.
const getProposalVoteResults = async (proposal, piURL) => {
  proposal.voteCounts = {};
  proposal.currentVoteChoice = "abstain";

  const voteBitToChoice = {}; // aux map from bit to vote choice id
  proposal.voteOptions.forEach(opt => {
    voteBitToChoice[opt.bits] = opt.id;
    proposal.voteCounts[opt.id] = 0;
  });

  const myTickets = proposal.eligibleTickets.reduce( (m, t) => { m[t.ticket] = true; return m; }, {});

  const voteResults = await pi.getVoteResults(piURL, proposal.token);

  voteResults.data.castvotes.forEach(vote => {
    const choiceID = voteBitToChoice[parseInt(vote.votebit)];
    if (!choiceID) { throw "ERRRRR: choiceID not found on vote", vote; }
    // proposal.voteCounts.abstain -= 1; // TODO: support abstain
    proposal.voteCounts[choiceID] += 1;
    if (myTickets[vote.ticket]) {
      proposal.currentVoteChoice = choiceID;
    }
  });
};

export const GETVETTED_ATTEMPT = "GETVETTED_ATTEMPT";
export const GETVETTED_FAILED = "GETVETTED_FAILED";
export const GETVETTED_SUCCESS = "GETVETTED_SUCCESS";

export const getVettedProposals = () => async (dispatch, getState) => {
  dispatch({ type: GETVETTED_ATTEMPT });
  const piURL = sel.politeiaURL(getState());

  try {
    const [ vetted, votesStatus, activeVotes ] = await Promise.all(
      [ pi.getVetted(piURL), pi.getVoteStatus(piURL), pi.getActiveVotes(piURL) ]);

    // helpers
    const chainParams = sel.chainParams(getState());
    const currentHeight = sel.currentBlockHeight(getState());
    const currentTimestamp = new Date().getTime() / 1000;
    const blockTimestampFromNow = (block) => Math.trunc(currentTimestamp + ((block - currentHeight) * chainParams.TargetTimePerBlock));
    const defaultVoteStatus = { status: 0, totalvotes: 0, optionsresult: null };

    // aux maps
    const statusByToken = votesStatus.data.votesstatus ? votesStatus.data.votesstatus.reduce((m, r) => {
      m[r.token] = r;
      return m;
    }, {}) : [];
    const activeVotesByToken = activeVotes.data.votes ? activeVotes.data.votes.reduce((m, p) => {
      m[p.proposal.censorshiprecord.token] = p;
      return m;
    }, {}) : [];

    // resulting data
    const proposals = [], preVote = [], activeVote = [], voted = [], byToken = {};

    for (let p of vetted.data.proposals) {
      const voteStatus = statusByToken[p.censorshiprecord.token] || defaultVoteStatus;
      const voteData = parseOptionsResult(voteStatus.optionsresult);
      const voteInfo = activeVotesByToken[p.censorshiprecord.token];
      const voteDetails = parseVoteInfo(voteInfo, blockTimestampFromNow);

      const proposal = {
        creator: p.username,
        name: p.name,
        token: p.censorshiprecord.token,
        numComments: p.numcomments,
        timestamp: p.timestamp,
        voteStatus: voteStatus.status,
        totalVotes: voteStatus.totalvotes,
        hasDetails: false,
        files: [],
        voteMask: voteInfo ? voteInfo.startvote.vote.mask : 0,
        hasEligibleTickets: 0,
        eligibleTickets: [],
        voteDetails,
        voteInfo,
        ...voteData,
      };

      proposals.push(proposal);
    }
    proposals.sort((a, b) => a.timestamp - b.timestamp);

    proposals.forEach(p => {
      switch (p.voteStatus) {
      case VOTESTATUS_PREVOTE: preVote.push(p); break;
      case VOTESTATUS_ACTIVEVOTE: activeVote.push(p); break;
      case VOTESTATUS_VOTED: voted.push(p); break;
      }

      byToken[p.token] = p;
    });

    dispatch({ proposals: byToken, preVote, activeVote, voted, type: GETVETTED_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETVETTED_FAILED });
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

  dispatch({ type: GETPROPOSAL_ATTEMPT });
  const piURL = sel.politeiaURL(getState());

  try {
    const resp = await pi.getProposal(piURL, token);

    const { walletService } = getState().grpc;
    const proposals = getState().governance.proposals;
    let proposal = proposals[token];

    const eligibleTickets = proposal && proposal.voteInfo
      ? await getWalletCommittedTickets(proposal.voteInfo.startvotereply.eligibletickets, walletService)
      : [];

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
      name: p.name,
      numComments: p.numcomments,
      timestamp: p.timestamp,
      files: files,
      hasDetails: true,
      hasEligibleTickets: eligibleTickets.length > 0,
      eligibleTickets,
    };

    if ([ VOTESTATUS_VOTED, VOTESTATUS_ACTIVEVOTE ].includes(proposal.voteStatus)) {
      await getProposalVoteResults(proposal, piURL);
    }

    dispatch({ token, proposal, type: GETPROPOSAL_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETPROPOSAL_FAILED });
    throw error;
  }
};

export const viewProposalDetails = (token) => (dispatch, getState) => {
  const details = sel.proposalDetails(getState());
  if (!details[token] || !details[token].hasDetails) {
    dispatch(getProposalDetails(token));
  }
  dispatch(pushHistory("/governance/proposals/details/" + token));
};

export const UPDATEVOTECHOICE_ATTEMPT = "UPDATEVOTECHOICE_ATTEMPT";
export const UPDATEVOTECHOICE_SUCCESS = "UPDATEVOTECHOICE_SUCCESS";
export const UPDATEVOTECHOICE_FAILED = "UPDATEVOTECHOICE_FAILED";

export const updateVoteChoice = (proposal, newVoteChoiceID, passphrase) =>
  async (dispatch, getState) => {
    const { walletService } = getState().grpc;

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
      await getProposalVoteResults(newProposal, piURL);

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
