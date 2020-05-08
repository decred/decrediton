// @flow
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { App } from "containers";
import configureStore from "./store/configureStore";
import { getGlobalCfg, getDaemonIsAdvanced, getIsSpv } from "./config";
import locales from "./i18n/locales";
import "pi-ui/dist/index.css";
import "./style/main.less";
import "./style/ReactSelectGlobal.less";
import pkg from "./package.json";
import { log } from "./wallet";
import { ipcRenderer } from "electron";
import { DCR, THEME, LOCALE, NETWORK } from "constants";
import { getSelectedWallet } from "./main_dev/launch";
import { AppContainer } from "react-hot-loader";

import { defaultLightTheme, ThemeProvider, defaultDarkTheme } from "pi-ui";
import { lightTheme, darkTheme, icons } from "style/themes";
import SourceSansProLight from "style/fonts/SourceSansPro-Light.ttf";
import SourceSansProLightItalic from "style/fonts/SourceSansPro-LightItalic.ttf";
import SourceSansProRegular from "style/fonts/SourceSansPro-Regular.ttf";
import SourceSansProItalic from "style/fonts/SourceSansPro-Italic.ttf";
import SourceSansProSemiBold from "style/fonts/SourceSansPro-SemiBold.ttf";
import SourceSansProSemiBoldItalic from "style/fonts/SourceSansPro-SemiBoldItalic.ttf";
import SourceSansProBold from "style/fonts/SourceSansPro-Bold.ttf";
import SourceSansProBoldItalic from "style/fonts/SourceSansPro-BoldItalic.ttf";
import InconsolataRegular from "style/fonts/Inconsolata-Regular.ttf";
import InconsolataBold from "style/fonts/Inconsolata-Bold.ttf";

const globalCfg = getGlobalCfg();
const locale = globalCfg.get(LOCALE);
const cliOptions = ipcRenderer.sendSync("get-cli-options");

log("info", "Starting main react app");

const hasCliOption = (key) => cliOptions && cliOptions[key];

