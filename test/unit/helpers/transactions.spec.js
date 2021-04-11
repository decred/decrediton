import {
  mix0Hex,
  coinbaseTxHex,
  smallNonMixedPoolSplitTx,
  hugeMixedSplitTx
} from "../../data/HexTransactions";
import { decodeRawTransaction } from "../../../app/helpers/msgTx";
import { isMixTx, isMixedSplitTx } from "../../../app/helpers/transactions";
import { DefaultRelayFeePerKb } from "../../../app/constants";

const testIsMixTxs = [
  {
    name: "Is mixed Transaction",
    tx: mix0Hex,
    expected: { isMix: true, mixCount: 11, mixDenom: 268435456 }
  },
  {
    name: "Not mixed Transaction. Coinbase tx:",
    tx: coinbaseTxHex,
    expected: { isMix: false }
  },
  {
    name: "smallNonMixedPoolSplitTx",
    tx: smallNonMixedPoolSplitTx,
    expected: { isMix: false }
  }
];

// ticket price so we can check if they are mixed split tx.
const ticketPrice0 = 13909274457;
const ticketPrice1 = 12978960619;

const testIsMixedSplitTxs = [
  {
    name: "ok mixed split tx",
    tx: hugeMixedSplitTx,
    ticketPrice: ticketPrice0,
    expected: { isMix: true, ticketOutAmt: 13909277437, numTickets: 9 }
  },
  {
    name: "ok no mixed split tx",
    tx: smallNonMixedPoolSplitTx,
    ticketPrice: ticketPrice1,
    expected: { isMix: false, ticketOutAmt: 0, numTickets: 0 }
  },
  {
    name: "no mixed split tx",
    tx: coinbaseTxHex,
    ticketPrice: ticketPrice0,
    expected: { isMix: false, ticketOutAmt: 0, numTickets: 0 }
  }
];

testIsMixedSplitTxs.forEach((testStruct) => {
  test("Is mix Tx ", () => {
    const decodedTx = decodeRawTransaction(Buffer.from(testStruct.tx, "hex"));
    expect(
      isMixedSplitTx(decodedTx, DefaultRelayFeePerKb, testStruct.ticketPrice)
    ).toStrictEqual(testStruct.expected);
  });
});
testIsMixTxs.forEach((testStruct) => {
  test("Is mix Tx ", () => {
    const decodedTx = decodeRawTransaction(Buffer.from(testStruct.tx, "hex"));
    expect(isMixTx(decodedTx)).toStrictEqual(testStruct.expected);
  });
});
