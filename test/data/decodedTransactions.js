export const decodedPurchasedTicketTx = {
  "version": 1,
  "prefixOffset": 172,
  "serType": 0,
  "numInputs": 1,
  "inputs": [
    {
      "prevTxId": "69a7f9f5940ac25394d79d04e64895e95015dc809389248ce408d983a2c06b84",
      "outputIndex": 0,
      "outputTree": 0,
      "sequence": 4294967295,
      "index": 0,
      "valueIn": 5411540911,
      "blockHeight": 0,
      "blockIndex": 4294967295,
      "sigScript": Buffer.from("473044022043f26897017cdb9cf61d9f13aa0ece87c1eb61c2cf83371568d4d2093830beff02203948589692b7a0dd3e504286afe9e309989f9f298c7e9070610c0b6f2aa873410121030875038ca21fee734f101888fef4315270e59d36eaff9830616e1e4dcf22f82b", "hex")
    }
  ],
  "numOutputs": 3,
  "outputs": [
    {
      "value": 5411537931,
      "version": 0,
      "script": Buffer.from([186, 118, 169, 20, 107, 161, 247, 166, 91, 127, 58, 29, 179, 69, 94, 23, 177, 27, 72, 252, 85, 223, 37, 183, 136, 172]),
      "index": 0,
      "decodedScript": {
        "scriptClass": 6,
        "address": "TsaqEon1LTaYNUC1yj4mL4rm5ps5UuqvrZN",
        "requiredSig": 1,
        "asm": "OP_SSTX OP_DUP OP_HASH160 OP_DATA_20 6ba1f7a65b7f3a1db3455e17b11b48fc55df25b7 OP_EQUALVERIFY OP_CHECKSIG"
      }
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
      "decodedScript": {
        "scriptClass": 9,
        "address": "TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2",
        "requiredSig": 1,
        "asm": "OP_SSTXCHANGE OP_DUP OP_HASH160 OP_DATA_20 0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG"
      }
    }
  ],
  "lockTime": 0,
  "expiry": 443268
};

// multiTxPrefix is a tx prefix in the format of how our decodeTxs are. We get
// this format from wallet.decodeRawTransaction().
export const multiTxPrefix = {
  prefixOffset: 211,
  serType: 1, // TxSerializeNoWitness,
  version: 1,
  numInputs: 1,
  numOutputs: 2,
  inputs: [
    {
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
        0xac // OP_CHECKSIG
      ])
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
        0xac // OP_CHECKSIG
      ])
    }
  ],
  lockTime: 0,
  expiry: 0
};

export const decodedVoteTx = {
  "version": 1,
  "prefixOffset": 201,
  "serType": 0,
  "numInputs": 2,
  "inputs": [
    {
      "prevTxId": "0000000000000000000000000000000000000000000000000000000000000000",
      "outputIndex": 4294967295,
      "outputTree": 0,
      "sequence": 4294967295,
      "index": 0,
      "valueIn": 17485354,
      "blockHeight": 0,
      "blockIndex": 4294967295,
      "sigScript": Buffer.from("0000", "hex")
    },
    {
      "prevTxId": "f31f3f60aff1294f08ead114cfccbd170094c73a77425795e1f72d0085c34991",
      "outputIndex": 0,
      "outputTree": 1,
      "sequence": 4294967295,
      "index": 1,
      "valueIn": 6652940331,
      "blockHeight": 0,
      "blockIndex": 4294967295,
      "sigScript": Buffer.from("47304402204c430c4ef577cbdcb51c3fe97340835964961c4c6d7efc47c1565292c486991f022037e02467ed5016dbebdb56061511491d55f7776eae72aad7a068278e7b9d885801210287d1de16a57eafa02035619991b53d1e4a878eb7e1028ebf634d36fb4f18bef4", "hex")
    }
  ],
  "numOutputs": 3,
  "outputs": [
    {
      "value": 0,
      "version": 0,
      "script": Buffer.from([ 106, 36, 80, 189, 167, 56, 116, 76, 236, 122, 238, 180, 10, 147, 237, 35, 166, 42, 23, 0, 145, 165, 64, 227, 45, 246, 67, 226, 51, 127, 5, 0, 0, 0, 217, 194, 6, 0 ]),
      "index": 0,
      "decodedScript": {
        "asm": "OP_RETURN OP_DATA_36 50bda738744cec7aeeb40a93ed23a62a170091a540e32df643e2337f05000000d9c20600",
        "scriptClass": 0,
        "requiredSig": 0,
        "address": null
      }
    },
    {
      "value": 0,
      "index": 1,
      "version": 0,
      "script": Buffer.from([ 106, 6, 1, 0, 8, 0, 0, 0 ]),
      "decodedScript": {
        "asm": "OP_RETURN OP_DATA_6 010008000000",
        "requiredSig": 0,
        "scriptClass": 0,
        "address": null
      }
    },
    {
      "value": 6670425685,
      "index": 2,
      "version": 0,
      "script": Buffer.from([
        187, 118, 169,  20, 142, 225,  64,
         16,  91, 233, 207, 135, 123, 201,
        214, 105, 176,  85, 198,  79,  67,
        147,  24, 105, 136, 172
      ]),
      "decodedScript": {
        "asm": "OP_SSGEN OP_DUP OP_HASH160 OP_DATA_20 8ee140105be9cf877bc9d669b055c64f43931869 OP_EQUALVERIFY OP_CHECKSIG",
        "requiredSig": 1,
        "scriptClass": 7,
        "address": "Tse3cGTiwBbZQYa3e4i4BiEdGQhSLpaaFvB"
      }
    }
  ],
  "lockTime": 0,
  "expiry": 0
};
