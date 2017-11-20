import Promise from "promise";
import * as client from "middleware/grpc/client";
import {
  NextAddressRequest,
  DecodeRawTransactionRequest,
  ValidateAddressRequest,
  GetTransactionsRequest,
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

export const validateAddress = (walletService, address) =>
  new Promise((resolve, reject) => {
    const request = new ValidateAddressRequest();
    request.setAddress(address);
    walletService.validateAddress(request, (error, response) => error ? reject(error) : resolve(response));
  });

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

export const getTransactions = (walletService, startBlockHeight,
  endBlockHeight, maximumBlockCount) =>
  new Promise((resolve, reject) => {
    var request = new GetTransactionsRequest();
    request.setStartingBlockHeight(startBlockHeight);
    request.setEndingBlockHeight(endBlockHeight);
    request.setMaximumTransactionCount(maximumBlockCount);

    var foundMined = [];
    var foundUnmined = [];

    const unminedBlock = {
      getTimestamp() { return null; },
      getHeight() { return -1; },
      getHash() { return null; }
    };

    const formatTx = (block, tx, index) => ({
      timestamp: block.getTimestamp(),
      height: block.getHeight(),
      blockHash: block.getHash(),
      index: index,
      type: tx.getTransactionType(),
      hash: tx.getHash(),
      tx: tx
    });

    let getTx = walletService.getTransactions(request);
    getTx.on("data", (response) => {
      let minedBlock = response.getMinedTransactions();
      if (minedBlock) {
        minedBlock
          .getTransactionsList()
          .map((v, i) => formatTx(minedBlock, v, i))
          .forEach(v => { foundMined.push(v); });
      }

      let unmined = response.getUnminedTransactionsList();
      if (unmined) {
        unmined
          .map((v, i) => formatTx(unminedBlock, v, i))
          .forEach(v => foundUnmined.push(v));
      }
    });
    getTx.on("end", () => {
      resolve({mined: foundMined, unmined: foundUnmined});
    });
    getTx.on("error", (err) => {
      reject(err);
    });
  });
