import { Machine } from "xstate";

// Hierarchical state machine called insed getStartedStateMachine.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const CreateWalletMachine = (a) => Machine({
  id: "getStarted",
  initial: "preStart",
  context: {
    isNew: null,
    error: null
  },
  states: {
    createWallet: {
      onEntry: "isAtCreateWallet",
      on: {
        RESTORE: {
          target: "writeSeed",
          cond: (c, event) => !event.isNew
        },
        CREATE: {
          target: "newWallet",
          cond: (c, event) => !!event.isNew
        },
      }
    },
    newWallet: {
      onEntry: "isAtNewWallet",
      on: {
        CONTINUE: "confirmSeed",
        BACK: "createWallet"
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
      onEntry: "isStartedDaemon",
      on: {
        CONFIRMED: "walletCreated",
        ERROR: "newWallet",
        BACK: "newWallet"
      }
    },
    walletCreated: {
      type: "final",
      onEntry: "isAtStartWalletCreated",
    }
  }
},
{
  actions: {
    isAtCreateWallet: () => {
      console.log("is at create wallet");
    }
  }
});
