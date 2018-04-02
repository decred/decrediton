import * as sel from "selectors";
import * as pi from "middleware/politeiaapi";

export const GETACTIVEVOTE_ATTEMPT = "GETACTIVEVOTE_ATTEMPT";
export const GETACTIVEVOTE_FAILED = "GETACTIVEVOTE_FAILED";
export const GETACTIVEVOTE_SUCCESS = "GETACTIVEVOTE_SUCCESS";

export const getActiveVoteProposals = () => (dispatch, getState) => {
  dispatch({ type: GETACTIVEVOTE_ATTEMPT });
  const piURL = sel.politeiaURL(getState());
  pi.getActiveVotes(piURL)
    .then((resp) => {
      console.log("active votes", resp);
      const proposals = resp.data.votes.map((vinfo => {
        const p = vinfo.proposal;
        return {
          voting: true,
          name: p.name,
          token: p.censorshiprecord.token,
          numComments: p.numcomments,
          timestamp: p.timestamp,
          voteOptions: vinfo.vote.Options,
          voteMask: vinfo.vote.mask,
          voteDetails: vinfo.votedetails,
        };
      }));
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
