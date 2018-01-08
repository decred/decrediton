// @flow
import { signMessage } from "wallet";
import * as sel from "selectors";

export const SIGNMESSAGE_ATTEMPT = "SIGNMESSAGE_ATTEMPT";
export const SIGNMESSAGE_FAILED = "SIGNMESSAGE_FAILED";
export const SIGNMESSAGE_SUCCESS = "SIGNMESSAGE_SUCCESS";
export const SIGNMESSAGE_CLEANSTORE = "SIGNMESSAGE_CLEANSTORE";

export function signMessageAttempt(address, message, passphrase ) {
  return (dispatch, getState) => {
    console.log(address, message, passphrase);
    dispatch({ type: SIGNMESSAGE_ATTEMPT });
    signMessage(sel.walletService(getState()), address, message, passphrase)
      .then(getSignMessageResponse =>
        dispatch({ getSignMessageResponse, type: SIGNMESSAGE_SUCCESS }))
      .catch(error => dispatch({ error, type: SIGNMESSAGE_FAILED }));
  };
}

export const signMessageCleanStore = () => ({ type: SIGNMESSAGE_CLEANSTORE });
