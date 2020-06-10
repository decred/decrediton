export const decodedPurchasedTicketTx = {
  "version": 1,
  "serType": 0,
  "numInputs": 1,
  "inputs": [
    {
      "opRawHash": Buffer.from([132, 107, 192, 162, 131, 217, 8, 228, 140, 36, 137, 147, 128, 220, 21, 80, 233, 149, 72, 230, 4, 157, 215, 148, 83, 194, 10, 148, 245, 249, 167, 105]),
      "prevTxId": "69a7f9f5940ac25394d79d04e64895e95015dc809389248ce408d983a2c06b84",
      "outputIndex": 0,
      "outputTree": 0,
      "sequence": 4294967295,
      "index": 0
    }
  ],
  "numOutputs": 3,
  "outputs": [
    {
      "value": 5411537931,
      "version": 0,
      "script": Buffer.from([186, 118, 169, 20, 107, 161, 247, 166, 91, 127, 58, 29, 179, 69, 94, 23, 177, 27, 72, 252, 85, 223, 37, 183, 136, 172]),
      "index": 0,
      "decodedScript": { "scriptClass": 6, "address": "TsaqEon1LTaYNUC1yj4mL4rm5ps5UuqvrZN", "requiredSig": 1 }
    },
    {
      "value": 0,
      "version": 0,
      "script": Buffer.from([106, 30, 38, 123, 31, 26, 0, 92, 236, 51, 208, 51, 56, 230, 32, 14, 198, 230, 22, 237, 157, 136, 175, 143, 141, 66, 1, 0, 0, 0, 0, 88]),
      "index": 1,
      "decodedScript": { "address": "TsUXbeUq2GBNkxFd3iYC8Qk9cjyRqJ86FCH", "scriptClass": 0, "requiredSig": 0 }
    },
    {
      "value": 0,
      "version": 0,
      "script": Buffer.from([189, 118, 169, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 172]),
      "index": 2,
      "decodedScript": { "scriptClass": 9, "address": "TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2", "requiredSig": 1 }
    }
  ],
  "lockTime": 0,
  "expiry": 443268
};

// multiTxPrefix is a tx prefix in the format of how our decodeTxs are. We get
// this format from wallet.decodeRawTransaction().
export const multiTxPrefix = {
  serType: 1, // TxSerializeNoWitness,
  version: 1,
  numInputs: 1,
  numOutputs: 2,
  inputs: [
    {
      opRawHash: Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      prevTxId: "0000000000000000000000000000000000000000000000000000000000000000",
      outputIndex: 0xffffffff,
      sequence: 0xffffffff,
      outputTree: 0,
      index: 0
    }
  ],
  outputs: [
    {
      value: 0x12a05f200,
      index: 0,
      version: 0xabab,
      script: Buffer.from([
        0x41, // OP_DATA_65
        0x04, 0xd6, 0x4b, 0xdf, 0xd0, 0x9e, 0xb1, 0xc5,
        0xfe, 0x29, 0x5a, 0xbd, 0xeb, 0x1d, 0xca, 0x42,
        0x81, 0xbe, 0x98, 0x8e, 0x2d, 0xa0, 0xb6, 0xc1,
        0xc6, 0xa5, 0x9d, 0xc2, 0x26, 0xc2, 0x86, 0x24,
        0xe1, 0x81, 0x75, 0xe8, 0x51, 0xc9, 0x6b, 0x97,
        0x3d, 0x81, 0xb0, 0x1c, 0xc3, 0x1f, 0x04, 0x78,
        0x34, 0xbc, 0x06, 0xd6, 0xd6, 0xed, 0xf6, 0x20,
        0xd1, 0x84, 0x24, 0x1a, 0x6a, 0xed, 0x8b, 0x63,
        0xa6, // 65-byte signature
        0xac, // OP_CHECKSIG
      ]),
    },
    {
      index: 1,
      value: 0x5f5e100,
      version: 0xbcbc,
      script: Buffer.from([
        0x41, // OP_DATA_65
        0x04, 0xd6, 0x4b, 0xdf, 0xd0, 0x9e, 0xb1, 0xc5,
        0xfe, 0x29, 0x5a, 0xbd, 0xeb, 0x1d, 0xca, 0x42,
        0x81, 0xbe, 0x98, 0x8e, 0x2d, 0xa0, 0xb6, 0xc1,
        0xc6, 0xa5, 0x9d, 0xc2, 0x26, 0xc2, 0x86, 0x24,
        0xe1, 0x81, 0x75, 0xe8, 0x51, 0xc9, 0x6b, 0x97,
        0x3d, 0x81, 0xb0, 0x1c, 0xc3, 0x1f, 0x04, 0x78,
        0x34, 0xbc, 0x06, 0xd6, 0xd6, 0xed, 0xf6, 0x20,
        0xd1, 0x84, 0x24, 0x1a, 0x6a, 0xed, 0x8b, 0x63,
        0xa6, // 65-byte signature
        0xac, // OP_CHECKSIG
      ]),
    },
  ],
  lockTime: 0,
  expiry: 0,
};
