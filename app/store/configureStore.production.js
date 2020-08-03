// @flow
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import rootReducer from "../reducers";

export default function configureStore(initialState: Object, history: Object) {
  const routerMiddlware = routerMiddleware(history);
  const enhancer = applyMiddleware(thunk, routerMiddlware);
  const routing = connectRouter(history);
  rootReducer.router = routing;
  const routingReducer = combineReducers(rootReducer);


  return createStore(routingReducer, initialState, enhancer);
}
