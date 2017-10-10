// @flow
import { VerifyMessageRequest }  from "../middleware/walletrpc/api_pb";



export const VERIFYMESSAGE_ATTEMPT = "VERIFYMESSAGE_ATTEMPT";
export const VERIFYMESSAGE_FAILED = "VERIFYMESSAGE_FAILED";
export const VERIFYMESSAGE_SUCCESS = "VERIFYMESSAGE_SUCCESS";
export const VERIFYMESSAGE_CLEANSTORE = "VERIFYMESSAGE_CLEANSTORE";

export function verifyMessageAttempt({ address, message, signature }) {
  return (dispatch, getState) => {
    dispatch({ type: VERIFYMESSAGE_ATTEMPT });
    const request = new VerifyMessageRequest();
    request.setAddress(address);
    request.setMessage(message);
    request.setSignature(signature);

    const { messageVerificationService } = getState().grpc;

    messageVerificationService.verifyMessage(request,
      function (error, getVerifyMessageResponse) {
        if (error) {
          dispatch({ error, type: VERIFYMESSAGE_FAILED });
        } else {
          dispatch({ getVerifyMessageResponse, type: VERIFYMESSAGE_SUCCESS });
        }
      });
  };
}

export function verifyMessageCleanStore() {
  return (dispatch) => {
    dispatch({ type: VERIFYMESSAGE_CLEANSTORE });
  };
}
