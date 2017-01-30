// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import grpc from './grpc';
import walletLoader from './walletLoader';
import seedService from './seedService';
import notifications from './notifications';
import control from './control';
import version from './version';
import settings from './settings';
const rootReducer = combineReducers({
  grpc,
  walletLoader,
  seedService,
  notifications,
  control,
  version,
  settings,
  routing
});

export default rootReducer;
