// @flow
window.eval = () => { throw new Error("Do not import things that use eval()"); };
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { Switch, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { App } from "containers";
import configureStore from "./store/configureStore";
import { getGlobalCfg } from "./config";
import locales from "./i18n/locales";
import "./style/main.less";
import "./style/Global.less";
import "./style/ReactSelectGlobal.less";
import pkg from "./package.json";
import { log } from "./wallet";

var globalCfg = getGlobalCfg();
const locale = globalCfg.get("locale");

log("info", "Starting main react app");

const currentSettings = {
  locale: locale,
  daemonStartAdvanced: globalCfg.get("daemon_start_advanced"),
  allowedExternalRequests: globalCfg.get("allowed_external_requests"),
  proxyType: globalCfg.get("proxy_type"),
  proxyLocation: globalCfg.get("proxy_location"),
  spvMode: globalCfg.get("spv_mode"),
  spvConnect: globalCfg.get("spv_connect"),
  timezone: globalCfg.get("timezone"),
  currencyDisplay: "DCR",
  network: globalCfg.get("network"),
};
var initialState = {
  settings: {
    currentSettings: currentSettings,
    tempSettings: currentSettings,
    settingsChanged: false,
    uiAnimations: globalCfg.get("ui_animations"),
    needNetworkReset: false,
    theme: globalCfg.get("theme"),
  },
  stakepool: {
    currentStakePoolConfig: null,
    currentStakePoolConfigRequest: false,
    currentStakePoolConfigError: null,
    currentStakePoolConfigSuccessMessage: "",
    activeStakePoolConfig: false,
    selectedStakePool: null,
    updatedStakePoolList: false,
    addCustomStakePoolAttempt: false,
  },
  daemon: {
    networkMatch: false,
    appVersion: pkg.version,
    daemonRemote: false,
    locale: locale,
    tutorial: globalCfg.get("show_tutorial"),
    showPrivacy: globalCfg.get("show_privacy"),
    setLanguage: globalCfg.get("set_language"),
    showSpvChoice: globalCfg.get("show_spvchoice"),
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
    remoteAppdataError: false,
    previousWallet: null,
    selectCreateWalletInputRequest: true,
    hiddenAccounts: Array(),
    walletName: null,
    neededBlocks: 0,
  },
  version: {
    // RequiredVersion
    requiredVersion: "5.6.0",
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
    port: "9121",
    walletService: null,
    requiredStakepoolAPIVersion: 2,
    recentBlockTimestamp: null,
    currentBlockHeight: 0,

    // ints for mainnet and testnet protocol hex
    // TestNet3 CurrencyNet = 0xb194aa75
    testnet: 2979310197,
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
    pingTimer: null,
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
    getSignMessageSignature: null,
    // VerifyMessage
    getVerifyMessageError: null,
    getVerifyMessageRequestAttempt: false,
    getVerifyMessageResponse: null,
    // Accounts
    getAccountsError: null,
    getAccountsRequestAttempt: false,
    getAccountsResponse: null,

    // Transactions for Overview Page
    recentTransactionCount: 8,
    recentTransactions: Array(),
    recentStakeTransactions: Array(),

    // GetTransactions
    minedTransactions: Array(),
    unminedTransactions: Array(),
    transactions: Array(), // unmined + mined. Calculated on the grpc reducer.
    maximumTransactionCount: 10,
    noMoreTransactions: false,
    transactionsFilter: {
      search: null, // The freeform text in the Search box
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      types: [], // desired transaction types (code). All if blank.
      direction: null, // direction of desired transactions (sent/received/transfer)
      maxAmount: null,
      minAmount: null,
    },
    lastTransaction: null, //last transaction obtained

    getTransactionsError: null,
    getTransactionsRequestAttempt: false,
    getTransactionsResponse: null,

    // GetTickets
    getTicketsError: null,
    getTicketsRequestAttempt: false,
    tickets: Array(),
    minedTickets: Array(),
    unminedTickets: Array(),
    noMoreTickets: false,
    ticketsFilter: {
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      status: [], // desired ticket status (code). All if blank.
    },
    getTicketsStartRequestHeight: null,
    getTicketsCancel: false, // user requested cancelation (but it hasn't happened yet)
    getTicketsProgressStartRequestHeight: null,

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

    // list of outstanding requests for additional stake data from transactions
    // (indexed by transaction hash)
    fetchMissingStakeTxDataAttempt: {},

    // Shown under governance tab
    treasuryBalance: null,
  },
  walletLoader: {
    syncInput: false,
    syncError: null,
    syncAttemptRequest: false,
    syncCall: null,
    peerCount: 0,
    existingOrNew: false,
    rpcRetryAttempts: 0,
    curBlocks: 0,
    stepIndex: 0,
    maxWalletCount: globalCfg.get("max_wallet_count"),
    isWatchingOnly: false,

    synced: false,
    syncFetchHeadersComplete: false,

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
  },
  notifications: {
    transactionNtfns: null,
    transactionNtfnsError: null,
    accountNtfnsRequestAttempt: false,
    accountNtfnsResponse: null,
  },
  control: {
    numTicketsToBuy: 1,
    // ExtendedPubKey
    getExtendedPubKeyAttempt: false,
    getExtendedPubKeyResponse: null,
    getExtendedPubKeyError: null,
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
    balanceToMaintain: null,
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

    exportingData: false,
    modalVisible: false,
    aboutModalMacOSVisible: false
  },
  snackbar: {
    messages: Array()
  },
  sidebar: {
    expandSideBar: true,
  },
  statistics: {
    dailyBalances: Array(),
    fullDailyBalances: Array(),
    voteTime: null,
    getMyTicketsStatsRequest: false,
    getStartupStatsAttempt: false,
    startupStatsEndCalcTime: new Date(0),
  },
  governance: {
    getVettedAttempt: false,
    activeVote: [],
    preVote: [],
    voted: [],

    getProposalAttempt: false,
    getProposalError: null,
    proposals: {}, // map from proposal token (id) to proposal details
    lastVettedFetchTime: new Date(0), // time when vetted proposals were requested
  },
  trezor: {
    enabled: false,
    debug: globalCfg.get("trezor_debug"),
    deviceList: null,
    getDeviceListAttempt: false,
    transportError: false,
    device: null,
    performingOperation: false,
    waitingForPin: false,
    waitingForPassPhrase: false,
    waitingForWord: false,
    pinCallBack: null,
    passPhraseCallBack: null,
    pinMessage: null,
    passPhraseMessage: null,
    wordCallBack: null,
    walletCreationMasterPubkeyAttempt: false,
  },
  locales: locales
};

const history = createMemoryHistory();
const store = configureStore(initialState, history);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
