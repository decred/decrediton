// @flow
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, createMemoryHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import routes from "./routes";
import configureStore from "./store/configureStore";
import { getGlobalCfg, getWalletCfg } from "./config.js";
import locales from "./i18n/locales";
import "./style/main.less";
import "./style/Global.less";
import "./style/ReactSelectGlobal.less";

var walletCfg = getWalletCfg("default-wallet");
var globalCfg = getGlobalCfg();

var grpcport = "";
var foundStakePoolConfig = false;
var currentStakePoolConfig = walletCfg.get("stakepools");
var network = walletCfg.get("network");
var hiddenAccounts = walletCfg.get("hiddenaccounts");
var firstConfiguredStakePool = null;
if (currentStakePoolConfig !== undefined) {
  for (var i = 0; i < currentStakePoolConfig.length; i++) {
    if (currentStakePoolConfig[i].ApiKey && currentStakePoolConfig[i].Network == network) {
      foundStakePoolConfig = true;
      firstConfiguredStakePool = currentStakePoolConfig[i];
      break;
    }
  }
}

if (network == "testnet") {
  grpcport = 19121;
} else {
  grpcport = 9121;
}

var initialState = {
  settings: {
    currentSettings: {
      currencyDisplay: walletCfg.get("currency_display"),
      network: walletCfg.get("network"),
      locale: globalCfg.get("locale"),
      daemonStartAdvanced: globalCfg.get("daemon_start_advanced"),
    },
    tempSettings: {
      currencyDisplay: walletCfg.get("currency_display"),
      network: walletCfg.get("network"),
      locale: globalCfg.get("locale"),
      daemonStartAdvanced: globalCfg.get("daemon_start_advanced"),
    },
    settingsChanged: false,
  },
  stakepool: {
    currentStakePoolConfig: currentStakePoolConfig,
    currentStakePoolConfigRequest: false,
    currentStakePoolConfigError: null,
    currentStakePoolConfigSuccessMessage: "",
    activeStakePoolConfig: foundStakePoolConfig,
    selectedStakePool: firstConfiguredStakePool,
  },
  daemon: {
    daemonStarted: false,
    daemonSynced: false,
    daemonStopped: false,
    walletReady: false,
    currentBlockCount: null,
    timeLeftEstimate: null,
    timeStart: 0,
    blockStart: 0,
    daemonAdvanced: globalCfg.get("daemon_start_advanced"),
    credentials: null,
    appData: null,
    shutdownRequested: false,
    openForm: globalCfg.get("must_open_form"),
    remoteAppdataError: false
  },
  version: {
    // RequiredVersion
    requiredVersion: "4.27.0",
    versionInvalid: false,
    versionInvalidError: null,
    // VersionService
    versionService: null,
    getVersionServiceRequestAttempt: false,
    getVersionServiceError: "",
    // Balance
    getWalletRPCVersionError: null,
    getWalletRPCVersionRequestAttempt: false,
    getWalletRPCVersionResponse: null,
  },
  grpc: {
    // WalletService
    address: "127.0.0.1",
    port: grpcport,
    walletService: null,
    network: network,
    requiredStakepoolAPIVersion: 2,
    recentBlockTimestamp: null,

    // ints for mainnet and testnet protocol hex
    // TestNet2 CurrencyNet = 0x48e7a065
    testnet: 1223139429,
    // MainNet CurrencyNet = 0xd9b400f9
    mainnet: 3652452601,

    // GetWalletService
    getWalletServiceRequestAttempt: false,
    getWalletServiceError: "",
    // Balance
    getBalanceError: null,
    getBalanceRequestAttempt: false,
    balances: Array(),
    // AccountNumber
    getAccountNumberError: null,
    getAccountNumberRequestAttempt: false,
    getAccountNumberResponse: null,
    // Network
    getNetworkError: null,
    getNetworkRequestAttempt: false,
    getNetworkResponse: null,
    // Ping
    getPingError: null,
    getPingRequestAttempt: false,
    getPingResponse: null,
    // StakeInfo
    getStakeInfoError: null,
    getStakeInfoRequestAttempt: false,
    getStakeInfoResponse: null,
    // TicketPrice
    getTicketPriceError: null,
    getTicketPriceRequestAttempt: false,
    getTicketPriceResponse: null,
    // SignMessage
    getSignMessageError: null,
    getSignMessageRequestAttempt: false,
    getSignMessageResponse: null,
    // VerifyMessage
    getVerifyMessageError: null,
    getVerifyMessageRequestAttempt: false,
    getVerifyMessageResponse: null,
    // Accounts
    hiddenAccounts: hiddenAccounts,
    getAccountsError: null,
    getAccountsRequestAttempt: false,
    getAccountsResponse: null,

    // Transactions for Overview Page
    recentTransactionCount: 8,
    recentTransactions: Array(),

    // GetTransactions
    minedTransactions: Array(),
    unminedTransactions: Array(),
    transactions: Array(), // unmined + mined. Calculated on the grpc reducer.
    maximumTransactionCount: 10,
    noMoreTransactions: false,
    transactionsFilter: {
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      types: [], // desired transaction types (code). All if blank.
      direction: null, // direction of desired transactions (sent/received/transfer)
    },
    lastTransaction: null, //last transaction obtained

    getTransactionsError: null,
    getTransactionsRequestAttempt: false,
    getTransactionsResponse: null,

    // GetTickets
    getTicketsError: null,
    getTicketsRequestAttempt: false,
    tickets: Array(),

    // Agenda/VoteChoices
    getAgendasResponse: null,
    getVoteChoicesResponse: null,

    // GetMessageDecodeService
    decodeMessageService: null,
    getMessageDecodeServiceRequestAttempt: false,
    getMessageDecodeServiceError: null,

    // map from (reversed) transaction hash to fully decoded transaction
    decodedTransactions: {},

    // Map that stores the accounts that should be updated at future block
    // heights, due to maturing stake transactions. Keys are the heights,
    // values are arrays of account numbers.
    maturingBlockHeights: {},
  },
  walletLoader: {
    rpcRetryAttempts: 0,
    neededBlocks: 0,
    curBlocks: 0,
    stepIndex: 0,
    // Loader
    getLoaderRequestAttempt: false,
    loader: null,
    getLoaderError: null,
    // WalletCreate
    createWalletExisting: false,
    confirmNewSeed: false,
    walletCreateRequestAttempt: false,
    walletCreateResponse: null,
    walletCreateError: null,
    walletCreateExisting: false,
    // WalletExist
    walletExistRequestAttempt: false,
    walletExistResponse: null,
    walletExistError: null,
    // WalletOpen
    walletOpenRequestAttempt: false,
    walletOpenResponse: null,
    walletOpenError: null,
    // WalletClose
    walletCloseRequestAttempt: false,
    walletClosedResponse: null,
    walletClosedError: null,
    // StartRpc
    startRpcRequestAttempt: false,
    startRpcResponse: null,
    startRpcError: null,
    // DiscoverAddress
    discoverAddressRequestAttempt: false,
    discoverAddressResponse: null,
    discoverAddressError: null,
    discoverAccountsComplete: walletCfg.get("discoveraccounts"),
    // SubscribeBlockNtfns
    subscribeBlockNtfnsRequestAttempt: false,
    subscribeBlockNtfnsResponse: null,
    subscribeBlockNtfnsError: null,
    // FetchHeaders
    fetchHeadersRequestAttempt: false,
    fetchHeadersResponse: null,
    fetchHeadersError: null,
  },
  notifications: {
    transactionNtfns: null,
    transactionNtfnsError: null,
    accountNtfnsRequestAttempt: false,
    accountNtfnsResponse: null,
  },
  control: {
    // NextAddress
    getNextAddressRequestAttempt: false,
    getNextAddressResponse: null,
    getNextAddressError: null,
    // RenameAccount
    renameAccountRequestAttempt: false,
    renameAccountResponse: null,
    renameAccountSuccess: null,
    renameAccountError: null,
    // Rescan
    rescanRequestAttempt: false,
    rescaneRequest: null,
    rescanResponse: null,
    rescanError: null,
    rescanCall: null,
    // NextAccount
    getNextAccountRequestAttempt: false,
    getNextAccountResponse: null,
    getNextAccountSuccess: null,
    getNextAccountError: null,
    // ImportPrivateKey
    importPrivateKeyRequestAttempt: false,
    importPrivateKeyResponse: null,
    importPrivateKeyError: null,
    // ImportScript
    importScriptRequestAttempt: false,
    importScriptResponse: null,
    importScriptError: null,
    importScriptSuccess: "",
    // ChangePassphrase
    changePassphraseRequestAttempt: false,
    changePassphraseResponse: null,
    changePassphraseError: null,
    changePassphraseSuccess: "",
    // ChangePassphrase
    loadActiveDataFiltersRequestAttempt: false,
    loadActiveDataFiltersResponse: null,
    loadActiveDataFiltersError: null,
    // FundTransaction
    fundTransactionRequestAttempt: false,
    fundTransactionResponse: null,
    fundTransactionError: null,
    // SignTransaction
    signTransactionRequestAttempt: false,
    signTransactionRespsonse: null,
    // PublishTransaction
    publishTransactionRequestAttempt: false,
    publishTransactionResponse: null,
    // PurchaseTicket
    purchaseTicketsRequestAttempt: false,
    purchaseTicketsResponse: null,
    purchaseTicketsSuccess: "",
    purchaseTicketsError: null,
    // RevokeTickets
    revokeTicketsRequestAttempt: false,
    revokeTicketsResponse: null,
    revokeTicketsSuccess: "",
    revokeTicketsError: null,

    // TicketBuyerService
    ticketBuyerService: null,
    // TicketBuyerConfig
    balanceToMaintain: walletCfg.get("balancetomaintain"),
    maxFee: walletCfg.get("maxfee"),
    maxPriceAbsolute: walletCfg.get("maxpriceabsolute"),
    maxPriceRelative: walletCfg.get("maxpricerelative"),
    maxPerBlock: walletCfg.get("maxperblock"),
    getTicketBuyerConfigRequestAttempt: false,
    getTicketBuyerConfigResponse: null,
    getTicketBuyerConfigSuccess: null,
    getTicketBuyerConfigError: null,
    // StartAutoBuyer
    startAutoBuyerRequestAttempt: false,
    startAutoBuyerResponse: null,
    startAutoBuyerSuccess: null,
    startAutoBuyerError: null,
    // StopAutoBuyer
    stopAutoBuyerRequestAttempt: false,
    stopAutoBuyerResponse: null,
    stopAutoBuyerSuccess: null,
    stopAutoBuyerError: null,
    // ConstructTransaction
    constructTxRequestAttempt: false,
    constructTxResponse: null,
    // ValidateAddress
    validateAddressRequestAttempt: false,
    validateAddressResponse: null,
    validateAddressError: null,
  },
  snackbar: {
    messages: Array()
  },
  sidebar: {
    showingSidebar: true,
    showingSidebarMenu: false,
  },
  locales: locales
};

const history = createMemoryHistory();
const store = configureStore(initialState, history);
const syncedHistory = syncHistoryWithStore(history, store);

render(
  <Provider store={store}>
    <Router history={syncedHistory} routes={routes} />
  </Provider>,
  document.getElementById("root")
);
