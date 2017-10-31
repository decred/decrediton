import { getDecodeMessageService } from "../middleware/grpc/client";
import {
  DecodeRawTransactionRequest
} from "../middleware/walletrpc/api_pb";
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

export const DECODERAWTX_ATTEMPT = "DECODERAWTX_ATTEMPT";

export function decodeRawTransaction(hexTx) {
  console.log("gonna hex", hexTx);
  return (dispatch, getState) => {
    var request = new DecodeRawTransactionRequest();
    var { decodeMessageService } = getState().grpc;
    var buff = new Uint8Array(Buffer.from(hexTx, "hex"));
    console.log(buff);
    request.setSerializedTransaction(buff);
    dispatch({ request, type: DECODERAWTX_ATTEMPT });
    decodeMessageService.decodeRawTransaction(request, (error, tx) => {
      if (error) {
        console.log("decodeRawTx Error", error);
        return;
      }
      console.log("decodeRawTx response", tx.toObject());

    });

  };

}

export function decodeTicketTransactions(ticket) {
  return (dispatch, getState) => {
    var { decodeMessageService } = getState().grpc;
    const responseResolved = decodedTransactionResponse => {
      const decodedTransaction = decodedTransactionResponse.getTransaction();
      const hash = reverseHash(Buffer.from(decodedTransaction.getTransactionHash()).toString("hex"));
      const transaction = {hash: hash, transaction: decodedTransaction};
      console.log("gonna dispatch XXXX", transaction);
      dispatch({transaction, type: "XXXX"});
    };

    decodeTransaction(decodeMessageService, ticket.ticketRawTx)
      .then(responseResolved);
    decodeTransaction(decodeMessageService, ticket.spenderRawTx)
      .then(responseResolved);
  };
}
