import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";
import * as wallet from "wallet";
import { push as pushHistory } from "react-router-redux";
import { hexReversedHashToArray, reverseRawHash } from "helpers";
import { currentBlockHeight } from "../selectors";

export const GETACTIVEVOTE_ATTEMPT = "GETACTIVEVOTE_ATTEMPT";
export const GETACTIVEVOTE_FAILED = "GETACTIVEVOTE_FAILED";
export const GETACTIVEVOTE_SUCCESS = "GETACTIVEVOTE_SUCCESS";

export const getActiveVoteProposals = () => async (dispatch, getState) => {

  const ticketHashesToByte = (hashes) => hashes.map(hexReversedHashToArray);

  dispatch({ type: GETACTIVEVOTE_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  try {
    const resp = await pi.getActiveVotes(piURL);

    console.log("active votes", resp);
    const { walletService } = getState().grpc;
    const chainParams = sel.chainParams(getState());
    const currentHeight = sel.currentBlockHeight(getState());
    const currentTimestamp = new Date().getTime() / 1000;
    const blockTimestampFromNow = (block) => Math.trunc(currentTimestamp + ((block - currentHeight) * chainParams.TargetTimePerBlock));
    console.log(currentHeight, blockTimestampFromNow(currentHeight+1));

    const proposals = [];
    for (let i = 0; i < resp.data.votes.length; i++) {
      const vinfo = resp.data.votes[i];
      const p = vinfo.proposal;
      const proposal = {
        creator: p.userid,
        voting: true,
        hasElligibleTickets: false,
        eligibleTickets: [],
        name: p.name,
        token: p.censorshiprecord.token,
        numComments: p.numcomments,
        timestamp: p.timestamp,
        voteOptions: vinfo.vote.Options,
        voteMask: vinfo.vote.mask,
        voteDetails: {
          startBlockHeight: parseInt(vinfo.votedetails.startblockheight),
          endBlockHeight: parseInt(vinfo.votedetails.endheight),

          // start/end timestamp are only estimations based on target block time
          startTimestamp: blockTimestampFromNow(parseInt(vinfo.votedetails.startblockheight)),
          endTimestamp: blockTimestampFromNow(parseInt(vinfo.votedetails.endheight)),
        },
        voteCounts: { abstain: vinfo.votedetails.eligibletickets.length },
        currentVoteChoice: "abstain",
      };

      const voteBitToChoice = {}; // aux map from bit to vote choice id
      proposal.voteOptions.forEach(opt => {
        voteBitToChoice[opt.bits] = opt.id;
        proposal.voteCounts[opt.id] = 0;
      });

      const commitedTicketsResp = await wallet.committedTickets(walletService, ticketHashesToByte(vinfo.votedetails.eligibletickets));
      const tickets = commitedTicketsResp.getTicketaddressesList();
      proposal.hasElligibleTickets = tickets.length > 0;
      proposal.eligibleTickets = tickets.map(t => ({
        ticket: reverseRawHash(t.getTicket()),
        address: t.getAddress(),
      }));

      const myTickets = proposal.eligibleTickets.reduce( (m, t) => { m[t.ticket] = true; return m; }, {});

      const voteResults = await pi.getVoteResults(piURL, p.censorshiprecord.token);
      console.log("Got vote results", voteResults);
      voteResults.data.castvotes.forEach(vote => {
        const choiceID = voteBitToChoice[parseInt(vote.votebit)];
        if (!choiceID) { console.log("ERRRRR: choiceID not found on vote", vote); return; }
        proposal.voteCounts.abstain -= 1;
        proposal.voteCounts[choiceID] += 1;
        if (myTickets[vote.ticket]) {
          proposal.currentVoteChoice = choiceID;
        }
      });

      proposals.push(proposal);
    }

    proposals.sort((a, b) => a.timestamp - b.timestamp);
    dispatch({ proposals, type: GETACTIVEVOTE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETACTIVEVOTE_FAILED });
  }
};

export const GETVETTED_ATTEMPT = "GETVETTED_ATTEMPT";
export const GETVETTED_FAILED = "GETVETTED_FAILED";
export const GETVETTED_SUCCESS = "GETVETTED_SUCCESS";

export const getVettedProposals = () => (dispatch, getState) => {
  dispatch({ type: GETVETTED_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  pi.getVetted(piURL)
    .then((resp) => {
      console.log("vetted", resp);
      const proposals = resp.data.proposals.map((p => {
        return {
          creator: p.userid,
          voting: false,
          hasElligibleTickets: false,
          name: p.name,
          token: p.censorshiprecord.token,
          numComments: p.numcomments,
          timestamp: p.timestamp,
        };
      }));
      proposals.sort((a, b) => a.timestamp - b.timestamp);
      dispatch({ proposals, type: GETVETTED_SUCCESS });
    })
    .catch((error) => dispatch({ error, type: GETVETTED_FAILED }));
};

export const GETPROPOSAL_ATTEMPT = "GETPROPOSAL_ATTEMPT";
export const GETPROPOSAL_FAILED = "GETPROPOSAL_FAILED";
export const GETPROPOSAL_SUCCESS = "GETPROPOSAL_SUCCESS";

export const getProposalDetails = (token) => (dispatch, getState) => {

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
  pi.getProposal(piURL, token)
    .then((resp) => {
      console.log("received proposal data", resp);
      const p = resp.data.proposal;
      const files = p.files.map(f => {
        return {
          digest: f.digest,
          mime: f.mime,
          name: f.name,
          payload: decodeFilePayload(f),
        };
      });

      // the next lines are needed because the /proposals/{token} endpoint
      // does not currently return voting info. If this changes in the future,
      // you can safely remove this.
      const activeVotes = getState().governance.activeVote;
      const voteProposal = activeVotes.find(v => v.token === token);

      const proposal = {
        ...voteProposal,
        creator: p.userid,
        token: token,
        name: p.name,
        numComments: p.numcomments,
        timestamp: p.timestamp,
        files: files,
      };
      console.log("proposal data", proposal);
      dispatch({ token, proposal, type: GETPROPOSAL_SUCCESS });
    })
    .catch((error) => dispatch({ error, type: GETPROPOSAL_FAILED }));
};

export const viewProposalDetails = (token) => (dispatch, getState) => {
  const details = sel.proposalDetails(getState());
  if (!details[token]) {
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
          console.log("Error signing message", signature.getError());
          return;
        }
        const hexSig = Buffer.from(signature.getSignature()).toString("hex");

        votes.push(pi.Vote(proposal.token, t.ticket, voteChoice.bits, hexSig));
      });

      console.log("casting votes", votes);

      const piURL = sel.politeiaURL(getState());
      const voted = await pi.castVotes(piURL, votes);

      console.log("voted", voted);

      dispatch({ votes, type: UPDATEVOTECHOICE_SUCCESS });
    } catch (error) {
      console.log("cast votes errored", error);
      dispatch({ error, type: UPDATEVOTECHOICE_FAILED });
    }
  };
