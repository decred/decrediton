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
    address: "127.0.0.1",
    port: "19113", 
    passphrase: "",
    isLoggedIn: false,
    isLoggingIn: false,
    error: "",
  },
  grpc: {
    //Balance
    getBalanceAccountNumber: 0,
    getBalanceRequiredConfs: 0,
    getBalanceError: "",
    getBalanceRequestAttempt: false,
    getBalanceResponse: null,
  },
  walletLoader: {
    address: "",
    port: "",
    privPass: "",
    pubPass: "",
    seed: "",
    isGettingLoader: false,
    isLoaderReady: false,
    isWalletCreatedRequest: false,
    isWalletCreated: false,
    isWalletExistRequest: false,
    isWalletExistComplete: false,
    isWalletExist: false,
    isWalletOpenRequest: false,
    isWalletOpen: false,
    isWalletClosedRequest: false,
    isWalletClosed: false,
    isStartRpcRequest: false,
    isStartRpc: false,
    isDiscoverAddressRequest: false,
    isDiscoverAddress: false,
    isSubscribeBlockNtfnsRequest: false,
    isSubscribeBlockNtfns: false,
  }
};

const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
