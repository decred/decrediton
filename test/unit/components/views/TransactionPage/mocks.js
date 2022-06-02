const toByteArray = (hex) => {
  if (!hex || !hex.length) {
    return hex;
  }
  const res = [];
  for (let i = 0; i < hex.length; i += 2) {
    res.push(parseInt(hex.substr(i, 2), 16));
  }
  return res;
};

const mockNormalizedRegularTransactionList = [
  // regular pending transaction
  {
    txUrl:
      "https://testnet.decred.org/tx/263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d",
    txBlockUrl: "",
    txHash: "263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d",
    txHeight: -1,
    txType: "regular",
    timestamp: 1624527932,
    isPending: true,
    txFee: 2530,
    txInputs: [
      {
        accountName: "default",
        amount: 1793854340,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "default",
        amount: 993851810,
        address: "TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY",
        index: 0
      }
    ],
    txBlockHash: null,
    txNumericType: 0,
    rawTx:
      "010000000137bdd42d19c66cb0ee0da40f5419b284bcd16af1d3836f313fad124b5e5a4fe80000000000ffffffff02a2f93c3b0000000000001976a914694d918352de4cfe4bee6776a3f2502a7fcdc2f888ac0008af2f0000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac000000000000000001840bec6a0000000091d80a000b0000006b4830450221009ce94aac7683dfbac6e23716af87b7529b3cf53d69d1bae7772a9e1baccc873902204e0312be8be7a518723c0c7d9e1f40abe67c681e9aabf78deb21d964c31872c201210314012e939d6ab30c7dacb4258654b0996ce89f7e47faa57bbbf65c44dffd668f",
    outputs: [
      {
        address: "TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY",
        value: 993851810,
        isChange: true
      },
      {
        address: "TsZJt5A55AcCMp8iBu1rkNCxqJ3Bf1MC8Zk",
        value: 800000000,
        isChange: false
      }
    ],
    creditAddresses: ["TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY"],
    mixedTx: false,
    selfTx: false,
    txAmount: 800000000,
    txDirection: "sent",
    txAccountName: "default"
  },
  // regular received mined regular transaction
  {
    txUrl:
      "https://testnet.decred.org/tx/642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    txHash: "642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e",
    txHeight: 706945,
    txType: "regular",
    timestamp: 1623923254,
    isPending: false,
    txFee: 0,
    txInputs: [],
    txOutputs: [
      {
        accountName: "default",
        amount: 10000000000,
        address: "TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV",
        index: 0
      }
    ],
    txBlockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    txNumericType: 0,
    rawTx:
      "0100000004bf28aa8fb5d6dac3178e9332a702d8e8356873ca8fe6d33dccbd2d9c5fd7683e0100000000ffffffffdb19f3f77aeeb622700d23fe355b63fe8fd76b8b7632b0589d84b9c38e05d4ae0000000000ffffffff6bf93964a8376db78e1e1ff4afb9f1b798d7bec728e012311fed0e31a8afd0190100000000ffffffff782715c018478b5632ef57c589e3411bb192d3b5ee456a0b116108c15ec1b5140000000000ffffffff0200e40b540200000000001976a9143686c91e4d6e3993d2a868c9d6989d26bf0932b888acfc0fb0d60600000000001976a914778e4e20f5a4979265fb74af268034d7f90e805f88ac00000000000000000400a3e1110000000004c40a00010000006a473044022043d419c5d52dc0d24b49e3967770c4ca652363aa2daeb17a72535ef6a3d0cbca022039f51a398ee97134b33d19261f5aadeb6fffb65df16b509e5477682d5a70b3170121023679ebfc751737b730d41e5cb3b7552ae5b5781d9871094c518bac333ac544e7000e270700000000c6c30a00010000006b4830450221008cc6a8b5e8b24db0d91548ffc613e82f9a8451a40a80fb1e84802e0f964e1fd5022074c95643de7f719a771cb6d2adadd7a412ed9b8ad5d65d30b33ca18788266e570121023679ebfc751737b730d41e5cb3b7552ae5b5781d9871094c518bac333ac544e700e1f505000000000dc40a00090000006a47304402203312f602dc56e581d138fe39d5024cf41efd2fec0e186526af3c9558d620507602206eb04e0f14315d561529ae280efef4982e086d51499dd70a61c8f34f32fe13500121023679ebfc751737b730d41e5cb3b7552ae5b5781d9871094c518bac333ac544e7527fbd0b0900000071180a00040000006a47304402202dd4f98539723adccf4ec139676d8589fc596575584b39baf2bb28e53f9e6aca0220575014c485b5ce5814f84889eda85a981be339bc713588f3d9fabcccce1cecbe01210396f97ab7cf4fb3bf9c8198d2c19c709a623103fe2c6316a7a6751484537a6820",
    outputs: [
      {
        address: "TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV",
        value: 10000000000,
        isChange: true
      },
      {
        address: "TsbvHMveM1bTK35aP5Dd2tmFppipvw2faWA",
        value: 29371666428,
        isChange: false
      }
    ],
    creditAddresses: ["TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV"],
    mixedTx: false,
    selfTx: false,
    txAmount: 10000000000,
    txDirection: "received",
    txAccountName: "default"
  },

  // regular self transfer transactio
  {
    txUrl:
      "https://testnet.decred.org/tx/9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304",
    txBlockUrl:
      "https://testnet.decred.org/block/00000000cf7eee715245616121f06e62fb3ac39c5cc296076395b80e21b5de62",
    txHash: "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304",
    txHeight: 712832,
    txType: "regular",
    timestamp: 1624605208,
    isPending: false,
    txFee: 2530,
    txInputs: [
      {
        accountName: "default",
        amount: 6362443956,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "account-4",
        amount: 5000000000,
        address: "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
        index: 0
      },
      {
        accountName: "default",
        amount: 1362441426,
        address: "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8",
        index: 1
      }
    ],
    txBlockHash:
      "00000000cf7eee715245616121f06e62fb3ac39c5cc296076395b80e21b5de62",
    txNumericType: 0,
    rawTx:
      "010000000105b2574bf056ac5bc8b1da11e13277dc7f9a4fcf1fcb46c8d7004d1b952e354c0100000000ffffffff0200f2052a0100000000001976a9140cbd0ed5738aee2c8b507c7234e140bdf5d2120e88acd23435510000000000001976a914ab2e3b83e5e37b902197b85599be1826373d082288ac000000000000000001b4303b7b0100000072de0a00050000006a47304402203c4e1289c57e46903e3b4444f9a6a4beab805b0a13b7551f63d35ba8eb8f3d0a02203ba8b75862288de7d71be0610f49ac0e880721ce3a6500b1ca75dbed687a682d0121032dcb435ca06b6c25401bfb7a4c6411ea79327e29e7f929571405f21db2f0cd20",
    outputs: [
      {
        address: "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
        value: 5000000000,
        isChange: true
      },
      {
        address: "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8",
        value: 1362441426,
        isChange: true
      }
    ],
    creditAddresses: [
      "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
      "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8"
    ],
    mixedTx: false,
    selfTx: true,
    txAmount: 2530,
    txDirection: "ticketfee",
    txAccountNameCredited: "account-4",
    txAccountNameDebited: "default"
  },
  // regular mixed transaction (from unmixed to mixed)
  {
    txUrl:
      "https://testnet.decred.org/tx/ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c",
    txBlockUrl:
      "https://testnet.decred.org/block/00000000f6281f84cd50fbf1dc0d13f39b843aa04fc1894d92db193534ff41d3",
    txHash: "ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c",
    txHeight: 712872,
    txType: "regular",
    timestamp: 1624609448,
    isPending: false,
    txFee: 0,
    txInputs: [
      {
        accountName: "account-4",
        amount: 5000000000,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "account-4",
        amount: 705029094,
        address: "TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR",
        index: 2
      },
      {
        accountName: "account-3",
        amount: 1073741824,
        address: "TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY",
        index: 4
      },
      {
        accountName: "account-3",
        amount: 1073741824,
        address: "TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC",
        index: 5
      },
      {
        accountName: "account-3",
        amount: 1073741824,
        address: "TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5",
        index: 6
      },
      {
        accountName: "account-3",
        amount: 1073741824,
        address: "TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs",
        index: 7
      }
    ],
    txBlockHash:
      "00000000f6281f84cd50fbf1dc0d13f39b843aa04fc1894d92db193534ff41d3",
    txNumericType: 0,
    rawTx:
      "010000000304a30f2f7a92cd0dc3ccc73b462f3988e851adc27b62897300a918c498b910910000000000000000007773ac3c5b1d902ee228b594c6648caa0519302dd5a09eb56861832318d3b01f0600000000000000007773ac3c5b1d902ee228b594c6648caa0519302dd5a09eb56861832318d3b01f0d00000000000000000915075c220000000000001976a914cf7ab856a54d039fb39c0437abecbb0a9cd22d4d88ac000000400000000000001976a914f5516162c4bb1ead78ed98758c744a9ede0642de88ace6e3052a0000000000001976a914b460a98fa91d688b9e7fb4533fde58c7b88617e288ac32e7b9130000000000001976a91430faefe4d83fa63c8d05a3b6a2240f9ba15b38bf88ac000000400000000000001976a91424c2aaaaba269fe4801322cca894dc53202b6cd588ac000000400000000000001976a914a1066198f4f2738684af9c0dabf2e0acb5368c1388ac000000400000000000001976a91445e8178ec05a05068af93bdd580667b0ecf50af788ac000000400000000000001976a914c73bdb952eac21dac545a074812f981b7398fce188ac000000400000000000001976a914f57e187ad1dfce7cc591cb85411c65d17fd8224e88ac00000000000000000300f2052a0100000080e00a00080000006b483045022100e533cbb88e3f11d9650262cd51e245dfe4d0659baa34df17e7eaaf3421c94bb102201144f1e482867e5984e9d0cf75a7cc7ae208786e7630be8d750fa24a8422f81001210393e85132b9aed5d69f7b0e8bfb48b2300fecc7710e7ba30c65ec2412d3d685ed14f1b95300000000a3e00a00070000006b4830450221009f9feb22dd01bbc16c97d889bca3e2200ed254f6a8e3ef421b1e4d25eab5c3ae02201b6c4e794a9a5ae211221f8bf569512d7a9489a164dc5a189f52ca2fccbf7b0d0121032aec130af5e726017c039cb471331bc95314f3b65d6e289a15af3310e5ce3c40f7105c6200000000a3e00a00070000006a47304402204b2d81fe96320768d0f547ceb836a656c6ff1c5d4bd81b626d053d77a0de3e96022042111c6311774c32d2d75f7c6e92904b40ef974ca995a81c8fa5a3fd9f3b137a012103b1ea67a2e2bcd020b470fbbdb14687d1034bce11eee0665db2e53f5467d1af3e",
    outputs: [
      {
        address: "TsjwBN1UELsLfV6BZynGfH21qhyBb5PtFaw",
        value: 576456469,
        isChange: false
      },
      {
        address: "TsoPFWy8h8DFKiXXqYxWUaS9uguazs1bzva",
        value: 1073741824,
        isChange: false
      },
      {
        address: "TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR",
        value: 705029094,
        isChange: true
      },
      {
        address: "TsVV7XBX2B8hj8c76FzWByoZ622DTiQxXUm",
        value: 330950450,
        isChange: false
      },
      {
        address: "TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsoQB5qSKdNXJEwr2X5YbUJnBhHaPYv2pA3",
        value: 1073741824,
        isChange: false
      }
    ],
    creditAddresses: [
      "TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR",
      "TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY",
      "TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC",
      "TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5",
      "TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs"
    ],
    mixedTx: true,
    selfTx: false,
    txAmount: 3610,
    txDirection: "sent",
    txAccountName: "account-4"
  }
];
const mockRegularTransactionList = [
  // regular pending transaction
  {
    timestamp: 1624527872,
    height: -1,
    blockHash: null,
    index: 0,
    txHash: "263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d",
    txType: "regular",
    debitsAmount: 1793854340,
    creditsAmount: 993851810,
    type: 0,
    amount: -800002530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: ["TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY"],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 993851810,
        address: "TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY",
        outputScript: "dqkUaU2Rg1LeTP5L7md2o/JQKn/NwviIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 1793854340
      }
    ],
    rawTx:
      "010000000137bdd42d19c66cb0ee0da40f5419b284bcd16af1d3836f313fad124b5e5a4fe80000000000ffffffff02a2f93c3b0000000000001976a914694d918352de4cfe4bee6776a3f2502a7fcdc2f888ac0008af2f0000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac000000000000000001840bec6a0000000000000000ffffffff6b4830450221009ce94aac7683dfbac6e23716af87b7529b3cf53d69d1bae7772a9e1baccc873902204e0312be8be7a518723c0c7d9e1f40abe67c681e9aabf78deb21d964c31872c201210314012e939d6ab30c7dacb4258654b0996ce89f7e47faa57bbbf65c44dffd668f",
    direction: "sent",
    outputs: [
      {
        address: "TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY",
        value: 993851810,
        isChange: true
      },
      {
        address: "TsZJt5A55AcCMp8iBu1rkNCxqJ3Bf1MC8Zk",
        value: 800000000,
        isChange: false
      }
    ]
  },
  // regular received mined regular transaction
  {
    timestamp: 1623923254,
    height: 706945,
    blockHash:
      "21eb3e22e887ba5c674399bff8e05bcb3bd8917ec283436d75357dc10b000000",
    index: 0,
    txHash: "642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e",
    txType: "regular",
    debitsAmount: 0,
    creditsAmount: 10000000000,
    type: 0,
    amount: 10000000000,
    fee: 0,
    debitAccounts: [],
    creditAddresses: ["TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV"],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: false,
        amount: 10000000000,
        address: "TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV",
        outputScript: "dqkUNobJHk1uOZPSqGjJ1pidJr8JMriIrA=="
      }
    ],
    debits: [],
    rawTx:
      "0100000004bf28aa8fb5d6dac3178e9332a702d8e8356873ca8fe6d33dccbd2d9c5fd7683e0100000000ffffffffdb19f3f77aeeb622700d23fe355b63fe8fd76b8b7632b0589d84b9c38e05d4ae0000000000ffffffff6bf93964a8376db78e1e1ff4afb9f1b798d7bec728e012311fed0e31a8afd0190100000000ffffffff782715c018478b5632ef57c589e3411bb192d3b5ee456a0b116108c15ec1b5140000000000ffffffff0200e40b540200000000001976a9143686c91e4d6e3993d2a868c9d6989d26bf0932b888acfc0fb0d60600000000001976a914778e4e20f5a4979265fb74af268034d7f90e805f88ac00000000000000000400a3e1110000000004c40a00010000006a473044022043d419c5d52dc0d24b49e3967770c4ca652363aa2daeb17a72535ef6a3d0cbca022039f51a398ee97134b33d19261f5aadeb6fffb65df16b509e5477682d5a70b3170121023679ebfc751737b730d41e5cb3b7552ae5b5781d9871094c518bac333ac544e7000e270700000000c6c30a00010000006b4830450221008cc6a8b5e8b24db0d91548ffc613e82f9a8451a40a80fb1e84802e0f964e1fd5022074c95643de7f719a771cb6d2adadd7a412ed9b8ad5d65d30b33ca18788266e570121023679ebfc751737b730d41e5cb3b7552ae5b5781d9871094c518bac333ac544e700e1f505000000000dc40a00090000006a47304402203312f602dc56e581d138fe39d5024cf41efd2fec0e186526af3c9558d620507602206eb04e0f14315d561529ae280efef4982e086d51499dd70a61c8f34f32fe13500121023679ebfc751737b730d41e5cb3b7552ae5b5781d9871094c518bac333ac544e7527fbd0b0900000071180a00040000006a47304402202dd4f98539723adccf4ec139676d8589fc596575584b39baf2bb28e53f9e6aca0220575014c485b5ce5814f84889eda85a981be339bc713588f3d9fabcccce1cecbe01210396f97ab7cf4fb3bf9c8198d2c19c709a623103fe2c6316a7a6751484537a6820",
    direction: "received",
    outputs: [
      {
        address: "TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV",
        value: 10000000000,
        isChange: true
      },
      {
        address: "TsbvHMveM1bTK35aP5Dd2tmFppipvw2faWA",
        value: 29371666428,
        isChange: false
      }
    ]
  },
  // regular self transfer transactio
  {
    timestamp: 1624605208,
    height: 712832,
    blockHash:
      "62deb5210eb895630796c25c9cc33afb626ef0216161455271ee7ecf00000000",
    index: 0,
    txHash: "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304",
    txType: "regular",
    debitsAmount: 6362443956,
    creditsAmount: 6362441426,
    type: 0,
    amount: -2530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: [
      "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
      "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8"
    ],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 4,
        internal: false,
        amount: 5000000000,
        address: "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
        outputScript: "dqkUDL0O1XOK7iyLUHxyNOFAvfXSEg6IrA=="
      },
      {
        index: 1,
        account: 0,
        internal: true,
        amount: 1362441426,
        address: "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8",
        outputScript: "dqkUqy47g+Xje5Ahl7hVmb4YJjc9CCKIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6362443956
      }
    ],
    rawTx:
      "010000000105b2574bf056ac5bc8b1da11e13277dc7f9a4fcf1fcb46c8d7004d1b952e354c0100000000ffffffff0200f2052a0100000000001976a9140cbd0ed5738aee2c8b507c7234e140bdf5d2120e88acd23435510000000000001976a914ab2e3b83e5e37b902197b85599be1826373d082288ac000000000000000001b4303b7b0100000000000000ffffffff6a47304402203c4e1289c57e46903e3b4444f9a6a4beab805b0a13b7551f63d35ba8eb8f3d0a02203ba8b75862288de7d71be0610f49ac0e880721ce3a6500b1ca75dbed687a682d0121032dcb435ca06b6c25401bfb7a4c6411ea79327e29e7f929571405f21db2f0cd20",
    direction: "ticketfee",
    outputs: [
      {
        address: "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
        value: 5000000000,
        isChange: true
      },
      {
        address: "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8",
        value: 1362441426,
        isChange: true
      }
    ]
  },
  // regular mixed transaction (from unmixed to mixed)
  {
    timestamp: 1624609448,
    height: 712872,
    blockHash:
      "d341ff343519db924d89c14fa03a849bf3130ddcf1fb50cd841f28f600000000",
    index: 0,
    txHash: "ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c",
    txType: "regular",
    debitsAmount: 5000000000,
    creditsAmount: 4999996390,
    type: 0,
    amount: -3610,
    fee: 0,
    isMix: true,
    debitAccounts: [4],
    creditAddresses: [
      "TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR",
      "TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY",
      "TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC",
      "TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5",
      "TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs"
    ],
    isStake: false,
    credits: [
      {
        index: 2,
        account: 4,
        internal: true,
        amount: 705029094,
        address: "TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR",
        outputScript: "dqkUtGCpj6kdaIuef7RTP95Yx7iGF+KIrA=="
      },
      {
        index: 4,
        account: 3,
        internal: false,
        amount: 1073741824,
        address: "TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY",
        outputScript: "dqkUJMKqqromn+SAEyLMqJTcUyArbNWIrA=="
      },
      {
        index: 5,
        account: 3,
        internal: false,
        amount: 1073741824,
        address: "TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC",
        outputScript: "dqkUoQZhmPTyc4aEr5wNq/LgrLU2jBOIrA=="
      },
      {
        index: 6,
        account: 3,
        internal: false,
        amount: 1073741824,
        address: "TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5",
        outputScript: "dqkURegXjsBaBQaK+TvdWAZnsOz1CveIrA=="
      },
      {
        index: 7,
        account: 3,
        internal: false,
        amount: 1073741824,
        address: "TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs",
        outputScript: "dqkUxzvblS6sIdrFRaB0gS+YG3OY/OGIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 4,
        previousAmount: 5000000000
      }
    ],
    rawTx:
      "010000000304a30f2f7a92cd0dc3ccc73b462f3988e851adc27b62897300a918c498b910910000000000000000007773ac3c5b1d902ee228b594c6648caa0519302dd5a09eb56861832318d3b01f0600000000000000007773ac3c5b1d902ee228b594c6648caa0519302dd5a09eb56861832318d3b01f0d00000000000000000915075c220000000000001976a914cf7ab856a54d039fb39c0437abecbb0a9cd22d4d88ac000000400000000000001976a914f5516162c4bb1ead78ed98758c744a9ede0642de88ace6e3052a0000000000001976a914b460a98fa91d688b9e7fb4533fde58c7b88617e288ac32e7b9130000000000001976a91430faefe4d83fa63c8d05a3b6a2240f9ba15b38bf88ac000000400000000000001976a91424c2aaaaba269fe4801322cca894dc53202b6cd588ac000000400000000000001976a914a1066198f4f2738684af9c0dabf2e0acb5368c1388ac000000400000000000001976a91445e8178ec05a05068af93bdd580667b0ecf50af788ac000000400000000000001976a914c73bdb952eac21dac545a074812f981b7398fce188ac000000400000000000001976a914f57e187ad1dfce7cc591cb85411c65d17fd8224e88ac00000000000000000300f2052a0100000000000000000000006b483045022100e533cbb88e3f11d9650262cd51e245dfe4d0659baa34df17e7eaaf3421c94bb102201144f1e482867e5984e9d0cf75a7cc7ae208786e7630be8d750fa24a8422f81001210393e85132b9aed5d69f7b0e8bfb48b2300fecc7710e7ba30c65ec2412d3d685ed14f1b9530000000000000000000000006b4830450221009f9feb22dd01bbc16c97d889bca3e2200ed254f6a8e3ef421b1e4d25eab5c3ae02201b6c4e794a9a5ae211221f8bf569512d7a9489a164dc5a189f52ca2fccbf7b0d0121032aec130af5e726017c039cb471331bc95314f3b65d6e289a15af3310e5ce3c40f7105c620000000000000000000000006a47304402204b2d81fe96320768d0f547ceb836a656c6ff1c5d4bd81b626d053d77a0de3e96022042111c6311774c32d2d75f7c6e92904b40ef974ca995a81c8fa5a3fd9f3b137a012103b1ea67a2e2bcd020b470fbbdb14687d1034bce11eee0665db2e53f5467d1af3e",
    direction: "sent",
    outputs: [
      {
        address: "TsjwBN1UELsLfV6BZynGfH21qhyBb5PtFaw",
        value: 576456469,
        isChange: false
      },
      {
        address: "TsoPFWy8h8DFKiXXqYxWUaS9uguazs1bzva",
        value: 1073741824,
        isChange: false
      },
      {
        address: "TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR",
        value: 705029094,
        isChange: true
      },
      {
        address: "TsVV7XBX2B8hj8c76FzWByoZ622DTiQxXUm",
        value: 330950450,
        isChange: false
      },
      {
        address: "TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs",
        value: 1073741824,
        isChange: true
      },
      {
        address: "TsoQB5qSKdNXJEwr2X5YbUJnBhHaPYv2pA3",
        value: 1073741824,
        isChange: false
      }
    ]
  }
];
export const mockOldTxs = [
  {
    timestamp: 1624605185,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304",
    txType: "regular",
    debitsAmount: 6362443956,
    creditsAmount: 6362441426,
    type: 0,
    amount: -2530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: [
      "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
      "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8"
    ],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 4,
        internal: false,
        amount: 5000000000,
        address: "TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh",
        outputScript: "dqkUDL0O1XOK7iyLUHxyNOFAvfXSEg6IrA=="
      },
      {
        index: 1,
        account: 0,
        internal: true,
        amount: 1362441426,
        address: "TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8",
        outputScript: "dqkUqy47g+Xje5Ahl7hVmb4YJjc9CCKIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6362443956
      }
    ],
    rawTx:
      "010000000105b2574bf056ac5bc8b1da11e13277dc7f9a4fcf1fcb46c8d7004d1b952e354c0100000000ffffffff0200f2052a0100000000001976a9140cbd0ed5738aee2c8b507c7234e140bdf5d2120e88acd23435510000000000001976a914ab2e3b83e5e37b902197b85599be1826373d082288ac000000000000000001b4303b7b0100000000000000ffffffff6a47304402203c4e1289c57e46903e3b4444f9a6a4beab805b0a13b7551f63d35ba8eb8f3d0a02203ba8b75862288de7d71be0610f49ac0e880721ce3a6500b1ca75dbed687a682d0121032dcb435ca06b6c25401bfb7a4c6411ea79327e29e7f929571405f21db2f0cd20",
    direction: "ticketfee"
  },
  {
    timestamp: 1624357057,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "e84f5a5e4b12ad3f316f83d3f16ad1bc84b219540fa40deeb06cc6192dd4bd37",
    txType: "regular",
    debitsAmount: 4793856870,
    creditsAmount: 4793854340,
    type: 0,
    amount: -2530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: [
      "TsVks1cwCPpHfiU9D21WNYDBy9MRKecTthJ",
      "TsnhL1EaeX7kRsqqycftFCDfwtF6vvH2Cjh"
    ],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 1793854340,
        address: "TsVks1cwCPpHfiU9D21WNYDBy9MRKecTthJ",
        outputScript: "dqkUM/V6+2VBmo82Vgx39MVLodF7zqCIrA=="
      },
      {
        index: 1,
        account: 2,
        internal: false,
        amount: 3000000000,
        address: "TsnhL1EaeX7kRsqqycftFCDfwtF6vvH2Cjh",
        outputScript: "dqkU7cR84Ae2AqWTxqeABGcbFsRfWtqIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 4793856870
      }
    ],
    rawTx:
      "01000000015aa710e8907876ab2670c03abcf0307f279e00b353ad68a1c9d684aeba8b26ba0000000000ffffffff02840bec6a0000000000001976a91433f57afb65419a8f36560c77f4c54ba1d17bcea088ac005ed0b20000000000001976a914edc47ce007b602a593c6a78004671b16c45f5ada88ac0000000000000000016673bc1d0100000000000000ffffffff6b483045022100d3c996a7e9566650d43d995c378ba760f8c3c1e4ff4771efe02dbfbdb4f15158022042c3d997eee71234c33c01226530f54e7a9e6e743cf5de9931344b311c27195e012102c197baff25e53a0f11d0d6e6dd5520a89bcbec030f39fae5910acd592dbc410d",
    direction: "ticketfee"
  },
  {
    timestamp: 1623754452,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "19d0afa8310eed1f3112e028c7bed798b7f1b9aff41f1e8eb76d37a86439f96b",
    txType: "regular",
    debitsAmount: 5794230255,
    creditsAmount: 5694227725,
    type: 0,
    amount: -100002530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: ["TsYHhpjiSSqnZbCHLjXMD6jbUezSApiMuDF"],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 5694227725,
        address: "TsYHhpjiSSqnZbCHLjXMD6jbUezSApiMuDF",
        outputScript: "dqkUT7r1E1MdbQQWpYiCdqiFrqBmO+WIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 5794230255
      }
    ],
    rawTx:
      "0100000001bf28aa8fb5d6dac3178e9332a702d8e8356873ca8fe6d33dccbd2d9c5fd7683e0000000000ffffffff020d0567530100000000001976a9144fbaf513531d6d0416a5888276a885aea0663be588ac00e1f5050000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac000000000000000001efef5c590100000004c40a00010000006a47304402206e4bb3082361bf71b4c6662df2c85fafbd3feca02ed5aeb44915b71672fd35ce02204a3873b885e223d8369201328104a8a4a3aaf63b0ca2a108a2cf390e91d461eb0121029ad7fdc90d88a57d3da6afe70ec25ee661a0a4dc88506a2035c691ad72353d08",
    direction: "sent"
  },
  {
    timestamp: 1624538831,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "4c352e951b4d00d7c846cb1fcf4f9a7fdc7732e111dab1c85bac56f04b57b205",
    txType: "regular",
    debitsAmount: 10093564240,
    creditsAmount: 10093561710,
    type: 0,
    amount: -2530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: [
      "TsXSv7pfF2jqLokPnjRbDv6QYTa2Avus9Gc",
      "Tso8RjACBabtGrZQJB1x6TSfXvskMWXEG7H"
    ],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 3731117754,
        address: "TsXSv7pfF2jqLokPnjRbDv6QYTa2Avus9Gc",
        outputScript: "dqkURoDWk7de0Y9UPRvNIkqvT8QNgD2IrA=="
      },
      {
        index: 1,
        account: 0,
        internal: true,
        amount: 6362443956,
        address: "Tso8RjACBabtGrZQJB1x6TSfXvskMWXEG7H",
        outputScript: "dqkU8oOp/SlHw5JBkCSY5UBwxUEw7xWIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 10093564240
      }
    ],
    rawTx:
      "01000000014d9c9f385b2715eacad6eedeab7887a3d716f6409b891cf16b0091a33277bb5b0000000000ffffffff02ba5664de0000000000001976a9144680d693b75ed18f543d1bcd224aaf4fc40d803d88acb4303b7b0100000000001976a914f283a9fd2947c39241902498e54070c54130ef1588ac00000000000000000150919f590200000000000000ffffffff6a47304402204134552053a7654864a842a4f8408f3f9ddaeea83e389c73beb459c49d89a49b02200599cd6dfe93a16752119fd508d55ec4a08a94947ac28fe284b62f6e2dd01d8201210210cb00e094a5198ec593f3f1b9c5a499f1bea944591e2458fc0fa5ba8b0699dc",
    direction: "ticketfee"
  },
  {
    timestamp: 1618326754,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "14b5c15ec10861110b6a45eeb5d392b11b41e389c557ef32568b4718c0152778",
    txType: "regular",
    debitsAmount: 0,
    creditsAmount: 1000000000,
    type: 0,
    amount: 1000000000,
    fee: 0,
    debitAccounts: [],
    creditAddresses: ["TsnfTk3q4HDiTYps5CExQoytTKD8dYExNDH"],
    isStake: false,
    credits: [
      {
        index: 1,
        account: 0,
        internal: false,
        amount: 1000000000,
        address: "TsnfTk3q4HDiTYps5CExQoytTKD8dYExNDH",
        outputScript: "dqkU7WodiYnvUG6xS450sBeAq2RmnlKIrA=="
      }
    ],
    debits: [],
    rawTx:
      "01000000017771bdf38b423ee2d71eec92f196a40feef4549c4aa9c8e75fdc91466aa0b1460100000000ffffffff02527fbd0b0900000000001976a91430393ea0dcc4811c26abd27c70024529b526607d88ac00ca9a3b0000000000001976a914ed6a1d8989ef506eb14b8e74b01780ab64669e5288ac00000000000000000134535847090000006d180a00010000006b483045022100b061d3913f257ed2b5d7a69a0a3a4c659093ddc424700da5a646e509875eca720220660459b52bb4b70534528a1b0195695ef540fb2ad1f1adfaac3bde7475779f69012102c85a74b390d591df54056d9d6016549872e466c9bb9a20cf4a82b091417e3462",
    direction: "received"
  },
  {
    timestamp: 1623754452,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "19d0afa8310eed1f3112e028c7bed798b7f1b9aff41f1e8eb76d37a86439f96b",
    txType: "regular",
    debitsAmount: 5794230255,
    creditsAmount: 5694227725,
    type: 0,
    amount: -100002530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: ["TsYHhpjiSSqnZbCHLjXMD6jbUezSApiMuDF"],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 5694227725,
        address: "TsYHhpjiSSqnZbCHLjXMD6jbUezSApiMuDF",
        outputScript: "dqkUT7r1E1MdbQQWpYiCdqiFrqBmO+WIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 5794230255
      }
    ],
    rawTx:
      "0100000001bf28aa8fb5d6dac3178e9332a702d8e8356873ca8fe6d33dccbd2d9c5fd7683e0000000000ffffffff020d0567530100000000001976a9144fbaf513531d6d0416a5888276a885aea0663be588ac00e1f5050000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac000000000000000001efef5c590100000004c40a00010000006a47304402206e4bb3082361bf71b4c6662df2c85fafbd3feca02ed5aeb44915b71672fd35ce02204a3873b885e223d8369201328104a8a4a3aaf63b0ca2a108a2cf390e91d461eb0121029ad7fdc90d88a57d3da6afe70ec25ee661a0a4dc88506a2035c691ad72353d08",
    direction: "sent"
  },
  {
    timestamp: 1623753072,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "3e68d75f9c2dbdcc3dd3e68fca736835e8d802a732938e17c3dad6b58faa28bf",
    txType: "regular",
    debitsAmount: 6094232785,
    creditsAmount: 5794230255,
    type: 0,
    amount: -300002530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: ["TsTK9zY9vSdRHr6Vwe8REUUyCccTB5ja7mo"],
    isStake: false,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 5794230255,
        address: "TsTK9zY9vSdRHr6Vwe8REUUyCccTB5ja7mo",
        outputScript: "dqkUGSiW0UvanaAxTOG/xaCNEwdfonmIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6094232785
      }
    ],
    rawTx:
      "0100000001fe8890429abb7ea8ea24af351a5a855da54fcb3e2a43207011afe20ca088e0880000000000ffffffff02efef5c590100000000001976a914192896d14bda9da0314ce1bfc5a08d13075fa27988ac00a3e1110000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac000000000000000001d19c3e6b01000000c9c30a00020000006a473044022022187c6c85b8207e2f629df214e8cc4638b76ef93631646102ed5e716634a7b00220233cf6bb30d4e0cac09db7714c68cd17224faf13b796bc4efb0646c1d72eafe6012102d0d8d9d2b30623929c58ebb6cd47fbacf3a9792d5691fc2e2bc5ce9d4927d29d",
    direction: "sent"
  },
  {
    timestamp: 1623745722,
    height: -1,
    blockHash: "",
    index: -1,
    txHash: "aed4058ec3b9849d58b032768b6bd78ffe635b35fe230d7022b6ee7af7f319db",
    txType: "regular",
    debitsAmount: 6375410806,
    creditsAmount: 6255408276,
    type: 0,
    amount: -120002530,
    fee: 2530,
    debitAccounts: [0],
    creditAddresses: ["TsYeBfycNJykGzfASWdNYmuL7UZYifGJULu"],
    isStake: false,
    credits: [
      {
        index: 1,
        account: 0,
        internal: true,
        amount: 6255408276,
        address: "TsYeBfycNJykGzfASWdNYmuL7UZYifGJULu",
        outputScript: "dqkUU5qGEUzTN/4dFoFm9+XDbJrHWGqIrA=="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 6375410806
      }
    ],
    rawTx:
      "01000000019f284b9f7eacc74daed9b7028ba868df8e0c78e2017e1b94b1892f536cfe2de70000000000ffffffff02000e27070000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac94f4d9740100000000001976a914539a86114cd337fe1d168166f7e5c36c9ac7586a88ac000000000000000001760c017c010000004cc20a00010000006b483045022100a643c49cbb32332879b592142515e8e7094788deab0b939666530f17888b953f02200530e3954071accccaa8218a20e74ef10c6377731539936e4ae96f65834256e3012102284bf79b21d41a7c002a25fc98af50b42629792973e495010508df464bcbf37d",
    direction: "sent"
  }
];

