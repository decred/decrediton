import { Machine } from "xstate";

// Hierarchical state machine called inside getStartedStateMachine.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const CreateWalletMachine = ({ cancelCreateWallet, backToCredentials }) => Machine({
  id: "getStarted",
  initial: "createWallet",
  context: {
    error: null,
  },
  states: {
    createWallet: {
      onEntry: "isAtCreateWallet",
      on: {
        RESTORE_WALLET: {
          target: "writeSeed",
          cond: (c, event) => event.isNew === "false"
        },
        CREATE_WALLET: {
          target: "newWallet",
          cond: (c, event) => event.isNew === "true"
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
        CONTINUE: "walletCreated",
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
    isAtNewWallet: () => {
      console.log("is At NewWallet")
    },
    isAtWriteSeed: () => {
      console.log("is At writeseed")
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
