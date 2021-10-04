import * as lna from "actions/LNActions";

export const mockChannels = [
  {
    active: true,
    status: "active",
    remotePubkey: "mock-remote-pubkey-0",
    channelPoint: "cpa-0",
    chanId: "810928308391837696",
    capacity: 200000000,
    localBalance: 78996360,
    remoteBalance: 121000000,
    commitFee: 3640,
    commitSize: 364,
    feePerKb: 10000,
    unsettledBalance: 0,
    totalAtomsSent: 21000000,
    totalAtomsReceived: 0,
    numUpdates: 4,
    pendingHtlcsList: [],
    csvDelay: 751,
    pb_private: false,
    initiator: true,
    chanStatusFlags: "ChanStatusDefault",
    localChanReserveAtoms: 2000000,
    remoteChanReserveAtoms: 2000000,
    staticRemoteKey: true,
    commitmentType: 1,
    lifetime: 8583,
    uptime: 8579,
    closeAddress: "",
    pushAmountAtoms: 100000000,
    thawHeight: 0,
    localConstraints: {
      csvDelay: 751,
      chanReserveAtoms: 2000000,
      dustLimitAtoms: 6030,
      maxPendingAmtMAtoms: 198000000000,
      minHtlcMAtoms: 1000,
      maxAcceptedHtlcs: 150
    },
    remoteConstraints: {
      csvDelay: 751,
      chanReserveAtoms: 2000000,
      dustLimitAtoms: 6030,
      maxPendingAmtMAtoms: 198000000000,
      minHtlcMAtoms: 1000,
      maxAcceptedHtlcs: 150
    },
    channelPointURL: "mock-channelPointURL-0"
  }
];

export const mockPendingChannels = [
  {
    status: "pending",
    channel: {
      remoteNodePub: "mock-pending-channel-remote-node-pub-0",
      channelPoint: "cpp-0",
      capacity: 200000000,
      localBalance: 99996360,
      remoteBalance: 100000000,
      localChanReserveAtoms: 2000000,
      remoteChanReserveAtoms: 2000000,
      initiator: 1,
      commitmentType: 1
    },
    confirmationHeight: 0,
    commitFee: 3640,
    commitSize: 364,
    feePerKb: 10000,
    remoteNodePub: "mock-pending-channel-remove-node-pub-0",
    channelPoint: "cpp-0",
    capacity: 200000000,
    localBalance: 99996360,
    remoteBalance: 100000000,
    localChanReserveAtoms: 2000000,
    remoteChanReserveAtoms: 2000000,
    initiator: 1,
    commitmentType: 1,
    pendingStatus: "open",
    remotePubkey: "mock-pending-channel-remote-node-pub-0",
    channelPointURL: "mock-pending-channel-channel-point-url-0"
  }
];

export const mockClosedChannels = [
  {
    status: "closed",
    channelPoint: "cpc-0",
    chanId: "793520840301019137",
    chainHash: "mock-closed-channel-chain-hash-0",
    closingTxHash: "mock-closed-channel-closing-tx-hash",
    remotePubkey: "mock-closed-channel-remote-pub-key-0",
    capacity: 47384802,
    closeHeight: 721757,
    settledBalance: 47381162,
    timeLockedBalance: 0,
    closeType: lna.CLOSETYPE_COOPERATIVE_CLOSE,
    openInitiator: 1,
    closeInitiator: 1,
    resolutionsList: [],
    channelPointURL: "mock-closed-channel-channel-point-url-0",
    closingTxidURL: "mock-closed-channel-closingtx-url-0"
  }
];

export const mockLnChannelBalance = {
  balance: 99997360,
  pendingOpenBalance: 0,
  maxInboundAmount: 97999000,
  maxOutboundAmount: 97997360
};

export const mockDescribeGraph = {
  nodeList: [
    { pubKey: mockChannels[0].remotePubkey, alias: "mock-alias-0" },
    { pubKey: mockPendingChannels[0].remotePubkey, alias: "mock-alias-1" },
    { pubKey: mockClosedChannels[0].remotePubkey, alias: "mock-alias-2" }
  ]
};

export const mockOutstandingPayments = {
  "mock-outstanding-payment-hash-0": {
    decoded: {
      destination: "mock-destination-0",
      paymentHash: "mock-outstanding-payment-hash-0",
      numAtoms: 1000000,
      timestamp: 1628688648,
      expiry: 3600,
      description: "mock-outstanding-desc-0",
      descriptionHash: "",
      fallbackAddr: "",
      cltvExpiry: 80,
      routeHintsList: [],
      paymentAddr: "mock-payment-address-0",
      numMAtoms: 1000000000,
      featuresMap: [
        [
          15,
          {
            name: "payment-addr",
            isRequired: false,
            isKnown: true
          }
        ],
        [
          17,
          {
            name: "multi-path-payments",
            isRequired: false,
            isKnown: true
          }
        ],
        [
          9,
          {
            name: "tlv-onion",
            isRequired: false,
            isKnown: true
          }
        ]
      ]
    }
  }
};

