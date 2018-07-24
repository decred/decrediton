import {
  GETVETTED_ATTEMPT, GETVETTED_FAILED, GETVETTED_SUCCESS,
  GETPROPOSAL_ATTEMPT, GETPROPOSAL_FAILED, GETPROPOSAL_SUCCESS,
  UPDATEVOTECHOICE_ATTEMPT, UPDATEVOTECHOICE_SUCCESS, UPDATEVOTECHOICE_FAILED,
} from "actions/GovernanceActions";

export default function governance(state = {}, action) {
  switch (action.type) {
  case GETVETTED_ATTEMPT:
    return { ...state, getVettedAttempt: true };
  case GETVETTED_FAILED:
    return { ...state, getVettedAttempt: false };
  case GETVETTED_SUCCESS:
    return { ...state,
      proposals: { ...state.proposals, ...action.proposals },
      getVettedAttempt: false,
      preVote: action.preVote,
      activeVote: action.activeVote,
      voted: action.voted,
      lastVettedFetchTime: new Date(),
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
  case UPDATEVOTECHOICE_ATTEMPT:
    return { ...state, updateVoteChoiceAttempt: true };
  case UPDATEVOTECHOICE_SUCCESS:
    return {
      ...state,
      proposals: action.proposals,
      updateVoteChoiceAttempt: false };
  case UPDATEVOTECHOICE_FAILED:
    return { ...state, updateVoteChoiceAttempt: false };
  default:
    return state;
  }
}
