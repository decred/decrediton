export const mockAccounts = [
  {
    accountNumber: 0,
    accountName: "default",
    totalBalance: 6062796917,
    externalKeyCount: 41,
    internalKeyCount: 64,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 1,
    accountName: "account-1",
    totalBalance: 0,
    externalKeyCount: 10,
    internalKeyCount: 2,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 2,
    accountName: "account-2",
    totalBalance: 0,
    externalKeyCount: 6,
    internalKeyCount: 1,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 3,
    accountName: "mixed",
    totalBalance: 1342177280,
    externalKeyCount: 151,
    internalKeyCount: 0,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 4,
    accountName: "unmixed",
    totalBalance: 5757295987,
    externalKeyCount: 61,
    internalKeyCount: 60,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 5,
    accountName: "LN Account",
    totalBalance: 133573732,
    externalKeyCount: 436,
    internalKeyCount: 129,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 6,
    accountName: "dex",
    totalBalance: 0,
    externalKeyCount: 0,
    internalKeyCount: 0,
    importedKeyCount: 0,
    accountEncrypted: true,
    accountUnlocked: false
  },
  {
    accountNumber: 2147483647,
    accountName: "imported",
    totalBalance: 0,
    externalKeyCount: 1,
    internalKeyCount: 1,
    importedKeyCount: 47,
    accountEncrypted: false,
    accountUnlocked: false
  }
];

export const mockSpendableAndLockedBalance = [
  {
    time: new Date("2021-11-16T22:59:59.999Z"),
    available: 131.96021386,
    locked: 0.0000298
  },
  {
    time: new Date("2021-11-17T22:59:59.999Z"),
    available: 72.33046999,
    locked: 60.62799897
  }
];

export const mockTicketDataChart = [
  {
    time: new Date("2021-11-16T22:59:59.999Z"),
    voted: 0,
    revoked: 0,
    ticket: 0,
    locked: 0.0000298,
    immature: 0
  },
  {
    time: new Date("2021-11-17T22:59:59.999Z"),
    voted: 0,
    revoked: 0,
    ticket: 60.62796917,
    locked: 60.62799897,
    immature: 0
  }
];

export const mockSentAndReceivedTransactions = [
  {
    time: new Date("2021-11-16T22:59:59.999Z"),
    sent: 0,
    received: 0
  },
  {
    time: new Date("2021-11-17T22:59:59.999Z"),
    sent: -2.0017449,
    received: 3
  }
];

export const mockHomeHistoryTransactions = [
  {
    txUrl: "",
    txBlockUrl: "",
    txHash: "",
    txHeight: 812802,
    txType: "regular",
    timestamp: 1637157081,
    isPending: false,
    txFee: 0,
    txInputs: [],
    txOutputs: [
      {
        accountName: "unmixed",
        amount: 300000000,
        address: "mockTxOutput1",
        index: 1
      }
    ],
    txBlockHash: "",
    txNumericType: 0,
    rawTx: "",
    outputs: [
      {
        address: "mockOutput11",
        value: 4513630403,
        isChange: false
      },
      {
        address: "mockOutput12",
        value: 300000000,
        isChange: true
      }
    ],
    creditAddresses: ["mockCreditAddress1"],
    mixedTx: false,
    selfTx: false,
    txAmount: 300000000,
    txDirection: "received",
    txAccountName: "unmixed"
  },
  {
    txUrl: "",
    txBlockUrl: "",
    txHash: "cfa4bc8c54a08fa5071d392b27a49a0f9f675007d03bdfa15b5d59c77c45ea7d",
    txHeight: 812802,
    txType: "regular",
    timestamp: 1637157081,
    isPending: false,
    txFee: 2530,
    txInputs: [
      {
        accountName: "mixed",
        amount: 268435456,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "unmixed",
        amount: 68432926,
        address: "mockTxOutput2",
        index: 1
      }
    ],
    txBlockHash: "",
    txNumericType: 0,
    rawTx: "",
    outputs: [
      {
        address: "mockOutput21",
        value: 200000000,
        isChange: false
      },
      {
        address: "mockOutput22",
        value: 68432926,
        isChange: true
      }
    ],
    creditAddresses: ["mockCreditAddress2"],
    mixedTx: true,
    selfTx: false,
    txAmount: 200000000,
    txDirection: "sent",
    txAccountName: "mixed"
  }
];

export const mockHomeHistoryTickets = [
  {
    txHash: "",
    txBlockHash: {},
    spenderHash: null,
    ticketHash: "",
    ticketTx: {},
    spenderTx: null,
    ticketPrice: 6062796917,
    ticketChange: 0,
    ticketInvestment: 6062799897,
    ticketTxFee: 2980,
    spenderTxFee: 0,
    enterTimestamp: 1637156117,
    leaveTimestamp: null,
    status: "live",
    rawTx: "",
    tx: {},
    txType: "ticket",
    isPending: false,
    accountName: "mixed",
    txInputs: [
      {
        accountName: "mixed",
        amount: 6062799897,
        index: 0
      }
    ],
    txOutputs: [
      {
        accountName: "default",
        amount: 6062796917,
        address: "",
        index: 0
      }
    ],
    txHeight: 812795,
    txUrl: "",
    txBlockUrl: "",
    isStake: true,
    feeStatus: 1
  },
  {
    txHash: "",
    txBlockHash: {},
    spenderHash: "",
    ticketHash: "",
    ticketTx: {},
    spenderTx: {},
    ticketPrice: 6925100364,
    ticketReward: 3062042,
    ticketChange: 0,
    ticketInvestment: 6925103344,
    ticketTxFee: 2980,
    ticketStakeRewards: 0.0004421655313856064,
    ticketReturnAmount: 6928165386,
    voteChoices: null,
    spenderTxFee: 0,
    enterTimestamp: 1635785606,
    leaveTimestamp: 1635929199,
    status: "voted",
    rawTx: "",
    tx: {},
    txType: "vote",
    isPending: false,
    accountName: "mixed",
    txInputs: [
      {
        accountName: "default",
        amount: 6925100364,
        index: 1
      }
    ],
    txOutputs: [
      {
        accountName: "mixed",
        amount: 6928165386,
        address: "",
        index: 2
      }
    ],
    txHeight: 802545,
    txUrl: "",
    txBlockUrl: "",
    isStake: true
  }
];
