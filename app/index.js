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
    // Balance
    getBalanceRequest: null,
    getBalanceError: null,
    getBalanceRequestAttempt: false,
    getBalanceResponse: null,
    // AccountNumber
    getAccountNumberRequest: null,
    getAccountNumberError: null,
    getAccountNumberRequestAttempt: false,
    getAccountNumberResponse: null,
    // Network
    getNetworkRequest: null,
    getNetworkError: null,
    getNetworkRequestAttempt: false,
    getNetworkResponse: null,
    // Ping
    getPingRequest: null,
    getPingError: null,
    getPingRequestAttempt: false,
    getPingResponse: null,
    // StakeInfo
    getStakeInfoRequest: null,
    getStakeInfoError: null,
    getStakeInfoRequestAttempt: false,
    getStakeInfoResponse: null,
    // TicketPrice
    getTicketPriceRequest: null,
    getTicketPriceError: null,
    getTicketPriceRequestAttempt: false,
    getTicketPriceResponse: null,
    // Accounts
    getAccountsRequest: null,
    getAccountsError: null,
    getAccountsRequestAttempt: false,
    getAccountsResponse: null,
    // Transactions
    getTransactionsRequest: null,
    getTransactionsError: null,
    getTransactionsRequestAttempt: false,
    getTransactionsResponse: null,
  },
  walletLoader: {
    // XXX Wallet Passphrases 
    // We are storing these in state for dev ease, 
    // but will construct an alternate system 
    // to properly/securely/safely store passphrases.
    privatePassphrase: "",
    publicPassphrase: "",
    // Loader
    getLoaderRequestAttempt: false,   
    getLoaderRequest: null,
    loader: null,
    getLoaderError: null,
    // WalletCreate
    walletCreateRequestAttempt: false,
    walletCreateRequest: false,
    walletCreateResponse: null,
    walletCreateError: null,
    // WalletExist
    walletExistRequestAttempt: false,
    walletExistRequest: null,
    walletExistResponse: null,
    walletExistError: null,    
    // WalletOpen
    walletOpenRequestAttempt: false,
    walletOpenRequest: null,
    walletOpenResponse: null,
    walletOpenError: null,
    // WalletClose
    walletCloseRequestAttempt: false,
    walletClosedRequest: null,
    walletClosedResponse: null,
    walletClosedError: null,
    // StartRpc
    startRpcRequestAttempt: false,
    startRpcRequest: null,
    startRpcResponse: null,
    startRpcError: null,
    // DiscoverAddress
    discoverAddressRequestAttempt: false,
    discoverAddressRequest: null,
    discoverAddressResponse: null,
    discoverAddressError: null,
    // SubscribeBlockNtfns
    subscribeBlockNtfnsRequestAttempt: false,
    subscribeBlockNtfnsRequest: null,
    subscribeBlockNtfnsResponse: null,
    subscribeBlockNtfnsError: null,
    // FetchHeaders
    fetchHeadersRequestAttempt: false,
    fetchHeadersRequest: null,
    fetchHeadersResponse: null,
    fetchHeadersError: null,
  },
  seedService: {
    getSeederRequestAttempt: false,
    getSeederRequest: null,
    seeder: null,
    getSeederError: null,

    generateRandomSeedRequestAttempt: false,
    generateRandomSeedRequest: null,
    generateRandomSeedResponse: null,
    generateRandomSeedError: null,

    decodeSeedRequestAttempt: false,
    decodeSeedRequest: null,
    decodeSeedResponse: null,
    decodeSeedError: null,
  },
  notifications: {
    transactionNtfnsRequestAttempt: false,
    transactionNtfnsRequest: null,
    transactionNtfnsResponse: null,

    spentnessNtfnsRequestAttempt: false,
    spentnessNtfnsRequest: null,
    spentnessNtfnsResponse: null,

    accountNtfnsRequestAttempt: false,
    accountNtfnsRequest: null,
    accountNtfnsResponse: null,
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
