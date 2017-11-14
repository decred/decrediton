import Promise from "promise";
import { getDecodeMessageService } from "middleware/grpc/client";
import {
  NextAddressRequest,
  DecodeRawTransactionRequest,
} from "middleware/walletrpc/api_pb";

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

export const getDecodeService = (address, port) =>
  new Promise((resolve, reject) => getDecodeMessageService(
    address, port, (service, error) => error ? reject(error) : resolve(service)
  ));
