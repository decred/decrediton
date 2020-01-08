import { Machine, assign } from "xstate";

// Hierarchical state machine called inside getStartedStateMachine.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const CreateWalletMachine = ({
  cancelCreateWallet, backToCredentials, generateSeed, sendEvent, checkIsValid
}) => Machine({
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
        RESTORE_WALLET: {
          target: "writeSeed",
          cond: (c, event) => !event.isNew
        },
        CREATE_WALLET: {
          target: "newWallet",
          cond: (c, event) => event.isNew
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
        CONTINUE: "walletCreated",
        ERROR: "createWallet",
        BACK: "finished",
        VALIDATE_DATA: {
          target: "writeSeed",
          // assign new context;
          actions: [
            assign({
              passPhrase: (context, event) => event.passPhrase ? event.passPhrase : context.passPhrase ? context.passPhrase : "",
              seed: (context, event) => event.seed ? event.seed : context.seed ? context.seed : [],
              error: (context, event) => {
                console.log(event)
                return event.error && event.error
              }
            }),
          ],
        }
      }
    },
    confirmSeed: {
      onEntry: "isAtConfirmSeed",
      on: {
        CONTINUE: "walletCreated",
        ERROR: "newWallet",
        BACK: {
          target: "newWallet",
          actions: [
            assign({
              passPhrase: "",
              seed: [],
              error: ""
            }),
          ]
        },
        VALIDATE_DATA: {
          target: "confirmSeed",
          // assign new context;
          actions: [
            assign({
              passPhrase: (context, event) => event.passPhrase ? event.passPhrase : context.passPhrase ? context.passPhrase : "",
              seed: (context, event) => event.seed ? event.seed : context.seed ? context.seed : [],
              error: (context, event) => event.error && event.error
            }),
          ],
        }
      },
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
      generateSeed().then(response => {
        // Allows verification skip in dev
        // context.seed = event.isTestNet ? response.getSeedBytes() : null;
        const mnemonic = response.getSeedMnemonic();
        context.mnemonic = mnemonic;
        sendEvent({ type: "GENERATED" })
      });
    },
    isAtConfirmSeed: (context, event) => {
      checkIsValid();
    },
    isAtWriteSeed: () => {
      checkIsValid();
    },
    isAtFinished: async () => {
      await cancelCreateWallet();
      backToCredentials();
    },
    isAtWalletCreated: async () => {
      backToCredentials();
    }
  }
});
