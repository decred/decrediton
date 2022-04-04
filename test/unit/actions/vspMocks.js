import {
  LIVE,
  UNMINED,
  IMMATURE,
  VOTED,
  MISSED,
  EXPIRED,
  REVOKED
} from "constants";

export const mockVspInfo = {
  data: {
    pubkey: "test-pubkey"
  }
};

export const defaultMockAvailableMainnetVsps = [
  {
    host: "test-stakepool1.eu",
    label: "test-stakepool1.eu",
    outdated: false,
    vspData: {
      feepercentage: 2,
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool2.eu",
    label: "test-stakepool2.eu",
    outdated: false,
    vspData: {
      feepercentage: 3,
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool3.eu",
    label: "test-stakepool3.eu",
    outdated: false,
    vspData: {
      feepercentage: 4,
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool4.eu",
    label: "test-stakepool4.eu",
    outdated: false,
    vspData: {
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool5.eu",
    label: "test-stakepool5.eu",
    outdated: false,
    vspData: {
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool6.eu",
    label: "test-stakepool6.eu",
    outdated: true,
    vspData: {
      feepercentage: 1, // this vsp is outdated, so it's not going to be
      // chosen in randomVSP despite the low fee percentage
      network: "mainnet",
      vspdversion: "1.0.0"
    }
  }
];

export const defaultMockAvailableTestnetVsps = [
  {
    host: "test-stakepool6.eu",
    label: "test-stakepool6.eu",
    outdated: false,
    vspData: {
      feepercentage: 4,
      network: "testnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool7.eu",
    label: "test-stakepool7.eu",
    outdated: false,
    vspData: {
      feepercentage: 5,
      network: "testnet",
      vspdversion: "1.1.0"
    }
  }
];

export const defaultMockAvailableInvalidVsps = [
  {
    host: "test-stakepool8.eu",
    label: "test-stakepool8.eu"
  }
];

export const mockTickets = [
  {
    status: LIVE,
    ticket: {
      txHash: "tx-hash-1",
      vspHost: `https://${defaultMockAvailableMainnetVsps[0].host}`
    }
  },
  {
    status: IMMATURE,
    ticket: {
      txHash: "tx-hash-2",
      vspHost: `https://${defaultMockAvailableMainnetVsps[1].host}`
    }
  },
  {
    status: UNMINED,
    ticket: {
      txHash: "tx-hash-3",
      vspHost: `https://${defaultMockAvailableMainnetVsps[1].host}`
    }
  },
  // vspHost is outdated
  {
    status: LIVE,
    ticket: {
      txHash: "tx-hash-4",
      vspHost: `https://${defaultMockAvailableMainnetVsps[5].host}`
    }
  },
  // vspHost is ""
  {
    status: LIVE,
    ticket: {
      txHash: "tx-hash-5",
      vspHost: ""
    }
  },
  // missing vspHost
  {
    status: LIVE,
    ticket: {
      txHash: "tx-hash-6"
    }
  },
  // spent/expired tickets
  {
    status: VOTED,
    ticket: {
      txHash: "tx-hash-7",
      vspHost: `https://${defaultMockAvailableMainnetVsps[0].host}`
    }
  },
  {
    status: MISSED,
    ticket: {
      txHash: "tx-hash-7",
      vspHost: `https://${defaultMockAvailableMainnetVsps[0].host}`
    }
  },
  {
    status: EXPIRED,
    ticket: {
      txHash: "tx-hash-8",
      vspHost: `https://${defaultMockAvailableMainnetVsps[0].host}`
    }
  },
  {
    status: REVOKED,
    ticket: {
      txHash: "tx-hash-9",
      vspHost: `https://${defaultMockAvailableMainnetVsps[0].host}`
    }
  }
];
