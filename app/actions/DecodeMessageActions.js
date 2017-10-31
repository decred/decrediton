import { getDecodeMessageService } from "../middleware/grpc/client";
import { decodeTransaction } from "wallet/service";
import { reverseHash } from "../helpers/byteActions";
import Promise from "promise";

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

export const DECODERAWTXS_SUCCESS = "DECODERAWTXS_SUCCESS";

// decodeRawTransaction requests decodification of a raw, hex-encoded transaction.
export function decodeRawTransaction(hexTx) {
  return decodeRawTransactions([hexTx]);
}

// decodeRawTransaction requests decodification of a list of hex transactions.
// Dispatches the event when all transactions have been decoded. Better
// performance than to use a sequence of decodeRawTransaction
export function decodeRawTransactions(hexTxs) {
  return (dispatch, getState) => {
    var { decodeMessageService } = getState().grpc;

    const resolved = resps => {
      let transactions = resps.map(resp => {
        const decodedTransaction = resp.getTransaction();
        const hash = reverseHash(Buffer.from(decodedTransaction.getTransactionHash()).toString("hex"));
        return {hash: hash, transaction: decodedTransaction};
      });
      dispatch({transactions, type: DECODERAWTXS_SUCCESS});
    };

    Promise
      .all(hexTxs.map(hex => decodeTransaction(decodeMessageService, hex)))
      .then(resolved)
      .catch(error => console.log("DecodeRawTx Error", error));
  };
}
