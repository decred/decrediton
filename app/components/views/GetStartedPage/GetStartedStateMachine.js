import { Machine } from 'xstate';

export const submitRemoteCredentials = (mService, remoteCredentials) => mService.send({ type: "SUBMIT_REMOTE", remoteCredentials })

export const getStartedMachine = Machine({
  id: 'getStarted',
  initial: "preStart",
  context: {
    credentials: {},
    selectedWallet: null,
  },
  states: {
    preStart: {
      onEntry: "isAtPreStart",
      on: {
        START_SPV: {
          target: "startSpv",
          cond: (c, event) => !!event.isSPV
        },
        START_ADVANCED_DAEMON: {
          target: "startAdvancedDaemon",
          cond: (c, event) => !!event.isAdvancedDaemon
        },
        START_DAEMON: {
          target: "startingDaemon",
          cond: (c, event) => !event.isAdvancedDaemon && !event.isSPV
        }
      },
    },
    startSpv: {
      onEntry: "isAtStartSPV",
    },
    startingDaemon: {
      onEntry: "isAtStartingDaemon",
      on: {
        STARTED_DAEMON: "startedDaemon",
        START_ADVANCED_DAEMON: "startAdvancedDaemon",
      }
    },
    startedDaemon: {
      onEntry: "isStartedDaemon",
      on: {
        CONNECT_DAEMON: "connectingDaemon",
      }
    },
    startAdvancedDaemon: {
      onEntry: "isAtStartAdvancedDaemon",
      on: {
        SUBMIT_REMOTE: "connectingDaemon",
        SUBMIT_APPDATA: "startingDaemon",
      }
    },
    connectingDaemon: {
      onEntry: "isAtConnectDaemon",
      on: {
        CHECK_NETWORK_MATCH: "checkingNetworkMatch",
      }
    },
    checkingNetworkMatch: {
      onEntry: "isAtCheckNetworkMatch",
      on: {
        SYNC_DAEMON: "syncingDaemon",
      }
    },
    syncingDaemon: {
      onEntry: "isAtSyncingDaemon",
      on: {
        CHOOSE_WALLET: "choosingWallet",
      }
    },
    choosingWallet: {
      onExit: "isAtLeavingChoosingWallet",
      on: {
        SUBMIT_CHOOSE_WALLET: "startingWallet",
      }
    },
    startingWallet: {
      onEntry: "isAtStartWallet",
      on: {
        SYNC_RPC: "syncingRPC",
      }
    },
    syncingRPC: {
      onEntry: "isSyncingRPC",
      on: {
        // CHOOSE_WALLET: "choosingWallet",
      }
    },
  },
},
{
  actions: {
    isAtPreStart: (context, event) => {
      console.log("is at pre start");
    },
    isAtStartAdvancedDaemon: (context, event) => {
      console.log("is at start advanced daemon");
    },
    isAtStartSPV: (context, event) => {
      console.log("is at start SPV");
    },
    isAtStartingDaemon: (context, event) => {
      console.log("is at start  At Starting Daemonn");
    },
    isStartedDaemon: (context, event) => {
      console.log("is at started daemon");
    },
    isAtStartAdvancedDaemon: (context, event) => {
      console.log("is at start advanced daemon");
    },
    isAtConnectDaemon: (context, event) => {
      context.credentials = event.remoteCredentials
      console.log(" is at connect daemon ")
    },
    isAtCheckNetworkMatch: (context, event) => {
      console.log(context)
      console.log(" is at check network ")
    },
    isAtSyncingDaemon: (context, event) => {
      console.log(" is at syncing daemon ")
    },
    isAtLeavingChoosingWallet: (context, event) => {
      console.log("is leaving choosing wallet")
      context.selectedWallet = event.selectedWallet;
    },
    isAtChoosingWallet: (context, event) => {
      console.log("is At Choose Wallet")
    },
    isAtStartWallet: (context, event) => {
      console.log("is At Start Wallet")
    },
    isSyncingRPC: (context, event) => {
      console.log("is at syncing rpc")
    },    
  },
});
