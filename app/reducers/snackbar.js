import React from "react";
import { reverseHash } from "../helpers/byteActions";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { PUBLISHTX_SUCCESS } from "../actions/ControlActions";

const messages = defineMessages({
  PUBLISHTX_SUCCESS: {
    id: "send.publishedTxHeader",
    defaultMessage: "Published tx: {hash}"
  }
});

export default function snackbar(state = {}, action) {
  let values, type;

  switch (action.type) {
    case PUBLISHTX_SUCCESS:
      const r = action.publishTransactionResponse;
      values = { hash: reverseHash(r.toString("hex")) }
      type = "Success";
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
