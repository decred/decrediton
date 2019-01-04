import {
  GETVETTED_ATTEMPT, GETVETTED_FAILED, GETVETTED_SUCCESS, GETVETTED_CANCELED,
  GETVETTED_UPDATEDVOTERESULTS_SUCCESS,
  GETPROPOSAL_ATTEMPT, GETPROPOSAL_FAILED, GETPROPOSAL_SUCCESS,
  UPDATEVOTECHOICE_ATTEMPT, UPDATEVOTECHOICE_SUCCESS, UPDATEVOTECHOICE_FAILED,
} from "actions/GovernanceActions";
import {
  CLOSEWALLET_SUCCESS
} from "actions/WalletLoaderActions";

export default function governance(state = {}, action) {
  switch (action.type) {
  case GETVETTED_ATTEMPT:
    return { ...state, getVettedAttempt: true };
  case GETVETTED_FAILED:
    return { ...state, getVettedAttempt: false };
  case GETVETTED_CANCELED:
    return { ...state, getVettedAttempt: false };
  case GETVETTED_SUCCESS:
    return { ...state,
      proposals: { ...state.proposals, ...action.proposals },
      getVettedAttempt: false,
      preVote: action.preVote,
      activeVote: action.activeVote,
      voted: action.voted,
      lastVettedFetchTime: new Date(),
      abandoned: action.abandoned,
    };
  case GETVETTED_UPDATEDVOTERESULTS_SUCCESS:
    return { ...state,
      proposals: { ...state.proposals, ...action.proposals },
      activeVote: action.activeVote,
      voted: action.voted,
    };
  case GETPROPOSAL_ATTEMPT:
    return { ...state, getProposalAttempt: true, getProposalError: null };
  case GETPROPOSAL_FAILED:
    return { ...state, getProposalAttempt: false, getProposalError: state.error };
  case GETPROPOSAL_SUCCESS:
    return { ...state,
      getProposalAttempt: false,
      preVote: action.preVote,
      activeVote: action.activeVote,
      voted: action.voted,
      abandoned: action.abandoned,
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
  case CLOSEWALLET_SUCCESS:
    return { ...state,
      getVettedAttempt: false,
      activeVote: [],
      preVote: [],
      voted: [],
      getProposalAttempt: false,
      getProposalError: null,
      proposals: {},
      lastVettedFetchTime: new Date(0),
    };
  default:
    return state;
  }
}
