// @flow
import { verifyMessage } from "wallet";
import * as sel from "selectors";

export const VERIFYMESSAGE_ATTEMPT = "VERIFYMESSAGE_ATTEMPT";
export const VERIFYMESSAGE_FAILED = "VERIFYMESSAGE_FAILED";
export const VERIFYMESSAGE_SUCCESS = "VERIFYMESSAGE_SUCCESS";
export const VERIFYMESSAGE_CLEANSTORE = "VERIFYMESSAGE_CLEANSTORE";

export const verifyMessageAttempt = ({ address, message, signature }) => (dispatch, getState) => {
  dispatch({ type: VERIFYMESSAGE_ATTEMPT });
  verifyMessage(sel.messageVerificationService(getState()), address, message, signature)
    .then(getVerifyMessageResponse =>
      dispatch({ getVerifyMessageResponse, type: VERIFYMESSAGE_SUCCESS }))
    .catch(error => dispatch({ error, type: VERIFYMESSAGE_FAILED }));
};

export const verifyMessageCleanStore = () => ({ type: VERIFYMESSAGE_CLEANSTORE });
