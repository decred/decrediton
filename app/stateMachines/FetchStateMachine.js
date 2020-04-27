import { Machine, assign } from "xstate";

export const fetchMachine = Machine({
  id: "fetch",
  initial: "idle",
  context: {
    retries: 0,
    error: null
  },
  states: {
    idle: {
      entry: ["initial"],
      on: {
        FETCH: "loading",
        RESOLVE: "success",
<<<<<<< HEAD
        REJECT: "failure"
=======
        REJECT: {
          target: "failure",
          actions: assign({
            error: (context, event) => event.error
          })
        }
>>>>>>> 19910b07... Merged with most recent master
      }
    },
    loading: {
      entry: ["load"],
      on: {
        RESOLVE: "success",
        REJECT: {
          target: "failure",
          actions: assign({
            error: (context, event) => event.error
          })
        }
      }
    },
    success: {
      on: {
        FETCH: "loading",
        REJECT: {
          target: "failure",
          actions: assign({
            error: (context, event) => event.error
          })
        }
      }
    },
    failure: {
      on: {
        RETRY: {
          target: "loading",
          actions: assign({
            retries: (context) => context.retries + 1
          })
        }
      }
    }
  }
});
