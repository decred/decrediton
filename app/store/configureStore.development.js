import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";
import { connectRouter, routerMiddleware, push } from "connected-react-router";
import createLogger from "redux-logger";
import rootReducer from "../reducers";

export default function configureStore(initialState: Object, history: Object) {
  const actionCreators = {
    push
  };

  const logger = createLogger({
    level: "info",
    collapsed: true
  });

  const routeMiddleware = routerMiddleware(history);
  const routing = connectRouter(history);
  rootReducer.router = routing;
  const routingReducer = combineReducers(rootReducer);

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */
  const enhancer = composeEnhancers(
    applyMiddleware(thunk, routeMiddleware, logger)
  );

  const store = createStore(routingReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept("../reducers", () =>
      store.replaceReducer(require("../reducers"))
    );
  }

  return store;
}
