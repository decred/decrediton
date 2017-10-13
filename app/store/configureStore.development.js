import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "../reducers";

const logger = createLogger({
  level: "info",
  collapsed: true
});

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(
  applyMiddleware(thunk, logger)
);

export default function configureStore(initialState: Object) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept("../reducers", () =>
      store.replaceReducer(require("../reducers"))
    );
  }

  return store;
}
