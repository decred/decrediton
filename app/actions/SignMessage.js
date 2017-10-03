// @flow
import { SignMessageRequest }  from "../middleware/walletrpc/api_pb";

export const SIGNMESSAGE_ATTEMPT = "SIGNMESSAGE_ATTEMPT";
export const SIGNMESSAGE_FAILED = "SIGNMESSAGE_FAILED";
export const SIGNMESSAGE_SUCCESS = "SIGNMESSAGE_SUCCESS";

export function signMessageAttempt({ address, message, passphrase }) {
  return (dispatch, getState) => {
    dispatch({ type: SIGNMESSAGE_ATTEMPT });
    const request = new SignMessageRequest();
    request.setAddress(address);
    request.setMessage(message);
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));

    const { walletService } = getState().grpc;
    walletService.signMessage(request,
      function (error, getSignMessageResponse) {
        if (error) {
          dispatch({ error, type: SIGNMESSAGE_FAILED });
        } else {
          dispatch({ getSignMessageResponse, type: SIGNMESSAGE_SUCCESS });
        }
      });
  };
}