export const mockPayments = [
  {
    paymentHash: "mock-payment-hash-0",
    value: 20000000,
    creationDate: 1627810765,
    fee: 0,
    paymentPreimage: "mock-preimage-0",
    valueAtoms: 20000000,
    valueMAtoms: 20000000000,
    paymentRequest: "mock-payment-request-0",
    status: 2,
    feeAtoms: 0,
    feeMAtoms: 0,
    creationTimeNs: 1627810765912116500,
    htlcsList: [
      {
        status: 1,
        route: {
          totalTimeLock: 738888,
          totalFees: 0,
          totalAmt: 20000000,
          hopsList: [
            {
              chanId: "810928308391837696",
              chanCapacity: 200000000,
              amtToForward: 20000000,
              fee: 0,
              expiry: 738888,
              amtToForwardMAtoms: 20000000000,
              feeMAtoms: 0,
              pubKey: "mock-pubkey-0",
              tlvPayload: true,
              mppRecord: {
                paymentAddr: "mock-payment-address-0",
                totalAmtMAtoms: 20000000000
              },
              customRecordsMap: []
            }
          ],
          totalFeesMAtoms: 0,
          totalAmtMAtoms: 20000000000
        },
        attemptTimeNs: 1627810765956084200,
        resolveTimeNs: 1627810766343210800,
        preimage: "mock-preimage-htlc-0"
      }
    ],
    paymentIndex: 4,
    failureReason: 0
  }
];

export const mockFailedPayment = [
  {
    paymentError: "mock-payment-error",
    decoded: {
      destination: "mock-destination",
      paymentHash: "mock-payment-hash",
      numAtoms: 10,
      timestamp: 1628512835,
      expiry: 3600,
      description: "mock-failed-desc",
      descriptionHash: "",
      fallbackAddr: "",
      cltvExpiry: 80,
      routeHintsList: [],
      paymentAddr: "mock-payment-address",
      numMAtoms: 10000,
      featuresMap: [
        [
          15,
          {
            name: "payment-addr",
            isRequired: false,
            isKnown: true
          }
        ],
        [
          17,
          {
            name: "multi-path-payments",
            isRequired: false,
            isKnown: true
          }
        ],
        [
          9,
          {
            name: "tlv-onion",
            isRequired: false,
            isKnown: true
          }
        ]
      ]
    }
  }
];

export const mockInvoices = [
  {
    memo: "mock-memo-1",
    rHash: "mock-rhash-1",
    value: 10000000,
    valueMAtoms: 10000000000,
    settled: false,
    creationDate: 1626706566,
    settleDate: 0,
    paymentRequest: "mock-payment-request1",
    descriptionHash: "",
    expiry: 3600,
    fallbackAddr: "",
    cltvExpiry: 80,
    routeHintsList: [],
    pb_private: false,
    addIndex: 28,
    settleIndex: 0,
    amtPaid: 0,
    amtPaidAtoms: 0,
    amtPaidMAtoms: 0,
    state: 0,
    htlcsList: [],
    ignoreMaxInboundAmt: false,
    featuresMap: [],
    isKeysend: false,
    status: "open",
    rHashHex: "mock-rhash-hex-1"
  },
  {
    memo: "mock-memo-2",
    rPreimage: "mock-rpreimage-2",
    rHash: "mock-rhash-21",
    value: 1000,
    valueMAtoms: 1000000,
    settled: true,
    creationDate: 1626706536,
    settleDate: 1626706576,
    paymentRequest: "mock-payment-request2",
    descriptionHash: "",
    expiry: 3600,
    fallbackAddr: "",
    cltvExpiry: 80,
    routeHintsList: [],
    pb_private: false,
    addIndex: 27,
    settleIndex: 1,
    amtPaid: 1000000,
    amtPaidAtoms: 1000,
    amtPaidMAtoms: 1000000,
    state: 1,
    ignoreMaxInboundAmt: false,
    isKeysend: false,
    status: "settled",
    rHashHex: "mock-rhash-hex-21"
  },
  {
    memo: "mock-memo-3",
    rPreimage: "mock-ppreimage-3",
    rHash: "mock-rhash-22",
    value: 1000,
    valueMAtoms: 1000000,
    settled: false,
    creationDate: 1626703527,
    settleDate: 0,
    paymentRequest: "mock-payment-request3",
    descriptionHash: "",
    expiry: 3600,
    fallbackAddr: "",
    cltvExpiry: 80,
    routeHintsList: [],
    pb_private: false,
    addIndex: 26,
    settleIndex: 0,
    amtPaid: 0,
    amtPaidAtoms: 0,
    amtPaidMAtoms: 0,
    state: 2,
    htlcsList: [],
    ignoreMaxInboundAmt: false,
    isKeysend: false,
    status: "canceled",
    rHashHex: "mock-rhash-hex-22"
  }
];

export const mockNetworkInfo = {
  graphDiameter: 0,
  avgOutDegree: 2.342857142857143,
  maxOutDegree: 29,
  numNodes: 35,
  numChannels: 41,
  totalNetworkCapacity: 15084830016,
  avgChannelSize: 367922683.31707317,
  minChannelSize: 100000,
  maxChannelSize: 1073741823,
  medianChannelSizeSat: 200000000,
  numZombieChans: 2
};
