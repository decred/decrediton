import { toByteArray } from "./mocks.js";

export const mockStakeTransactionList = [
  // vote tx
  {
    timestamp: 1654485406,
    height: 932737,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash:
      "1472512351262304275125239808423343934577220111166192222712233111195632030000",
    txHash: "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
    txType: "vote",
    debitsAmount: 6785796485,
    creditsAmount: 6790119971,
    type: 2,
    amount: 4323486,
    fee: 0,
    debitAccounts: [0],
    creditAddresses: ["Tsf35F2zDqv9EmDC1pTqixwNe5ytxyseRGr"],
    isStake: true,
    credits: [
      {
        index: 2,
        account: 15,
        internal: true,
        amount: 6790119971,
        address: "Tsf35F2zDqv9EmDC1pTqixwNe5ytxyseRGr",
        outputScript: "u3apFJm/el6ZyMAOCezvNx6r14Zbz14RiKw="
      }
    ],
    debits: [
      {
        index: 1,
        previousAccount: 0,
        previousAmount: 6785796485
      }
    ],
    rawTx:
      "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff60ed215decf9ec50b50ff4477db42b1603178dab67e35d59f22b0de16cf4c1650000000001ffffffff0300000000000000000000266a24e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e0000000000000000000000086a0601000a0000002302b9940100000000001abb76a91499bf7a5e99c8c00e09ecef371eabd7865bcf5e1188ac0000000000000000029ef841000000000000000000ffffffff02000085097794010000007d330e00060000006a473044022038c9d8cafe8d98a904c72760e29a7f1e3942c9ef398a7384ca7b946517a3f598022016768855eae1edb7297ee52717bb4c1a247e836fce316a1d681026f4bcf9e5240121027bf4538b926d5668452965c44dbf8724b571ee6b3bae2eab59fd6969e6e87f13",
    isMix: false
  },
  // voted ticket
  {
    timestamp: 1652858637,
    height: 919842,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash: "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
    txHash: "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
    txType: "ticket",
    debitsAmount: 12271681343,
    creditsAmount: 12271678363,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [15],
    creditAddresses: ["TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 12271678363,
        address: "TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU",
        outputScript: "unapFFyo29n4+AuvdgX88JdEQQCZoS+biKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 15,
        previousAmount: 12271681343
      }
    ],
    rawTx:
      "0100000001b50f2e03314661b566e3f0f246623c4419d8ec605da401f407a5f67cf148ce920000000000ffffffff039bf372db0200000000001aba76a9145ca8dbd9f8f80baf7605fcf09744410099a12f9b88ac00000000000000000000206a1e53b208495f9fabdfa80b4be10c4d0e488b33f2993fff72db02000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac0000000000000000013fff72db0200000000000000ffffffff6b483045022100d8f4e49c56f3249947a759d7ba766b671579399e758feaa12bc525c822c020f602200266d21d887165183479cf3d06a01470ceadc53b73527f6863ae76bf22a11ea001210355d8fdf5cdec7a8848e6d653d6c379908c256d4b54b7be637ab5018d56d19149",
    isMix: false,
    vspHost: "mockVspHost-votedticket",
    feeStatus: 1
  },
  // missed
  {
    timestamp: 1605621435,
    height: 558424,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash: "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
    txHash: "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
    txType: "ticket",
    debitsAmount: 9525592746,
    creditsAmount: 9525589786,
    type: 1,
    amount: -2960,
    fee: 2960,
    debitAccounts: [6],
    creditAddresses: ["TccM3W31vkNXUCosK4Y5vYrmtiWWjuecHFs"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 2147483647,
        internal: false,
        amount: 9525589786,
        address: "TccM3W31vkNXUCosK4Y5vYrmtiWWjuecHFs",
        outputScript: "uqkUNP+z1D9bQODb6UJuU4ZfydVT0QOH"
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 6,
        previousAmount: 9525592746
      }
    ],
    rawTx:
      "0100000001781d53a4f25c754340cf9250f98039c1db2c92bcd58b1e4637c9ca534d9053c00100000000ffffffff031af7c43702000000000018baa91434ffb3d43f5b40e0dbe9426e53865fc9d553d1038700000000000000000000206a1e5c1c4094ac61fc8762be68d7b15cdb4806611cf7aa02c537020000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000006085080001aa02c5370200000057850800010000006a473044022053cad54d349690d3c22b346134ff71da1b527695c6ec1252f11c1e7c5d9da9280220606a81e7d4ea63b448945cfbf1385b85642e0221cf49ca0824e5ec8ff62a61c30121032071d0e49038bcdeee3461296d2c50950b62f08e35caafbd4f2b0d025d1a47e1",
    isMix: false,
    vspHost: "mockVspHost-missed",
    txUrl:
      "https://testnet.decred.org/tx/30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774"
  },
  // revoked ticket
  {
    timestamp: 1637487987,
    height: 815405,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash: "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
    txHash: "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
    txType: "ticket",
    debitsAmount: 8600221089,
    creditsAmount: 8600218109,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TsnHm1YjaLMmnFsyGwt54D4P53aFaNqeESJ"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 8600218109,
        address: "TsnHm1YjaLMmnFsyGwt54D4P53aFaNqeESJ",
        outputScript: "unapFOlPYM9gpJSRDMD+KPZi22h5RnROiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 8600221089
      }
    ],
    rawTx:
      "010000000145dff3de5ec042630f66a9ba4ea2ed6d70f3fa306af01858a83efa676d3779000000000000ffffffff03fde99c000200000000001aba76a914e94f60cf60a494910cc0fe28f662db687946744e88ac00000000000000000000206a1e8ef37a84dc2bc7c924877e1ab3026b3b5a102e5fa1f59c0002000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001a1f59c00020000002c710c00030000006a47304402206888557060684807b6e78f47ea8c186debe45f2316a584abe60c5495f36f77f80220249421832ab9ea9e6bbb70d50376e7f48258b3108a345dc299d1de8186e046060121036343175c705537c636732c42fa699ba96f6296bc66b915216cbc833d00e18e10",
    isMix: false
  },
  // revocation
  {
    timestamp: 1622730448,
    height: 697812,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash: "8c6e88a38ceac7e52ef3c9f4d936d0cf16fcc0a510955cab255f3a23ce2e09c1",
    txHash: "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
    txType: "revocation",
    debitsAmount: 6475415536,
    creditsAmount: 6475413336,
    type: 3,
    amount: -2200,
    fee: 2200,
    debitAccounts: [0],
    creditAddresses: ["Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 6475413336,
        address: "Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU",
        outputScript: "vHapFMDks6W1pFTjiMaGSuUSBSI6EtzkiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6475415536
      }
    ],
    rawTx:
      "010000000147ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a0000000001ffffffff0158f7f6810100000000001abc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac000000000000000001f0fff6810100000045180a00060000006b483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052",
    isMix: false
  },
  // unmined
  {
    timestamp: 1658937788,
    height: -1,
    blockHash: null,
    index: 1,
    hash: "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
    txHash: "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
    txType: "ticket",
    debitsAmount: 20002980,
    creditsAmount: 20000000,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TsRWjysgoNXTS7JAQXfsaAzts8UM3Dq3WUg"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 20000000,
        address: "TsRWjysgoNXTS7JAQXfsaAzts8UM3Dq3WUg",
        outputScript: "unapFAVpSQ3nfoA2C1xW+RhdcLMvdGCoiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 20002980
      }
    ],
    rawTx:
      "01000000011babed986d25d5c3c27a1626e6caa344899949974a83bf63a49c2b1fa5f0514a0000000000ffffffff03002d31010000000000001aba76a9140569490de77e80360b5c56f9185d70b32f7460a888ac00000000000000000000206a1e9154057f4df98e818b05779aea2a20f6b624012ea438310100000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001a43831010000000000000000ffffffff6a4730440220290c05e17b48e8c6ed6ee42326565a91416835b75c5f481b10a16e5b0dfa9f67022001d99b93ae971419db6e411dab042828e34ed2b0c7fcd30bd50ccae3d333a393012102af8273525052a10d5c8906ea288968d6f8c7e68caeaab58554b429e8f535e269",
    isMix: false,
    vspHost: "mockVspHost-unmined",
    txUrl:
      "https://testnet.decred.org/tx/d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f"
  },
  // immature
  {
    timestamp: 1654203366,
    height: 930690,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash: "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
    txHash: "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
    txType: "ticket",
    debitsAmount: 6785799465,
    creditsAmount: 6785796485,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TsSSWJRNEor8X6R33GSoo68p3yq3zFuGoVK"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 6785796485,
        address: "TsSSWJRNEor8X6R33GSoo68p3yq3zFuGoVK",
        outputScript: "unapFA+UU96/HfOSYqbq+B/LmP95fIlciKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6785799465
      }
    ],
    rawTx:
      "01000000011a1b3fc2661245ba6b8cab9e315cf76b16c565f1c1277512608d51906f1636c10000000000ffffffff03850977940100000000001aba76a9140f9453debf1df39262a6eaf81fcb98ff797c895c88ac00000000000000000000206a1e19e5ba2f1f3b99efe1090707638af39998a1b7582915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6b483045022100a510695025634a249cda2c85fe63a43312cb0ee5c02db2f1256fe4f835702f8002202b0f4c7e093500b75626a4829c9705a370cb2f2f834702abe8b9ac268d5ac57b012102dfa5deeeee8b65f2738483d412f2bb5627fa7f761b132f3b4eef2e154151902c",
    isMix: false
  },
  // live
  {
    timestamp: 1654204193,
    height: 930696,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    hash: "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
    txHash: "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
    txType: "ticket",
    debitsAmount: 6785799465,
    creditsAmount: 6785796485,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TscyVUMxevtGhTuTvM6LkLnvQGU97kEyUg4"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 6785796485,
        address: "TscyVUMxevtGhTuTvM6LkLnvQGU97kEyUg4",
        outputScript: "unapFIMhyeEfBENiiiK/SodiN02IfAYyiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6785799465
      }
    ],
    rawTx:
      "010000000164f0acf752429210f469c6536c857d092aac8bc84fa661f013b535aa6394c4710000000000ffffffff03850977940100000000001aba76a9148321c9e11f0443628a22bf4a8762374d887c063288ac00000000000000000000206a1e01ca6bb0120ca64e750a9cbaa66597f010c1c03d2915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6b483045022100a58c8e7b6f33b3c3fdc43dfa7472d19e39cc8c22c5990f94ca45a9458c860bfe02202227864c234f9a2c328418cabf6a5934e99d16806a8492805ad4243155d77e63012102029965f740c2b87c21dca96fb4195f71dae34b779ef4daed5902f98a0c09a437",
    isMix: false
  }
];

export const mockStakeTransactions = {};
mockStakeTransactionList.forEach((tx) => {
  tx.blockHash = toByteArray(tx.blockHash);
  if (tx.ticket) {
    tx.ticket.blockHash = toByteArray(tx.ticket.blockHash);
  }
  if (tx.spender) {
    tx.spender.blockHash = toByteArray(tx.spender.blockHash);
  }
  mockStakeTransactions[tx.txHash] = tx;
});
