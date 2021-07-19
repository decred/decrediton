import { Machine, assign } from "xstate";

export const fetchMachine = Machine({
  id: "fetch",
  initial: "idle",
  context: {
    retries: 0,
    error: null,
    resets: 0
  },
  states: {
    idle: {
      entry: ["initial"],
      on: {
        FETCH: "loading",
        RESOLVE: "success",
        REJECT: {
          target: "failure",
          actions: assign({
            error: (context, event) => event.error
          })
        }
      }
    },
    loading: {
      entry: ["load"],
      on: {
        RESOLVE: {
          target: "success",
          actions: assign({
            // clean error.
            error: () => ""
          })
        },
        REJECT: {
          target: "failure",
          actions: assign({
            error: (context, event) => event.error
          })
        },
        FETCH: "loading"
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
        },
        RESET: {
          target: "idle",
          actions: assign({
            retries: (context) => context.resets + 1,
            error: () => ""
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
