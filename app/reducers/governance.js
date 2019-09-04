import {
  GETVETTED_ATTEMPT, GETVETTED_FAILED, GETVETTED_SUCCESS, GETVETTED_CANCELED,
  GETVETTED_UPDATEDVOTERESULTS_SUCCESS, GETVETTED_UPDATEDVOTERESULTS_ATTEMPT,
  GETPROPOSAL_ATTEMPT, GETPROPOSAL_FAILED, GETPROPOSAL_SUCCESS,
  UPDATEVOTECHOICE_ATTEMPT, UPDATEVOTECHOICE_SUCCESS, UPDATEVOTECHOICE_FAILED,
  GETTOKEN_INVENTORY_SUCCESS, GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT,
  GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS, GETPROPROSAL_UPDATEVOTESTATUS_FAILED,
} from "actions/GovernanceActions";
import {
  CLOSEWALLET_SUCCESS
} from "actions/WalletLoaderActions";
import { WALLETREADY } from "actions/DaemonActions";

export default function governance(state = {}, action) {
  switch (action.type) {
  case GETTOKEN_INVENTORY_SUCCESS:
    return { ...state,
      inventory: action.inventory,
    };
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
  case GETVETTED_UPDATEDVOTERESULTS_ATTEMPT:
    return { ...state,
      getVettedUpdateVoteResultsAttempt: true,
    };
  case GETVETTED_UPDATEDVOTERESULTS_SUCCESS:
    return { ...state,
      getVettedUpdateVoteResultsAttempt: false,
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
  case GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT:
    return { ...state,
      getProposalsAttempt: true,
    };
  case GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS:
    return { ...state,
      proposals: action.proposals,
      getProposalsAttempt: false,
    };
  case GETPROPROSAL_UPDATEVOTESTATUS_FAILED:
    return { ...state,
      getProposalsAttempt: false,
      getProposalError: state.error
    };
  case WALLETREADY:
    return { ...state,
      lastPoliteiaAccessTime: action.lastPoliteiaAccessTime,
      lastPoliteiaAccessBlock: action.lastPoliteiaAccessBlock,
    }
    break;
  default:
    return state;
  }
}
