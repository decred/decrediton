import { reverseHash } from "../helpers/byteActions";
import { defineMessages } from "react-intl";
import {
  PUBLISHTX_SUCCESS, PUBLISHTX_FAILED,
  SIGNTX_FAILED, CONSTRUCTTX_FAILED,
  PURCHASETICKETS_SUCCESS, PURCHASETICKETS_FAILED,
  STARTAUTOBUYER_SUCCESS, STARTAUTOBUYER_FAILED,
  STOPAUTOBUYER_SUCCESS, STOPAUTOBUYER_FAILED,
  REVOKETICKETS_SUCCESS, REVOKETICKETS_FAILED,
  IMPORTSCRIPT_SUCCESS, IMPORTSCRIPT_FAILED,
} from "../actions/ControlActions";
import {
  UPDATESTAKEPOOLCONFIG_SUCCESS, UPDATESTAKEPOOLCONFIG_FAILED,
  SETSTAKEPOOLVOTECHOICES_SUCCESS, SETSTAKEPOOLVOTECHOICES_FAILED
} from "../actions/StakePoolActions";
import { SNACKBAR_DISMISS_MESSAGES } from "../actions/SnackbarActions";

const messages = defineMessages({
  PUBLISHTX_SUCCESS: {
    id: "send.publishedTxHeader",
    defaultMessage: "Published tx: {hash}"
  },
  PUBLISHTX_FAILED: {
    id: "send.errors.publishTxFailed",
    defaultMessage: "{originalError}"
  },
  SIGNTX_FAILED: {
    id: "send.errors.signTxFailed",
    defaultMessage: "{originalError}"
  },
  CONSTRUCTTX_FAILED: {
    id: "send.errors.constructTxFailed",
    defaultMessage: "{originalError}"
  },
  PURCHASETICKETS_SUCCESS: {
    id: "tickets.purchaseTicketsHeader",
    defaultMessage: "You bought {numTickets} tickets"
  },
  PURCHASETICKETS_FAILED: {
    id: "tickets.errors.purchaseTicketsFailed",
    defaultMessage: "{originalError}"
  },
  REVOKETICKETS_SUCCESS: {
    id: "tickets.revokeTicketsHeader",
    defaultMessage: "You successfully revoked tickets"
  },
  REVOKETICKETS_FAILED: {
    id: "tickets.errors.revokeTicketsFailed",
    defaultMessage: "{originalError}"
  },
  IMPORTSCRIPT_SUCCESS: {
    id: "tickets.importScriptHeader",
    defaultMessage: "You successfully imported a script tickets"
  },
  IMPORTSCRIPT_FAILED: {
    id: "tickets.errors.importScriptFailed",
    defaultMessage: "{originalError}"
  },
  STARTAUTOBUYER_SUCCESS: {
    id: "tickets.startAutoBuyerHeader",
    defaultMessage: "Ticket buyer is now running."
  },
  STARTAUTOBUYER_FAILED: {
    id: "tickets.errors.startAutoBuyerFailed",
    defaultMessage: "{originalError}"
  },
  STOPAUTOBUYER_SUCCESS: {
    id: "tickets.stopAutoBuyerHeader",
    defaultMessage: "Ticket buyer is now stopped."
  },
  STOPAUTOBUYER_FAILED: {
    id: "tickets.errors.stopAutoBuyerFailed",
    defaultMessage: "{originalError}"
  },
  UPDATESTAKEPOOLCONFIG_SUCCESS: {
    id: "tickets.updateStakePoolConfigHeader",
    defaultMessage: "You have successfully updated your stakepool settings."
  },
  UPDATESTAKEPOOLCONFIG_FAILED: {
    id: "tickets.errors.updateStakePoolConfigFailed",
    defaultMessage: "{originalError}"
  },
  SETSTAKEPOOLVOTECHOICES_SUCCESS: {
    id: "tickets.setStakePoolVoteChoices",
    defaultMessage: "Successfully set vote choices."
  },
  SETSTAKEPOOLVOTECHOICES_FAILED: {
    id: "tickets.errors.setStakePoolVoteChoicesFailed",
    defaultMessage: "{originalError}"
  },
});

export default function snackbar(state = {}, action) {
  let values, type;

  switch (action.type) {
  // snackbar management events
  case SNACKBAR_DISMISS_MESSAGES:
    return { state, messages: Array() };

  // events that generate a snackbar message
  case PUBLISHTX_SUCCESS: {
    const r = action.publishTransactionResponse;
    values = { hash: reverseHash(r.toString("hex")) };
    type = "Success";
    break;
  }

  case PUBLISHTX_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case SIGNTX_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case CONSTRUCTTX_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case PURCHASETICKETS_SUCCESS:
    values = { numTickets: action.purchaseTicketsResponse.getTicketHashesList().length };
    type = "Success";
    break;

  case PURCHASETICKETS_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case REVOKETICKETS_SUCCESS:
    type = "Success";
    break;

  case REVOKETICKETS_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case IMPORTSCRIPT_SUCCESS:
    type = "Success";
    break;

  case IMPORTSCRIPT_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case STARTAUTOBUYER_SUCCESS:
    type = "Success";
    break;

  case STARTAUTOBUYER_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case STOPAUTOBUYER_SUCCESS:
    type = "Success";
    break;

  case STOPAUTOBUYER_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case UPDATESTAKEPOOLCONFIG_SUCCESS:
    type = "Success";
    break;

  case UPDATESTAKEPOOLCONFIG_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;

  case SETSTAKEPOOLVOTECHOICES_SUCCESS:
    type = "Success";
    break;

  case SETSTAKEPOOLVOTECHOICES_FAILED:
    values = { originalError: String(action.error) };
    type = "Error";
    break;
  }
  if (values || type) {
    state.messages = state.messages.slice();
    state.messages.push({
      type: type,
      message: messages[action.type],
      values: values
    });
  }

  return state;

}
