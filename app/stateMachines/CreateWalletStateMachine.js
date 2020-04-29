import { Machine, assign } from "xstate";

// Hierarchical state machine called inside getStartedStateMachine.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const CreateWalletMachine = ({
  cancelCreateWallet,
  backToCredentials,
  generateSeed,
  sendEvent,
  checkIsValid,
  onCreateWatchOnly
}) =>
  Machine(
    {
      id: "getStarted",
      initial: "createWallet",
      context: {
        error: null,
        isNew: null,
        mnemonic: "",
        seed: "",
        passPhrase: ""
      },
      states: {
        createWallet: {
          onEntry: "isAtCreateWallet",
          on: {
            CREATE_WALLET: {
              target: "newWallet",
              cond: (c, event) => event.isNew
            },
            RESTORE_WATCHING_ONLY_WALLET: {
              target: "restoreWatchingOnly",
              cond: (c, event) => event.isWatchingOnly
            },
            RESTORE_TREZOR_WALLET: {
              target: "restoreTrezor",
              cond: (c, event) => event.isTrezor
            },
            RESTORE_WALLET: {
              target: "writeSeed",
              cond: (c, event) => event.isRestore
            }
          }
        },
        newWallet: {
          onEntry: "isAtNewWallet",
          on: {
            CONTINUE: "confirmSeed",
            BACK: "finished",
            GENERATED: "newWallet"
          }
        },
        writeSeed: {
          onEntry: "isAtWriteSeed",
          on: {
            CONTINUE: "creatingWallet",
            ERROR: "createWallet",
            BACK: "finished",
            VALIDATE_DATA: {
              target: "writeSeed",
              // assign new context value to each one;
              actions: [
                assign({
                  passPhrase: (context, event) =>
                    event.passPhrase
                      ? event.passPhrase
                      : context.passPhrase
                      ? context.passPhrase
                      : "",
                  seed: (context, event) =>
                    event.seed ? event.seed : context.seed ? context.seed : [],
                  error: (context, event) => {
                    console.log(event);
                    return event.error && event.error;
                  }
                })
              ]
            }
          }
        },
        confirmSeed: {
          onEntry: "isAtConfirmSeed",
          on: {
            CONTINUE: "creatingWallet",
            ERROR: "newWallet",
            BACK: {
              target: "newWallet",
              actions: [
                assign({
                  passPhrase: "",
                  seed: [],
                  error: ""
                })
              ]
            },
            VALIDATE_DATA: {
              target: "confirmSeed",
              // assign new context;
              actions: [
                assign({
                  passPhrase: (context, event) =>
                    event.passPhrase
                      ? event.passPhrase
                      : context.passPhrase
                      ? context.passPhrase
                      : "",
                  seed: (context, event) =>
                    event.seed ? event.seed : context.seed ? context.seed : [],
                  error: (context, event) => event.error && event.error
                })
              ]
            }
          }
        },
        restoreWatchingOnly: {
          onEntry: "isAtRestoreWatchingOnly",
          on: {
            CONTINUE: "creatingWallet"
          }
        },
        restoreTrezor: {
          onEntry: "isAtRestoreTrezor",
          on: {
            CONTINUE: "creatingWallet"
          }
        },
        creatingWallet: {
          onEntry: "isAtCreatingWallet",
          on: {
            CONTINUE: "walletCreated"
          }
        },
        walletCreated: {
          type: "final",
          onEntry: "isAtWalletCreated"
        },
        finished: {
          type: "final",
          onEntry: "isAtFinished"
        }
      }
    },
    {
      actions: {
        isAtCreateWallet: () => {
          console.log("is at create wallet");
        },
        isAtNewWallet: (context, event) => {
          // We only generate the seed once. If mnemonic already exists, we return it.
          if (context.mnemonic) return;
          generateSeed().then((response) => {
            // Allows verification skip in dev
            context.seed = event.isTestNet ? response.getSeedBytes() : null;
            const mnemonic = response.getSeedMnemonic();
            context.mnemonic = mnemonic;
            sendEvent({ type: "GENERATED" });
          });
        },
        isAtConfirmSeed: () => {
          checkIsValid();
        },
        isAtWriteSeed: () => {
          checkIsValid();
        },
        isAtRestoreWatchingOnly: () => {
          console.log("is at restoring watching only");
          onCreateWatchOnly();
        },
        isAtRestoreTrezor: () => {
          console.log("is at restoring trezor");
          onCreateWatchOnly();
        },
        isAtFinished: async () => {
          await cancelCreateWallet();
          backToCredentials();
        },
        isAtCreatingWallet: () => {
          console.log("creating wallet");
        },
        isAtWalletCreated: () => {
          backToCredentials();
        }
      }
    }
  );
