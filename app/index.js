// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './bootstrap.min.css';

var initialState = {
  login: {
    address: "",
    port: "", 
    passphrase: "",
    isLoggedIn: false,
    isLoggingIn: false,
    error: "",
  },
  grpc: {
    balanceAccountNumber: 0,
    balanceRequiredConfs: 0,
    isGettingBalance: false,
    isGotBalance: false,
    error: "",
    balance: null,
  }
};

const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);
console.log(store.getState());
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
