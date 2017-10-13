// @flow
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import grpc from "./grpc";
import walletLoader from "./walletLoader";
import notifications from "./notifications";
import control from "./control";
import version from "./version";
import settings from "./settings";
import stakepool from "./stakepool";
import daemon from "./daemon";
import locales from "./locales";
import sidebar from "./sidebar";

const rootReducer = combineReducers({
  grpc,
  walletLoader,
  notifications,
  control,
  version,
  settings,
  stakepool,
  daemon,
  locales,
  form,
  sidebar,
});

export default rootReducer;
