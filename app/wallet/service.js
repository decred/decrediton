import Promise from "promise";
import * as client from "middleware/grpc/client";
import {
  NextAddressRequest,
  DecodeRawTransactionRequest,
} from "middleware/walletrpc/api_pb";

const promisify = fn => (...args) => new Promise((ok, fail) => fn(...args,
  (res, err) => err ? fail(err) : ok(res)));

export const getWalletService = promisify(client.getWalletService);
export const getTicketBuyerService = promisify(client.getTicketBuyerService);
export const getVotingService = promisify(client.getVotingService);
export const getAgendaService = promisify(client.getAgendaService);
export const getMessageVerificationService = promisify(client.getMessageVerificationService);
export const getDecodeService = promisify(client.getDecodeMessageService);

export const getNextAddress = (walletService, accountNum) =>
  new Promise((resolve, reject) => {
    const request = new NextAddressRequest();
    request.setAccount(accountNum);
    request.setKind(0);
    walletService
      .nextAddress(request, (error, response) => error ? reject(error) : resolve(response));
  })
  .then(response => ({
    publicKey: response.getPublicKey()
  }));

export const decodeTransaction = (decodeMessageService, hexTx) =>
  new Promise((resolve, reject) => {
    var request = new DecodeRawTransactionRequest();
    var buff = new Uint8Array(Buffer.from(hexTx, "hex"));
    request.setSerializedTransaction(buff);
    decodeMessageService.decodeRawTransaction(request, (error, tx) => {
      if (error) {
        reject(error);
      } else {
        resolve(tx);
      }
    });
  });
