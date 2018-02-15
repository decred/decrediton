import Promise from "promise";
import * as client from "middleware/grpc/client";
import { reverseHash } from "../helpers/byteActions";
import {
  NextAddressRequest,
  DecodeRawTransactionRequest,
  ValidateAddressRequest,
  GetTransactionsRequest,
  TransactionDetails,
  PublishUnminedTransactionsRequest,
} from "middleware/walletrpc/api_pb";
import { withLog as log, withLogNoData, logOptionNoResponseData } from "./index";

const promisify = fn => (...args) => new Promise((ok, fail) => fn(...args,
  (res, err) => err ? fail(err) : ok(res)));

export const getWalletService = promisify(client.getWalletService);
export const getTicketBuyerService = promisify(client.getTicketBuyerService);
export const getVotingService = promisify(client.getVotingService);
export const getAgendaService = promisify(client.getAgendaService);
export const getMessageVerificationService = promisify(client.getMessageVerificationService);
export const getDecodeService = promisify(client.getDecodeMessageService);

export const getNextAddress = log((walletService, accountNum) =>
  new Promise((resolve, reject) => {
    const request = new NextAddressRequest();
    request.setAccount(accountNum);
    request.setKind(0);
    walletService
      .nextAddress(request, (error, response) => error ? reject(error) : resolve(response));
  })
    .then(response => ({
      publicKey: response.getPublicKey()
    })), "Get Next Address", logOptionNoResponseData());

export const validateAddress = withLogNoData((walletService, address) =>
  new Promise((resolve, reject) => {
    const request = new ValidateAddressRequest();
    request.setAddress(address);
    walletService.validateAddress(request, (error, response) => error ? reject(error) : resolve(response));
  }), "Validate Address");

export const decodeTransaction = withLogNoData((decodeMessageService, rawTx) =>
  new Promise((resolve, reject) => {
    var request = new DecodeRawTransactionRequest();
    var buffer = Buffer.isBuffer(rawTx) ? rawTx : Buffer.from(rawTx, "hex");
    var buff = new Uint8Array(buffer);
    request.setSerializedTransaction(buff);
    decodeMessageService.decodeRawTransaction(request, (error, tx) => {
      if (error) {
        reject(error);
      } else {
        resolve(tx);
      }
    });
  }), "Decode Transaction");

// UNMINED_BLOCK_TEMPLATE is a helper const that defines what an unmined block
// looks like (null timestamp, height == -1, etc).
export const UNMINED_BLOCK_TEMPLATE = {
  getTimestamp() { return null; },
  getHeight() { return -1; },
  getHash() { return null; }
};

export const TRANSACTION_TYPE_REGULAR = "Regular";
export const TRANSACTION_TYPE_TICKET_PURCHASE = "Ticket";
export const TRANSACTION_TYPE_VOTE = "Vote";
export const TRANSACTION_TYPE_REVOCATION = "Revocation";
export const TRANSACTION_TYPE_COINBASE = "Coinbase";

// Map from numerical into string transaction type
export const TRANSACTION_TYPES = {
  [TransactionDetails.TransactionType.REGULAR]: TRANSACTION_TYPE_REGULAR,
  [TransactionDetails.TransactionType.TICKET_PURCHASE]: TRANSACTION_TYPE_TICKET_PURCHASE,
  [TransactionDetails.TransactionType.VOTE]: TRANSACTION_TYPE_VOTE,
  [TransactionDetails.TransactionType.REVOCATION]: TRANSACTION_TYPE_REVOCATION,
  [TransactionDetails.TransactionType.COINBASE]: TRANSACTION_TYPE_COINBASE
};

export const TRANSACTION_DIR_SENT = "sent";
export const TRANSACTION_DIR_RECEIVED = "received";
export const TRANSACTION_DIR_TRANSFERED = "transfer";

// formatTransaction converts a transaction from the structure of a grpc reply
// into a structure more amenable to use within decrediton. It stores the block
// information of when the transaction was mined into the transaction.
// Index is the index of the transaction within the block.
export function formatTransaction(block, transaction, index) {

  const inputAmounts = transaction.getDebitsList().reduce((s, input) => s + input.getPreviousAmount(), 0);
  const outputAmounts = transaction.getCreditsList().reduce((s, input) => s + input.getAmount(), 0);
  const amount = outputAmounts - inputAmounts;
  const fee = transaction.getFee();
  const type = transaction.getTransactionType();
  let direction = "";

  if (type === TransactionDetails.TransactionType.REGULAR) {
    if (amount > 0) {
      direction = TRANSACTION_DIR_RECEIVED;
    } else if (amount < 0 && (fee == Math.abs(amount))) {
      direction = TRANSACTION_DIR_TRANSFERED;
    } else {
      direction = TRANSACTION_DIR_SENT;
    }
  }

  return {
    timestamp: block.getTimestamp(),
    height: block.getHeight(),
    blockHash: block.getHash(),
    index: index,
    hash: transaction.getHash(),
    txHash: reverseHash(Buffer.from(transaction.getHash()).toString("hex")),
    tx: transaction,
    txType: TRANSACTION_TYPES[type],
    debitsAmount: inputAmounts,
    creditsAmount: outputAmounts,
    type,
    direction,
    amount,
    fee
  };
}

export function formatUnminedTransaction(transaction, index) {
  return formatTransaction(UNMINED_BLOCK_TEMPLATE, transaction, index);
}

export const streamGetTransactions = withLogNoData((walletService, startBlockHeight,
  endBlockHeight, targetTransactionCount, dataCb) =>
  new Promise((resolve, reject) => {
    var request = new GetTransactionsRequest();
    request.setStartingBlockHeight(startBlockHeight);
    request.setEndingBlockHeight(endBlockHeight);
    request.setTargetTransactionCount(targetTransactionCount);

    let getTx = walletService.getTransactions(request);
    getTx.on("data", (response) => {
      var foundMined = [];
      var foundUnmined = [];

      let minedBlock = response.getMinedTransactions();
      if (minedBlock) {
        foundMined = minedBlock
          .getTransactionsList()
          .map((v, i) => formatTransaction(minedBlock, v, i));
      }

      let unmined = response.getUnminedTransactionsList();
      if (unmined) {
        foundUnmined = unmined
          .map((v, i) => formatUnminedTransaction(v, i));
      }

      dataCb(foundMined, foundUnmined);
    });
    getTx.on("end", () => {
      resolve();
    });
    getTx.on("error", (err) => {
      reject(err);
    });
  }), "Get Transactions");

export const getTransactions = (walletService, startBlockHeight,
  endBlockHeight, targetTransactionCount) =>
  new Promise((resolve, reject) => {

    var mined = [];
    var unmined = [];

    const dataCb = (foundMined, foundUnmined) => {
      mined  = mined.concat(foundMined);
      unmined = unmined.concat(foundUnmined);
    };

    streamGetTransactions(walletService, startBlockHeight,
      endBlockHeight, targetTransactionCount, dataCb)
      .then(() => resolve({mined, unmined}))
      .catch(reject);
  });

export const publishUnminedTransactions = log((walletService) => new Promise((resolve, reject) => {
  const req = new PublishUnminedTransactionsRequest();
  walletService.publishUnminedTransactions(req, (err) => err ? reject(err) : resolve());
}), "Publish Unmined Transactions");
