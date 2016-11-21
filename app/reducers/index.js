// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import walletInfo from './walletInfo';

const rootReducer = combineReducers({
  counter,
  walletInfo: walletInfo,
  routing
});

export default rootReducer;
