export const toByteArray = (hex) => {
  if (!hex || !hex.length) {
    return hex;
  }
  const res = [];
  for (let i = 0; i < hex.length; i += 2) {
    res.push(parseInt(hex.substr(i, 2), 16));
  }
  return res;
};

export const mockNormalizedRegularTransactionList = [
  // regular pending transaction
  {
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
    debits: [{ index: 0, previousAccount: 0, previousAmount: 1793854340 }],
    txUrl:
      "https://testnet.decred.org/tx/263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d",
    txBlockUrl: "https://testnet.decred.org/block/null",
    txHash: "263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d",
    height: -1,
    txType: "regular",
    timestamp: 1624527872,
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
    blockHash: null,
    txNumericType: 0,
    rawTx:
      "010000000137bdd42d19c66cb0ee0da40f5419b284bcd16af1d3836f313fad124b5e5a4fe80000000000ffffffff02a2f93c3b0000000000001976a914694d918352de4cfe4bee6776a3f2502a7fcdc2f888ac0008af2f0000000000001976a9145aec0ddf49a9ca0ad1de2b4143666f544860043688ac000000000000000001840bec6a0000000000000000ffffffff6b4830450221009ce94aac7683dfbac6e23716af87b7529b3cf53d69d1bae7772a9e1baccc873902204e0312be8be7a518723c0c7d9e1f40abe67c681e9aabf78deb21d964c31872c201210314012e939d6ab30c7dacb4258654b0996ce89f7e47faa57bbbf65c44dffd668f",
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
    txUrl:
      "https://testnet.decred.org/tx/642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    txHash: "642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e",
    height: 706945,
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
    blockHash:
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
    debits: [{ index: 0, previousAccount: 0, previousAmount: 6362443956 }],
    txUrl:
      "https://testnet.decred.org/tx/9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304",
    txBlockUrl:
      "https://testnet.decred.org/block/00000000cf7eee715245616121f06e62fb3ac39c5cc296076395b80e21b5de62",
    txHash: "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304",
    height: 712832,
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
    blockHash:
      "00000000cf7eee715245616121f06e62fb3ac39c5cc296076395b80e21b5de62",
    txNumericType: 0,
    rawTx:
      "010000000105b2574bf056ac5bc8b1da11e13277dc7f9a4fcf1fcb46c8d7004d1b952e354c0100000000ffffffff0200f2052a0100000000001976a9140cbd0ed5738aee2c8b507c7234e140bdf5d2120e88acd23435510000000000001976a914ab2e3b83e5e37b902197b85599be1826373d082288ac000000000000000001b4303b7b0100000000000000ffffffff6a47304402203c4e1289c57e46903e3b4444f9a6a4beab805b0a13b7551f63d35ba8eb8f3d0a02203ba8b75862288de7d71be0610f49ac0e880721ce3a6500b1ca75dbed687a682d0121032dcb435ca06b6c25401bfb7a4c6411ea79327e29e7f929571405f21db2f0cd20",
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
    debits: [{ index: 0, previousAccount: 4, previousAmount: 5000000000 }],
    txUrl:
      "https://testnet.decred.org/tx/ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c",
    txBlockUrl:
      "https://testnet.decred.org/block/00000000f6281f84cd50fbf1dc0d13f39b843aa04fc1894d92db193534ff41d3",
    txHash: "ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c",
    height: 712872,
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
    blockHash:
      "00000000f6281f84cd50fbf1dc0d13f39b843aa04fc1894d92db193534ff41d3",
    txNumericType: 0,
    rawTx:
      "010000000304a30f2f7a92cd0dc3ccc73b462f3988e851adc27b62897300a918c498b910910000000000000000007773ac3c5b1d902ee228b594c6648caa0519302dd5a09eb56861832318d3b01f0600000000000000007773ac3c5b1d902ee228b594c6648caa0519302dd5a09eb56861832318d3b01f0d00000000000000000915075c220000000000001976a914cf7ab856a54d039fb39c0437abecbb0a9cd22d4d88ac000000400000000000001976a914f5516162c4bb1ead78ed98758c744a9ede0642de88ace6e3052a0000000000001976a914b460a98fa91d688b9e7fb4533fde58c7b88617e288ac32e7b9130000000000001976a91430faefe4d83fa63c8d05a3b6a2240f9ba15b38bf88ac000000400000000000001976a91424c2aaaaba269fe4801322cca894dc53202b6cd588ac000000400000000000001976a914a1066198f4f2738684af9c0dabf2e0acb5368c1388ac000000400000000000001976a91445e8178ec05a05068af93bdd580667b0ecf50af788ac000000400000000000001976a914c73bdb952eac21dac545a074812f981b7398fce188ac000000400000000000001976a914f57e187ad1dfce7cc591cb85411c65d17fd8224e88ac00000000000000000300f2052a0100000000000000000000006b483045022100e533cbb88e3f11d9650262cd51e245dfe4d0659baa34df17e7eaaf3421c94bb102201144f1e482867e5984e9d0cf75a7cc7ae208786e7630be8d750fa24a8422f81001210393e85132b9aed5d69f7b0e8bfb48b2300fecc7710e7ba30c65ec2412d3d685ed14f1b9530000000000000000000000006b4830450221009f9feb22dd01bbc16c97d889bca3e2200ed254f6a8e3ef421b1e4d25eab5c3ae02201b6c4e794a9a5ae211221f8bf569512d7a9489a164dc5a189f52ca2fccbf7b0d0121032aec130af5e726017c039cb471331bc95314f3b65d6e289a15af3310e5ce3c40f7105c620000000000000000000000006a47304402204b2d81fe96320768d0f547ceb836a656c6ff1c5d4bd81b626d053d77a0de3e96022042111c6311774c32d2d75f7c6e92904b40ef974ca995a81c8fa5a3fd9f3b137a012103b1ea67a2e2bcd020b470fbbdb14687d1034bce11eee0665db2e53f5467d1af3e",
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
export const mockRegularTransactionList = [
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

export const mockNormalizedStakeTransactionList = [
  // vote tx
  {
    type: 2,
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
    txHash: "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash:
      "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
    ticketHash:
      "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60",
    ticketTx: {
      timestamp: 1654202680,
      height: 930685,
      blockHash:
        "33383134633937643639643532326435356266653332313833656532306461623735353063653531613232343863333330326538383237313030303030303030",
      hash: "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60",
      txHash:
        "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60",
      txType: "ticket",
      debitsAmount: 6785799465,
      creditsAmount: 6785796485,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [15],
      creditAddresses: ["TsZxH8PTsbnWHg7ty2xFhUH9uzizLrNSAy7"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6785796485,
          address: "TsZxH8PTsbnWHg7ty2xFhUH9uzizLrNSAy7",
          outputScript: "unapFGH+sNJBVRkEe2EjIOCHcpFJ7baziKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 15,
          previousAmount: 6785799465
        }
      ],
      rawTx:
        "010000000154a9b3b3e7a51658a2dcadb7e6cc440acda169c47e785ba6225cab34be43dce50000000000ffffffff03850977940100000000001aba76a91461feb0d2415519047b612320e087729149edb6b388ac00000000000000000000206a1e99bf7a5e99c8c00e09ecef371eabd7865bcf5e112915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6a473044022020cfc5e2bb47ddcd39fdc1a7e82e90a8fb0c2fc01db79c683296b15afb29780c0220216ee46d39c358a18395a035b9cc0af1a0a753eed82deef8694b516b77ee0bdd0121025d5aeb18e8bb8ae1485aed5e2816990ff8b0eee40bb9ab046d738cd6e18b4edd",
      isMix: false,
      vspHost: "mockVspHost",
      txUrl:
        "https://testnet.decred.org/tx/65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60"
    },
    spenderTx: {
      timestamp: 1654485406,
      height: 932737,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
      index: 0,
      hash:
        "1472512351262304275125239808423343934577220111166192222712233111195632030000",
      txHash:
        "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
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
    ticketPrice: 6785796485,
    ticketReward: 4320506,
    ticketChange: 0,
    ticketInvestment: 6785799465,
    ticketTxFee: 2980,
    ticketStakeRewards: 0.0006366981550640327,
    ticketReturnAmount: 6790119971,
    voteScript: {
      voteChoices: {
        reverttreasurypolicy: "abstain",
        explicitverupgrades: "abstain",
        autorevocations: "abstain",
        changesubsidysplit: "abstain"
      },
      version: 10,
      bits: "0x0001",
      isLastBlockValid: 1
    },
    spenderTxFee: 0,
    enterTimestamp: 1654202680,
    leaveTimestamp: 1654485406,
    status: "voted",
    rawTx:
      "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff60ed215decf9ec50b50ff4477db42b1603178dab67e35d59f22b0de16cf4c1650000000001ffffffff0300000000000000000000266a24e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e0000000000000000000000086a0601000a0000002302b9940100000000001abb76a91499bf7a5e99c8c00e09ecef371eabd7865bcf5e1188ac0000000000000000029ef841000000000000000000ffffffff02000085097794010000007d330e00060000006a473044022038c9d8cafe8d98a904c72760e29a7f1e3942c9ef398a7384ca7b946517a3f598022016768855eae1edb7297ee52717bb4c1a247e836fce316a1d681026f4bcf9e5240121027bf4538b926d5668452965c44dbf8724b571ee6b3bae2eab59fd6969e6e87f13",
    txType: "vote",
    isPending: false,
    accountName: "account-15",
    txInputs: [
      {
        accountName: "default",
        amount: 6785796485,
        index: 1
      }
    ],
    txOutputs: [
      {
        accountName: "account-15",
        amount: 6790119971,
        address: "Tsf35F2zDqv9EmDC1pTqixwNe5ytxyseRGr",
        index: 2
      }
    ],
    height: 932737,
    txUrl:
      "https://testnet.decred.org/tx/843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: undefined
  },
  // voted ticket
  {
    type: 1,
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
    txHash: "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash:
      "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
    ticketHash:
      "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
    ticketTx: {
      timestamp: 1652858637,
      height: 919842,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
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
      vspHost: "mockVspHost-votedticket",
      feeStatus: 1,
      txUrl:
        "https://testnet.decred.org/tx/6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57"
    },
    spenderTx: {
      timestamp: 1652874655,
      height: -1,
      blockHash: "",
      index: -1,
      hash: "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
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
      isMix: false
    },
    ticketPrice: 12271678363,
    ticketReward: 4586488,
    ticketChange: 0,
    ticketInvestment: 12271681343,
    ticketTxFee: 2980,
    ticketStakeRewards: 0.00037374568910365487,
    ticketReturnAmount: 12276267831,
    voteScript: {
      voteChoices: {
        reverttreasurypolicy: "abstain",
        explicitverupgrades: "abstain",
        autorevocations: "abstain",
        changesubsidysplit: "abstain"
      },
      version: 10,
      bits: "0x0001",
      isLastBlockValid: 1
    },
    spenderTxFee: 0,
    enterTimestamp: 1652858637,
    leaveTimestamp: 1652874655,
    status: "voted",
    rawTx:
      "0100000001b50f2e03314661b566e3f0f246623c4419d8ec605da401f407a5f67cf148ce920000000000ffffffff039bf372db0200000000001aba76a9145ca8dbd9f8f80baf7605fcf09744410099a12f9b88ac00000000000000000000206a1e53b208495f9fabdfa80b4be10c4d0e488b33f2993fff72db02000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac0000000000000000013fff72db0200000000000000ffffffff6b483045022100d8f4e49c56f3249947a759d7ba766b671579399e758feaa12bc525c822c020f602200266d21d887165183479cf3d06a01470ceadc53b73527f6863ae76bf22a11ea001210355d8fdf5cdec7a8848e6d653d6c379908c256d4b54b7be637ab5018d56d19149",
    txType: "ticket",
    isPending: false,
    accountName: "account-15",
    txInputs: [{ accountName: "account-15", amount: 12271681343, index: 0 }],
    txOutputs: [
      {
        accountName: "default",
        amount: 12271678363,
        address: "TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU",
        index: 0
      }
    ],
    height: 919842,
    txUrl:
      "https://testnet.decred.org/tx/6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: 1
  },
  // missed
  {
    type: 1,
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
    txHash: "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash:
      "c44db16d004aa264c3cc8dcf90ecc08caa88964cb6e34477139651b56f46af79",
    ticketHash:
      "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
    ticketTx: {
      timestamp: 1605621435,
      height: 558424,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
      index: 0,
      hash: "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
      txHash:
        "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
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
    spenderTx: {
      timestamp: 1605714645,
      height: -1,
      blockHash: "",
      index: -1,
      hash: "c44db16d004aa264c3cc8dcf90ecc08caa88964cb6e34477139651b56f46af79",
      txHash:
        "c44db16d004aa264c3cc8dcf90ecc08caa88964cb6e34477139651b56f46af79",
      txType: "revocation",
      debitsAmount: 9525589786,
      creditsAmount: 9525587586,
      type: 3,
      amount: -2200,
      fee: 2200,
      debitAccounts: [2147483647],
      creditAddresses: ["TsZRAVD9t8shxck66daNEhaWrWCsYV9e2Qp"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 6,
          internal: true,
          amount: 9525587586,
          address: "TsZRAVD9t8shxck66daNEhaWrWCsYV9e2Qp",
          outputScript: "vHapFFwcQJSsYfyHYr5o17Fc20gGYRz3iKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 2147483647,
          previousAmount: 9525589786
        }
      ],
      rawTx:
        "01000000017457e53cda6f04dc671bf2bde52568add0bbe4fb9fc3db74b43a769d0406dd300000000001ffffffff0182eec4370200000000001abc76a9145c1c4094ac61fc8762be68d7b15cdb4806611cf788ac0000000000000000011af7c437020000005885080005000000904730440220163ae79bc0713243f5e627aeafb680fbc2126b153188b4921d954056efc3fa61022040c5ecfdaa83175cef7faf99460b765779c4bcf09cc6e72782d491664bb66dbb01475121038add32307530f18099a9208f32fc04502b40073ea6a6cfebbbd79988270a612e2103f2a96dbe354081542af9571c43662b883d9ae02416cd5080137c0556c7a0976d52ae",
      isMix: false
    },
    ticketPrice: 9525589786,
    ticketReward: -5160,
    ticketChange: 0,
    ticketInvestment: 9525592746,
    ticketTxFee: 2960,
    ticketStakeRewards: -5.416985732637787e-7,
    ticketReturnAmount: 9525587586,
    voteScript: undefined,
    spenderTxFee: 2200,
    enterTimestamp: 1605621435,
    leaveTimestamp: 1605714645,
    status: "missed",
    rawTx:
      "0100000001781d53a4f25c754340cf9250f98039c1db2c92bcd58b1e4637c9ca534d9053c00100000000ffffffff031af7c43702000000000018baa91434ffb3d43f5b40e0dbe9426e53865fc9d553d1038700000000000000000000206a1e5c1c4094ac61fc8762be68d7b15cdb4806611cf7aa02c537020000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000006085080001aa02c5370200000057850800010000006a473044022053cad54d349690d3c22b346134ff71da1b527695c6ec1252f11c1e7c5d9da9280220606a81e7d4ea63b448945cfbf1385b85642e0221cf49ca0824e5ec8ff62a61c30121032071d0e49038bcdeee3461296d2c50950b62f08e35caafbd4f2b0d025d1a47e1",
    txType: "ticket",
    isPending: false,
    accountName: "account-6",
    txInputs: [
      {
        accountName: "account-6",
        amount: 9525592746,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "imported",
        amount: 9525589786,
        address: "TccM3W31vkNXUCosK4Y5vYrmtiWWjuecHFs",
        index: 0
      }
    ],
    height: 558424,
    txUrl:
      "https://testnet.decred.org/tx/30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: undefined
  },
  // revoked ticket
  {
    type: 1,
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
    debits: [{ index: 0, previousAccount: 0, previousAmount: 8600221089 }],
    txHash: "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash:
      "c63ff33bf5955e8636d57be2762d60e1fedaf65c92548e08784db9a4e433de1d",
    ticketHash:
      "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
    ticketTx: {
      timestamp: 1637487987,
      height: 815405,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
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
    },
    spenderTx: {
      timestamp: 1643948925,
      height: 868792,
      blockHash:
        "30383936626239623038353766316531326239373563366366303133633863343439383530666235616466313033633063343536643165613030303030303030",
      index: 1,
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
    ticketPrice: 8600218109,
    ticketReward: -2980,
    ticketChange: 0,
    ticketInvestment: 8600221089,
    ticketTxFee: 2980,
    ticketStakeRewards: -3.465027200069926e-7,
    ticketReturnAmount: 8600218109,
    voteScript: undefined,
    spenderTxFee: 0,
    enterTimestamp: 1637487987,
    leaveTimestamp: 1643948925,
    status: "revoked",
    rawTx:
      "010000000145dff3de5ec042630f66a9ba4ea2ed6d70f3fa306af01858a83efa676d3779000000000000ffffffff03fde99c000200000000001aba76a914e94f60cf60a494910cc0fe28f662db687946744e88ac00000000000000000000206a1e8ef37a84dc2bc7c924877e1ab3026b3b5a102e5fa1f59c0002000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001a1f59c00020000002c710c00030000006a47304402206888557060684807b6e78f47ea8c186debe45f2316a584abe60c5495f36f77f80220249421832ab9ea9e6bbb70d50376e7f48258b3108a345dc299d1de8186e046060121036343175c705537c636732c42fa699ba96f6296bc66b915216cbc833d00e18e10",
    txType: "ticket",
    isPending: false,
    accountName: "default",
    txInputs: [{ accountName: "default", amount: 8600221089, index: 0 }],
    txOutputs: [
      {
        accountName: "default",
        amount: 8600218109,
        address: "TsnHm1YjaLMmnFsyGwt54D4P53aFaNqeESJ",
        index: 0
      }
    ],
    height: 815405,
    txUrl:
      "https://testnet.decred.org/tx/b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: undefined
  },
  // revocation
  {
    type: 3,
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
    debits: [{ index: 0, previousAccount: 0, previousAmount: 6475415536 }],
    txHash: "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash:
      "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
    ticketHash:
      "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
    ticketTx: {
      timestamp: 1618322224,
      height: 661573,
      blockHash:
        "37313535336630323163353733646463653136386336623938326131373630343134323163383663386133633832636464306361613433366131303030303030",
      hash: "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
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
        "010000000120b97bf5eb8969095c3b8fa9590701f910246f464b84db62423b34c37b6747330000000000ffffffff03f0fff6810100000000001aba76a91451d06806b3922a664e9e9cd63fe18caa7081ea6688ac00000000000000000000206a1ec0e4b3a5b5a454e388c6864ae51205223a12dce4940bf781010000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001940bf7810100000044180a00020000006a47304402204be3e7097a452d99c2b56c138f8df33a923f6da1f9f465e56c75b9cdd571864902201bf7a3e9db1cfd3b7f8e55252d5f3c04311275bbc2c4ff2333472840c262b413012102936911a32e4e000e56f82207ec5d39a66b9971021869905087b23a10399cb1b0",
      isMix: false,
      txUrl:
        "https://testnet.decred.org/tx/9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
      vspHost:
        "mock-vspHost-c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c"
    },
    spenderTx: {
      timestamp: 1622730448,
      height: 697812,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
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
        "010000000147ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a0000000001ffffffff0158f7f6810100000000001abc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac000000000000000001f0fff6810100000045180a00060000006b483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052",
      isMix: false
    },
    ticketPrice: 6475415536,
    ticketReward: -5180,
    ticketChange: 0,
    ticketInvestment: 6475418516,
    ticketTxFee: 2980,
    ticketStakeRewards: -7.999482948014599e-7,
    ticketReturnAmount: 6475413336,
    voteScript: undefined,
    spenderTxFee: 2200,
    enterTimestamp: 1618322224,
    leaveTimestamp: 1622730448,
    status: "revoked",
    rawTx:
      "010000000147ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a0000000001ffffffff0158f7f6810100000000001abc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac000000000000000001f0fff6810100000045180a00060000006b483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052",
    txType: "revocation",
    isPending: false,
    accountName: "default",
    txInputs: [
      {
        accountName: "default",
        amount: 6475415536,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "default",
        amount: 6475413336,
        address: "Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU",
        index: 0
      }
    ],
    height: 697812,
    txUrl:
      "https://testnet.decred.org/tx/c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: undefined
  },
  // unmined
  {
    type: 1,
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
    txHash: "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
    blockHash: null,
    spenderHash: null,
    ticketHash:
      "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
    ticketTx: {
      timestamp: 1658937788,
      height: -1,
      blockHash: null,
      index: 1,
      hash: "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
      txHash:
        "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
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
    spenderTx: null,
    ticketPrice: 20000000,
    ticketReward: undefined,
    ticketChange: 0,
    ticketInvestment: 20002980,
    ticketTxFee: 2980,
    spenderTxFee: 0,
    ticketStakeRewards: undefined,
    ticketReturnAmount: undefined,
    voteScript: undefined,
    enterTimestamp: 1658937788,
    leaveTimestamp: null,
    status: "unmined",
    rawTx:
      "01000000011babed986d25d5c3c27a1626e6caa344899949974a83bf63a49c2b1fa5f0514a0000000000ffffffff03002d31010000000000001aba76a9140569490de77e80360b5c56f9185d70b32f7460a888ac00000000000000000000206a1e9154057f4df98e818b05779aea2a20f6b624012ea438310100000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001a43831010000000000000000ffffffff6a4730440220290c05e17b48e8c6ed6ee42326565a91416835b75c5f481b10a16e5b0dfa9f67022001d99b93ae971419db6e411dab042828e34ed2b0c7fcd30bd50ccae3d333a393012102af8273525052a10d5c8906ea288968d6f8c7e68caeaab58554b429e8f535e269",
    txType: "ticket",
    isPending: true,
    accountName: "default",
    txInputs: [
      {
        accountName: "default",
        amount: 20002980,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "default",
        amount: 20000000,
        address: "TsRWjysgoNXTS7JAQXfsaAzts8UM3Dq3WUg",
        index: 0
      }
    ],
    height: -1,
    txUrl:
      "https://testnet.decred.org/tx/d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
    txBlockUrl: "https://testnet.decred.org/block/null",
    isStake: true,
    feeStatus: undefined
  },
  // immature
  {
    type: 1,
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
    debits: [{ index: 0, previousAccount: 0, previousAmount: 6785799465 }],
    txHash: "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash: null,
    ticketHash:
      "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
    ticketTx: {
      timestamp: 1654203366,
      height: 930690,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
      index: 0,
      hash: "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
      txHash:
        "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
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
      isMix: false,
      vspHost: "mockVspHost-immature",
      txUrl:
        "https://testnet.decred.org/tx/f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530"
    },
    spenderTx: null,
    ticketPrice: 6785796485,
    ticketReward: undefined,
    ticketChange: 0,
    ticketInvestment: 6785799465,
    ticketTxFee: 2980,
    ticketStakeRewards: undefined,
    ticketReturnAmount: undefined,
    voteScript: undefined,
    spenderTxFee: 0,
    enterTimestamp: 1654203366,
    leaveTimestamp: null,
    status: "immature",
    rawTx:
      "01000000011a1b3fc2661245ba6b8cab9e315cf76b16c565f1c1277512608d51906f1636c10000000000ffffffff03850977940100000000001aba76a9140f9453debf1df39262a6eaf81fcb98ff797c895c88ac00000000000000000000206a1e19e5ba2f1f3b99efe1090707638af39998a1b7582915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6b483045022100a510695025634a249cda2c85fe63a43312cb0ee5c02db2f1256fe4f835702f8002202b0f4c7e093500b75626a4829c9705a370cb2f2f834702abe8b9ac268d5ac57b012102dfa5deeeee8b65f2738483d412f2bb5627fa7f761b132f3b4eef2e154151902c",
    txType: "ticket",
    isPending: false,
    accountName: "default",
    txInputs: [
      {
        accountName: "default",
        amount: 6785799465,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "default",
        amount: 6785796485,
        address: "TsSSWJRNEor8X6R33GSoo68p3yq3zFuGoVK",
        index: 0
      }
    ],
    height: 930690,
    txUrl:
      "https://testnet.decred.org/tx/f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: undefined
  },
  // live
  {
    type: 1,
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
    debits: [{ index: 0, previousAccount: 0, previousAmount: 6785799465 }],
    txHash: "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
    blockHash:
      "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    spenderHash: null,
    ticketHash:
      "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
    ticketTx: {
      timestamp: 1654204193,
      height: 930696,
      blockHash:
        "0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
      index: 0,
      hash: "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
      txHash:
        "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
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
      isMix: false,
      vspHost: "mockVspHost-live",
      txUrl:
        "https://testnet.decred.org/tx/05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07"
    },
    spenderTx: null,
    ticketPrice: 6785796485,
    ticketReward: undefined,
    ticketChange: 0,
    ticketInvestment: 6785799465,
    ticketTxFee: 2980,
    ticketStakeRewards: undefined,
    ticketReturnAmount: undefined,
    voteScript: undefined,
    spenderTxFee: 0,
    enterTimestamp: 1654204193,
    leaveTimestamp: null,
    status: "live",
    rawTx:
      "010000000164f0acf752429210f469c6536c857d092aac8bc84fa661f013b535aa6394c4710000000000ffffffff03850977940100000000001aba76a9148321c9e11f0443628a22bf4a8762374d887c063288ac00000000000000000000206a1e01ca6bb0120ca64e750a9cbaa66597f010c1c03d2915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6b483045022100a58c8e7b6f33b3c3fdc43dfa7472d19e39cc8c22c5990f94ca45a9458c860bfe02202227864c234f9a2c328418cabf6a5934e99d16806a8492805ad4243155d77e63012102029965f740c2b87c21dca96fb4195f71dae34b779ef4daed5902f98a0c09a437",
    txType: "ticket",
    isPending: false,
    accountName: "default",
    txInputs: [
      {
        accountName: "default",
        amount: 6785799465,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "default",
        amount: 6785796485,
        address: "TscyVUMxevtGhTuTvM6LkLnvQGU97kEyUg4",
        index: 0
      }
    ],
    height: 930696,
    txUrl:
      "https://testnet.decred.org/tx/05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
    txBlockUrl:
      "https://testnet.decred.org/block/0000000bc17d35756d4383c27e91d83bcb5be0f8bf9943675cba87e8223eeb21",
    isStake: true,
    feeStatus: undefined
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

export const mockNormalizedStakeTransactions = {};
mockNormalizedStakeTransactionList.forEach((tx) => {
  mockNormalizedStakeTransactions[tx.txHash] = tx;
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
