import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { App } from "containers";
import configureStore from "./store/configureStore";
import locales from "./i18n/locales";
import "pi-ui/dist/index.css";
import "./style/main.css";
import pkg from "./package.json";
import {
  DCR,
  THEME,
  LOCALE,
  NETWORK,
  PROPOSALS_MAX_PAGE_SIZE
} from "constants";
import * as cfgConstants from "constants/config";
import { wallet } from "wallet-preload-shim";
import { AppContainer } from "react-hot-loader";
import {
  defaultLightTheme,
  ThemeProvider,
  defaultDarkTheme,
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";
import { sharedTheme, lightTheme, darkTheme, icons } from "style/themes";
import SourceSansProLight from "style/fonts/SourceSansPro-Light.ttf";
import SourceSansProLightItalic from "style/fonts/SourceSansPro-LightItalic.ttf";
import SourceSansProRegular from "style/fonts/SourceSansPro-Regular.ttf";
import SourceSansProItalic from "style/fonts/SourceSansPro-Italic.ttf";
import SourceSansProSemiBold from "style/fonts/SourceSansPro-SemiBold.ttf";
import SourceSansProSemiBoldItalic from "style/fonts/SourceSansPro-SemiBoldItalic.ttf";
import SourceSansProBold from "style/fonts/SourceSansPro-Bold.ttf";
import SourceSansProBoldItalic from "style/fonts/SourceSansPro-BoldItalic.ttf";
import SourceCodeProRegular from "style/fonts/SourceCodePro-Regular.ttf";
import SourceCodeProBold from "style/fonts/SourceCodePro-Bold.ttf";

const { log, getCLIOptions, getHeightSynced } = wallet;

const globalCfg = wallet.getGlobalCfg();
const locale = globalCfg.get(LOCALE);
const cliOptions = getCLIOptions();

log("info", "Starting main react app");

const hasCliOption = (key) => cliOptions && cliOptions[key];

// Apply translated strings from custom translation file if it was loaded for
// this locale.
const customLocaleMsgs = wallet.getCustomTranslationMessages();
const currLocale = locales.find((value) => value.key === locale);
if (currLocale && customLocaleMsgs) {
  currLocale.messages = customLocaleMsgs;
}

const currentSettings = {
  locale: locale,
  daemonStartAdvanced:
    hasCliOption("daemonStartAdvanced") || wallet.getDaemonIsAdvanced(),
  daemonStartAdvancedFromCli: !!hasCliOption("daemonStartAdvanced"),
  allowedExternalRequests: globalCfg.get(
    cfgConstants.ALLOWED_EXTERNAL_REQUESTS
  ),
  proxyType: globalCfg.get(cfgConstants.PROXY_TYPE),
  proxyLocation: globalCfg.get(cfgConstants.PROXY_LOCATION),
  spvMode: hasCliOption("spvMode") || wallet.getIsSpv(),
  spvModeFromCli: !!hasCliOption("spvMode"),
  spvConnect:
    hasCliOption("spvConnect") || globalCfg.get(cfgConstants.SPV_CONNECT),
  spvConnectFromCli: !!hasCliOption("spvConnect"),
  timezone: globalCfg.get(cfgConstants.TIMEZONE),
  currencyDisplay: DCR,
  network: hasCliOption("network") || globalCfg.get(NETWORK),
  networkFromCli: !!hasCliOption("network"),
  theme: globalCfg.get(THEME),
  uiAnimations: globalCfg.get(cfgConstants.UI_ANIMATIONS)
};
const initialState = {
  settings: {
    currentSettings: currentSettings,
    tempSettings: currentSettings,
    settingsChanged: false,
    needNetworkReset: false
  },
  stakepool: {
    currentStakePoolConfig: null,
    selectedStakePool: null
  },
  vsp: {
    availableVSPs: null,
    availableVSPsError: null,
    ticketAutoBuyerRunning: null,
    isLegacy: null,
    rememberedVspHost: null,
    processUnmanagedTicketsAttempt: false,
    processUnmanagedTicketsError: null,
    processManagedTicketsAttempt: false,
    processManagedTicketsError: null,
    trackedTickets: {},
    needsProcessManagedTickets: true,
    canDisableProcessManaged: true
  },
  daemon: {
    networkMatch: false,
    appVersion: pkg.version,
    daemonRemote: false,
    locale: locale,
    tutorial: globalCfg.get(cfgConstants.SHOW_TUTORIAL),
    visitedTutorialTabs: globalCfg.get(cfgConstants.VISITED_TUTORIAL_TABS),
    showPrivacy: globalCfg.get(cfgConstants.SHOW_PRIVACY),
    setLanguage: globalCfg.get(cfgConstants.SET_LANGUAGE),
    showSpvChoice: globalCfg.get(cfgConstants.SHOW_SPV_CHOICE),
    daemonStarted: false,
    daemonSynced: getHeightSynced(),
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
    requiredVersion: "7.12.0",
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

    recentStakeTransactions: [],

    // GetTransactions
    // requestHeight of last getTransaction call
    startRequestHeight: null,
    // noMoreLiveTickets check if no more live tickets can be find.
    noMoreLiveTickets: null,
    // stakeTransactionsCancel checks if a stake transaction is canceled from
    // getting more transactions.
    stakeTransactionsCancel: false,
    unminedTransactions: [],
    // map representing each txs type
    stakeTransactions: {},
    regularTransactions: {},
    normalizedRegularTransactions: {},
    // getRegularTxsAux is a state helper to get regular transactions
    getRegularTxsAux: {
      noMoreTransactions: false,
      lastTransaction: null
    },
    // getRegularTxsAux is a state helper to get stake transactions
    getStakeTxsAux: {
      noMoreTransactions: false,
      lastTransaction: null
    },
    transactionsFilter: {
      search: null, // The freeform text in the Search box
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      types: [], // desired transaction types (code). All if blank. (mixed)
      directions: [], // directions of desired transactions (sent/received/transfer/ticketfee)
      maxAmount: null,
      minAmount: null
    },
    getTransactionsRequestAttempt: false,
    getTransactionsResponse: null,
    ticketsFilter: {
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      status: null, // desired ticket status (code). All if blank.
      vspFeeStatus: null // All if blank.
    },

    // Agenda/VoteChoices
    allAgendas: [],
    getAgendasResponse: null,
    getVoteChoicesResponse: null,

    // map from (reversed) transaction hash to fully decoded transaction
    decodedTransactions: {},

    // Map that stores the accounts that should be updated at future block
    // heights, due to maturing stake transactions. Keys are the heights,
    // values are arrays of account numbers.
    maturingBlockHeights: {},

    // Shown under governance tab
    treasuryBalance: null
  },
  walletLoader: {
    syncInput: false,
    syncError: null,
    syncAttemptRequest: null,
    syncCall: null,
    peerCount: 0,
    rpcRetryAttempts: 0,
    curBlocks: 0,
    isWatchingOnly: false,
    selectedWallet: null,

    synced: false,
    syncFetchHeadersComplete: false,

    // Loader
    getLoaderRequestAttempt: false,
    loader: null,
    getLoaderError: null,
    showStakingWarning: true
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
    aboutModalMacOSVisible: false,
    cantCloseModalVisible: false,
    changeScriptByAccount: {},
    monitorLockableAccountsTimer: null,
    confirmationDialogModalVisible: false,
    settingAccountsPassphrase: false
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
    proposals: {
      abandonedVote: [],
      activeVote: [],
      approvedVote: [],
      finishedVote: [],
      preVote: [],
      rejectedVote: []
    },
    proposalsDetails: {},
    getProposalError: null,
    proposallistpagesize: PROPOSALS_MAX_PAGE_SIZE
  },
  trezor: {
    enabled: false,
    debug: globalCfg.get(cfgConstants.TREZOR_DEBUG),
    deviceList: null,
    getDeviceListAttempt: false,
    transportError: false,
    device: null,
    performingOperation: false,
    waitingForPin: false,
    waitingForPassPhrase: false,
    waitingForWord: false,
    performingRecoverDevice: false,
    confirmingTogglePassphrase: false,
    enablePassphraseProtection: false,
    pinCallBack: null,
    passPhraseCallBack: null,
    pinMessage: null,
    passPhraseMessage: null,
    wordCallBack: null,
    walletCreationMasterPubkeyAttempt: false
  },
  ln: {
    enabled: globalCfg.get(cfgConstants.LN_ENABLED),
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
    outstandingPayments: {}, // map paymentHash => payment data
    failedPayments: Array(),
    addInvoiceAttempt: false,
    cancelInvoiceAttempt: false,
    sendPaymentAttempt: false,
    scbPath: "",
    scbUpdatedTime: 0,
    nodeInfo: null,
    getNodeInfoAttempt: false,
    towersList: [],
    invoiceFilter: {
      search: null, // The freeform text in the Search box
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      type: null // desired invoice type (code).
    },
    paymentFilter: {
      search: null, // The freeform text in the Search box
      listDirection: "desc", // asc = oldest -> newest, desc => newest -> oldest
      type: null // desired payment type (code).
    },
    channelFilter: {
      search: null, // The freeform text in the Search box
      type: null // desired channel type (code).
    },
    recentlyOpenedChannel: null,
    describeGraph: Array(),
    modifyAutopilotStatusAttempt: false,
    getAutopilotStatusAttempt: false,
    autopilotEnabled: false,
    getTransactionsAttempt: false,
    transactions: Array(),
    lastDcrlndLogLine: "",
    routerPruneTarget: 0,
    routerPruneHeight: 0,
    routerPruneStart: 0
  },
  dex: {
    dexOrdersOpen: false,
    loggedIn: false,
    alreadyPaid: false
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
  // SourceCodePro
  {
    "font-family": "Source Code Pro",
    src: `url(${SourceCodeProRegular}) format("truetype")`
  },
  {
    "font-family": "Source Code Pro",
    src: `url(${SourceCodeProBold}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-bold"]
  }
];

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: {
    ...defaultLightTheme,
    ...sharedTheme,
    ...lightTheme,
    ...icons
  },
  [DEFAULT_DARK_THEME_NAME]: {
    ...defaultDarkTheme,
    ...sharedTheme,
    ...darkTheme,
    ...icons
  }
};

const history = createMemoryHistory();
const store = configureStore(initialState, history);

const currentTheme = currentSettings && currentSettings.theme;
const defaultThemeName = currentTheme.includes("dark")
  ? DEFAULT_DARK_THEME_NAME
  : DEFAULT_LIGHT_THEME_NAME;

const render = () =>
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider
        themes={themes}
        defaultThemeName={defaultThemeName}
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
