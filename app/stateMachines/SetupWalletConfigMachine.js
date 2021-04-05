import { Machine, assign } from "xstate";

// Hierarchical state machine called inside getStartedStateMachine.
// This is done this way so we can exchange passPhrase between them without
// the need of dispatching it to other place.
// source: https://github.com/davidkpiano/xstate#hierarchical-nested-state-machines
export const SetupWalletConfigMachine = Machine({
  id: "setupWallet",
  initial: "settingMixedAccount",
  context: {
    error: null,
    isNew: null
  },
  states: {
    settingMixedAccount: {
      on: {
        CONTINUE: "processingManagedTickets"
      }
    },
    processingManagedTickets: {
      on: {
        BACK: "processingUnmanagedTickets",
        CONTINUE: "processingUnmanagedTickets",
        ERROR: {
          target: "processingManagedTickets",
          actions: assign({
            error: (context, event) => event.error && event.error
          })
        }
      }
    },
    processingUnmanagedTickets: {
      on: {
        CONTINUE: "goToHomeView",
        BACK: "goToHomeView",
        ERROR: {
          target: "processingUnmanagedTickets",
          actions: assign({
            error: (context, event) => event.error && event.error
          })
        }
      }
    },
    // goToHomeView goes to home view. We do that, instead of going to a final
    // state, because the machine can still be called, like when a refresh
    // happens in dev mode.
    goToHomeView: {}
  }
});
