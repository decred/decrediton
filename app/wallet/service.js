import Promise from "promise";
import * as client from "middleware/grpc/client";
import { reverseHash, strHashToRaw, rawToHex } from "helpers/byteActions";
import { CommittedTicketsRequest } from "middleware/walletrpc/api_pb";
import {
  withLog as log,
  withLogNoData,
  logOptionNoResponseData
} from "./index";
import * as api from "middleware/walletrpc/api_pb";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  REGULAR,
  COINBASE,
  TICKET,
  VOTE,
  REVOCATION
} from "constants/Decrediton";
import { MAX_DCR_AMOUNT } from "constants/Decred";
import {
  _blake256,
  selializeNoWitnessEncode,
  decodeRawTransaction as decodeHelper
} from "helpers";
import { extractPkScriptAddrs } from "helpers/scripts";
import { addrFromSStxPkScrCommitment } from "helpers/tickets";
import { hexToBytes } from "../helpers/byteActions";

const promisify = (fn) => (...args) =>
  new Promise((ok, fail) =>
    fn(...args, (res, err) => (err ? fail(err) : ok(res)))
  );

export const getWalletService = promisify(client.getWalletService);
export const getTicketBuyerService = promisify(client.getTicketBuyerV2Service);
export const getVotingService = promisify(client.getVotingService);
export const getAgendaService = promisify(client.getAgendaService);
export const getMessageVerificationService = promisify(
  client.getMessageVerificationService
);
export const getSeedService = promisify(client.getSeedService);
export const getAccountMixerService = promisify(client.getAccountMixerService);

export const getNextAddress = log(
  (walletService, accountNum, kind) =>
    new Promise((resolve, reject) => {
      const request = new api.NextAddressRequest();
      request.setAccount(accountNum);
      request.setKind(kind ? kind : 0);
      request.setGapPolicy(api.NextAddressRequest.GapPolicy.GAP_POLICY_WRAP);
      walletService.nextAddress(request, (error, response) =>
        error ? reject(error) : resolve(response)
      );
    }).then((response) => ({
      ...response,
      publicKey: response.getPublicKey(),
      address: response.getAddress()
    })),
  "Get Next Address",
  logOptionNoResponseData()
);

export const validateAddress = withLogNoData(
  (walletService, address) =>
    new Promise((resolve, reject) => {
      const request = new api.ValidateAddressRequest();
      request.setAddress(address);
      walletService.validateAddress(request, (error, response) =>
        error ? reject(error) : resolve(response)
      );
    }),
  "Validate Address"
);

export const decodeTransactionLocal = (rawTx, chainParams) => {
  const buffer = Buffer.isBuffer(rawTx) ? rawTx : Buffer.from(rawTx, "hex");
  return Promise.resolve(decodeRawTransaction(buffer, chainParams));
};

// UNMINED_BLOCK_TEMPLATE is a helper const that defines what an unmined block
// looks like (null timestamp, height == -1, etc).
const UNMINED_BLOCK_TEMPLATE = {
  getTimestamp() {
    return null;
  },
  getHeight() {
    return -1;
  },
  getHash() {
    return null;
  }
};

// Map from numerical into string transaction type
export const TRANSACTION_TYPES = {
  [api.TransactionDetails.TransactionType.REGULAR]: REGULAR,
  [api.TransactionDetails.TransactionType.TICKET_PURCHASE]: TICKET,
  [api.TransactionDetails.TransactionType.VOTE]: VOTE,
  [api.TransactionDetails.TransactionType.REVOCATION]: REVOCATION,
  [api.TransactionDetails.TransactionType.COINBASE]: COINBASE
};

const StakeTxType = [
  api.TransactionDetails.TransactionType.VOTE,
  api.TransactionDetails.TransactionType.REVOCATION,
  api.TransactionDetails.TransactionType.TICKET_PURCHASE
];

