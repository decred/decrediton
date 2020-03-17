import { Machine, assign } from "xstate";

export const fetchMachine = Machine({
  id: "fetch",
  initial: "idle",
  context: {
    retries: 0
  },
  states: {
    idle: {
      entry: [ "initial" ],
      on: {
        FETCH: "loading",
        RESOLVE: "success"
      }
    },
    loading: {
      entry: [ "load" ],
      on: {
        RESOLVE: "success",
        REJECT: "failure"
      }
    },
    success: {
      entry: [ "onSucess" ],
      on: {
        FETCH: "loading"
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
