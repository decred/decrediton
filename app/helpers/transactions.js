import {
  RedeemP2PKHSigScriptSize,
  P2PKHPkScriptSize,
  TicketCommitmentScriptSize,
  MaxAmount,
  DefaultRelayFeePerKb
} from "constants";
import { EstimateSerializeSizeFromScriptSizes } from "./scripts";

// FeeForSerializeSize calculates the required fee for a transaction of some
// arbitrary size given a mempool's relay fee policy.
const FeeForSerializeSize = (relayFeePerKb, txSerializeSize) => {
  let fee = (relayFeePerKb * txSerializeSize) / 1000;

  if (fee == 0 && relayFeePerKb > 0) {
    fee = relayFeePerKb;
  }

  if (fee < 0 || fee > MaxAmount) {
    fee = MaxAmount;
  }

  return fee;
};

// must be sorted large to small
const splitPoints = [
  1 << 36, // 687.19476736
  1 << 34, // 171.79869184
  1 << 32, // 042.94967296
  1 << 30, // 010.73741824
  1 << 28, // 002.68435456
  1 << 26, // 000.67108864
  1 << 24, // 000.16777216
  1 << 22, // 000.04194304
  1 << 20, // 000.01048576
  1 << 18 // 000.00262144
];

const splitPointMapInit = () => {
  const splitMap = {};
  splitPoints.forEach((amt) => (splitMap[amt] = {}));
  return splitMap;
};

// isMixTx tests if a transaction is a CSPP-mixed transaction, which must have 3
// or more outputs of the same amount, which is one of the pre-defined mix
// denominations. mixDenom is the largest of such denominations. mixCount is the
// number of outputs of this denomination.
export const isMixTx = (tx) => {
  let mixDenom = 0;
  let mixCount;
  if (tx.txOutputs.length < 3 || tx.txInputs.length < 3) {
    return { isMix: false };
  }

  const splitPointMap = splitPointMapInit();
  const mixedOuts = new Map();
  tx.txOutputs.forEach((output) => {
    const val = output.amount;
    if (splitPointMap[val]) {
      const mixedOutCount = mixedOuts.get(val);
      if (mixedOutCount) {
        mixedOuts.set(val, mixedOutCount + 1);
      } else {
        mixedOuts.set(val, 1);
      }
    }
  });

  mixedOuts.forEach((count, val) => {
    console.log(val);
    console.log(count);
    console.log(mixedOuts);
    console.log(mixedOuts.get(val));
    if (count < 3) return;
    if (val > mixDenom) {
      mixDenom = val;
      mixCount = mixedOuts.get(val);
    }
  });

  const isMix = mixCount >= tx.txOutputs.length / 2;
  return { isMix, mixDenom, mixCount };
};

// The size of a solo (non-pool) ticket purchase transaction assumes a specific
// transaction structure and worst-case signature script sizes.
const calcSoloTicketTxSize = () => {
  const inSizes = [RedeemP2PKHSigScriptSize];
  const outSizes = [
    P2PKHPkScriptSize + 1,
    TicketCommitmentScriptSize,
    P2PKHPkScriptSize + 1
  ];
  return EstimateSerializeSizeFromScriptSizes(inSizes, outSizes, 0);
};

const soloTicketTxSize = calcSoloTicketTxSize();
const defaultFeeForTicket = FeeForSerializeSize(
  DefaultRelayFeePerKb,
  soloTicketTxSize
);

// IsMixedSplitTx tests if a transaction is a CSPP-mixed ticket split
// transaction (the transaction that creates appropriately-sized outputs to be
// spent by a ticket purchase). Such a transaction must have 3 or more outputs
// with an amount equal to the ticket price plus transaction fees, and at least
// as many other outputs. The expected fees to be included in the amount are
// based on the provided fee rate, relayFeeRate, and an assumed serialized size
// of a solo ticket transaction with one P2PKH input, two P2PKH outputs and one
// ticket commitment output.

// return (isMix bool, ticketOutAmt int64, numTickets uint32)
export const IsMixedSplitTx = (tx, relayFeeRate, ticketPrice) => {
  let numTickets = 0;
  let ticketOutAmt = 0;
  if (tx.txOutputs < 6 || tx.txInputs < 3) {
    return { isMix: false, ticketOutAmt, numTickets };
  }

  let ticketTxFee = defaultFeeForTicket;
  if (relayFeeRate !== DefaultRelayFeePerKb) {
    ticketTxFee = FeeForSerializeSize(relayFeeRate, soloTicketTxSize);
  }
  ticketOutAmt = ticketPrice + ticketTxFee;

  let numOtherOut = 0;
  tx.txOutputs.forEach((o) => {
    if (o.amount === ticketOutAmt) {
      numTickets++;
    } else {
      numOtherOut++;
    }
  });

  // NOTE: The numOtherOut requirement may be too strict,
  if (numTickets < 3 || numOtherOut < 3) {
    return { isMix: false, ticketOutAmt: 0, numTickets: 0 };
  }

  // The input amounts do not indicate if a split tx is a mix, although it is
  // common to fund such a split transaction with mixed outputs.

  // Count the mix denomination inputs.
  // mixedIns := make(map[int64]int64)
  // for _, in := range tx.TxIn {
  // 	val := in.ValueIn
  // 	if _, ok := splitPointMap[val]; ok {
  // 		mixedIns[val]++
  // 		//numMixedIns++
  // 		continue
  // 	}
  // }

  return { isMix: true, ticketOutAmt, numTickets };
};
