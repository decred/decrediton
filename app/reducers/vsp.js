import {
  DISCOVERAVAILABLEVSPS_SUCCESS,
  DISCOVERAVAILABLEVSPS_FAILED,
  GETVSPTICKETSTATUS_SUCCESS,
  HASVSPTICKETSERRORED,
  TOGGLE_ISLEGACY,
  SET_REMEMBERED_VSP_HOST,
  SYNCVSPTICKETS_ATTEMPT,
  SYNCVSPTICKETS_FAILED,
  SYNCVSPTICKETS_SUCCESS,
  PROCESSMANAGEDTICKETS_ATTEMPT,
  PROCESSMANAGEDTICKETS_SUCCESS,
  PROCESSMANAGEDTICKETS_FAILED,
  PROCESSUNMANAGEDTICKETS_ATTEMPT,
  PROCESSUNMANAGEDTICKETS_SUCCESS,
  PROCESSUNMANAGEDTICKETS_FAILED,
  SETVSPDVOTECHOICE_ATTEMPT,
  SETVSPDVOTECHOICE_FAILED,
  SETVSPDVOTECHOICE_SUCCESS
} from "actions/VSPActions";
import {
  STARTTICKETBUYERV3_ATTEMPT,
  STARTTICKETBUYERV3_SUCCESS,
  STARTTICKETBUYERV3_FAILED,
  STOPTICKETBUYER_SUCCESS
} from "actions/ControlActions";

export default function vsp(state = {}, action) {
  switch (action.type) {
    case DISCOVERAVAILABLEVSPS_SUCCESS:
      return {
        ...state,
        availableVSPs: action.availableVSPs
      };
    case DISCOVERAVAILABLEVSPS_FAILED:
      return {
        ...state,
        availableVSPs: null,
        availableVSPsError: action.error
      };
    case STARTTICKETBUYERV3_ATTEMPT:
      return { ...state, ticketAutoBuyerRunning: false };
    case STARTTICKETBUYERV3_SUCCESS:
      return {
        ...state,
        ticketAutoBuyerRunning: true,
        ticketBuyerCall: action.ticketBuyerCall,
        vsp: action.vsp,
        balanceToMaintain: action.balanceToMaintain,
        account: action.account
      };
    case STARTTICKETBUYERV3_FAILED:
      return { ...state, ticketAutoBuyerRunning: false };
    case STOPTICKETBUYER_SUCCESS:
      return { ...state, ticketAutoBuyerRunning: false };
    case GETVSPTICKETSTATUS_SUCCESS:
      return {
        ...state,
        vspTickets: {
          ...state.vspTickets,
          ...action.vspTickets
        }
      };
    case HASVSPTICKETSERRORED:
      return { ...state, hasVSPTicketsError: action.hasVSPTicketsError };
    case TOGGLE_ISLEGACY:
      return { ...state, isLegacy: action.isLegacy };
    case SET_REMEMBERED_VSP_HOST:
      return { ...state, rememberedVspHost: action.rememberedVspHost };
    case SYNCVSPTICKETS_ATTEMPT:
      return {
        ...state,
        syncVSPRequestAttempt: true,
        syncVSPRequestError: null
      };
    case SYNCVSPTICKETS_FAILED:
      return {
        ...state,
        syncVSPRequestAttempt: false,
        syncVSPRequestError: action.error
      };
    case SYNCVSPTICKETS_SUCCESS:
      return {
        ...state,
        syncVSPRequestAttempt: false,
        syncVSPRequestError: null
      };
    case PROCESSMANAGEDTICKETS_ATTEMPT:
      return {
        ...state,
        processManagedTicketsAttempt: true,
        processManagedTicketsError: null
      };
    case PROCESSMANAGEDTICKETS_SUCCESS:
      return {
        ...state,
        processManagedTicketsAttempt: false,
        processManagedTicketsError: null
      };
    case PROCESSMANAGEDTICKETS_FAILED:
      return {
        ...state,
        processManagedTicketsAttempt: false,
        processManagedTicketsError: action.error
      };
    case PROCESSUNMANAGEDTICKETS_ATTEMPT:
      return {
        ...state,
        processUnmanagedTicketsAttempt: true,
        processUnmanagedTicketsError: null
      };
    case PROCESSUNMANAGEDTICKETS_SUCCESS:
      return {
        ...state,
        processUnmanagedTicketsAttempt: false,
        processUnmanagedTicketsError: null
      };
    case PROCESSUNMANAGEDTICKETS_FAILED:
      return {
        ...state,
        processUnmanagedTicketsAttempt: false,
        processUnmanagedTicketsError: action.error
      };
    case SETVSPDVOTECHOICE_ATTEMPT:
      return {
        ...state,
        setVspdVoteChoicesError: null,
        setVspdVoteChoicesRequestAttempt: true
      };
    case SETVSPDVOTECHOICE_FAILED:
      return {
        ...state,
        setVspdVoteChoicesError: String(action.error),
        setVspdVoteChoicesRequestAttempt: false
      };
    case SETVSPDVOTECHOICE_SUCCESS:
      return {
        ...state,
        setVspdVoteChoicesRequestAttempt: false
      };
    default:
      return state;
  }
}
