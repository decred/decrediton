// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import configureStore from './store/configureStore';
import { getCfg } from './config.js';

var cfg = getCfg();

var grpcport = '';
var neededBlocks = 0;
var today = new Date();
var startDate = new Date();
var totalDays = 0.0;

if (cfg.network == 'testnet') {
  grpcport = cfg.wallet_port_testnet;
  startDate = new Date('01/27/2016');
  totalDays = (today.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
  neededBlocks = totalDays * 720 * (0.95);
} else {
  startDate = new Date('02/08/2016');
  totalDays = (today.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
  neededBlocks = totalDays * 288 * (0.95);
  grpcport = cfg.wallet_port;
}


var initialState = {
  version: {
    // RequiredVersion
    requiredVersion: '4.2.2',
    versionInvalid: false,
    versionInvalidError: null,
    // VersionService
    versionService: null,
    getVersionServiceRequestAttempt: false,
    getVersionServiceError: '',
    // Balance
    getWalletRPCVersionRequest: null,
    getWalletRPCVersionError: null,
    getWalletRPCVersionRequestAttempt: false,
    getWalletRPCVersionResponse: null,
  },
  grpc: {
    // WalletService
    address: '127.0.0.1',
    port: grpcport,
    walletService: null,
    getWalletServiceRequestAttempt: false,
    getWalletServiceError: '',
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
    transactions: Array(),
    getTransactionsRequest: null,
    getTransactionsError: null,
    getTransactionsRequestAttempt: false,
    getTransactionsResponse: null,
  },
  walletLoader: {
    neededBlocks: neededBlocks,
    curBlocks: 0,
    disclaimerOK: false,
    stepIndex: 0,
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
    walletCreateExisting: false,
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
  },
  control: {
    // NextAddress
    getNextAddressRequestAttempt: false,
    getNextAddressRequest: null,
    getNextAddressResponse: null,
    getNextAddressError: null,
    // RenameAccount
    renameAccountRequestAttempt: false,
    renameAccountRequest: null,
    renameAccountResponse: null,
    renameAccountError: null,
    // Rescan
    rescanRequestAttempt: false,
    rescanRequest: null,
    rescanResponse: null,
    rescanError: null,
    // NextAccount
    getNextAccountRequestAttempt: false,
    getNextAccountRequest: null,
    getNextAccountResponse: null,
    getNextAccountError: null,
    // ImportPrivateKey
    importPrivateKeyRequestAttempt: false,
    importPrivateKeyRequest: null,
    importPrivateKeyResponse: null,
    importPrivateKeyError: null,
    // ImportScript
    importScriptRequestAttempt: false,
    importScriptRequest: null,
    importScriptResponse: null,
    importScriptError: null,
    // ChangePassphrase
    changePassphraseRequestAttempt: false,
    changePassphraseRequest: null,
    changePassphraseResponse: null,
    changePassphraseError: null,
    // ChangePassphrase
    loadActiveDataFiltersRequestAttempt: false,
    loadActiveDataFiltersRequest: null,
    loadActiveDataFiltersResponse: null,
    loadActiveDataFiltersError: null,
    // FundTransaction
    fundTransactionRequestAttempt: false,
    fundTransactionRequest: null,
    fundTransactionResponse: null,
    fundTransactionError: null,
    // SignTransaction
    signTransactionRequestAttempt: false,
    signTransactionRequest: null,
    signTransactionRespsonse: null,
    signTransactionError: null,
    // PublishTransaction
    publishTransactionRequestAttempt: false,
    publishTransactionRequest: null,
    publishTransactionResponse: null,
    publishTransactionError: null,
    // PurchaseTicket
    purchaseTicketRequestAttempt: false,
    purchaseTicketRequest: null,
    purchaseTicketResponse: null,
    purchaseTicketError: null,
    // ConstructTransaction
    constructTxRequestAttempt: false,
    constructTxRequest: null,
    constructTxResponse: null,
    constructTxError: null,
  }
};

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
