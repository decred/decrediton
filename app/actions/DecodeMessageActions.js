import { decodeTransaction, getDecodeService, validateAddress } from "wallet";
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

// decodeRawTransaction requests decodification of a raw, hex-encoded transaction.
export const decodeRawTransaction = (hexTx) => (dispatch, getState) => new Promise((resolve, reject) => {
  const { decodeMessageService } = getState().grpc;
  decodeTransaction(decodeMessageService, hexTx)
    .then(resp => {
      const decodedTx = resp.getTransaction();
      const hash = reverseHash(Buffer.from(decodedTx.getTransactionHash()).toString("hex"));
      dispatch({ decodedTx, hash, type: DECODERAWTXS_SUCCESS });
      resolve(decodedTx);
    })
    .catch(error => {
      dispatch({ error, type: DECODERAWTXS_FAILED });
      reject(error);
    });
});

// getNonWalletOutputs decodes a tx and gets outputs which are not from the wallet.
export const getNonWalletOutputs = (decodeMessageService, walletService, tx) => new Promise((resolve,reject) => decodeTransaction(
  decodeMessageService, Buffer.from(tx.tx.getTransaction())
).then(async r => {
  const tx = r.getTransaction();
  const outputs = tx.getOutputsList().map(async o => {
    const address = o.getAddressesList()[0];
    // Validate address so we can check if it is our own.
    // If that is the case it is a change output.
    const addrValidResp = await validateAddress(walletService, address);
    return {
      address,
      value: o.getValue(),
      isChange: addrValidResp.getIsMine()
    };
  });
  resolve(Promise.all(outputs));
})
  .catch(err => reject(err)));
