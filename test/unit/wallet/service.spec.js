import { decodeRawTransaction } from "../../../app/wallet/service";
import { hexToBytes } from "../../../app/helpers";

import { purchasedTicketTx } from "../../data/HexTransactions";
import { decodedPurchasedTicketTx } from "../../data/decodedTransactions";
import { MainNetParams, TestNetParams } from "../../../app/constants";

// TODO create integrations tests directory, differentiate them at our
// package.json mv this code part to there
test("decode ticket raw transaction", () => {
  const bufferTx = Buffer.from(hexToBytes(purchasedTicketTx));
  expect(decodeRawTransaction(bufferTx, TestNetParams)).toStrictEqual(decodedPurchasedTicketTx);
});
