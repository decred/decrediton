import Promise from "promise";
import * as client from "middleware/grpc/client";
import { reverseHash, strHashToRaw, rawHashToHex } from "../helpers/byteActions";
import { Uint64LE } from "int64-buffer";
import { CommittedTicketsRequest, DecodeRawTransactionRequest } from "middleware/walletrpc/api_pb";
import { withLog as log, withLogNoData, logOptionNoResponseData } from "./index";
import * as api from "middleware/walletrpc/api_pb";

const promisify = fn => (...args) => new Promise((ok, fail) => fn(...args,
  (res, err) => err ? fail(err) : ok(res)));

export const getWalletService = promisify(client.getWalletService);
export const getTicketBuyerService = promisify(client.getTicketBuyerV2Service);
export const getVotingService = promisify(client.getVotingService);
export const getAgendaService = promisify(client.getAgendaService);
export const getMessageVerificationService = promisify(client.getMessageVerificationService);
export const getDecodeService = promisify(client.getDecodeMessageService);
export const getSeedService = promisify(client.getSeedService);

export const getNextAddress = log((walletService, accountNum) =>
  new Promise((resolve, reject) => {
    const request = new api.NextAddressRequest();
    request.setAccount(accountNum);
    request.setKind(0);
    request.setGapPolicy(api.NextAddressRequest.GapPolicy.GAP_POLICY_WRAP);
    walletService
      .nextAddress(request, (error, response) => error ? reject(error) : resolve(response));
  })
    .then(response => ({
      ...response,
      publicKey: response.getPublicKey(),
      address: response.getAddress()
    })), "Get Next Address", logOptionNoResponseData());

export const validateAddress = withLogNoData((walletService, address) =>
  new Promise((resolve, reject) => {
    const request = new api.ValidateAddressRequest();
    request.setAddress(address);
    walletService.validateAddress(request, (error, response) => error ? reject(error) : resolve(response));
  }), "Validate Address");

export const decodeTransactionLocal = (rawTx) => {
  var buffer = Buffer.isBuffer(rawTx) ? rawTx : Buffer.from(rawTx, "hex");
  return Promise.resolve(decodeRawTransaction(buffer));
};

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
  [api.TransactionDetails.TransactionType.REGULAR]: TRANSACTION_TYPE_REGULAR,
  [api.TransactionDetails.TransactionType.TICKET_PURCHASE]: TRANSACTION_TYPE_TICKET_PURCHASE,
  [api.TransactionDetails.TransactionType.VOTE]: TRANSACTION_TYPE_VOTE,
  [api.TransactionDetails.TransactionType.REVOCATION]: TRANSACTION_TYPE_REVOCATION,
  [api.TransactionDetails.TransactionType.COINBASE]: TRANSACTION_TYPE_COINBASE
};

export const TRANSACTION_DIR_SENT = "sent";
export const TRANSACTION_DIR_RECEIVED = "received";
export const TRANSACTION_DIR_TRANSFERRED = "transfer";

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

  let debitAccounts = [];
  transaction.getDebitsList().forEach((debit) => debitAccounts.push(debit.getPreviousAccount()));

  let creditAddresses = [];
  transaction.getCreditsList().forEach((credit) => creditAddresses.push(credit.getAddress()));

  if (type === api.TransactionDetails.TransactionType.REGULAR) {
    if (amount > 0) {
      direction = TRANSACTION_DIR_RECEIVED;
    } else if (amount < 0 && (fee == Math.abs(amount))) {
      direction = TRANSACTION_DIR_TRANSFERRED;
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
    fee,
    debitAccounts,
    creditAddresses
  };
}

export function formatUnminedTransaction(transaction, index) {
  return formatTransaction(UNMINED_BLOCK_TEMPLATE, transaction, index);
}

export const streamGetTransactions = withLogNoData((walletService, startBlockHeight,
  endBlockHeight, targetTransactionCount, dataCb) =>
  new Promise((resolve, reject) => {
    var request = new api.GetTransactionsRequest();
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
      .then(() => resolve({ mined, unmined }))
      .catch(reject);
  });

export const getTransaction = (walletService, txHash) =>
  new Promise((resolve, reject) => {
    var request = new api.GetTransactionRequest();
    request.setTransactionHash(strHashToRaw(txHash));
    walletService.getTransaction(request, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      // wallet.GetTransaction doesn't return block height/timestamp information
      const block = {
        getHash: resp.getBlockHash,
        getHeight: () => -1,
        getTimestamp: () => -1,
      };
      const index = -1; // wallet.GetTransaction doesn't return the index
      const tx = formatTransaction(block, resp.getTransaction(), index);
      resolve(tx);
    });
  });

