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
