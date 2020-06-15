import { hexToBytes } from "../../app/helpers";
import { OP_DATA_45 } from "../../app/constants";

// TODO finish importing extractPkScriptAddrs method so we can finish testing.
export const MAINNET_scriptDataTest = [
  // {
  //   name: "standard p2pk with compressed pubkey (0x02)",
  //   script: hexToBytes("2102192d74d0cb94344c9569c2e77901573d8d7903c3ebec3a957724895dca52c6b4ac"),
  //   expected: "DkM2fgjLXUzrioFVeSggNQjGnj1Amawdhjyot2RUbtNz4BYNdA4uE",
  //   reqSigs: 1,
  //   // class: PubKeyTy,
  // },
  // {
  //   name: "standard p2pk with uncompressed pubkey (0x04)",
  //   script: hexToBytes("410411db93e1dcdb8a016b49840f8c53b" +
  //     "c1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddf" +
  //     "b84ccf9744464f82e160bfa9b8b64f9d4c03f999b864" +
  //     "3f656b412a3ac"),
  //   expected: "DkRKRkLSZj47MF74gXJCStRzyu5taJEaKswi14BDBjcrav994xM3u",
  //   reqSigs: 1,
  //   // class: PubKeyTy,
  // },
  // {
  //   name: "standard p2pk with compressed pubkey (0x03)",
  //   script: hexToBytes("2103b0bd634234abbb1ba1e986e884185" +
  //     "c61cf43e001f9137f23c2c409273eb16e65ac"),
  //   expected: "DkRLdimLZbLUFDAgAURRbm7rRnXxfPbXrCJ2S8cAc2yFUov8mFTz9",
  //   reqSigs: 1,
  //   // class: PubKeyTy,
  // },
  // {
  //   name: "2nd standard p2pk with uncompressed pubkey (0x04)",
  //   script: hexToBytes("4104b0bd634234abbb1ba1e986e884185" +
  //     "c61cf43e001f9137f23c2c409273eb16e6537a576782" +
  //     "eba668a7ef8bd3b3cfb1edb7117ab65129b8a2e681f3" +
  //     "c1e0908ef7bac"),
  //   expected: "DkRLdimLZbLUFDAgAURRbm7rRnXxfPbXrCJ2S8cAc2yFUov8mFTz9",
  //   reqSigs: 1,
  //   // class: PubKeyTy,
  // },
  {
    name: "standard p2pkh",
    script: hexToBytes("76a914ad06dd6ddee55cbca9a9e3713bd" +
      "7587509a3056488ac"),
    expected: {
      "address": "Dsgjncbv1fYMywusjnrSBrzvAde8APEPP1f",
      "requiredSig": 1,
      "scriptClass": 2,
      "asm": "OP_DUP OP_HASH160 OP_DATA_20 ad06dd6ddee55cbca9a9e3713bd7587509a30564 OP_EQUALVERIFY OP_CHECKSIG"
    },
    // reqSigs: 1,
    // class: PubKeyHashTy == 2,
  },
  {
    name: "standard p2sh",
    script: hexToBytes("a91463bcc565f9e68ee0189dd5cc67f1b" +
      "0e5f02f45cb87"),
    expected: {
      "address": "DcgYx6SzsWsaTFYEHwZ83wyKntCMiJYrJ3M",
      "requiredSig": 1,
      "scriptClass": 3,
      "asm": "OP_HASH160 OP_DATA_20 63bcc565f9e68ee0189dd5cc67f1b0e5f02f45cb OP_EQUAL"
    },
    // reqSigs: 1,
    // class: ScriptHashTy == 3,
  },
  // {"version":1,"serType":0,"numInputs":1,"inputs":
  // [{"opRawHash":{"type":"Buffer","data":
  // [132,107,192,162,131,217,8,228,140,36,137,147,128,220,21,80,233,149,72,230,4,157,215,148,83,194,10,148,245,249,167,105]},
  // "prevTxId":"69a7f9f5940ac25394d79d04e64895e95015dc809389248ce408d983a2c06b84","outputIndex":0,"outputTree":0,"sequence":4294967295,"index":0}],
  // "numOutputs":3,
  // "outputs":[{"value":5411537931,"version":0,"script":{"type":"Buffer","data":
  // [186,118,169,20,107,161,247,166,91,127,58,29,179,69,94,23,177,27,72,252,85,223,37,183,136,172]},"index":0},
  // {"value":0,"version":0,"script":{"type":"Buffer",
  // "data":[106,30,38,123,31,26,0,92,236,51,208,51,56,230,32,14,198,230,22,237,157,136,175,143,141,66,1,0,0,0,0,88]},"index":1}
  // ,{"value":0,"version":0,"script":{"type":"Buffer","data":[189,118,169,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,172]},"index":2}]
  // ,"lockTime":0,"expiry":443268}

  // from real tx 60a20bd93aa49ab4b28d514ec10b06e1829ce6818ec06cd3aabd013ebcdc4bb1, vout 0
  // {
  //   name: "standard 1 of 2 multisig",
  //   script: hexToBytes("514104cc71eb30d653c0c3163990c47b9" +
  //     "76f3fb3f37cccdcbedb169a1dfef58bbfbfaff7d8a47" +
  //     "3e7e2e6d317b87bafe8bde97e3cf8f065dec022b51d1" +
  //     "1fcdd0d348ac4410461cbdcc5409fb4b4d42b51d3338" +
  //     "1354d80e550078cb532a34bfa2fcfdeb7d76519aecc6" +
  //     "2770f5b0e4ef8551946d8a540911abe3e7854a26f39f" +
  //     "58b25c15342af52ae"),
  //   expected: [
  //     "DkM42dsoS2eeL2TpENYGQMxCB6SMKqc94FnD3iE8pWCbAaugyHuEm",
  //     "DkRL2xG4nM4RN931tr9uX4oYJZPWuuLxcvxbPXsSEkzEW2PRyYFP9"
  //   ],
  //   reqSigs: 1,
  //   // class: MultiSigTy,
  // },
  // // from real tx d646f82bd5fbdb94a36872ce460f97662b80c3050ad3209bef9d1e398ea277ab, vin 1
  // {
  //   name: "standard 2 of 3 multisig",
  //   script: hexToBytes("524104cb9c3c222c5f7a7d3b9bd152f36" +
  //     "3a0b6d54c9eb312c4d4f9af1e8551b6c421a6a4ab0e2" +
  //     "9105f24de20ff463c1c91fcf3bf662cdde4783d4799f" +
  //     "787cb7c08869b4104ccc588420deeebea22a7e900cc8" +
  //     "b68620d2212c374604e3487ca08f1ff3ae12bdc63951" +
  //     "4d0ec8612a2d3c519f084d9a00cbbe3b53d071e9b09e" +
  //     "71e610b036aa24104ab47ad1939edcb3db65f7fedea6" +
  //     "2bbf781c5410d3f22a7a3a56ffefb2238af8627363bd" +
  //     "f2ed97c1f89784a1aecdb43384f11d2acc64443c7fc2" +
  //     "99cef0400421a53ae"),
  //   expected: [
  //     "DkRLqZ8qrKjBotEES7Bji2CNGu77BiamaA2gGPdEcWEbh1ZKtEvAV",
  //     "DkM42nDh87gEz2cz9yg1ctJEPjXGTj24dVovAQrendnxj1DEHPtG5",
  //     "DkM3n2immWmrTaQnjA2FMn4NDZBiz9YD6yHsR6ZYymD2sR59p7vUx"
  //   ],
  //   reqSigs: 2,
  //   // class: MultiSigTy,
  // },

  // // The below are nonstandard script due to things such as
  // // invalid pubkeys, failure to parse, and not being of a
  // // standard form.

  // {
  //   name: "p2pk with uncompressed pk missing OP_CHECKSIG",
  //   script: hexToBytes("410411db93e1dcdb8a016b49840f8c53b" +
  //     "c1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddf" +
  //     "b84ccf9744464f82e160bfa9b8b64f9d4c03f999b864" +
  //     "3f656b412a3"),
  //   expected: [],
  //   reqSigs: 0,
  //   // class: NonStandardTy,
  // },
  // {
  //   name: "valid signature from a sigscript - no addresses",
  //   script: hexToBytes("47304402204e45e16932b8af514961a1d" +
  //     "3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd41022" +
  //     "0181522ec8eca07de4860a4acdd12909d831cc56cbba" +
  //     "c4622082221a8768d1d0901"),
  //   expected: [],
  //   reqSigs: 0,
  //   // class: NonStandardTy,
  // },
  // // Note the technically the pubkey is the second item on the
  // // stack, but since the address extraction intentionally only
  // // works with standard PkScripts, this should not return any
  // // addresses.
  // {
  //   name: "valid sigscript to redeem p2pk - no addresses",
  //   script: hexToBytes("493046022100ddc69738bf2336318e4e0" +
  //     "41a5a77f305da87428ab1606f023260017854350ddc0" +
  //     "22100817af09d2eec36862d16009852b7e3a0f6dd765" +
  //     "98290b7834e1453660367e07a014104cd4240c198e12" +
  //     "523b6f9cb9f5bed06de1ba37e96a1bbd13745fcf9d11" +
  //     "c25b1dff9a519675d198804ba9962d3eca2d5937d58e" +
  //     "5a75a71042d40388a4d307f887d"),
  //   expected: [],
  //   reqSigs: 0,
  //   // class: NonStandardTy,
  // },
  // // adapted from btc:
  // // tx 691dd277dc0e90a462a3d652a1171686de49cf19067cd33c7df0392833fb986a, vout 0
  // // invalid public keys
  // {
  //   name: "1 of 3 multisig with invalid pubkeys",
  //   script: hexToBytes("5141042200007353455857696b696c656" +
  //     "16b73204361626c6567617465204261636b75700a0a6" +
  //     "361626c65676174652d3230313031323034313831312" +
  //     "e377a0a0a446f41046e6c6f61642074686520666f6c6" +
  //     "c6f77696e67207472616e73616374696f6e732077697" +
  //     "468205361746f736869204e616b616d6f746f2773206" +
  //     "46f776e6c6f61410420746f6f6c2077686963680a636" +
  //     "16e20626520666f756e6420696e207472616e7361637" +
  //     "4696f6e2036633533636439383731313965663739376" +
  //     "435616463636453ae"),
  //   expected: [],
  //   reqSigs: 1,
  //   // class: MultiSigTy,
  // },
  // adapted from btc:
  // tx 691dd277dc0e90a462a3d652a1171686de49cf19067cd33c7df0392833fb986a, vout 44
  // invalid public keys
  // {
  //   name: "1 of 3 multisig with invalid pubkeys 2",
  //   script: hexToBytes("514104633365633235396337346461636" +
  //     "536666430383862343463656638630a6336366263313" +
  //     "93936633862393461333831316233363536313866653" +
  //     "16539623162354104636163636539393361333938386" +
  //     "134363966636336643664616266640a3236363363666" +
  //     "13963663463303363363039633539336333653931666" +
  //     "56465373032392102323364643432643235363339643" +
  //     "338613663663530616234636434340a00000053ae"),
  //   expected: {"address": [], "requiredSig": 1, "scriptClass": 0},
  //   reqSigs: 1,
  //   // class: MultiSigTy,
  // },
  {
    name: "empty script",
    script: [],
    expected: { "address": [], "requiredSig": 0, "scriptClass": 0, "asm": "" },
    // reqSigs: 0,
    // class: NonStandardTy,
  },
  {
    name: "script that does not parse",
    script: [OP_DATA_45],
    expected: {"error": "opcode OP_DATA_45 requires 46 bytes, but script only has 1 remaining."},
    // reqSigs: 0,
    //   class: NonStandardTy,
    //     noparse: true,
    // },
  }
];

export const TESTNET_scriptDataTest = [
  {
    name: "sstxcommitment tx",
    script: [106,30,38,123,31,26,0,92,236,51,208,51,56,230,32,14,198,230,22,237,157,136,175,143,141,66,1,0,0,0,0,88],
    expected: {
      "address": [],
      "requiredSig": 0,
      "scriptClass": 0,
      "asm": "OP_RETURN OP_DATA_30 267b1f1a005cec33d03338e6200ec6e616ed9d88af8f8d42010000000058"
    },
  }
]
