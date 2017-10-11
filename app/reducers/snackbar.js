import React from "react";
import { reverseHash } from "../helpers/byteActions";
import { FormattedMessage as T, defineMessages } from "react-intl";
import {
  PUBLISHTX_SUCCESS, PUBLISHTX_FAILED, SIGNTX_FAILED, CONSTRUCTTX_FAILED
} from "../actions/ControlActions";
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
  }
});

export default function snackbar(state = {}, action) {
  let values, type;

  switch (action.type) {
    // snackbar management events
    case SNACKBAR_DISMISS_MESSAGES:
      return { state, messages: Array() }

    // events that generate a snackbar message
    case PUBLISHTX_SUCCESS:
      const r = action.publishTransactionResponse;
      values = { hash: reverseHash(r.toString("hex")) }
      type = "Success";
      break;

    case PUBLISHTX_FAILED:
      values = { originalError: String(action.error) }
      type = "Error";
      break;

    case SIGNTX_FAILED:
      values = { originalError: String(action.error) }
      type = "Error";
      break;

    case CONSTRUCTTX_FAILED:
      values = { originalError: String(action.error) }
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
