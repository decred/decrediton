import {
  UPDATEVOTECHOICE_SUCCESS,
  GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT,
  GETPROPOSAL_ATTEMPT,
  GETPROPOSAL_FAILED,
  GETPROPOSAL_SUCCESS,
  REMOVED_PROPOSALS_FROM_LIST,
  DISABLE_POLITEIA_SUCCESS,
  COMPARE_INVENTORY_SUCCESS,
  GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS,
  GETPROPROSAL_UPDATEVOTESTATUS_FAILED,
  GETVOTES_INVENTORY_ATTEMPT,
  GETVOTES_INVENTORY_SUCCESS,
  GETVOTES_INVENTORY_FAILED
} from "actions/GovernanceActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";
import { WALLETREADY } from "actions/DaemonActions";

export default function governance(state = {}, action) {
  switch (action.type) {
    case GETVOTES_INVENTORY_ATTEMPT:
      return {
        ...state,
        getProposalsAttempt: true,
        getVotesInventoryError: null
      };
    case GETVOTES_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: action.inventory,
        getProposalsAttempt: false,
        getVotesInventoryError: null
      };
    case GETVOTES_INVENTORY_FAILED:
      return {
        ...state,
        getProposalsAttempt: false,
        getVotesInventoryError: action.error
      };
    case CLOSEWALLET_SUCCESS:
      return {
        ...state,
        getProposalsAttempt: false,
        getProposalError: null,
        getVotesInventoryError: null,
        proposals: null,
        inventory: null
      };
    case GETPROPROSAL_UPDATEVOTESTATUS_ATTEMPT:
      return { ...state, getProposalsAttempt: true };
    case GETPROPROSAL_UPDATEVOTESTATUS_SUCCESS:
      return {
        ...state,
        proposals: { ...action.proposals },
        getProposalsAttempt: false,
        getProposalError: null
      };
    case GETPROPROSAL_UPDATEVOTESTATUS_FAILED:
      return {
        ...state,
        getProposalsAttempt: false,
        getProposalError: action.error
      };
    case GETPROPOSAL_ATTEMPT:
      return { ...state, getProposalsAttempt: true, getProposalError: null };
    case GETPROPOSAL_FAILED:
      return {
        ...state,
        getProposalsAttempt: false,
        getProposalError: action.error
      };
    case GETPROPOSAL_SUCCESS:
      return {
        ...state,
        getProposalsAttempt: false,
        proposalsDetails: {
          ...state.proposalsDetails,
          [action.token]: { ...action.proposal }
        },
        proposals: { ...action.proposals }
      };
    case UPDATEVOTECHOICE_SUCCESS:
      return {
        ...state,
        proposals: { ...action.proposals },
        proposalsDetails: {
          ...state.proposalsDetails,
          [action.token]: { ...action.proposal }
        }
      };
    case WALLETREADY:
      return {
        ...state,
        lastPoliteiaAccessTime: action.lastPoliteiaAccessTime,
        lastPoliteiaAccessBlock: action.lastPoliteiaAccessBlock
      };
    case DISABLE_POLITEIA_SUCCESS:
      return {
        ...state,
        inventory: [],
        proposals: {
          activeVote: [],
          abandonedVote: [],
          preVote: [],
          finishedVote: []
        }
      };
    case COMPARE_INVENTORY_SUCCESS:
      return { ...state, inventory: action.inventory };
    case REMOVED_PROPOSALS_FROM_LIST:
      return { ...state, proposals: action.proposals };
    default:
      return state;
  }
}
