import { Machine, assign, sendParent } from "xstate";

// Hierarchical state machine called inside getStartedStateMachine.
// This is done this way so we can exchange passPhrase between them without
// the need of dispatching it to other place.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const CreateWalletMachine = Machine({
  id: "getStarted",
  initial: "createWalletInit",
  context: {
    error: null,
    isNew: null,
    mnemonic: "",
    seed: "",
    passPhrase: "",
    walletMasterPubKey: "",
    isTrezor: false,
    isLedger: false
  },
  states: {
    createWalletInit: {
      on: {
        CREATE_WALLET: {
          target: "generateNewSeed",
          cond: (c, event) => event.isNew
        },
        RESTORE_WATCHING_ONLY_WALLET: {
          target: "restoreWatchingOnly",
          cond: (c, event) => event.isWatchingOnly
        },
        RESTORE_WALLET: {
          target: "writeSeed",
          cond: (c, event) => event.isRestore
        }
      }
    },
    // generateNewSeed is the state responsible to generate a new seed.
    generateNewSeed: {
      on: {
        CONTINUE: "loading"
      }
    },
    // newWallet is the state responsible for showing the new wallet seed
    // generated.
    newWallet: {
      on: {
        CONTINUE: "confirmSeed",
        BACK: {
          actions: sendParent({ type: "BACK" })
        },
        GENERATED: {
          target: "newWallet",
          actions: [
            assign({
              mnemonic: (context, event) => {
                console.log(event);
                return event.mnemonic;
              }
            })
          ]
        }
      }
    },
    // writeSeed is the state responsible for writing the whole seed when
    // recovering wallet.
    writeSeed: {
      on: {
        CONTINUE: "loading",
        ERROR: "finished",
        BACK: {
          actions: sendParent({ type: "BACK" })
        },
        VALIDATE_DATA: {
          target: "writeSeed",
          // assign new context value to each one;
          actions: [
            assign({
              passPhrase: (context, event) =>
                event.passPhrase ?? context.passPhrase ?? "",
              seed: (context, event) =>
                event.seed ? event.seed : context.seed ? context.seed : [],
              error: (context, event) => event.error ?? context.error ?? ""
            })
          ]
        }
      }
    },
    // confirmSeed is the state which will confirm the seed filing the blanks
    // when creating a new wallet.
    confirmSeed: {
      on: {
        CONTINUE: "loading",
        ERROR: "newWallet",
        BACK: {
          target: "newWallet",
          actions: [
            assign({
              passPhrase: "",
              seed: (context, { isTestNet }) =>
                isTestNet && context.seed ? context.seed : [],
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
                event.passPhrase ?? context.passPhrase ?? "",
              seed: (context, event) =>
                event.seed ? event.seed : context.seed ? context.seed : [],
              error: (context, event) => event.error ?? context.error ?? ""
            })
          ]
        }
      }
    },
    restoreWatchingOnly: {
      on: {
        CONTINUE: "loading"
      }
    },
    loading: {
      on: {
        ERROR: {
          target: "finished",
          actions: [
            assign({
              completed: true
            }),
            sendParent((_, { type, payload: { error } }) => ({
              type: type,
              error: error
            }))
          ]
        },
        WALLET_CREATED: {
          target: "walletCreated",
          actions: [
            assign({ completed: true }),
            sendParent((ctx, event) => ({
              type: event.type,
              passPhrase: ctx.passPhrase
            }))
          ]
        },
        SEED_GENERATED: {
          target: "newWallet",
          actions: [
            assign({
              mnemonic: (ctx, { payload: { mnemonic } }) => mnemonic,
              seed: (ctx, { payload: { seed } }) => seed
            })
          ]
        }
      }
    },
    walletCreated: {
      type: "final"
    },
    finished: {
      type: "final"
    }
  }
});