export const getUnformattedTransaction = (walletService, txHash) =>
  new Promise((resolve, reject) => {
    var request = new api.GetTransactionRequest();
    var buffer = Buffer.isBuffer(txHash) ? txHash : strHashToRaw(txHash);
    request.setTransactionHash(buffer);
    walletService.getTransaction(request, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      const tx = resp.getTransaction();
      resolve(tx);
    });
  });

// getInputTransactions returns the input transactions to the given source
// transaction (assumes srcTx was returned from decodeTransaction).
export const getInputTransactions = async (walletService, decodeMessageService, srcTx) => {
  const txs = [];
  for (let inp of srcTx.getInputsList()) {
    const inpTx = await getUnformattedTransaction(walletService, rawHashToHex(inp.getPreviousTransactionHash()));
    const decodedInpResp = await decodeTransaction(decodeMessageService, inpTx.getTransaction());
    txs.push(decodedInpResp.getTransaction());
  }

  return txs;
};

export const publishUnminedTransactions = log((walletService) => new Promise((resolve, reject) => {
  const req = new api.PublishUnminedTransactionsRequest();
  walletService.publishUnminedTransactions(req, (err) => err ? reject(err) : resolve());
}), "Publish Unmined Transactions");

export const committedTickets = withLogNoData((walletService, ticketHashes) => new Promise((resolve, reject) => {
  const req = new CommittedTicketsRequest();
  req.setTicketsList(ticketHashes);
  walletService.committedTickets(req, (err, tickets) => err ? reject(err) : resolve(tickets));
}), "Committed Tickets");

export const decodeRawTransaction = (rawTx) => {
  if (!(rawTx instanceof Buffer)) {
    throw new Error("rawtx requested for decoding is not a Buffer object");
  }
  var position = 0;

  var tx = {};
  tx.version = rawTx.readUInt32LE(position);
  position += 4;
  var first = rawTx.readUInt8(position);
  position += 1;
  switch (first) {
  case 0xFD:
    tx.numInputs = rawTx.readUInt16LE(position);
    position += 2;
    break;
  case 0xFE:
    tx.numInputs = rawTx.readUInt32LE(position);
    position += 4;
    break;
  default:
    tx.numInputs = first;
  }
  tx.inputs = [];
  for (var i = 0; i < tx.numInputs; i++) {
    var input = {};
    input.prevTxId = rawTx.slice(position, position+32);
    position += 32;
    input.outputIndex = rawTx.readUInt32LE(position);
    position += 4;
    input.outputTree = rawTx.readUInt8(position);
    position += 1;
    input.sequence = rawTx.readUInt32LE(position);
    position += 4;
    tx.inputs.push(input);
  }

  first = rawTx.readUInt8(position);
  position += 1;
  switch (first) {
  case 0xFD:
    tx.numOutputs = rawTx.readUInt16LE(position);
    position += 2;
    break;
  case 0xFE:
    tx.numOutputs = rawTx.readUInt32LE(position);
    position += 4;
    break;
  default:
    tx.numOutputs = first;
  }

  tx.outputs = [];
  for (var j = 0; j < tx.numOutputs; j++) {
    var output = {};
    output.value = Uint64LE(rawTx.slice(position, position+8)).toNumber();
    position += 8;
    output.version = rawTx.readUInt16LE(position);
    position += 2;
    // check length of scripts
    var scriptLen;
    first = rawTx.readUInt8(position);
    position += 1;
    switch (first) {
    case 0xFD:
      scriptLen = rawTx.readUInt16LE(position);
      position += 2;
      break;
    case 0xFE:
      scriptLen = rawTx.readUInt32LE(position);
      position += 4;
      break;
    default:
      scriptLen = first;
    }
    output.script = rawTx.slice(position, position+scriptLen);
    position += scriptLen;
    tx.outputs.push(output);
  }

  tx.lockTime = rawTx.readUInt32LE(position);
  position += 4;
  tx.expiry = rawTx.readUInt32LE(position);
  position += 4;
  return tx;
};
