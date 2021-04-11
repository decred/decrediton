import {
  calculateSerializeSize,
  selializeNoWitnessEncode,
  decodeRawTransaction
} from "../../../app/helpers/msgTx";
import { multiTxPrefixEncoded } from "../../data/rawTransactions";
import { multiTxPrefix } from "../../data/decodedTransactions";

test("Needed size to serialize tx calculated by calculateSerializeSize():", () => {
  expect(calculateSerializeSize(multiTxPrefix)).toBe(211);
});

test("encode no witness tx: ", () => {
  expect(selializeNoWitnessEncode(multiTxPrefix)).toStrictEqual(
    multiTxPrefixEncoded
  );
});

test("test msgTx decodeRawTransaction: ", () => {
  expect(decodeRawTransaction(multiTxPrefixEncoded)).toStrictEqual(
    multiTxPrefix
  );
});
