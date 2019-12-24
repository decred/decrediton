import { Machine } from "xstate";

// Hierarchical state machine called inside getStartedStateMachine.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const CreateWalletMachine = () => Machine({
  id: "getStarted",
  initial: "createWallet",
  context: {
    isNew: null,
    error: null
  },
  states: {
    createWallet: {
      onEntry: "isAtCreateWallet",
      on: {
        CREATE_WALLET: {
          target: "writeSeed",
          cond: (c, event) => !event.isNew
        },
        CREATE_WALLET: {
          target: "newWallet",
          cond: (c, event) => !!event.isNew
        }
      }
    },
    newWallet: {
      onEntry: "isAtNewWallet",
      on: {
        CONTINUE: "confirmSeed",
        BACK: "finished"
      }
    },
    writeSeed: {
      onEntry: "isAtWriteSeed",
      on: {
        WRITED: "walletCreated",
        ERROR: "createWallet",
        BACK: "createWallet"
      }
    },
    confirmSeed: {
      onEntry: "isAtConfirmSeed",
      on: {
        CONTINUE: "walletCreated",
        ERROR: "newWallet",
        BACK: "newWallet"
      }
    },
    walletCreated: {
      type: "final",
      onEntry: "isAtStartWalletCreated"
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
    isAtNewWallet: () => {
      console.log("is At NewWallet")
    },
    isAtConfirmSeed: () => {
      console.log("is At ConfirmSeed");
    },
    isAtFinished: () => {
      console.log("is At Finished");
    }
  }
});