// formatTransaction converts a transaction from the structure of a grpc reply
// into a structure more amenable to use within decrediton. If dec
export function formatTransaction(block, transaction, index) {
  // isStakeTx gets a transaction type and return true if it is a stake tx, false otherwise.
  // @param {int} type.
  const isStakeTx = (type) => StakeTxType.indexOf(type) > -1;

  const inputAmounts = transaction
    .getDebitsList()
    .reduce((s, input) => s + input.getPreviousAmount(), 0);
  const outputAmounts = transaction
    .getCreditsList()
    .reduce((s, input) => s + input.getAmount(), 0);
  const amount = outputAmounts - inputAmounts;
  const fee = transaction.getFee();
  const type = transaction.getTransactionType();
  const txType = TRANSACTION_TYPES[type];
  let direction;

  const debitAccounts = [];
  transaction
    .getDebitsList()
    .forEach((debit) => debitAccounts.push(debit.getPreviousAccount()));

  const creditAddresses = [];
  transaction
    .getCreditsList()
    .forEach((credit) => creditAddresses.push(credit.getAddress()));

  const isStake = isStakeTx(type);

  if (!isStake) {
    if (amount > 0) {
      direction = TRANSACTION_DIR_RECEIVED;
    } else if (amount < 0 && fee == Math.abs(amount)) {
      direction = TICKET_FEE;
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
    txType,
    debitsAmount: inputAmounts,
    creditsAmount: outputAmounts,
    type,
    amount,
    fee,
    debitAccounts,
    creditAddresses,
    isStake,
    rawTx: Buffer.from(transaction.getTransaction()).toString("hex"),
    direction
  };
}

export function formatUnminedTransaction(transaction, index) {
  return formatTransaction(UNMINED_BLOCK_TEMPLATE, transaction, index);
}

export const streamGetTransactions = withLogNoData(
  (
    walletService,
    startBlockHeight,
    endBlockHeight,
    targetTransactionCount,
    dataCb
  ) =>
    new Promise((resolve, reject) => {
      const request = new api.GetTransactionsRequest();
      request.setStartingBlockHeight(startBlockHeight);
      request.setEndingBlockHeight(endBlockHeight);
      request.setTargetTransactionCount(targetTransactionCount);

      const getTx = walletService.getTransactions(request);
      getTx.on("data", (response) => {
        let foundMined = [];
        let foundUnmined = [];

        const minedBlock = response.getMinedTransactions();
        if (minedBlock) {
          foundMined = minedBlock
            .getTransactionsList()
            .map((v, i) => formatTransaction(minedBlock, v, i));
        }

        const unmined = response.getUnminedTransactionsList();
        if (unmined) {
          foundUnmined = unmined.map((v, i) => formatUnminedTransaction(v, i));
        }

        dataCb(foundMined, foundUnmined);
      });
      getTx.on("end", () => {
        resolve();
      });
      getTx.on("error", (err) => {
        reject(err);
      });
    }),
  "Get Transactions"
);

export const getTransactions = (
  walletService,
  startBlockHeight,
  endBlockHeight,
  targetTransactionCount
) =>
  new Promise((resolve, reject) => {
    let mined = [];
    let unmined = [];

    const dataCb = (foundMined, foundUnmined) => {
      mined = mined.concat(foundMined);
      unmined = unmined.concat(foundUnmined);
    };

    streamGetTransactions(
      walletService,
      startBlockHeight,
      endBlockHeight,
      targetTransactionCount,
      dataCb
    )
      .then(() => resolve({ mined, unmined }))
      .catch(reject);
  });

export const getTransaction = (walletService, txHash) =>
  new Promise((resolve, reject) => {
    const request = new api.GetTransactionRequest();
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
        getTimestamp: () => -1
      };
      const index = -1; // wallet.GetTransaction doesn't return the index
      const tx = formatTransaction(block, resp.getTransaction(), index);
      resolve(tx);
    });
  });

export const publishUnminedTransactions = log(
  (walletService) =>
    new Promise((resolve, reject) => {
      const req = new api.PublishUnminedTransactionsRequest();
      walletService.publishUnminedTransactions(req, (err) =>
        err ? reject(err) : resolve()
      );
    }),
  "Publish Unmined Transactions"
);

