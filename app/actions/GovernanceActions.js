import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";
import * as wallet from "wallet";
import { push as pushHistory } from "react-router-redux";
import { hexReversedHashToArray, reverseRawHash } from "helpers";

export const GETACTIVEVOTE_ATTEMPT = "GETACTIVEVOTE_ATTEMPT";
export const GETACTIVEVOTE_FAILED = "GETACTIVEVOTE_FAILED";
export const GETACTIVEVOTE_SUCCESS = "GETACTIVEVOTE_SUCCESS";

export const getActiveVoteProposals = () => (dispatch, getState) => {

  const ticketHashesToByte = (hashes) => hashes.map(hexReversedHashToArray);

  dispatch({ type: GETACTIVEVOTE_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  pi.getActiveVotes(piURL)
    .then(async (resp) => {
      console.log("active votes", resp);
      const { walletService } = getState().grpc;

      const proposals = [];
      for (let i = 0; i < resp.data.votes.length; i++) {
        const vinfo = resp.data.votes[i];
        const p = vinfo.proposal;
        const proposal = {
          voting: true,
          hasElligibleTickets: false,
          eligibleTickets: [],
          name: p.name,
          token: p.censorshiprecord.token,
          numComments: p.numcomments,
          timestamp: p.timestamp,
          voteOptions: vinfo.vote.Options,
          voteMask: vinfo.vote.mask,
          voteDetails: vinfo.votedetails,
        };

        const commitedTicketsResp = await wallet.committedTickets(walletService, ticketHashesToByte(vinfo.votedetails.eligibletickets));
        const tickets = commitedTicketsResp.getTicketaddressesList();
        proposal.hasElligibleTickets = tickets.length > 0;
        proposal.eligibleTickets = tickets.map(t => ({
          ticket: reverseRawHash(t.getTicket()),
          address: t.getAddress(),
        }));

        proposals.push(proposal);
      }
      dispatch({ proposals, type: GETACTIVEVOTE_SUCCESS });
    })
    .catch((error) => dispatch({ error, type: GETACTIVEVOTE_FAILED }));
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
          voting: false,
          hasElligibleTickets: false,
          name: p.name,
          token: p.censorshiprecord.token,
          numComments: p.numcomments,
          timestamp: p.timestamp,
        };
      }));
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

export const updateVoteChoice = (proposal, newVoteChoiceID, passphrase) =>
  (dispatch, getState) => {
    const { walletService } = getState().grpc;

    const voteChoice = proposal.voteOptions.find(o => o.id === newVoteChoiceID);
    if (!voteChoice) throw "Unknown vote choice for proposal";

    const messages = proposal.eligibleTickets.map(t => {
      // msg here needs to follow the same syntax as what is defined on
      // politeiavoter.
      const msg = proposal.token + t.ticket + voteChoice.bits.toString(16);
      return { address: t.address, message: msg };
    });

    wallet
      .signMessages(walletService, passphrase, messages)
      .then(resp => {
        console.log("signMessages replied", resp.toObject());
      })
      .catch(error => console.log("signMessages errored", error));

  };
