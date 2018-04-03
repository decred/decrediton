import {
  GETACTIVEVOTE_ATTEMPT, GETACTIVEVOTE_FAILED, GETACTIVEVOTE_SUCCESS,
  GETVETTED_ATTEMPT, GETVETTED_FAILED, GETVETTED_SUCCESS,
  GETPROPOSAL_ATTEMPT, GETPROPOSAL_FAILED, GETPROPOSAL_SUCCESS,
} from "actions/GovernanceActions";

export default function governance(state = {}, action) {
  switch (action.type) {
  case GETACTIVEVOTE_ATTEMPT:
    return { ...state, getActiveVoteAttempt: true };
  case GETACTIVEVOTE_FAILED:
    return { ...state, getActiveVoteAttempt: false };
  case GETACTIVEVOTE_SUCCESS:
    return { ...state,
      getActiveVoteAttempt: false,
      activeVote: action.proposals
    };
  case GETVETTED_ATTEMPT:
    return { ...state, getVettedAttempt: true };
  case GETVETTED_FAILED:
    return { ...state, getVettedAttempt: false };
  case GETVETTED_SUCCESS:
    return { ...state,
      getVettedAttempt: false,
      vetted: action.proposals
    };
  case GETPROPOSAL_ATTEMPT:
    return { ...state, getProposalAttempt: true, getProposalError: null };
  case GETPROPOSAL_FAILED:
    return { ...state, getProposalAttempt: false, getProposalError: state.error };
  case GETPROPOSAL_SUCCESS:
    return { ...state,
      getProposalAttempt: false,
      proposals: { ...state.proposals, [action.token]: action.proposal }
    };
  default:
    return state;
  }
}
