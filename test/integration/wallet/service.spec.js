import { decodeRawTransaction } from "../../../app/wallet/service";
import { hexToBytes } from "../../../app/helpers";

import { txShouldFail } from "../../data/HexTransactions";
import { MainNetParams, TestNetParams } from "../../../app/constants";

test("decode ticket raw transaction", () => {
  const bufferTx = Buffer.from(hexToBytes(txShouldFail));
  expect(decodeRawTransaction(bufferTx, TestNetParams)).toStrictEqual(null);
});
 
