import {
  DISCOVERAVAILABLEVSPS_SUCCESS,
  DISCOVERAVAILABLEVSPS_FAILED,
  GETVSPTICKETSTATUS_SUCCESS,
  HASVSPTICKETSERRORED,
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
  SETVSPDVOTECHOICE_SUCCESS,
  SET_AUTOBUYER_SETTINGS,
  GETVSPSPUBKEYS_SUCCESS,
  GETVSPSPUBKEYS_FAILED,
  GETVSPTRACKEDTICKETS_SUCCESS,
  SET_CANDISABLEPROCESSMANAGED,
  GETVSP_ATTEMPT,
  GETVSP_FAILED,
  GETVSP_SUCCESS,
  GETUNSPENTUNEXPIREDVSPTICKETS_ATTEMPT,
  GETUNSPENTUNEXPIREDVSPTICKETS_SUCCESS,
  GETUNSPENTUNEXPIREDVSPTICKETS_FAILED,
  UPDATE_USED_VSPS,
  RESENDVSPDVOTECHOICES_ATTEMPT,
  RESENDVSPDVOTECHOICES_SUCCESS,
  RESENDVSPDVOTECHOICES_FAILED,
  GETVSP_TICKET_STATUS_ATTEMPT,
  GETVSP_TICKET_STATUS_SUCCESS,
  GETVSP_TICKET_STATUS_FAILED,
  SET_ACCOUNT_FOR_TICKET_PURCHASE,
  SET_SELECTED_VSP,
  SET_NUM_TICKETS_TO_BUY
} from "actions/VSPActions";
import {
  STARTTICKETBUYER_ATTEMPT,
  STARTTICKETBUYER_SUCCESS,
  STARTTICKETBUYER_FAILED,
  STOPTICKETBUYER_SUCCESS
} from "actions/ControlActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";
import { WALLET_LOADER_SETTINGS } from "actions/DaemonActions";

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
    case STARTTICKETBUYER_ATTEMPT:
      return { ...state, ticketAutoBuyerRunning: false };
    case STARTTICKETBUYER_SUCCESS:
      return {
        ...state,
        ticketAutoBuyerRunning: true,
        ticketBuyerCall: action.ticketBuyerCall,
        vsp: action.vsp,
        balanceToMaintain: action.balanceToMaintain,
        account: action.account.name
      };
    case STARTTICKETBUYER_FAILED:
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
    case SET_REMEMBERED_VSP_HOST:
      return { ...state, rememberedVspHost: action.rememberedVspHost };
    case UPDATE_USED_VSPS:
      return { ...state, usedVSPs: action.usedVSPs };
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
    case SET_AUTOBUYER_SETTINGS:
      return {
        ...state,
        balanceToMaintain: action.autobuyerSettings?.balanceToMaintain,
        account: action.autobuyerSettings?.account,
        maxFeePercentage: action.autobuyerSettings?.maxFeePercentage
      };
    case GETVSPSPUBKEYS_SUCCESS:
      return {
        ...state,
        availableVSPsPubkeys: action.availableVSPsPubkeys,
        availableVSPsPubkeysError: null
      };
    case GETVSPSPUBKEYS_FAILED:
      return {
        ...state,
        availableVSPsPubkeysError: String(action.error)
      };
    case GETVSPTRACKEDTICKETS_SUCCESS:
      return {
        ...state,
        trackedTickets: action.trackedTickets
      };
    case SET_CANDISABLEPROCESSMANAGED:
      return {
        ...state,
        canDisableProcessManaged: action.value
      };
    case WALLET_LOADER_SETTINGS:
      return {
        ...state,
        needsProcessManagedTickets: action.needsVSPdProcessManaged,
        canDisableProcessManaged: true
      };
    case CLOSEWALLET_SUCCESS:
      return {
        ...state,
        trackedTickets: {},
        needsProcessManagedTickets: true,
        account: null,
        selectedAccountForTicketPurchase: null,
        selectedVSP: null,
        numVSPicketsToBuy: 1
      };
    case GETVSP_ATTEMPT:
      return {
        ...state,
        getVSPAttempt: true
      };
    case GETVSP_FAILED:
      return {
        ...state,
        getVSPAttempt: false
      };
    case GETVSP_SUCCESS:
      return {
        ...state,
        getVSPAttempt: false
      };
    case GETUNSPENTUNEXPIREDVSPTICKETS_ATTEMPT:
      return { ...state, getUnspentUnexpiredVspTicketsAttempt: true };
    case GETUNSPENTUNEXPIREDVSPTICKETS_SUCCESS:
      return {
        ...state,
        getUnspentUnexpiredVspTicketsAttempt: false,
        unspentUnexpiredVspTickets: action.vsps
      };
    case GETUNSPENTUNEXPIREDVSPTICKETS_FAILED:
      return {
        ...state,
        getUnspentUnexpiredVspTicketsError: String(action.error),
        getUnspentUnexpiredVspTicketsAttempt: false
      };
    case RESENDVSPDVOTECHOICES_ATTEMPT:
      return { ...state, resendVSPDVoteChoicesAttempt: true };
    case RESENDVSPDVOTECHOICES_SUCCESS:
      return {
        ...state,
        resendVSPDVoteChoicesAttempt: false
      };
    case RESENDVSPDVOTECHOICES_FAILED:
      return {
        ...state,
        resendVSPDVoteChoicesAttemptError: String(action.error),
        resendVSPDVoteChoicesAttempt: false
      };
    case GETVSP_TICKET_STATUS_ATTEMPT:
      return { ...state, getVSPTicketStatusAttempt: true };
    case GETVSP_TICKET_STATUS_SUCCESS:
      return {
        ...state,
        getVSPTicketStatusAttempt: false
      };
    case GETVSP_TICKET_STATUS_FAILED:
      return {
        ...state,
        getVSPTicketStatusError: String(action.error),
        getVSPTicketStatusAttempt: false
      };
    case SET_ACCOUNT_FOR_TICKET_PURCHASE:
      return {
        ...state,
        selectedAccountForTicketPurchase: action.account.name
      };
    case SET_SELECTED_VSP:
      return {
        ...state,
        selectedVSP: action.selectedVSP
      };
    case SET_NUM_TICKETS_TO_BUY:
      return {
        ...state,
        numVSPicketsToBuy: action.numVSPicketsToBuy
      };
    default:
      return state;
  }
}
