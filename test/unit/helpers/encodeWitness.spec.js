import {
  calculateSerializeSize,
  selializeNoWitnessEncode,
  decodeRawTransaction
} from "../../../app/helpers/msgTx";
import { hexToBytes } from "../../../app/helpers/byteActions";
import { multiTxPrefix, multiTxPrefixEncoded } from "../../data/transactionsToEncode";
import { txShouldFail } from "../../data/HexTransactions";

test("Needed size to serialize tx calculated by calculateSerializeSize():", () => {
  expect(calculateSerializeSize(multiTxPrefix)).toBe(211);
});

test("encode no witness tx: ", () => {
  expect(selializeNoWitnessEncode(multiTxPrefix)).toStrictEqual(multiTxPrefixEncoded);
});

test("test msgTx decodeRawTransaction: ", () => {
  expect(decodeRawTransaction(multiTxPrefixEncoded)).toStrictEqual(multiTxPrefix);
});

// test("should fail", () => {
//   expect(decodeRawTransaction(Buffer.from(hexToBytes(txShouldFail)))).toStrictEqual(null)
// });
