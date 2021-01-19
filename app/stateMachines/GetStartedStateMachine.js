import { Machine, assign, spawn } from "xstate";
import { CreateWalletMachine } from "stateMachines/CreateWalletStateMachine";

export const getStartedMachine = Machine({
  id: "getStarted",
  initial: "startMachine",
  context: {
    // createWalletRef represents the a ref to the createWallet state
    // machine.
    createWalletRef: null,
    credentials: {},
    selectedWallet: null,
    appdata: null,
    error: null,
    isCreateNewWallet: null,
    isSPV: null,
    isAdvancedDaemon: null
  },
  states: {
    // startMachine represents the state with daemon and wallet starting operations.
    startMachine: {
      initial: "preStart",
      on: {
        SHOW_SETTINGS: "settings",
        SHOW_LOGS: "logs",
        SHOW_TREZOR_CONFIG: "trezorConfig",
        SHOW_RELEASE_NOTES: "releaseNotes",
        SHOW_CREATE_WALLET: "creatingWallet",
        SET_MIXED_ACCOUNT: {
          target: "settingMixedAccount"
        },
        GO_TO_HOME_VIEW: "goToHomeView"
      },
      states: {
        preStart: {
          onEntry: "isAtPreStart",
          on: {
            START_SPV: {
              target: "startSpv",
              cond: (c, event) => !!event.isSPV,
              actions: assign({
                isSPV: (context, event) =>
                  event.isSPV ? !!event.isSPV : context.isSPV
              })
            },
            START_ADVANCED_DAEMON: {
              target: "startAdvancedDaemon",
              cond: (c, event) => !!event.isAdvancedDaemon,
              actions: assign({
                isAdvancedDaemon: (context, event) =>
                  event.isAdvancedDaemon
                    ? !!event.isAdvancedDaemon
                    : context.isAdvancedDaemon,
                error: (context, event) => event.error
              })
            },
            START_REGULAR_DAEMON: {
              target: "startingDaemon",
              cond: (c, event) => !event.isAdvancedDaemon && !event.isSPV
            },
            START_CLI_REMOTE_DAEMON: {
              target: "connectingDaemon",
              cond: (c, event) => !!event.remoteCredentials
            },
            CHOOSE_WALLET: {
              target: "choosingWallet",
              actions: assign({
                isAdvancedDaemon: (context, event) =>
                  event.isAdvancedDaemon
                    ? !!event.isAdvancedDaemon
                    : context.isAdvancedDaemon,
                isSPV: (context, event) =>
                  event.isSPV ? !!event.isSPV : context.isSPV,
                selectedWallet: (context, event) =>
                  event.selectedWallet
                    ? event.selectedWallet
                    : context.selectedWallet,
                error: (context, event) => event.error
              })
            }
          }
        },
        startSpv: {
          onEntry: "isAtStartSPV",
          on: {
            CONTINUE: "choosingWallet"
          }
        },
        startingDaemon: {
          onEntry: "isAtStartingDaemon",
          on: {
            START_ADVANCED_DAEMON: "startAdvancedDaemon",
            CONNECT_DAEMON: {
              target: "connectingDaemon",
              actions: assign({
                credentials: (context, event) =>
                  event.credentials ? event.credentials : context.credentials,
                appdata: (context, event) =>
                  event.appdata ? event.appdata : context.appdata
              })
            },
            ERROR_STARTING_DAEMON: "daemonError"
          }
        },
        // This state is needed to better treat errors. If we are in advanced
        // mode, we will be sent back to startAdvancedDaemon state. Otherwise,
        // we send it to Error Page.
        daemonError: {
          onEntry: "isAtDaemonError",
          on: {
            START_ADVANCED_DAEMON: {
              target: "startAdvancedDaemon",
              actions: assign({
                error: (context, event) => event.payload.error
              })
            }
          }
        },
        startAdvancedDaemon: {
          onEntry: "isAtStartAdvancedDaemon",
          on: {
            SUBMIT_REMOTE: "connectingDaemon",
            SUBMIT_APPDATA: {
              target: "startingDaemon",
              actions: assign({
                appdata: (context, event) =>
                  event.appdata ? event.appdata : context.appdata
              })
            },
            CONTINUE: "startingDaemon"
          }
        },
        connectingDaemon: {
          onEntry: "isAtConnectingDaemon",
          on: {
            SYNC_DAEMON: {
              target: "syncingDaemon",
              actions: assign({
                error: (context, event) => event.error && event.error
              })
            },
            ERROR_CONNECTING_DAEMON: "daemonError"
          }
        },
        checkingNetworkMatch: {
          onEntry: "isAtCheckNetworkMatch",
          on: {
            CHOOSE_WALLET: "choosingWallet",
            ERROR_NETWORK_DAEMON: "daemonError"
          }
        },
        syncingDaemon: {
          onEntry: "isAtSyncingDaemon",
          on: {
            CHECK_NETWORK_MATCH: {
              target: "checkingNetworkMatch",
              actions: assign({
                error: (context, event) => event.error && event.error
              })
            },
            ERROR_SYNCING_DAEMON: "daemonError"
          }
        },
        // We have a step before wallet creation, which creates wallet directory and config.
        // preCreateWallet state is responsible to deal with that.
        preCreateWallet: {
          on: {
            BACK: "choosingWallet",
            ERROR: {
              target: "preCreateWallet",
              actions: assign({
                error: (context, event) => event.error && event.error
              })
            }
          }
        },
        choosingWallet: {
          onEntry: "isAtChoosingWallet",
          on: {
            SUBMIT_CHOOSE_WALLET: {
              target: "startingWallet",
              actions: assign({
                selectedWallet: (context, event) =>
                  event.selectedWallet
                    ? event.selectedWallet
                    : context.selectedWallet,
                error: (context, event) => event.error
              })
            },
            CREATE_WALLET: {
              target: "preCreateWallet",
              actions: assign({
                isCreateNewWallet: (context, event) =>
                  typeof event.isNew !== "undefined"
                    ? event.isNew
                    : context.isCreateNewWallet
              })
            },
            ERROR: {
              target: "choosingWallet",
              actions: assign({
                error: (_, event) => event.error
              })
            }
          }
        },
        startingWallet: {
          onEntry: "isAtStartWallet",
          on: {
            SYNC_RPC: "syncingRPC",
            WALLET_PUBPASS_INPUT: "walletPubpassInput",
            WALLET_DISCOVERACCOUNTS_PASS: "walletDiscoverAccountsPassInput",
            ERROR: {
              target: "choosingWallet",
              actions: assign({
                error: (context, event) => event.error
              })
            }
          }
        },
        walletPubpassInput: {
          onEntry: "isAtWalletPubpassInput",
          on: {
            WALLET_DISCOVERACCOUNTS_PASS: "walletDiscoverAccountsPassInput",
            CONTINUE: "syncingRPC",
            ERROR: {
              target: "walletPubpassInput",
              actions: assign({
                error: (context, event) => event.error && event.error
              })
            }
          }
        },
        walletDiscoverAccountsPassInput: {
          onEntry: "isAtWalletDiscoverAccountsPassInput",
          on: {
            SETPASSPHRASE: {
              target: "syncingRPC",
              actions: assign({
                passPhrase: (context, event) => event.passPhrase
              })
            },
            ERROR: {
              target: "walletDiscoverAccountsPassInput",
              actions: assign({
                error: (context, event) => event.error && event.error
              })
            }
          }
        },
        syncingRPC: {
          onEntry: "isSyncingRPC",
          on: {
            WALLET_DISCOVERACCOUNTS_PASS: "walletDiscoverAccountsPassInput",
            ERROR_SYNCING_WALLET: {
              target: "choosingWallet",
              actions: assign({
                error: (context, event) => event.error && event.error
              })
            }
          }
        },
        // history state so we can go back in the specific state when going to other view, like settings or log
        // source: https://xstate.js.org/docs/guides/history.html#history
        hist: {
          type: "history"
        }
      }
      // end of startMachine states
    },
    creatingWallet: {
      initial: "creatingWallet",
      states: {
        creatingWallet: {
          entry: assign({
            createWalletRef: (ctx, e) => {
              let spawnedMachine;
              // spawn a new actor machine so we can comunicate with the
              // getStartedMachine.

              // source: https://xstate.js.org/docs/guides/actors.html#spawning-machines
              try {
                spawnedMachine = spawn(
                  CreateWalletMachine.withContext({
                    isNew: e.isNew,
                    walletMasterPubKey: e.walletMasterPubKey,
                    isTrezor: e.isTrezor
                  })
                );
              } catch (e) {
                console.log(e);
              }
              return spawnedMachine;
            }
          })
        }
      },
      on: {
        BACK: "startMachine.choosingWallet",
        WALLET_CREATED: {
          target: "startMachine.preStart",
          actions: assign({
            passPhrase: (context, event) => event.passPhrase
          })
        },
        ERROR: {
          target: "startMachine.preCreateWallet",
          actions: assign({
            error: (context, event) => event.error && event.error
          })
        }
      }
    },
    // XXX
    // make a machine for final configurations, similar to how we create
    // the create wallet machine, so we can set mix accounts sync vsp and
    // any other config which may come.
    settingMixedAccount: {
      onEntry: "isAtSettingAccount",
      initial: "settingMixedAccount",
      states: {
        settingMixedAccount: {}
      },
      on: {
        CONTINUE: "syncVSPTickets"
      }
    },
    syncVSPTickets: {
      onEntry: "isAtSyncingVSPTickets",
      initial: "syncingVSPTickets",
      states: {
        syncingVSPTickets: {}
      },
      on: {
        FINISH: "goToHomeView",
        CONTINUE: "processingManagedTickets"
      }
    },
    processingManagedTickets: {
      onEntry: "isAtProcessingManagedTickets",
      initial: "processingManagedTickets",
      states: {
        processingManagedTickets: {}
      },
      on: {
        BACK: "processingUnmanagedTickets",
        CONTINUE: "isLoadingConfig"
      }
    },
    processingUnmanagedTickets: {
      onEntry: "isAtProcessingUnmanagedTickets",
      initial: "processingUnmanagedTickets",
      states: {
        processingUnmanagedTickets: {}
      },
      on: {
        CONTINUE: "isLoadingConfig",
        BACK: "goToHomeView"
      }
    },
    isLoadingConfig: {
      onEntry: "isAtLoadingConfig",
      initial: "isLoadingConfig",
      states: {
        isLoadingConfig: {}
      },
      on: {
        FINISH: "goToHomeView",
        CONTINUE: "processingUnmanagedTickets"
      }
    },
    releaseNotes: {
      initial: "releaseNotes",
      states: {
        releaseNotes: {}
      },
      on: {
        BACK: "startMachine.hist"
      }
    },
    trezorConfig: {
      initial: "trezorConfig",
      states: {
        trezorConfig: {}
      },
      on: {
        BACK: "startMachine.hist",
        SHOW_TREZOR_CONFIG: "trezorConfig"
      }
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
    // goToHomeView goes to home view. We do that, instead of going to a final
    // state, because the machine can still be called, like when a refresh
    // happens in dev mode.
    goToHomeView: {
      onEntry: "isAtFinishMachine"
    }
  }
});