export const committedTickets = withLogNoData(
  (walletService, ticketHashes) =>
    new Promise((resolve, reject) => {
      const req = new CommittedTicketsRequest();
      req.setTicketsList(ticketHashes);
      walletService.committedTickets(req, (err, tickets) =>
        err ? reject(err) : resolve(tickets)
      );
    }),
  "Committed Tickets"
);

// decodeRawTransaction decodes a raw transaction into a human readable
// object.
export const decodeRawTransaction = (rawTx, chainParams) => {
  if (!(rawTx instanceof Buffer)) {
    throw new Error("rawtx requested for decoding is not a Buffer object");
  }
  if (!chainParams) {
    throw new Error("chainParams can not be undefined");
  }

  const decodedTx = decodeHelper(rawTx);
  decodedTx.outputs = decodedTx.outputs.map((o, i) => {
    let decodedScript = extractPkScriptAddrs(0, o.script, chainParams);
    // if scriptClass equals NullDataTy (which is 0) && i&1 == 1
    // extract address from SStxPkScrCommitment script.
    if (decodedScript.scriptClass === 0 && i&1 === 1) {
      const { error, address } = addrFromSStxPkScrCommitment(o.script, chainParams);
      if (!error && address) {
        decodedScript = {
          address,
          scriptClass: 0,
          requiredSig: 0
        };
      }
    }
    return {
      ...o,
      decodedScript
    };
  });

  return decodedTx;
};

// getSstxCommitmentAddress gets a sstx commitiment address from a ticket.
export const getSstxCommitmentAddress = (walletService, chainParams, ticketHash) => new Promise((resolve, reject) => {
  if (!chainParams) {
    throw new Error("chainParams can not be undefined");
  }
  let address;
  getTransaction(walletService, ticketHash).then(tx => {
    const { rawTx } = tx;
    const bufferRawTx = Buffer.from(hexToBytes(rawTx));
    const decodedTx = decodeHelper(bufferRawTx);
    decodedTx.outputs = decodedTx.outputs.map((o, i) => {
      const decodedScript = extractPkScriptAddrs(0, o.script, chainParams);
      // if scriptClass equals NullDataTy (which is 0) && i&1 == 1
      // extract address from SStxPkScrCommitment script.
      if (decodedScript.scriptClass === 0 && i&1 === 1) {
        address = addrFromSStxPkScrCommitment(o.script, chainParams);
        resolve(address);
      }
      return;
    });
  }).catch(error => reject(error));
});

// calculateHashFromEncodedTx calculates a hash from a decoded tx prefix.
export const calculateHashFromDecodedTx = (decodedTx) => {
  const rawEncodedTx = selializeNoWitnessEncode(decodedTx);
  const checksum = _blake256(Buffer.from(rawEncodedTx));
  return reverseHash(rawToHex(checksum));
};

export const listUnspentOutputs = withLogNoData(
  (
    walletService,
    accountNum,
    dataCb
  ) =>
    new Promise((resolve, reject) => {
      const request = new api.UnspentOutputsRequest();
      request.setAccount(accountNum);
      // we set the target amount as the MAX_DCR_AMOUNT, as we want to list all
      // unspent outputs possible.
      request.setTargetAmount(MAX_DCR_AMOUNT);
      // at least one confirmation.
      request.setRequiredConfirmations(1);

      const getOutputs = walletService.unspentOutputs(request);
      getOutputs.on("data", (response) => {
        const amount = response.getAmount();
        const txHash = reverseHash(
          Buffer.from(response.getTransactionHash()).toString("hex")
        );
        const outpointIndex = response.getOutputIndex();
        dataCb({ amount, txHash, outpointIndex });
      });
      getOutputs.on("end", () => {
        resolve();
      });
      getOutputs.on("error", (err) => {
        reject(err);
      });
    }),
  "Get Unspent Outputs"
);
withLogNoData;
