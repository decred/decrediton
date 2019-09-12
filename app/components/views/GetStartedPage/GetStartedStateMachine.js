import { Machine } from "xstate";

export const getStartedMachine = (a) => Machine({
  id: "getStarted",
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
    isAtPreStart: () => {
      // console.log(e)
      console.log("is at pre start");
      console.log(a);
      return a.prepStartDaemon();
    },
    isAtStartAdvancedDaemon: () => {
      console.log("is at start advanced daemon");
    },
    isAtStartSPV: () => {
      console.log("is at start SPV");
    },
    isAtStartingDaemon: () => {
      console.log("is at start  At Starting Daemonn");
    },
    isStartedDaemon: () => {
      console.log("is at started daemon");
    },
    isAtConnectDaemon: (context, event) => {
      console.log(" is at connect daemon ");
      const { remoteCredentials } = event;
      context.credentials = remoteCredentials;
      return a.onConnectDaemon(remoteCredentials)
        .then(connected => {
          console.log(context);
          console.log(event);
          a.sendEvent({ type: "CHECK_NETWORK_MATCH", payload: connected });
        })
        .catch(e => console.log(e));
    },
    isAtCheckNetworkMatch: () => {
      console.log(" is at check network ");
      return a.checkNetworkMatch()
        .then(checked => a.sendEvent({ type: "SYNC_DAEMON", payload: checked }))
        .catch(e => console.log(e));
    },
    isAtSyncingDaemon: () => {
      console.log(" is at syncing daemon ");
      a.syncDaemon().then( synced => {
        a.onGetAvailableWallets().
          then(w => a.sendEvent({ type: "CHOOSE_WALLET", payload: { synced, w } }));
      });
    },
    isAtLeavingChoosingWallet: (context, event) => {
      console.log("is leaving choosing wallet");
      context.selectedWallet = event.selectedWallet;
    },
    isAtChoosingWallet: () => {
      console.log("is At Choose Wallet");
    },
    isAtStartWallet: (context) => {
      console.log("is At Start Wallet");
      a.onStartWallet(context.selectedWallet).then(r => {
        a.sendEvent({ type: "SYNC_RPC", r });
      });
    },
    isSyncingRPC: (context, ) => {
      console.log("is at syncing rpc");
      a.onRetryStartRPC(context.credentials);
    },
  },
});