const mockStakeTransactionList = [
  // vote tx
  {
    timestamp: 1652874655,
    height: 919977,
    blockHash:
      "000000005af1c046f26b1a4336280e37a84a8d8e20898a1a27af18a4f23c2e56",
    index: 0,
    hash: "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
    txHash: "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
    txType: "vote",
    debitsAmount: 12271678363,
    creditsAmount: 12276267831,
    type: 2,
    amount: 4589468,
    fee: 0,
    debitAccounts: [0],
    creditAddresses: ["TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n"],
    isStake: true,
    credits: [
      {
        index: 2,
        account: 15,
        internal: true,
        amount: 12276267831,
        address: "TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n",
        outputScript: "u3apFFOyCElfn6vfqAtL4QxNDkiLM/KZiKw="
      }
    ],
    debits: [
      {
        index: 1,
        previousAccount: 0,
        previousAmount: 12271678363
      }
    ],
    rawTx:
      "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff574f7189057261e0e816b09306c3dd4ae55146be8d1ce52a4d5c2475fdcf85600000000001ffffffff0300000000000000000000266a2432c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e0000000000000000000000086a0601000a00000037fbb8db0200000000001abb76a91453b208495f9fabdfa80b4be10c4d0e488b33f29988ac0000000000000000029c0746000000000000000000ffffffff0200009bf372db0200000022090e00110000006a4730440220481a66bdf843d6fe2f41b0b5ba129cfec694f82bac72602d08998a2a8b792fb2022003b0a2c8ddfcc317fdb5fac33cc0fbff280ce4bc250caef3e94840c79ef60ee301210355174775888e14ed49e50dd0b904e6dca3f6b4595afd9248a020a4aa87ae469e",
    isMix: false,
    ticket: {
      timestamp: 1652858637,
      height: 919842,
      blockHash:
        "000000005af1c046f26b1a4336280e37a84a8d8e20898a1a27af18a4f23c2e56",
      hash: "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
      txHash:
        "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
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
      transaction:
        "4991d1568d01b57a63beb7544b6d258c9079c3d653d6e648887aeccdf5fdd855032101a01ea122bf76ae63687f52733bc5adce7014a0063dcf7934186571881dd266022002f620c022c825c52ba1ea8f759e397915676b76bad759a7479924f3569ce4f4d80021024530486bffffffff0000000000000002db72ff3f010000000000000000ac88000000000000000000000000000000000000000014a976bd1a000000000000000000004e0000000002db72ff3f99f2338b480e4d0ce14b0ba8dfab9f5f4908b2531e6a2000000000000000000000ac889b2fa19900414497f0fc0576af0bf8f8d9dba85c14a976ba1a000000000002db72f39b03ffffffff000000000092ce48f17cf6a507f401a45d60ecd819443c6246f2f0e366b5614631032e0fb50100000001",
      vspHost: "mockVspHost",
      txUrl:
        "https://testnet.decred.org/tx/6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57"
    },
    spender: {
      timestamp: 1652874655,
      height: 919977,
      blockHash:
        "000000005af1c046f26b1a4336280e37a84a8d8e20898a1a27af18a4f23c2e56",
      index: 0,
      hash: "000000005af1c046f26b1a4336280e37a84a8d8e20898a1a27af18a4f23c2e56",
      txHash:
        "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
      txType: "vote",
      debitsAmount: 12271678363,
      creditsAmount: 12276267831,
      type: 2,
      amount: 4589468,
      fee: 0,
      debitAccounts: [0],
      creditAddresses: ["TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n"],
      isStake: true,
      credits: [
        {
          index: 2,
          account: 0,
          internal: true,
          amount: 12276267831,
          address: "TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n",
          outputScript: "u3apFFOyCElfn6vfqAtL4QxNDkiLM/KZiKw="
        }
      ],
      debits: [
        {
          index: 1,
          previousAccount: 0,
          previousAmount: 12271678363
        }
      ],
      rawTx:
        "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff574f7189057261e0e816b09306c3dd4ae55146be8d1ce52a4d5c2475fdcf85600000000001ffffffff0300000000000000000000266a2432c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e0000000000000000000000086a0601000a00000037fbb8db0200000000001abb76a91453b208495f9fabdfa80b4be10c4d0e488b33f29988ac0000000000000000029c0746000000000000000000ffffffff0200009bf372db0200000022090e00110000006a4730440220481a66bdf843d6fe2f41b0b5ba129cfec694f82bac72602d08998a2a8b792fb2022003b0a2c8ddfcc317fdb5fac33cc0fbff280ce4bc250caef3e94840c79ef60ee301210355174775888e14ed49e50dd0b904e6dca3f6b4595afd9248a020a4aa87ae469e",
      isMix: false
    },
    status: "voted"
  },
  // voted ticket
  {
    timestamp: 1652858637,
    height: 919842,
    blockHash:
      "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
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
    ticket: {
      timestamp: 1652858637,
      height: 919842,
      blockHash:
        "00000000bbf1f33870cec5e4da9a7eb7a80c17b07cd3ba4865f4086fa6f8cd3e",
      index: 0,
      hash: "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
      txHash:
        "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
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
      vspHost: "mockVspHost",
      txUrl:
        "https://testnet.decred.org/tx/6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57"
    },
    spender: {
      timestamp: 1652874655,
      height: -1,
      blockHash: "",
      index: -1,
      hash: "000000005af1c046f26b1a4336280e37a84a8d8e20898a1a27af18a4f23c2e56",
      txHash:
        "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
      txType: "vote",
      debitsAmount: 12271678363,
      creditsAmount: 12276267831,
      type: 2,
      amount: 4589468,
      fee: 0,
      debitAccounts: [0],
      creditAddresses: ["TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n"],
      isStake: true,
      credits: [
        {
          index: 2,
          account: 0,
          internal: true,
          amount: 12276267831,
          address: "TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n",
          outputScript: "u3apFFOyCElfn6vfqAtL4QxNDkiLM/KZiKw="
        }
      ],
      debits: [
        {
          index: 1,
          previousAccount: 0,
          previousAmount: 12271678363
        }
      ],
      rawTx:
        "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff574f7189057261e0e816b09306c3dd4ae55146be8d1ce52a4d5c2475fdcf85600000000001ffffffff0300000000000000000000266a2432c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e0000000000000000000000086a0601000a00000037fbb8db0200000000001abb76a91453b208495f9fabdfa80b4be10c4d0e488b33f29988ac0000000000000000029c0746000000000000000000ffffffff0200009bf372db0200000022090e00110000006a4730440220481a66bdf843d6fe2f41b0b5ba129cfec694f82bac72602d08998a2a8b792fb2022003b0a2c8ddfcc317fdb5fac33cc0fbff280ce4bc250caef3e94840c79ef60ee301210355174775888e14ed49e50dd0b904e6dca3f6b4595afd9248a020a4aa87ae469e",
      isMix: false
    },
    status: "voted",
    feeStatus: 1
  },
  // missed
  {
    timestamp: 1623923652,
    height: 706946,
    blockHash:
      "ac7f70041e636f548314989b0eb7f50b9699194d58693642beb67aa401000000",
    index: 0,
    hash: "d47add864295f2d09ee993025f04e337f6fbd3b5443fb61a801738ec436391d9",
    txHash: "d9916343ec3817801ab63f44b5d3fbf637e3045f0293e99ed0f2954286dd7ad4",
    txType: "ticket",
    debitsAmount: 9663778247,
    creditsAmount: 9663775267,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TsZu7GLduXJKyD69vpuBrTj6Ja2sREAY1M1"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 9663775267,
        address: "TsZu7GLduXJKyD69vpuBrTj6Ja2sREAY1M1",
        outputScript: "unapFGFlNa2jpIRoGJLHW9lUJxgWv3YIiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 9663778247
      }
    ],
    rawTx:
      "01000000011a85d6fba21ae1ce273289089662304e13da5c745391e44fba4c614edbcc4c960000000000ffffffff03238201400200000000001aba76a914616535ada3a484681892c75bd954271816bf760888ac00000000000000000000206a1e1a55f9e36f3c419b77a06ad9eb27e1229d8f7bfcc78d0140020000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001c78d01400200000081c90a000b0000006a473044022069248e698f6942357e33d6abd7faf692ef7b5ca9c869a6271d958b75261262e10220189fc7aa035e0b7bdda299f900e078febfd99bdd19ddbc337b90062919e0136b01210293e05bb5230bac9482452e908367fa4c2c0207955c22d5f6479635f3db1b6327",
    ticket: {
      timestamp: 1623923652,
      height: 706946,
      blockHash:
        "ac7f70041e636f548314989b0eb7f50b9699194d58693642beb67aa401000000",
      index: 0,
      hash: "d47add864295f2d09ee993025f04e337f6fbd3b5443fb61a801738ec436391d9",
      txHash:
        "d9916343ec3817801ab63f44b5d3fbf637e3045f0293e99ed0f2954286dd7ad4",
      txType: "ticket",
      debitsAmount: 9663778247,
      creditsAmount: 9663775267,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TsZu7GLduXJKyD69vpuBrTj6Ja2sREAY1M1"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 9663775267,
          address: "TsZu7GLduXJKyD69vpuBrTj6Ja2sREAY1M1",
          outputScript: "unapFGFlNa2jpIRoGJLHW9lUJxgWv3YIiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 9663778247
        }
      ],
      rawTx:
        "01000000011a85d6fba21ae1ce273289089662304e13da5c745391e44fba4c614edbcc4c960000000000ffffffff03238201400200000000001aba76a914616535ada3a484681892c75bd954271816bf760888ac00000000000000000000206a1e1a55f9e36f3c419b77a06ad9eb7e1229d8f7bfcc78d0140020000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001c78d01400200000081c90a000b0000006a473044022069248e698f6942357e33d6abd7faf692ef7b5ca9c869a6271d958b75261262e10220189fc7aa035e0b7bdda299f900e078febfd99bdd19ddbc337b90062919e0136b01210293e05bb5230bac9482452e908367fa4c2c0207955c22d5f6479635f3db1b6327",
      vspHost: "mockVspHost-missed"
    },
    status: "missed"
  },
  // revoked ticket
  {
    timestamp: 1637487987,
    height: 815405,
    blockHash:
      "000000080433728b66a9dcd5471205adde4df9619af27f45613f60c4d3dc8a02",
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
    isMix: false,
    spender: {
      timestamp: 1643948925,
      height: -1,
      blockHash: "",
      index: -1,
      hash: "c63ff33bf5955e8636d57be2762d60e1fedaf65c92548e08784db9a4e433de1d",
      txHash:
        "c63ff33bf5955e8636d57be2762d60e1fedaf65c92548e08784db9a4e433de1d",
      txType: "revocation",
      debitsAmount: 8600218109,
      creditsAmount: 8600218109,
      type: 3,
      amount: 0,
      fee: 0,
      debitAccounts: [0],
      creditAddresses: ["Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 8600218109,
          address: "Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy",
          outputScript: "vHapFI7zeoTcK8fJJId+GrMCaztaEC5fiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 8600218109
        }
      ],
      rawTx:
        "0200000001997fa9df69903ad5d40fce86f0da366f3d9c13b842e947d1d0859a30e3e24eb00000000001ffffffff01fde99c000200000000001abc76a9148ef37a84dc2bc7c924877e1ab3026b3b5a102e5f88ac000000000000000001fde99c00020000002d710c000800000000",
      isMix: false
    },
    status: "revoked",
    ticket: {
      timestamp: 1637487987,
      height: 815405,
      blockHash:
        "000000080433728b66a9dcd5471205adde4df9619af27f45613f60c4d3dc8a02",
      index: 0,
      hash: "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
      txHash:
        "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
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
      isMix: false,
      vspHost: "",
      txUrl:
        "https://testnet.decred.org/tx/b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99"
    }
  },
  // revocation
  {
    timestamp: 1622730448,
    height: 697812,
    blockHash:
      "a52cdf0ddcfdb30a191f021262edfaae9f38b6a819d0338d9c7ca04900000000",
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
    ticket: {
      timestamp: 1618322224,
      height: -1,
      blockHash: "",
      index: -1,
      hash: "47ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a",
      txHash:
        "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
      txType: "ticket",
      debitsAmount: 6475418516,
      creditsAmount: 6475415536,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TsYUisRdHbZ7p4y2w2Hfnu9zp9bUn6BzxPu"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6475415536,
          address: "TsYUisRdHbZ7p4y2w2Hfnu9zp9bUn6BzxPu",
          outputScript: "unapFFHQaAazkipmTp6c1j/hjKpwgepmiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 6475418516
        }
      ],
      rawTx:
        "010000000120b97bf5eb8969095c3b8fa9590701f910246f464b84db62423b34c37b6747330000000000ffffffff03f0fff6810100000000001aba76a91451d06806b3922a664e9e9cd63fe18caa7081ea6688ac00000000000000000000206a1ec0e4b3a5b5a454e388c6864ae51205223a12dce4940bf781010000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001940bf7810100000044180a00020000006a47304402204be3e7097a452d99c2b56c138f8df33a923f6da1f9f465e56c75b9cdd571864902201bf7a3e9db1cfd3b7f8e55252d5f3c04311275bbc2c4ff2333472840c262b413012102936911a32e4e000e56f82207ec5d39a66b9971021869905087b23a10399cb1b0"
    },
    spender: {
      timestamp: 1622730448,
      height: 697812,
      blockHash:
        "a52cdf0ddcfdb30a191f021262edfaae9f38b6a819d0338d9c7ca04900000000",
      index: 0,
      hash: "8c6e88a38ceac7e52ef3c9f4d936d0cf16fcc0a510955cab255f3a23ce2e09c1",
      txHash:
        "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
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
        "010000000147ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a0000000001ffffffff0158f7f6810100000000001abc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac000000000000000001f0fff6810100000045180a00060000006b483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052"
    },
    status: "revoked"
  },
  // unmined
  {
    timestamp: 1624534387,
    height: -1,
    blockHash: null,
    index: 0,
    hash: "7268c1fa609ee3c042073012066a169d178b1ab5faad1a9440dc3eeeb1366d7d",
    txHash: "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16874",
    txType: "ticket",
    debitsAmount: 3731117754,
    creditsAmount: 3731114774,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 3731114774,
        address: "TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU",
        outputScript: "unapFHyIuckvdJ6IQbvXkPpCvH9iKZwWiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 3731117754
      }
    ],
    rawTx:
      "010000000186c0442e361ab94261602434ff49aaca20ea1316100fce542f9497a11bfc736b0000000000ffffffff03164b64de0000000000001aba76a9147c88b9c92f749e8841bbd790fa42bc7f62299c1688ac00000000000000000000206a1e31eede4990f81aabdf6ac274b9858f3d9f7ec0e3ba5664de000000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001ba5664de0000000000000000ffffffff6b483045022100faf3a618d5ec7255556c68f0c79a4a1e3f0dd75e06e9759c24fa5bc06bb2a12502201022b1a619d9f8427edbcf7595b051474a3455738cf61d3478fe0a919264f95501210218bb44dd0393aae1ced4e631a7d354e430c1adc3f9e2ce96f2ce51347e13f32c",
    ticket: {
      timestamp: 1624534387,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "7268c1fa609ee3c042073012066a169d178b1ab5faad1a9440dc3eeeb1366d7d",
      txHash:
        "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16874",
      txType: "ticket",
      debitsAmount: 3731117754,
      creditsAmount: 3731114774,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 3731114774,
          address: "TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU",
          outputScript: "unapFHyIuckvdJ6IQbvXkPpCvH9iKZwWiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 3731117754
        }
      ],
      rawTx:
        "010000000186c0442e361ab94261602434ff49aaca20ea1316100fce542f9497a11bfc736b0000000000ffffffff03164b64de0000000000001aba76a9147c88b9c92f749e8841bbd790fa42bc7f62299c1688ac00000000000000000000206a1e31eede4990f81aabdf6ac274b9858f3d9f7ec0e3ba5664de000000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001ba5664de0000000000000000ffffffff6b483045022100faf3a618d5ec7255556c68f0c79a4a1e3f0dd75e06e9759c24fa5bc06bb2a12502201022b1a619d9f8427edbcf7595b051474a3455738cf61d3478fe0a919264f95501210218bb44dd0393aae1ced4e631a7d354e430c1adc3f9e2ce96f2ce51347e13f32c",
      vspHost: "mockVspHost-unmined"
    },
    status: "unmined",
    feeStatus: "1"
  },
  // immature
  {
    timestamp: 1624534588,
    height: 712265,
    blockHash:
      "46f843e79f131cf969628c4b05c568811ec53dbe8b365a50945485b300000000",
    index: 0,
    hash: "7268c1fa609ee3c042073012066a169d178b1ab5faad1a9440dc3eeeb1366d7d",
    txHash: "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16872",
    txType: "ticket",
    debitsAmount: 3731117754,
    creditsAmount: 3731114774,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 3731114774,
        address: "TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU",
        outputScript: "unapFHyIuckvdJ6IQbvXkPpCvH9iKZwWiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 3731117754
      }
    ],
    rawTx:
      "010000000186c0442e361ab94261602434ff49aaca20ea1316100fce542f9497a11bfc736b0000000000ffffffff03164b64de0000000000001aba76a9147c88b9c92f749e8841bbd790fa42bc7f62299c1688ac00000000000000000000206a1e31eede4990f81aabdf6ac274b9858f3d9f7ec0e3ba5664de000000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001ba5664de0000000000000000ffffffff6b483045022100faf3a618d5ec7255556c68f0c79a4a1e3f0dd75e06e9759c24fa5bc06bb2a12502201022b1a619d9f8427edbcf7595b051474a3455738cf61d3478fe0a919264f95501210218bb44dd0393aae1ced4e631a7d354e430c1adc3f9e2ce96f2ce51347e13f32c",
    ticket: {
      timestamp: 1624534588,
      height: 712265,
      blockHash:
        "46f843e79f131cf969628c4b05c568811ec53dbe8b365a50945485b300000000",
      index: 0,
      hash: "7268c1fa609ee3c042073012066a169d178b1ab5faad1a9440dc3eeeb1366d7d",
      txHash:
        "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16872",
      txType: "ticket",
      debitsAmount: 3731117754,
      creditsAmount: 3731114774,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 3731114774,
          address: "TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU",
          outputScript: "unapFHyIuckvdJ6IQbvXkPpCvH9iKZwWiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 3731117754
        }
      ],
      rawTx:
        "010000000186c0442e361ab94261602434ff49aaca20ea1316100fce542f9497a11bfc736b0000000000ffffffff03164b64de0000000000001aba76a9147c88b9c92f749e8841bbd790fa42bc7f62299c1688ac00000000000000000000206a1e31eede4990f81aabdf6ac274b9858f3d9f7ec0e3ba5664de000000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001ba5664de0000000000000000ffffffff6b483045022100faf3a618d5ec7255556c68f0c79a4a1e3f0dd75e06e9759c24fa5bc06bb2a12502201022b1a619d9f8427edbcf7595b051474a3455738cf61d3478fe0a919264f95501210218bb44dd0393aae1ced4e631a7d354e430c1adc3f9e2ce96f2ce51347e13f32c",
      vspHost: "mockVspHost-immature"
    },
    status: "immature",
    feeStatus: 1
  },
  // live
  {
    timestamp: 1624534588,
    height: 712265,
    blockHash:
      "46f843e79f131cf969628c4b05c568811ec53dbe8b365a50945485b300000000",
    index: 0,
    hash: "7268c1fa609ee3c042073012066a169d178b1ab5faad1a9440dc3eeeb1366d7d",
    txHash: "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16873",
    txType: "ticket",
    debitsAmount: 3731117754,
    creditsAmount: 3731114774,
    type: 1,
    amount: -2980,
    fee: 2980,
    debitAccounts: [0],
    creditAddresses: ["TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU"],
    isStake: true,
    credits: [
      {
        index: 0,
        account: 0,
        internal: true,
        amount: 3731114774,
        address: "TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU",
        outputScript: "unapFHyIuckvdJ6IQbvXkPpCvH9iKZwWiKw="
      }
    ],
    debits: [
      {
        index: 0,
        previousAccount: 0,
        previousAmount: 3731117754
      }
    ],
    rawTx:
      "010000000186c0442e361ab94261602434ff49aaca20ea1316100fce542f9497a11bfc736b0000000000ffffffff03164b64de0000000000001aba76a9147c88b9c92f749e8841bbd790fa42bc7f62299c1688ac00000000000000000000206a1e31eede4990f81aabdf6ac274b9858f3d9f7ec0e3ba5664de000000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001ba5664de0000000000000000ffffffff6b483045022100faf3a618d5ec7255556c68f0c79a4a1e3f0dd75e06e9759c24fa5bc06bb2a12502201022b1a619d9f8427edbcf7595b051474a3455738cf61d3478fe0a919264f95501210218bb44dd0393aae1ced4e631a7d354e430c1adc3f9e2ce96f2ce51347e13f32c",
    ticket: {
      timestamp: 1624534588,
      height: 712265,
      blockHash:
        "46f843e79f131cf969628c4b05c568811ec53dbe8b365a50945485b300000000",
      index: 0,
      hash: "7268c1fa609ee3c042073012066a169d178b1ab5faad1a9440dc3eeeb1366d7d",
      txHash:
        "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16873",
      txType: "ticket",
      debitsAmount: 3731117754,
      creditsAmount: 3731114774,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 3731114774,
          address: "TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU",
          outputScript: "unapFHyIuckvdJ6IQbvXkPpCvH9iKZwWiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 3731117754
        }
      ],
      rawTx:
        "010000000186c0442e361ab94261602434ff49aaca20ea1316100fce542f9497a11bfc736b0000000000ffffffff03164b64de0000000000001aba76a9147c88b9c92f749e8841bbd790fa42bc7f62299c1688ac00000000000000000000206a1e31eede4990f81aabdf6ac274b9858f3d9f7ec0e3ba5664de000000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001ba5664de0000000000000000ffffffff6b483045022100faf3a618d5ec7255556c68f0c79a4a1e3f0dd75e06e9759c24fa5bc06bb2a12502201022b1a619d9f8427edbcf7595b051474a3455738cf61d3478fe0a919264f95501210218bb44dd0393aae1ced4e631a7d354e430c1adc3f9e2ce96f2ce51347e13f32c",
      vspHost: "mockVspHost-live"
    },
    status: "live",
    feeStatus: 1
  }
];

