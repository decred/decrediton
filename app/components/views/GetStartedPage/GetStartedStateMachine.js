import { Machine } from "xstate";
import { CreateWalletMachine } from "./CreateWallet/CreateWalletStateMachine";

export const getStartedMachine = ({
  preStartDaemon, onStartDaemon, sendEvent, goToError, onConnectDaemon, checkNetworkMatch, syncDaemon,
  onGetAvailableWallets, setSelectedWallet, onStartWallet, onRetryStartRPC, goToSettings, backToCredentials
}) => Machine({
  id: "getStarted",
  initial: "startMachine",
  context: {
    credentials: {},
    selectedWallet: null,
    appdata: null,
    error: null
  },
  states: {
    // startMachine represents the state with daemon and wallet starting operations.
    startMachine: {
      initial: "preStart",
      on: {
        SHOW_SETTINGS: "settings",
        SHOW_LOGS: "logs"
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
            CHOOSE_WALLET: "choosingWallet"
          }
        },
        startSpv: {
          onEntry: "isAtStartSPV"
        },
        startingDaemon: {
          onEntry: "isAtStartingDaemon",
          on: {
            START_ADVANCED_DAEMON: "startAdvancedDaemon",
            CONNECT_DAEMON: "connectingDaemon",
            ERROR_STARTING_DAEMON: "errorStartingDaemon"
          }
        },
        errorStartingDaemon: {
          onEntry: "isAtErrorStartingDaemon",
          on: {
            START_ADVANCED_DAEMON: "startAdvancedDaemon"
          }
        },
        startedDaemon: {
          onEntry: "isStartedDaemon",
          on: {
            CONNECT_DAEMON: "connectingDaemon"
          }
        },
        startAdvancedDaemon: {
          onEntry: "isAtStartAdvancedDaemon",
          on: {
            SUBMIT_REMOTE: "connectingDaemon",
            SUBMIT_APPDATA: "startingDaemon"
          }
        },
        connectingDaemon: {
          onEntry: "isAtConnectingDaemon",
          on: {
            SYNC_DAEMON: "syncingDaemon",
            ERROR_CONNECTING_DAEMON: "startAdvancedDaemon"
          }
        },
        checkingNetworkMatch: {
          onEntry: "isAtCheckNetworkMatch",
          on: {
            CHOOSE_WALLET: "choosingWallet"
          }
        },
        syncingDaemon: {
          onEntry: "isAtSyncingDaemon",
          on: {
            CHECK_NETWORK_MATCH: "checkingNetworkMatch"
          }
        },
        creatingWallet: {
          onEntry: "isAtCreatingWallet",
          on: {
            WALLET_CREATED: "syncingRPC"
          },
          ...CreateWalletMachine
        },
        choosingWallet: {
          onEntry: "isAtChoosingWallet",
          onExit: "isAtLeavingChoosingWallet",
          on: {
            SUBMIT_CHOOSE_WALLET: "startingWallet",
            CREATE_CHOSEN_WALLET: "creatingWallet",
            CREATE_WALLET: "creatingWallet"
          }
        },
        startingWallet: {
          onEntry: "isAtStartWallet",
          on: {
            SYNC_RPC: "syncingRPC"
          }
        },
        syncingRPC: {
          onEntry: "isSyncingRPC",
          on: {
            // CHOOSE_WALLET: "choosingWallet",
          }
        },
        // history state so we can go back in the specific state when going to other view, like settings or log
        // source: https://xstate.js.org/docs/guides/history.html#history
        hist: {
          type: 'history',
        },
      },
    // end of startMachine states 
    },
    settings: {
      initial: "settings",
      states: {
        settings: {}
      },
      on: {
        BACK: "startMachine.hist",
        SHOW_LOGS: "logs"
      }
    },
    logs: {
      initial: "logs",
      states: {
        logs: {}
      },
      on: {
        BACK: "startMachine.hist",
        SHOW_SETTINGS: "settings"
      }
    },
  }
},
{
  actions: {
    isAtPreStart: () => {
      console.log("is at pre start");
      return preStartDaemon();
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
      return onStartDaemon({ appdata })
        .then(started => {
          const { credentials, appdata } = started;
          context.credentials = credentials;
          context.appdata = appdata;
          sendEvent({ type: "CONNECT_DAEMON", payload: started });
        })
        .catch(
          error => sendEvent({ type: "ERROR_STARTING_DAEMON", payload: { error } })
        );
    },
    isAtErrorStartingDaemon: (context) => {
      console.log("is at error starting daemon");
      const { appdata } = context;
      if (appdata) {
        sendEvent({ type: "START_ADVANCED_DAEMON" });
      }
      return goToError();
    },
    isStartedDaemon: () => {
      console.log("is at started daemon");
    },
    isAtConnectingDaemon: (context, event) => {
      console.log(" is at connect daemon ");
      const { remoteCredentials } = event;
      remoteCredentials && (context.credentials = remoteCredentials);
      return onConnectDaemon(remoteCredentials)
        .then(connected => {
          sendEvent({ type: "SYNC_DAEMON", payload: connected });
        })
        .catch(error =>
          sendEvent({ type: "ERROR_CONNECTING_DAEMON", payload: { error } })
        );
    },
    isAtCheckNetworkMatch: () => {
      console.log(" is at check network ");
      return checkNetworkMatch()
        .then( checked => sendEvent({ type: "CHOOSE_WALLET", payload: { checked } }))
        .catch(e => console.log(e));
    },
    isAtSyncingDaemon: () => {
      console.log(" is at syncing daemon ");
      syncDaemon()
        .then(synced => sendEvent({ type: "CHECK_NETWORK_MATCH", payload: synced }))
        .catch(e => console.log(e));
    },
    isAtChoosingWallet: (context, event) => {
      console.log("is at choosingWallet");
      onGetAvailableWallets()
        .then(w => sendEvent({ type: "CHOOSE_WALLET", payload: { w } }) )
        .catch(e => console.log(e));
      const { selectedWallet } = event;
      if (selectedWallet) {
        context.selectedWallet = selectedWallet;
        return sendEvent({ type: "SUBMIT_CHOOSE_WALLET" });
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
      setSelectedWallet(selectedWallet);

      onStartWallet(selectedWallet)
        .then(r => {
          sendEvent({ type: "SYNC_RPC", r });
        })
        .catch(err => console.log(err));
    },
    isSyncingRPC: () => {
      console.log("is at syncing rpc");
      onRetryStartRPC();
    },
  }
});
