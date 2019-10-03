import { Machine } from "xstate";

export const getStartedMachine = (a) => Machine({
  id: "getStarted",
  initial: "preStart",
  context: {
    credentials: {},
    selectedWallet: null,
    appdata: null,
    error: null,
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
        START_REGULAR_DAEMON: {
          target: "startingDaemon",
          cond: (c, event) => !event.isAdvancedDaemon && !event.isSPV
        },
        CHOOSE_WALLET: "choosingWallet",
      },
    },
    startSpv: {
      onEntry: "isAtStartSPV",
    },
    startingDaemon: {
      onEntry: "isAtStartingDaemon",
      on: {
        START_ADVANCED_DAEMON: "startAdvancedDaemon",
        CONNECT_DAEMON: "connectingDaemon",
        ERROR_STARTING_DAEMON: "errorStartingDaemon",
      }
    },
    errorStartingDaemon: {
      onEntry: "isAtErrorStartingDaemon",
      on: {
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
      onEntry: "isAtConnectingDaemon",
      on: {
        SYNC_DAEMON: "syncingDaemon",
        ERROR_CONNECTING_DAEMON: "startAdvancedDaemon",
      }
    },
    checkingNetworkMatch: {
      onEntry: "isAtCheckNetworkMatch",
      on: {
        CHOOSE_WALLET: "choosingWallet",
      }
    },
    syncingDaemon: {
      onEntry: "isAtSyncingDaemon",
      on: {
        CHECK_NETWORK_MATCH: "checkingNetworkMatch",
      }
    },
    choosingWallet: {
      onEntry: "isAtChoosingWallet",
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
      console.log("is at pre start");
      return a.preStartDaemon();
    },
    isAtStartAdvancedDaemon: (context, event) => {
      console.log("is at start advanced daemon");
      context.error = event.payload && event.payload.error;
    },
    isAtStartSPV: () => {
      console.log("is at start SPV");
    },
    isAtStartingDaemon: (context, event) => {
      console.log("is at Starting Daemonn");
      const { appdata } = event;
      context.appdata = appdata;
      return a.onStartDaemon({ appdata })
        .then(started => {
          const { credentials, appdata } = started;
          context.credentials = credentials;
          context.appdata = appdata;
          a.sendEvent({ type: "CONNECT_DAEMON", payload: started });
        })
        .catch(
          error => a.sendEvent({ type: "ERROR_STARTING_DAEMON", payload: { error } })
        );
    },
    isAtErrorStartingDaemon: (context) => {
      console.log("is at error starting daemon");
      const { appdata } = context;
      if (appdata) {
        a.sendEvent({ type: "START_ADVANCED_DAEMON" });
      }
      return a.goToError();
    },
    isStartedDaemon: () => {
      console.log("is at started daemon");
    },
    isAtConnectingDaemon: (context, event) => {
      console.log(" is at connect daemon ");
      const { remoteCredentials } = event;
      remoteCredentials && (context.credentials = remoteCredentials);
      return a.onConnectDaemon(remoteCredentials)
        .then(connected => {
          a.sendEvent({ type: "SYNC_DAEMON", payload: connected });
        })
        .catch(error =>
          a.sendEvent({ type: "ERROR_CONNECTING_DAEMON", payload: { error } })
        );
    },
    isAtCheckNetworkMatch: () => {
      console.log(" is at check network ");
      return a.checkNetworkMatch()
        .then( checked => a.sendEvent({ type: "CHOOSE_WALLET", payload: { checked } }))
        .catch(e => console.log(e));
    },
    isAtSyncingDaemon: () => {
      console.log(" is at syncing daemon ");
      a.syncDaemon()
        .then(synced => a.sendEvent({ type: "CHECK_NETWORK_MATCH", payload: synced }))
        .catch(e => console.log(e));
    },
    isAtChoosingWallet: (context, event) => {
      console.log("is at choosingWallet");
      a.onGetAvailableWallets()
        .then(w => a.sendEvent({ type: "CHOOSE_WALLET", payload: { w } }) )
        .catch(e => console.log(e));
      const { selectedWallet } = event;
      if (selectedWallet) {
        context.selectedWallet = selectedWallet;
        return a.sendEvent({ type: "SUBMIT_CHOOSE_WALLET" });
      }
    },
    isAtLeavingChoosingWallet: (context, event) => {
      console.log("is leaving choosing wallet");
      if (!event.selectedWallet) {
        return;
      }
      context.selectedWallet = event.selectedWallet;
    },
    isAtStartWallet: (context) => {
      console.log("is At Start Wallet");
      const { selectedWallet } = context;
      a.setSelectedWallet(selectedWallet);

      a.onStartWallet(selectedWallet)
        .then(r => {
          a.sendEvent({ type: "SYNC_RPC", r });
        })
        .catch(err => console.log(err));
    },
    isSyncingRPC: () => {
      console.log("is at syncing rpc");
      a.onRetryStartRPC();
    },
  },
});
