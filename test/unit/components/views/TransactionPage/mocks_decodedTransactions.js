export const mockDecodedTransactions = {
  "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff60ed215decf9ec50b50ff4477db42b1603178dab67e35d59f22b0de16cf4c1650000000001ffffffff0300000000000000000000266a24e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e0000000000000000000000086a0601000a0000002302b9940100000000001abb76a91499bf7a5e99c8c00e09ecef371eabd7865bcf5e1188ac0000000000000000029ef841000000000000000000ffffffff02000085097794010000007d330e00060000006a473044022038c9d8cafe8d98a904c72760e29a7f1e3942c9ef398a7384ca7b946517a3f598022016768855eae1edb7297ee52717bb4c1a247e836fce316a1d681026f4bcf9e5240121027bf4538b926d5668452965c44dbf8724b571ee6b3bae2eab59fd6969e6e87f13": {
    version: 1,
    serType: 0,
    numInputs: 2,
    inputs: [
      {
        prevTxId:
          "0000000000000000000000000000000000000000000000000000000000000000",
        outputIndex: 4294967295,
        outputTree: 0,
        sequence: 4294967295,
        index: 0,
        valueIn: 4323486,
        blockHeight: 0,
        blockIndex: 4294967295,
        sigScript: "0000"
      },
      {
        prevTxId:
          "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60",
        outputIndex: 0,
        outputTree: 1,
        sequence: 4294967295,
        index: 1,
        valueIn: 6785796485,
        blockHeight: 930685,
        blockIndex: 6,
        sigScript:
          "473044022038c9d8cafe8d98a904c72760e29a7f1e3942c9ef398a7384ca7b946517a3f598022016768855eae1edb7297ee52717bb4c1a247e836fce316a1d681026f4bcf9e5240121027bf4538b926d5668452965c44dbf8724b571ee6b3bae2eab59fd6969e6e87f13"
      }
    ],
    numOutputs: 3,
    outputs: [
      {
        value: 0,
        version: 0,
        script:
          "6a24e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e00",
        index: 0,
        decodedScript: {
          scriptClass: 0,
          address: null,
          requiredSig: 0,
          asm:
            "OP_RETURN OP_DATA_36 e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e00"
        }
      },
      {
        value: 0,
        version: 0,
        script: "6a0601000a000000",
        index: 1,
        decodedScript: {
          scriptClass: 0,
          address: null,
          requiredSig: 0,
          asm: "OP_RETURN OP_DATA_6 01000a000000"
        }
      },
      {
        value: 6790119971,
        version: 0,
        script: "bb76a91499bf7a5e99c8c00e09ecef371eabd7865bcf5e1188ac",
        index: 2,
        decodedScript: {
          scriptClass: 7,
          address: "Tsf35F2zDqv9EmDC1pTqixwNe5ytxyseRGr",
          requiredSig: 1,
          asm:
            "OP_SSGEN OP_DUP OP_HASH160 OP_DATA_20 99bf7a5e99c8c00e09ecef371eabd7865bcf5e11 OP_EQUALVERIFY OP_CHECKSIG"
        }
      }
    ],
    lockTime: 0,
    expiry: 0
  },
  "010000000147ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a0000000001ffffffff0158f7f6810100000000001abc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac000000000000000001f0fff6810100000045180a00060000006b483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052": {
    version: 1,
    serType: 0,
    numInputs: 1,
    inputs: [
      {
        prevTxId:
          "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
        outputIndex: 0,
        outputTree: 1,
        sequence: 4294967295,
        index: 0,
        valueIn: 6475415536,
        blockHeight: 661573,
        blockIndex: 6,
        sigScript:
          "483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052"
      }
    ],
    numOutputs: 1,
    outputs: [
      {
        value: 6475413336,
        version: 0,
        script: "bc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac",
        index: 0,
        decodedScript: {
          scriptClass: 8,
          address: "Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU",
          requiredSig: 1,
          asm:
            "OP_SSRTX OP_DUP OP_HASH160 OP_DATA_20 c0e4b3a5b5a454e388c6864ae51205223a12dce4 OP_EQUALVERIFY OP_CHECKSIG"
        }
      }
    ],
    lockTime: 0,
    expiry: 0
  },
  "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff574f7189057261e0e816b09306c3dd4ae55146be8d1ce52a4d5c2475fdcf85600000000001ffffffff0300000000000000000000266a2432c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e0000000000000000000000086a0601000a00000037fbb8db0200000000001abb76a91453b208495f9fabdfa80b4be10c4d0e488b33f29988ac0000000000000000029c0746000000000000000000ffffffff0200009bf372db0200000022090e00110000006a4730440220481a66bdf843d6fe2f41b0b5ba129cfec694f82bac72602d08998a2a8b792fb2022003b0a2c8ddfcc317fdb5fac33cc0fbff280ce4bc250caef3e94840c79ef60ee301210355174775888e14ed49e50dd0b904e6dca3f6b4595afd9248a020a4aa87ae469e": {
    version: 1,
    serType: 0,
    numInputs: 2,
    inputs: [
      {
        prevTxId:
          "0000000000000000000000000000000000000000000000000000000000000000",
        outputIndex: 4294967295,
        outputTree: 0,
        sequence: 4294967295,
        index: 0,
        valueIn: 4589468,
        blockHeight: 0,
        blockIndex: 4294967295,
        sigScript: "0000"
      },
      {
        prevTxId:
          "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
        outputIndex: 0,
        outputTree: 1,
        sequence: 4294967295,
        index: 1,
        valueIn: 12271678363,
        blockHeight: 919842,
        blockIndex: 17,
        sigScript:
          "4730440220481a66bdf843d6fe2f41b0b5ba129cfec694f82bac72602d08998a2a8b792fb2022003b0a2c8ddfcc317fdb5fac33cc0fbff280ce4bc250caef3e94840c79ef60ee301210355174775888e14ed49e50dd0b904e6dca3f6b4595afd9248a020a4aa87ae469e"
      }
    ],
    numOutputs: 3,
    outputs: [
      {
        value: 0,
        version: 0,
        script:
          "6a2432c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e00",
        index: 0,
        decodedScript: {
          scriptClass: 0,
          address: null,
          requiredSig: 0,
          asm:
            "OP_RETURN OP_DATA_36 32c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e00"
        }
      },
      {
        value: 0,
        version: 0,
        script: "6a0601000a000000",
        index: 1,
        decodedScript: {
          scriptClass: 0,
          address: null,
          requiredSig: 0,
          asm: "OP_RETURN OP_DATA_6 01000a000000"
        }
      },
      {
        value: 12276267831,
        version: 0,
        script: "bb76a91453b208495f9fabdfa80b4be10c4d0e488b33f29988ac",
        index: 2,
        decodedScript: {
          scriptClass: 7,
          address: "TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n",
          requiredSig: 1,
          asm:
            "OP_SSGEN OP_DUP OP_HASH160 OP_DATA_20 53b208495f9fabdfa80b4be10c4d0e488b33f299 OP_EQUALVERIFY OP_CHECKSIG"
        }
      }
    ],
    lockTime: 0,
    expiry: 0
  }
};
