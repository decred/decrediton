import { Machine, assign } from "xstate";
import { CreateWalletMachine } from "stateMachines/CreateWalletStateMachine";
import { OPENWALLET_INPUT } from "actions/WalletLoaderActions";

export const getStartedMachine = ({
  preStartDaemon,
  onStartDaemon,
  sendEvent,
  goToErrorPage,
  onConnectDaemon,
  checkNetworkMatch,
  syncDaemon,
  onGetAvailableWallets,
  setSelectedWallet,
  onStartWallet,
  onRetryStartRPC,
  startSPVSync
}) =>
  Machine(
    {
      id: "getStarted",
      initial: "startMachine",
      context: {
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
            SHOW_RELEASE_NOTES: "releaseNotes"
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
                        : context.selectedWallet
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
                      event.credentials
                        ? event.credentials
                        : context.credentials,
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
                  actions: assign({ error: (context, event) => event.error })
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
                }
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
              onEntry: "isAtPreCreateWallet",
              on: {
                CONTINUE: "creatingWallet",
                BACK: "choosingWallet",
                ERROR: {
                  target: "preCreateWallet",
                  actions: assign({
                    error: (context, event) => event.error && event.error
                  })
                }
              }
            },
            creatingWallet: {
              onEntry: "isAtCreatingWallet",
              on: {
                ERROR: {
                  target: "preCreateWallet",
                  actions: assign({
                    error: (context, event) => event.error && event.error
                  })
                }
              },
              ...CreateWalletMachine
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
                        : context.selectedWallet
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
                }
              }
            },
            startingWallet: {
              onEntry: "isAtStartWallet",
              on: {
                SYNC_RPC: "syncingRPC",
                WALLET_PUBPASS_INPUT: "walletPubpassInput",
                ERROR_STARTING_WALLET: {
                  target: "choosingWallet",
                  actions: assign({ error: (context, event) => event.error })
                }
              }
            },
            walletPubpassInput: {
              onEntry: "isAtWalletPubpassInput",
              on: {
                CONTINUE: "syncingRPC",
                ERROR: {
                  target: "walletPubpassInput",
                  actions: assign({
                    error: (context, event) => event.error && event.error
                  })
                }
              }
            },
            syncingRPC: {
              onEntry: "isSyncingRPC",
              on: {
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
        }
      }
    },
    {
      actions: {
        isAtPreStart: () => {
          console.log("is at pre start");
          return preStartDaemon();
        },
        isAtStartSPV: () => {
          sendEvent({ type: "CONTINUE" });
        },
        isAtStartingDaemon: (context, event) => {
          console.log("is at Starting Daemonn");
          const { appdata } = event;
          return onStartDaemon({ appdata })
            .then((started) => {
              const { credentials, appdata } = started;
              sendEvent({
                type: "CONNECT_DAEMON",
                payload: { started, credentials, appdata }
              });
            })
            .catch((error) =>
              sendEvent({ type: "ERROR_STARTING_DAEMON", payload: { error } })
            );
        },
        isAtDaemonError: (context, event) => {
          console.log("is at daemon error");
          if (!event) return;
          const { error } = event;
          if (!error) return;
          const { isAdvancedDaemon } = context;
          // We send the user to the error page if decrediton is not in advanced mode.
          if (!isAdvancedDaemon) {
            return goToErrorPage();
          }
          sendEvent({ type: "START_ADVANCED_DAEMON", payload: { error } });
        },
        isAtConnectingDaemon: (context, event) => {
          console.log(" is at connect daemon ");
          const { remoteCredentials } = event;
          return onConnectDaemon(remoteCredentials)
            .then(() => {
              sendEvent({ type: "SYNC_DAEMON" });
            })
            .catch((error) =>
              sendEvent({ type: "ERROR_CONNECTING_DAEMON", payload: { error } })
            );
        },
        isAtCheckNetworkMatch: () => {
          console.log(" is at check network ");
          // TODO add error when network does not match
          return checkNetworkMatch()
            .then(() => sendEvent({ type: "CHOOSE_WALLET" }))
            .catch((error) =>
              sendEvent({ type: "ERROR_NETWORK_DAEMON", payload: { error } })
            );
        },
        isAtSyncingDaemon: () => {
          console.log(" is at syncing daemon ");
          syncDaemon()
            .then(() => sendEvent({ type: "CHECK_NETWORK_MATCH" }))
            .catch((error) =>
              sendEvent({ type: "ERROR_SYNCING_DAEMON", payload: { error } })
            );
        },
        isAtChoosingWallet: (context, event) => {
          console.log("is at choosingWallet");
          const { selectedWallet } = event;
          if (selectedWallet) {
            return sendEvent({ type: "SUBMIT_CHOOSE_WALLET", selectedWallet });
          }
          onGetAvailableWallets()
            .then((w) => sendEvent({ type: "CHOOSE_WALLET", payload: { w } }))
            .catch((e) => console.log(e));
        },
        isAtStartWallet: (context) => {
          console.log("is At Start Wallet");
          const { selectedWallet } = context;
          setSelectedWallet(selectedWallet);

          onStartWallet(selectedWallet)
            .then((r) => {
              sendEvent({ type: "SYNC_RPC", r });
            })
            .catch((error) => {
              // If error is OPENWALLET_INPUT, the wallet has a pubpass and we
              // switch states, for inputing it and open the wallet.
              if (error === OPENWALLET_INPUT) {
                return sendEvent({ type: "WALLET_PUBPASS_INPUT" });
              }
              sendEvent({ type: "ERROR_STARTING_WALLET", payload: { error } });
            });
        },
        isSyncingRPC: (context) => {
          if (context.isSPV) {
            return startSPVSync()
              .then((r) => r)
              .catch((error) =>
                sendEvent({ type: "ERROR_SYNCING_WALLET", payload: { error } })
              );
          }
          onRetryStartRPC()
            .then((r) => r)
            .catch((error) =>
              sendEvent({ type: "ERROR_SYNCING_WALLET", payload: { error } })
            );
        }
      }
    }
  );