export const mockRegularTransactions = {};
mockRegularTransactionList.forEach((tx) => {
  tx.blockHash = toByteArray(tx.blockHash);
  mockRegularTransactions[tx.txHash] = tx;
});

export const mockNormalizedRegularTransactions = {};
mockNormalizedRegularTransactionList.forEach((tx) => {
  mockNormalizedRegularTransactions[tx.txHash] = tx;
});

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

export const mockAgendas = [
  {
    name: "reverttreasurypolicy",
    description:
      "Change maximum treasury expenditure policy as defined in DCP0007"
  },
  {
    name: "explicitverupgrades",
    description: "Enable explicit version upgrades as defined in DCP0008"
  },
  {
    name: "changesubsidysplit",
    description:
      "Change block reward subsidy split to 10/80/10 as defined in DCP0010"
  },
  {
    name: "autorevocations",
    description: "Enable automatic ticket revocations as defined in DCP0009"
  },
  {
    name: "treasury",
    description: "Enable decentralized Treasury opcodes as defined in DCP0006"
  },
  {
    name: "headercommitments",
    description: "Enable header commitments as defined in DCP0005"
  },
  {
    name: "fixlnseqlocks",
    description: "Modify sequence lock handling as defined in DCP0004"
  },
  {
    name: "lnfeatures",
    description:
      "Enable features defined in DCP0002 and DCP0003 necessary to support Lightning Network (LN)"
  },
  {
    name: "sdiffalgorithm",
    description: "Change stake difficulty algorithm as defined in DCP0001"
  },
  {
    name: "lnsupport",
    description:
      "Request developers begin work on Lightning Network (LN) integration"
  }
];
