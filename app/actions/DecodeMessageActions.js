import { decodeTransaction, getDecodeService } from "wallet";
import { reverseHash } from "helpers/byteActions";
import Promise from "promise";
import { isTestNet } from "selectors";

export const GETDECODEMESSAGESERVICE_ATTEMPT = "GETDECODEMESSAGESERVICE_ATTEMPT";
export const GETDECODEMESSAGESERVICE_FAILED = "GETDECODEMESSAGESERVICE_FAILED";
export const GETDECODEMESSAGESERVICE_SUCCESS = "GETDECODEMESSAGESERVICE_SUCCESS";

export const getDecodeMessageServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETDECODEMESSAGESERVICE_ATTEMPT });
  return getDecodeService(isTestNet(getState()), walletName, address, port)
    .then(decodeMessageService =>
      dispatch({ decodeMessageService, type: GETDECODEMESSAGESERVICE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETDECODEMESSAGESERVICE_FAILED }));
};

export const DECODERAWTXS_SUCCESS = "DECODERAWTXS_SUCCESS";
export const DECODERAWTXS_FAILED = "DECODERAWTXS_FAILED";

// decodeRawTransaction requests decodification of a list of hex transactions.
// Dispatches the event when all transactions have been decoded. Better
// performance than to use a sequence of decodeRawTransaction
export const decodeRawTransactions = (hexTxs) => (dispatch, getState) => {
  const { grpc: { decodeMessageService } } = getState();

  const resolved = resps => {
    const transactions = resps.reduce((map, resp) => {
      const decodedTransaction = resp.getTransaction();
      const hash = reverseHash(Buffer.from(decodedTransaction.getTransactionHash()).toString("hex"));
      map[hash] = { hash: hash, transaction: decodedTransaction };
      return map;
    }, {});
    dispatch({ transactions, type: DECODERAWTXS_SUCCESS });
  };

  Promise
    .all(hexTxs.map(hex => decodeTransaction(decodeMessageService, hex)))
    .then(resolved)
    .catch(error => dispatch({ error, type: DECODERAWTXS_FAILED }));
};

// decodeRawTransaction requests decodification of a raw, hex-encoded transaction.
export const decodeRawTransaction = (hexTx) => decodeRawTransactions([ hexTx ]);
