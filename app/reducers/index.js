// @flow
import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";
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
import snackbar from "./snackbar";
import statistics from "./statistics";
import governance from "./governance";
import trezor from "./trezor";

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
  routing,
  sidebar,
  snackbar,
  statistics,
  governance,
  trezor,
});

export default rootReducer;
