import { getDecodeMessageService } from "../middleware/grpc/client";
import { decodeTransaction } from "wallet/service";
import { reverseHash } from "../helpers/byteActions";

export const GETDECODEMESSAGESERVICE_ATTEMPT = "GETDECODEMESSAGESERVICE_ATTEMPT";
export const GETDECODEMESSAGESERVICE_FAILED = "GETDECODEMESSAGESERVICE_FAILED";
export const GETDECODEMESSAGESERVICE_SUCCESS = "GETDECODEMESSAGESERVICE_SUCCESS";

export function getDecodeMessageServiceAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETDECODEMESSAGESERVICE_ATTEMPT });

    const grpc = getState().grpc;

    getDecodeMessageService(grpc.address, grpc.port, function(decodeMessageService, error) {
      if (error) {
        dispatch({error, type: GETDECODEMESSAGESERVICE_FAILED });
      } else {
        dispatch({ decodeMessageService, type: GETDECODEMESSAGESERVICE_SUCCESS });
      }
    });
  };
}

export const DECODERAWTX_SUCCESS = "DECODERAWTX_SUCCESS";

// decodeRawTransaction requests decodification of a raw, hex-encoded transaction.
export function decodeRawTransaction(hexTx) {
  return (dispatch, getState) => {
    var { decodeMessageService } = getState().grpc;

    const resolved = resp => {
      const decodedTransaction = resp.getTransaction();
      const hash = reverseHash(Buffer.from(decodedTransaction.getTransactionHash()).toString("hex"));
      const transaction = {hash: hash, transaction: decodedTransaction};
      dispatch({transaction, type: DECODERAWTX_SUCCESS});
    };

    decodeTransaction(decodeMessageService, hexTx)
      .then(resolved)
      .catch(error => console.log("DecodeRawTx Error", error));
  };
}
