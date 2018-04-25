import Promise from "promise";
import * as client from "middleware/grpc/client";
import { reverseHash, strHashToRaw, rawHashToHex } from "../helpers/byteActions";
import { CommittedTicketsRequest } from "middleware/walletrpc/api_pb";
import Parser from "binary-parser";
import { withLog as log, withLogNoData, logOptionNoResponseData } from "./index";
import * as api from "middleware/walletrpc/api_pb";

const promisify = fn => (...args) => new Promise((ok, fail) => fn(...args,
  (res, err) => err ? fail(err) : ok(res)));

export const getWalletService = promisify(client.getWalletService);
export const getTicketBuyerService = promisify(client.getTicketBuyerService);
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

export const decodeTransaction = withLogNoData((decodeMessageService, rawTx) =>
  new Promise((resolve, reject) => {
    var buffer = Buffer.isBuffer(rawTx) ? rawTx : Buffer.from(rawTx, "hex");
    var buff = new Uint8Array(buffer);
    decodeRawTransaction(buff, (error, tx) => {
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

const decodeRawTransaction = (rawTx, cb) => {
  /*
	message Input {
		bytes previous_transaction_hash = 1;
		uint32 previous_transaction_index = 2;
		enum TreeType {
			REGULAR = 0;
			UNKNOWN = -1;
			STAKE = 1;
		}
		TreeType tree = 3;
		uint32 sequence = 4;
		int64 amount_in = 5;
		uint32 block_height = 6;
		uint32 block_index = 7;
		bytes signature_script = 8;
		string signature_script_asm = 9;
	}
	message Output {
		int64 value = 1;
		uint32 index = 2;
		int32 version = 3;
		bytes script = 4;
		string script_asm = 5;
		int32 required_signatures = 6;
		enum ScriptClass {
			NON_STANDARD = 0;
			PUB_KEY = 1;
			PUB_KEY_HASH = 2;
			SCRIPT_HASH = 3;
			MULTI_SIG = 4;
			NULL_DATA = 5;
			STAKE_SUBMISSION = 6;
			STAKE_GEN = 7;
			STAKE_REVOCATION = 8;
			STAKE_SUB_CHANGE = 9;
			PUB_KEY_ALT = 10;
			PUB_KEY_HASH_ALT = 11;
		}
		ScriptClass script_class = 7;
		repeated string addresses = 8;
		int64 commitment_amount = 9;
	}
	bytes transaction_hash = 1;
	int32 version = 2;
	uint32 lock_time = 3;
	uint32 expiry = 4;
	TransactionDetails.TransactionType transaction_type = 5;
	repeated Input inputs = 6;
	repeated Output outputs = 7;
  const
  var tx = {
    inputs: [],
    outputs: [],
    txHash: "",
    version: 0,
    lockTime: 0,
    expiry: 0,
    transactionType: "vote",
  };
  */
  var txParser = new Parser()
    .endianess("little")
    .uint32("version")
    .uint32("numInputs")
    .array("inputs", {
      type: inputParser,
      length: "numInputs"
    })
    .uint32("numOutputs")
    .array("outputs", {
      type: outputParser,
      length: "numOutputs"
    })
    .uint32("lockTime")
    .uint32("expiry");

  var inputParser = new Parser()
    .endianess("big")
    .buffer(32, "prevTxId")
    .uint32("outIndex")
    .bit3("outputTree")
    .bit13("sequence");

  var outputParser = new Parser()
    .endianess("big")
    .uint32("bu")
    .uint16("id")
    .bit3("offset")
    .bit13("fragOffset");

  this.version = reader.readInt32LE();
  var sizeTxIns = reader.readVarintNum();

  // check for segwit
  var hasWitnesses = false;
  if (sizeTxIns === 0 && reader.buf[reader.pos] !== 0) {
    reader.pos += 1;
    hasWitnesses = true;
    sizeTxIns = reader.readVarintNum();
  }

  for (var i = 0; i < sizeTxIns; i++) {
    var input = Input.fromBufferReader(reader);
    this.inputs.push(input);
  }

  var sizeTxOuts = reader.readVarintNum();
  for (var j = 0; j < sizeTxOuts; j++) {
    this.outputs.push(Output.fromBufferReader(reader));
  }

  if (hasWitnesses) {
    for (var k = 0; k < sizeTxIns; k++) {
      var itemCount = reader.readVarintNum();
      var witnesses = [];
      for (var l = 0; l < itemCount; l++) {
        var size = reader.readVarintNum();
        var item = reader.read(size);
        witnesses.push(item);
      }
      this.inputs[k].setWitnesses(witnesses);
    }
  }

  this.nLockTime = reader.readUInt32LE();

  var tx = txParser.parse(rawTx);
  return cb(null, tx);
};