const currentSettings = {
  locale: locale,
  daemonStartAdvanced:
    hasCliOption("daemonStartAdvanced") || getDaemonIsAdvanced(),
  daemonStartAdvancedFromCli: !!hasCliOption("daemonStartAdvanced"),
  allowedExternalRequests: globalCfg.get("allowed_external_requests"),
  proxyType: globalCfg.get("proxy_type"),
  proxyLocation: globalCfg.get("proxy_location"),
  spvMode: hasCliOption("spvMode") || getIsSpv(),
  spvModeFromCli: !!hasCliOption("spvMode"),
  spvConnect: hasCliOption("spvConnect") || globalCfg.get("spv_connect"),
  spvConnectFromCli: !!hasCliOption("spvConnect"),
  timezone: globalCfg.get("timezone"),
  currencyDisplay: DCR,
  network: hasCliOption("network") || globalCfg.get(NETWORK),
  networkFromCli: !!hasCliOption("network"),
  theme: globalCfg.get(THEME)
};
const initialState = {
  settings: {
    currentSettings: currentSettings,
    tempSettings: currentSettings,
    settingsChanged: false,
    uiAnimations: globalCfg.get("ui_animations"),
    needNetworkReset: false,
    theme: globalCfg.get(THEME)
  },
  stakepool: {
    currentStakePoolConfig: null,
    currentStakePoolConfigRequest: false,
    currentStakePoolConfigError: null,
    currentStakePoolConfigSuccessMessage: "",
    activeStakePoolConfig: false,
    selectedStakePool: null,
    updatedStakePoolList: false,
    addCustomStakePoolAttempt: false
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
    daemonSynced: ipcRenderer.sendSync("get-height-synced"),
    daemonStopped: false,
    daemonTimeout: false,
    walletReady: false,
    currentBlockCount: null,
    timeLeftEstimate: null,
    timeStart: 0,
    blockStart: 0,
    credentials: null,
    appdata: null,
    shutdownRequested: false,
    remoteAppdataError: false,
    previousWallet: null,
    hiddenAccounts: Array(),
    walletName: null,
    neededBlocks: 0
  },
  version: {
    // RequiredVersion
    requiredVersion: "7.4.0",
    versionInvalid: false,
    versionInvalidError: null,
    // VersionService
    versionService: null,
    getVersionServiceRequestAttempt: false,
    getVersionServiceError: "",
    // Balance
    getWalletRPCVersionError: null,
    getWalletRPCVersionRequestAttempt: false,
    getWalletRPCVersionResponse: null
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
      minAmount: null
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
      status: [] // desired ticket status (code). All if blank.
    },
    getTicketsStartRequestHeight: null,
    getTicketsCancel: false, // user requested cancelation (but it hasn't happened yet)
    getTicketsProgressStartRequestHeight: null,

    // Agenda/VoteChoices
    allAgendas: [],
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
    treasuryBalance: null
  },
  walletLoader: {
    syncInput: false,
    syncError: null,
    syncAttemptRequest: false,
    syncCall: null,
    peerCount: 0,
    rpcRetryAttempts: 0,
    curBlocks: 0,
    maxWalletCount: globalCfg.get("max_wallet_count"),
    isWatchingOnly: false,
    // getSelectedWallet returns null if no wallet is selected.
    selectedWallet: getSelectedWallet(),

    synced: false,
    syncFetchHeadersComplete: false,

    // Loader
    getLoaderRequestAttempt: false,
    loader: null,
    getLoaderError: null,
    // WalletCreate
    createWalletExisting: false
  },
  notifications: {
    transactionNtfns: null,
    transactionNtfnsError: null,
    accountNtfnsRequestAttempt: false,
    accountNtfnsResponse: null
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

    walletMasterPubKey: null,
    exportingData: false,
    modalVisible: false,
    aboutModalMacOSVisible: false,
    autobuyerRunningModalVisible: false,
    changeScriptByAccount: {}
  },
  snackbar: {
    messages: Array()
  },
  sidebar: {
    expandSideBar: true
  },
  statistics: {
    dailyBalances: [],
    fullDailyBalances: [],
    voteTime: null,
    getMyTicketsStatsRequest: false,
    getStartupStatsAttempt: false,
    startupStatsEndCalcTime: new Date(0),
    ticketDataHeatmap: []
  },
  governance: {
    getProposalsAttempt: false,
    inventory: null,
    proposals: null,
    proposalsDetails: {},
    getProposalError: null,
    // TODO: Get proposallistpagesize from politeia's request: /v1/policy
    proposallistpagesize: 20
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
    walletCreationMasterPubkeyAttempt: false
  },
  ln: {
    enabled: globalCfg.get("ln_enabled"),
    active: false,
    exists: false,
    connectAttempt: false,
    startAttempt: false,
    info: {
      version: null,
      identityPubkey: null,
      alias: null
    },
    walletBalances: {
      totalBalance: 0,
      confirmedBalance: 0,
      unconfirmedBalance: 0
    },
    channelBalances: {
      balance: 0,
      pendingOpenBalance: 0,
      maxInboundAmount: 0,
      maxOutboundAmount: 0
    },
    channels: Array(),
    pendingChannels: Array(),
    closedChannels: Array(),
    invoices: Array(),
    payments: Array(),
    addInvoiceAttempt: false,
    sendPaymentAttempt: false
  },
  locales: locales
};

const fonts = [
  // Source Sans Pro
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProLight}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-light"]
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProLightItalic}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-light"],
    "font-style": "italic"
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProRegular}) format("truetype")`
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProItalic}) format("truetype")`,
    "font-style": "italic"
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProSemiBold}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-semi-bold"]
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProSemiBoldItalic}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-semi-bold"],
    "font-style": "italic"
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProBold}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-bold"]
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProBoldItalic}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-bold"],
    "font-style": "italic"
  },
  // Inconsolata
  {
    "font-family": "Inconsolata",
    src: `url(${InconsolataRegular}) format("truetype")`
  },
  {
    "font-family": "Inconsolata",
    src: `url(${InconsolataBold}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-bold"]
  }
];

const themes = {
  "theme-light": { ...defaultLightTheme, ...lightTheme, ...icons },
  "theme-dark": { ...defaultDarkTheme, ...darkTheme, ...icons }
};

const history = createMemoryHistory();
const store = configureStore(initialState, history);

const render = () => ReactDOM.render(
  <AppContainer>
    <ThemeProvider
      themes={themes}
      defaultThemeName={currentSettings.theme}
      fonts={fonts}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  </AppContainer>,
  document.getElementById("root")
);

render();
