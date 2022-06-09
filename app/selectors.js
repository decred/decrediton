import {
  compose,
  reduce,
  filter,
  get,
  not,
  or,
  and,
  eq,
  bool,
  map,
  apply,
  some,
  uniq,
  createSelectorEager as createSelector
} from "./fp";
import { isNull } from "lodash";
import { appLocaleFromElectronLocale } from "./i18n/locales";
import { decodeVoteScript, dateToLocal, dateToUTC } from "helpers";
import {
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA
} from "constants";
import {
  POLITEIA_URL_TESTNET,
  POLITEIA_URL_MAINNET
} from "./middleware/politeiaapi";
import {
  DCRDATA_URL_TESTNET,
  DCRDATA_URL_MAINNET
} from "./middleware/dcrdataapi";
import {
  MainNetParams,
  TestNetParams,
  MainNetDexServer,
  TestNetDexServer,
  MIN_RELAY_FEE,
  DCR,
  ATOMS,
  UNIT_DIVISOR,
  TESTNET,
  MAINNET,
  VOTED
} from "constants";
import { wallet } from "wallet-preload-shim";
import { isArray } from "lodash";

const EMPTY_ARRAY = []; // Maintaining identity (will) improve performance;

export const theme = get(["settings", "currentSettings", "theme"]);
// Daemon startup selectors
export const daemonError = get(["daemon", "daemonError"]);
export const walletError = get(["daemon", "walletError"]);
export const appVersion = get(["daemon", "appVersion"]);
export const updateAvailable = get(["daemon", "updateAvailable"]);
export const isDaemonRemote = get(["daemon", "daemonRemote"]);
export const getDaemonStarted = get(["daemon", "daemonStarted"]);
export const getCurrentBlockCount = get(["daemon", "currentBlockCount"]);
export const getNeededBlocks = get(["daemon", "neededBlocks"]);
export const getEstimatedTimeLeft = get(["daemon", "timeLeftEstimate"]);
export const getDaemonSynced = get(["daemon", "daemonSynced"]);
export const getWalletReady = get(["daemon", "walletReady"]);
export const getSyncAttemptRequest = get([
  "walletLoader",
  "syncAttemptRequest"
]);

// general startup selector
export const pageBodyScrollHandler = get(["control", "pageBodyScrollHandler"]);
export const pageBodyTopRef = get(["control", "pageBodyTopRef"]);
export const setLanguage = get(["daemon", "setLanguage"]);
export const showTutorial = get(["daemon", "tutorial"]);
export const visitedTutorialTabs = get(["daemon", "visitedTutorialTabs"]);
export const showPrivacy = get(["daemon", "showPrivacy"]);
export const showSpvChoice = get(["daemon", "showSpvChoice"]);
export const daemonWarning = get(["daemon", "daemonWarning"]);
export const versionInvalid = get(["version", "versionInvalid"]);
export const requiredWalletRPCVersion = get(["version", "requiredVersion"]);
export const walletRPCVersion = createSelector(
  [get(["version", "getWalletRPCVersionResponse"])],
  (r) => (r ? r.versionString : null)
);
export const getVersionServiceError = get([
  "version",
  "getVersionServiceError"
]);
export const getWalletRPCVersionError = get([
  "version",
  "getWalletRPCVersionError"
]);
export const getLoaderError = get(["version", "getLoaderError"]);
export const versionInvalidError = createSelector(
  [versionInvalid, get(["version", "versionInvalidError"])],
  (invalid, error) => (invalid ? error || "Unknown Error" : null)
);

// rpc or spv dcrwallet sync selectors
export const syncInput = get(["walletLoader", "syncInput"]);
export const peerCount = get(["walletLoader", "peerCount"]);
export const synced = get(["walletLoader", "synced"]);
export const syncFetchMissingCfiltersAttempt = get([
  "walletLoader",
  "syncFetchMissingCfiltersAttempt"
]);
export const syncFetchMissingCfiltersStart = get([
  "walletLoader",
  "syncFetchMissingCfiltersStart"
]);
export const syncFetchMissingCfiltersEnd = get([
  "walletLoader",
  "syncFetchMissingCfiltersEnd"
]);
export const syncFetchHeadersAttempt = get([
  "walletLoader",
  "syncFetchHeadersAttempt"
]);
export const syncFetchHeadersCount = get([
  "walletLoader",
  "syncFetchHeadersCount"
]);
export const syncFetchHeadersLastHeaderTime = get([
  "walletLoader",
  "syncLastFetchedHeaderTime"
]);
export const syncDiscoverAddressesAttempt = get([
  "walletLoader",
  "syncDiscoverAddressesAttempt"
]);
export const syncRescanAttempt = get(["walletLoader", "syncRescanAttempt"]);
export const syncFetchHeadersComplete = get([
  "walletLoader",
  "syncFetchHeadersComplete"
]);
export const syncFetchTimeStart = get(["walletLoader", "syncFetchTimeStart"]);
export const getPrivacyEnabled = get(["walletLoader", "privacyEnabled"]);
export const getAllowSendFromUnmixed = get([
  "walletLoader",
  "allowSendFromUnmixed"
]);
// getMixedAccount gets the account number (int) which represents the mixed
// account at decrediton.
export const getMixedAccount = get(["walletLoader", "mixedAccount"]);
// getChangeAccount get the changeaccount selector, which is used for unmixed
// accounts on mixer.
export const getChangeAccount = get(["walletLoader", "changeAccount"]);
export const getCsppServer = get(["walletLoader", "csppServer"]);
export const getCsppPort = get(["walletLoader", "csppPort"]);
export const getMixedAccountBranch = get([
  "walletLoader",
  "mixedAccountBranch"
]);

export const getMixedAccountSpendableBalance = get([
  "grpc",
  "mixedAccountSpendableBalance"
]);
export const getChangeAccountSpendableBalance = get([
  "grpc",
  "changeAccountSpendableBalance"
]);

export const discoverUsageAttempt = get(["control", "discoverUsageAttempt"]);
export const showStakingWarning = bool(
  get(["walletLoader", "showStakingWarning"])
);

const availableWallets = get(["daemon", "availableWallets"]);
const availableWalletsSelect = createSelector([availableWallets], (wallets) =>
  map(
    (wallet) => ({
      label: wallet.wallet + " (" + wallet.network + ")",
      value: wallet,
      network: wallet.network,
      finished: wallet.finished,
      isWatchingOnly: wallet.isWatchingOnly,
      lastAccess: wallet.lastAccess ? new Date(wallet.lastAccess) : null
    }),
    wallets
  )
);
export const sortedAvailableWallets = createSelector(
  [availableWalletsSelect],
  (availableWallets) =>
    availableWallets.sort((a, b) => b.lastAccess - a.lastAccess)
);
export const previousWallet = get(["daemon", "previousWallet"]);
export const getWalletName = get(["daemon", "walletName"]);
export const getSelectedWallet = get(["walletLoader", "selectedWallet"]);

// balances is the selector responsable for keeping account balances and
// other informations. This is the selector which we sort our accounts,
// for example.
export const balances = or(get(["grpc", "balances"]), () => []);

// dcrwallet grpc services
export const walletService = get(["grpc", "walletService"]);
export const agendaService = get(["grpc", "agendaService"]);
export const votingService = get(["grpc", "votingService"]);
export const accountMixerService = get(["grpc", "accountMixerService"]);
export const decodeMessageService = get(["grpc", "decodeMessageService"]);

// TODO review selectors that are not being used anymore.
export const getBalanceRequestAttempt = get([
  "grpc",
  "getBalanceRequestAttempt"
]);
export const getAccountsResponse = get(["grpc", "getAccountsResponse"]);
export const getNetworkResponse = get(["grpc", "getNetworkResponse"]);
export const getNetworkError = get(["grpc", "getNetworkError"]);
export const getAccountMixerRunning = get(["grpc", "accountMixerRunning"]);
export const getAccountMixerError = get(["grpc", "mixerStreamerError"]);
export const getIsMixerDisabled = get(["grpc", "isMixerDisabled"]);
export const createMixerAccountAttempt = get([
  "grpc",
  "createMixerAccountAttempt"
]);

// accounts is a selector representing accountsList from gRPC response.
export const accounts = createSelector([getAccountsResponse], (r) =>
  r ? r.accountsList : []
);

export const isWatchingOnly = bool(get(["walletLoader", "isWatchingOnly"]));
export const accountExtendedKey = createSelector(
  [get(["control", "getAccountExtendedKeyResponse"])],
  (response) => (response ? response.accExtendedPubKey : null)
);
export const sortedAccounts = createSelector([balances], (balances) =>
  balances.slice().sort((a, b) => a.accountNumber - b.accountNumber)
);

export const totalBalance = createSelector(
  [balances],
  reduce((atoms, { total }) => atoms + total, 0)
);

export const spendableTotalBalance = createSelector(
  [balances],
  reduce(
    (total, { accountName, spendable }) =>
      accountName === "imported" ? total : total + spendable,
    0
  )
);

export const lockedTotalBalance = createSelector(
  [totalBalance, spendableTotalBalance],
  (totalBalance, spendableTotalBalance) => totalBalance - spendableTotalBalance
);

export const unconfirmedTotalBalance = createSelector(
  [balances],
  reduce(
    (total, { accountName, unconfirmed }) =>
      accountName === "imported" ? total : total + unconfirmed,
    0
  )
);

export const getMixedAccountName = createSelector(
  [getMixedAccount, balances],
  (mixedAcc, balances) =>
    !mixedAcc
      ? null
      : balances
          .filter(({ accountNumber }) => accountNumber === mixedAcc)
          .map(({ accountName }) => accountName)[0]
);

export const getChangeAccountName = createSelector(
  [getChangeAccount, balances],
  (changeAcc, balances) =>
    !changeAcc
      ? null
      : balances
          .filter(({ accountNumber }) => accountNumber === changeAcc)
          .map(({ accountName }) => accountName)[0]
);

// getNotMixedAccounts Is an array of all accountNumbers which is not the mixedaccount.
// this ways we can filter our mixedAccount to send transactions in privacy wallets.
// If allowSendFromUnmixed is enabled, it returns null.
export const getNotMixedAccounts = createSelector(
  [getMixedAccount, balances, getAllowSendFromUnmixed],
  (mixedAcc, balances) =>
    !mixedAcc
      ? []
      : balances
          .filter(({ accountNumber }) => accountNumber !== mixedAcc)
          .map(({ accountNumber }) => accountNumber)
);

// getNotMixedAcctIfAllowed checks if it is allowed to send from unmixed
// accounts and returns an empty array, if that's the case.
export const getNotMixedAcctIfAllowed = createSelector(
  [getNotMixedAccounts, getAllowSendFromUnmixed],
  (notMixedAccts, allowSendFromUnmixed) => {
    return !allowSendFromUnmixed ? notMixedAccts : [];
  }
);

export const lockedByTicketsTotalBalance = createSelector(
  [balances],
  reduce((atoms, { lockedByTickets }) => atoms + lockedByTickets, 0)
);

export const immatureRewardTotalBalance = createSelector(
  [balances],
  reduce((total, { immatureReward }) => total + immatureReward, 0)
);

export const immatureStakeGenerationTotalBalance = createSelector(
  [balances],
  reduce(
    (total, { immatureStakeGeneration }) => total + immatureStakeGeneration,
    0
  )
);

export const networks = () => [{ name: TESTNET }, { name: MAINNET }];
export const network = get(["settings", "currentSettings", "network"]);
export const isTestNet = compose(eq(TESTNET), network);
export const isMainNet = not(isTestNet);
export const firstBlockTime = compose(
  (isMainNet) =>
    isMainNet
      ? new Date("2016-02-08 18:00:00 UTC")
      : new Date("2018-08-06 00:00:00 UTC"),
  isMainNet
);
export const currencies = () => [{ name: DCR }, { name: ATOMS }];
export const gapLimit = get(["settings", "currentSettings", "gapLimit"]);
export const needNetworkReset = get(["settings", "needNetworkReset"]);
export const currencyDisplay = get([
  "settings",
  "currentSettings",
  "currencyDisplay"
]);
export const unitDivisor = compose(
  (disp) => (disp === DCR ? UNIT_DIVISOR : 1),
  currencyDisplay
);
export const currentLocaleName = get(["settings", "currentSettings", "locale"]);
export const timezone = get(["settings", "currentSettings", "timezone"]);
export const defaultLocaleName = createSelector(
  [currentLocaleName],
  (currentLocaleName) => {
    return appLocaleFromElectronLocale(currentLocaleName);
  }
);
export const tsDate = compose(
  (timezone) => (timezone === "utc" ? dateToUTC : dateToLocal),
  timezone
);

export const isSPV = get(["settings", "currentSettings", "spvMode"]);
export const isAdvancedDaemon = get([
  "settings",
  "currentSettings",
  "daemonStartAdvanced"
]);

export const sortedLocales = createSelector([get(["locales"])], (locales) =>
  locales.sort((a, b) => a.description.localeCompare(b.description))
);
export const namedLocales = createSelector([get(["locales"])], (locales) =>
  reduce(
    (nl, l) => {
      nl[l.key] = l;
      return nl;
    },
    {},
    locales
  )
);
export const locale = createSelector(
  [namedLocales, currentLocaleName],
  (namedLocales, currentLocaleName) => {
    return namedLocales[currentLocaleName] || namedLocales["en"];
  }
);

export const txURLBuilder = createSelector([network], (network) => (txHash) =>
  `https://${
    network !== TESTNET ? "dcrdata" : "testnet"
  }.decred.org/tx/${txHash}`
);

export const blockURLBuilder = createSelector(
  [network],
  (network) => (txHash) =>
    `https://${
      network !== TESTNET ? "dcrdata" : "testnet"
    }.decred.org/block/${txHash}`
);

export const txOutURLBuilder = createSelector(
  [network],
  (network) => (txHash, outputIdx) =>
    `https://${
      network !== "testnet" ? "explorer" : network
    }.dcrdata.org/tx/${txHash}/out/${outputIdx}`
);

export const decodedTransactions = get(["grpc", "decodedTransactions"]);

export const chainParams = compose(
  (isTestNet) => (isTestNet ? TestNetParams : MainNetParams),
  isTestNet
);

export const numTicketsToBuy = get(["control", "numTicketsToBuy"]);

// ****** Transactions selectors ********

// transactions selectors before normalized
// these selectors are maps, with tx hash as key, containing all transactions
// which decrediton already known about them.

export const regularTransactions = get(["grpc", "regularTransactions"]);
export const stakeTransactions = get(["grpc", "stakeTransactions"]);

export const startRequestHeight = get(["grpc", "startRequestHeight"]);

export const noMoreRegularTxs = get([
  "grpc",
  "getRegularTxsAux",
  "noMoreTransactions"
]);
export const noMoreStakeTxs = get([
  "grpc",
  "getStakeTxsAux",
  "noMoreTransactions"
]);
export const transactionsFilter = get(["grpc", "transactionsFilter"]);
export const ticketsFilter = get(["grpc", "ticketsFilter"]);

export const getStakeTransactionsCancel = get([
  "grpc",
  "stakeTransactionsCancel"
]);

export const lastVotedTicket = createSelector(
  [stakeTransactions],
  (transactions) => {
    const lastVotedTicket = Object.keys(transactions)
      .map((hash) => transactions[hash])
      .filter((transaction) => transaction.status == VOTED)
      .reduce(
        (prev, current) =>
          prev.leaveTimestamp > current.leaveTimestamp ? prev : current,
        []
      );

    return isArray(lastVotedTicket) ? null : lastVotedTicket;
  }
);

// note that hasTickets means "ever had any tickets", **NOT** "currently has live
// tickets".
export const hasTickets = compose(
  (t) => t && Object.keys(t).length > 0,
  stakeTransactions
);

export const homeHistoryTickets = get(["grpc", "recentStakeTransactions"]);

export const homeHistoryTransactions = get([
  "grpc",
  "recentRegularTransactions"
]);

// ******* end of transactions selectors ************

// ************** VSP selectors ******************
// purchase tickets selectors
export const getAvailableVSPs = get(["vsp", "availableVSPs"]);
export const getDiscoverAvailableVSPError = get(["vsp", "availableVSPsError"]);

export const isSyncingTickets = get(["vsp", "syncVSPRequestAttempt"]);
export const needsProcessManagedTickets = get([
  "vsp",
  "needsProcessManagedTickets"
]);
export const canDisableProcessManaged = get([
  "vsp",
  "canDisableProcessManaged"
]);

// ticket auto buyer
export const getTicketAutoBuyerRunning = get(["vsp", "ticketAutoBuyerRunning"]);
export const legacyBuyerVSP = get(["control", "legacyVsp"]);
export const legacyBuyerBalanceToMaintain = get([
  "control",
  "legacyBalanceToMaintain"
]);
export const legacyBuyerAccount = get(["control", "legacyAccount"]);
export const getHasVSPTicketsError = get(["vsp", "hasVSPTicketsError"]);
export const getIsLegacy = () => false; // hide legacy purchase
export const getRememberedVspHost = get(["vsp", "rememberedVspHost"]);

export const getVSPTicketsHashes = get(["vsp", "vspTickets"]);
export const isGetVSPAttempt = get(["vsp", "getVSPAttempt"]);
export const unspentUnexpiredVspTickets = get([
  "vsp",
  "unspentUnexpiredVspTickets"
]);

export const isProcessingManaged = get(["vsp", "processManagedTicketsAttempt"]);
export const isProcessingUnmanaged = get([
  "vsp",
  "processUnmanagedTicketsAttempt"
]);
export const isSettingAccountsPassphrase = get([
  "control",
  "settingAccountsPassphrase"
]);

export const getAvailableVSPsPubkeys = get(["vsp", "availableVSPsPubkeys"]);
export const getVSPTrackedTickets = get(["vsp", "trackedTickets"]);
export const getVSPTrackedTicketsCommitAccounts = createSelector(
  [getVSPTrackedTickets],
  (trackedTickets) => {
    if (!trackedTickets) return [];
    return uniq(
      Object.values(trackedTickets)
        .reduce((acc, v) => {
          acc.push(...v.tickets);
          return acc;
        }, [])
        .map((v) => v.commitmentAccount)
        .sort()
    );
  }
);
export const getVSPTicketBuyerAccount = get(["vsp", "account"]);

// ****************** end of vsp selectors ******************

export const dailyBalancesStats = get(["statistics", "dailyBalances"]);

export const spendableAndLockedBalance = createSelector(
  [dailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.map((s) => ({
      time: s.time,
      available: s.series.spendable / unitDivisor,
      locked:
        (s.series.locked + s.series.immature + s.series.immatureNonWallet) /
        unitDivisor
    }))
);

export const balanceSent = createSelector([dailyBalancesStats], (balances) =>
  balances.reduce((s, b) => s + b.series.sent, 0)
);

export const balanceReceived = createSelector(
  [dailyBalancesStats],
  (balances) => balances.reduce((s, b) => s + b.series.received, 0)
);

export const sentAndReceivedTransactions = createSelector(
  [dailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.map((s) => ({
      time: s.time,
      sent: s.series.sent / unitDivisor,
      received: s.series.received / unitDivisor
    }))
);

//fake data for ticket tab on overview Page
export const totalValueOfLiveTickets = createSelector(
  [dailyBalancesStats],
  (balances) => {
    if (!balances) return 0;
    const lastBalance = balances[balances.length - 1];
    if (!lastBalance) return 0;
    return lastBalance.series.locked;
  }
);

export const ticketDataHeatmap = get(["statistics", "ticketDataHeatmap"]);

export const ticketDataChart = createSelector(
  [dailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.map((s) => ({
      time: s.time,
      voted: s.series.voted / unitDivisor,
      revoked: s.series.revoked / unitDivisor,
      ticket: s.series.ticket / unitDivisor,
      locked: (s.series.locked + s.series.immature) / unitDivisor,
      immature: s.series.immature / unitDivisor
    }))
);

const rescanResponse = get(["control", "rescanResponse"]);
export const rescanRequest = get(["control", "rescanRequest"]);
export const getTransactionsRequestAttempt = get([
  "grpc",
  "getTransactionsRequestAttempt"
]);
export const notifiedBlockHeight = get(["notifications", "currentHeight"]);

export const currentBlockHeight = get(["grpc", "currentBlockHeight"]);
export const getNoMoreLiveTickets = get(["grpc", "noMoreLiveTickets"]);

export const rescanEndBlock = currentBlockHeight;
export const rescanStartBlock = compose(
  (req) => (req ? req.beginHeight : 0),
  rescanRequest
);
export const rescanCurrentBlock = compose(
  (res) => (res ? res.rescannedThrough : 0),
  rescanResponse
);

export const rescanPercentFinished = createSelector(
  [rescanCurrentBlock, rescanEndBlock],
  (current, end) => ((current / end) * 100).toFixed(2)
);

export const visibleAccounts = createSelector(
  [unitDivisor, currencyDisplay, balances],
  (unitDivisor, currencyDisplay, balances) =>
    reduce(
      (accounts, { accountName, accountNumber, hidden, spendable, ...data }) =>
        accountName === "imported" || hidden
          ? accounts
          : [
              ...accounts,
              {
                value: accountNumber,
                label: `${accountName}: ${
                  spendable / unitDivisor
                } ${currencyDisplay}`,
                name: accountName,
                spendableAndUnit: `${
                  spendable / unitDivisor
                } ${currencyDisplay}`,
                spendable,
                hidden,
                ...data
              }
            ],
      [],
      balances
    )
);

export const spendingAccounts = createSelector(
  [unitDivisor, currencyDisplay, balances],
  (unitDivisor, currencyDisplay, balances) =>
    reduce(
      (accounts, { accountName, accountNumber, spendable, ...data }) =>
        accountNumber !== 0 && (accountName === "imported" || spendable <= 0)
          ? accounts
          : [
              ...accounts,
              {
                value: accountNumber,
                label: `${accountName}: ${
                  spendable / unitDivisor
                } ${currencyDisplay}`,
                name: accountName,
                spendableAndUnit: `${
                  spendable / unitDivisor
                } ${currencyDisplay}`,
                spendable,
                ...data
              }
            ],
      [],
      balances
    )
);

// unlockableAccounts returns a list of accounts which are both
// "standard" (i.e. BIP0044, non-imported) and individually encrypted. These are
// accounts that can be unlocked.
export const unlockableAccounts = createSelector([balances], (balances) =>
  balances.filter(
    (acct) => acct.accountNumber < Math.pow(2, 31) - 1 && acct.encrypted
  )
);

/* autobuyerSettings */
export const buyerBalanceToMaintain = createSelector(
  [get(["vsp", "balanceToMaintain"])],
  (balanceToMaintain) =>
    !isNull(balanceToMaintain)
      ? {
          atomValue: balanceToMaintain,
          value: parseInt(balanceToMaintain) / UNIT_DIVISOR
        }
      : null
);
export const buyerAccount = createSelector(
  [get(["vsp", "account"]), visibleAccounts],
  (buyerAccountName, visibleAccounts) =>
    visibleAccounts.find(({ name }) => name === buyerAccountName)
);
export const buyerMaxFeePercentage = get(["vsp", "maxFeePercentage"]);

const getNextAddressResponse = get(["control", "getNextAddressResponse"]);
const nextAddressAccountNumber = compose(
  (res) => (res ? res.accountNumber : null),
  getNextAddressResponse
);

export const getNextAddressRequestAttempt = get([
  "control",
  "getNextAddressRequestAttempt"
]);
export const nextAddressAccount = createSelector(
  [visibleAccounts, nextAddressAccountNumber],
  (accounts, number) => accounts.find(compose(eq(number), get("value")))
);
export const nextAddress = compose(get("address"), getNextAddressResponse);

export const defaultSpendingAccount = createSelector(
  [visibleAccounts, getMixedAccount],
  (accounts, mixedAccount) =>
    accounts.find(compose(eq(mixedAccount || 0), get("value")))
);

const getNextChangeAddressResponse = get([
  "control",
  "getNextChangeAddressResponse"
]);
export const nextChangeAddress = compose(
  get("address"),
  getNextChangeAddressResponse
);

export const defaultSpendingAccountDisregardMixedAccount = createSelector(
  [visibleAccounts],
  (accounts) => accounts.find(compose(eq(0), get("value")))
);

export const changePassphraseRequestAttempt = get([
  "control",
  "changePassphraseRequestAttempt"
]);

export const constructTxLowBalance = get(["control", "constructTxLowBalance"]);
export const constructTxResponse = get(["control", "constructTxResponse"]);
export const constructTxRequestAttempt = get([
  "control",
  "constructTxRequestAttempt"
]);
const signTransactionRequestAttempt = get([
  "control",
  "signTransactionRequestAttempt"
]);
export const signTransactionError = get(["control", "signTransactionError"]);
const publishTransactionRequestAttempt = get([
  "control",
  "publishTransactionRequestAttempt"
]);
const totalOutputAmount = compose(
  (r) => (r ? r.totalOutputAmount : 0),
  constructTxResponse
);
const totalAmount = compose(
  (res) => (res ? res.totalAmount : 0),
  constructTxResponse
);
const totalPreviousOutputAmount = compose(
  (res) => (res ? res.totalPreviousOutputAmount : 0),
  constructTxResponse
);

export const publishTxResponse = get(["control", "publishTransactionResponse"]);

export const estimatedSignedSize = compose(
  (res) => (res ? res.estimatedSignedSize : 0),
  constructTxResponse
);

export const unsignedTransaction = createSelector(
  [constructTxResponse],
  (res) => (res ? res.unsignedTransaction : null)
);

export const unsignedRawTx = createSelector(
  [constructTxResponse],
  (res) => res && res.rawTx
);

export const estimatedFee = compose(
  (bytes) => (bytes / 1000) * (MIN_RELAY_FEE * UNIT_DIVISOR),
  estimatedSignedSize
);

export const getPeersCount = get(["grpc", "peersCount"]);

export const totalSpent = createSelector(
  [totalPreviousOutputAmount, totalOutputAmount, totalAmount],
  (totalPreviousOutputAmount, totalOutputAmount, totalAmount) =>
    totalPreviousOutputAmount - totalOutputAmount + totalAmount
);

export const isSendingTransaction = bool(
  or(signTransactionRequestAttempt, publishTransactionRequestAttempt)
);

export const isConstructingTransaction = bool(constructTxRequestAttempt);

export const tempSettings = get(["settings", "tempSettings"]);
export const settingsChanged = get(["settings", "settingsChanged"]);
export const uiAnimations = get([
  "settings",
  "currentSettings",
  "uiAnimations"
]);
export const changePassphraseError = get(["control", "changePassphraseError"]);
export const changePassphraseSuccess = get([
  "control",
  "changePassphraseSuccess"
]);
export const updatedStakePoolList = get(["stakepool", "updatedStakePoolList"]);
export const allowedExternalRequests = get([
  "settings",
  "currentSettings",
  "allowedExternalRequests"
]);
export const stakePoolListingEnabled = compose(
  (l) => l.indexOf(EXTERNALREQUEST_STAKEPOOL_LISTING) > -1,
  allowedExternalRequests
);
export const dismissBackupRedeemScript = get([
  "stakepool",
  "dismissBackupRedeemScript"
]);

export const isSigningMessage = get(["grpc", "getSignMessageRequestAttempt"]);
export const signMessageError = get(["grpc", "getSignMessageError"]);
export const signMessageSignature = get(["grpc", "getSignMessageSignature"]);

export const messageVerificationService = get([
  "grpc",
  "messageVerificationService"
]);
export const isVerifyingMessage = get([
  "grpc",
  "getVerifyMessageRequestAttempt"
]);
export const verifyMessageError = get(["grpc", "getVerifyMessageError"]);
export const verifyMessageResponse = get(["grpc", "getVerifyMessageResponse"]);
export const verifyMessageSuccess = compose(
  (r) => (r ? r : null),
  verifyMessageResponse
);

const getStakeInfoResponse = get(["grpc", "getStakeInfoResponse"]);

export const ticketPoolSize = compose(
  (r) => (r ? r.poolSize : 0),
  getStakeInfoResponse
);
export const votedTicketsCount = compose(
  (r) => (r ? r.voted : 0),
  getStakeInfoResponse
);
export const allMempoolTicketsCount = compose(
  (r) => (r ? r.allMempoolTix : 0),
  getStakeInfoResponse
);
export const missedTicketsCount = compose(
  (r) => (r ? r.missed : 0),
  getStakeInfoResponse
);
export const ownMempoolTicketsCount = compose(
  (r) => (r ? r.ownMempoolTix : 0),
  getStakeInfoResponse
);
export const revokedTicketsCount = compose(
  (r) => (r ? r.revoked : 0),
  getStakeInfoResponse
);
export const immatureTicketsCount = compose(
  (r) => (r ? r.immature : 0),
  getStakeInfoResponse
);
export const expiredTicketsCount = compose(
  (r) => (r ? r.expired : 0),
  getStakeInfoResponse
);
export const liveTicketsCount = compose(
  (r) => (r ? r.live : 0),
  getStakeInfoResponse
);
export const unspentTicketsCount = compose(
  (r) => (r ? r.unspent : 0),
  getStakeInfoResponse
);
export const activeTicketsCount = createSelector(
  [isSPV, getStakeInfoResponse],
  (isSPV, r) => (isSPV ? r.unspent + r.immature : r.live + r.immature)
);
export const totalSubsidy = compose(
  (r) => (r ? r.totalSubsidy : 0),
  getStakeInfoResponse
);

export const ticketBuyerService = get(["grpc", "ticketBuyerService"]);
export const ticketBuyerConfig = get(["control", "ticketBuyerConfig"]);

export const balanceToMaintain = get(["control", "balanceToMaintain"]);

const getTicketPriceResponse = get(["grpc", "getTicketPriceResponse"]);

export const ticketPrice = compose(
  (r) => (r ? r.ticketPrice : 0),
  getTicketPriceResponse
);

const requiredStakepoolAPIVersion = get([
  "grpc",
  "requiredStakepoolAPIVersion"
]);

export const currentStakePoolConfigError = get([
  "stakepool",
  "currentStakePoolConfigError"
]);

export const purchaseTicketsError = get(["control", "purchaseTicketsError"]);
export const purchaseTicketsSuccess = get([
  "control",
  "purchaseTicketsSuccess"
]);
export const importScriptSuccess = get(["control", "importScriptSuccess"]);
export const importScriptError = get(["control", "importScriptError"]);
export const startAutoBuyerError = get(["control", "startAutoBuyerError"]);
export const startAutoBuyerSuccess = get(["control", "startAutoBuyerSuccess"]);
export const stopAutoBuyerError = get(["control", "stopAutoBuyerError"]);
export const stopAutoBuyerSuccess = get(["control", "stopAutoBuyerSuccess"]);

const purchaseTicketsResponse = get(["control", "purchaseTicketsResponse"]);

export const splitTx = createSelector(
  [purchaseTicketsResponse],
  (res) => res && Buffer.from(res.splitTx).toString("hex")
);

export const ticketsList = createSelector(
  [purchaseTicketsResponse],
  (res) => res && res.ticketsList.map((t) => Buffer.from(t).toString("hex"))
);

export const currentStakePoolConfig = get([
  "stakepool",
  "currentStakePoolConfig"
]);

const allStakePoolStats = get(["stakepool", "getStakePoolInfo"]);

const allStakePoolStatsList = createSelector(
  [allStakePoolStats, requiredStakepoolAPIVersion],
  (pools, requiredVersion) =>
    map(
      (pool) => ({
        ...pool,
        label: pool.URL,
        value: pool,
        isVersionValid: pool.APIVersionsSupported[1] === requiredVersion
      }),
      pools
    )
);
export const networkStakePoolStatsList = createSelector(
  [allStakePoolStatsList, network],
  (pools, network) => filter(compose(eq(network), get("Network")), pools)
);

const allStakePools = createSelector(
  [currentStakePoolConfig, requiredStakepoolAPIVersion],
  (pools, requiredVersion) =>
    map(
      (pool) => ({
        ...pool,
        label: pool.Host,
        value: pool,
        isVersionValid: pool.APIVersionsSupported[1] === requiredVersion
      }),
      pools
    )
);

const networkStakePools = createSelector(
  [allStakePools, network],
  (pools, network) => filter(compose(eq(network), get("Network")), pools)
);

export const configuredStakePools = createSelector(
  [networkStakePools],
  filter(bool(get("ApiKey")))
);

export const unconfiguredStakePools = createSelector(
  [networkStakePools],
  filter(not(get("ApiKey")))
);

export const defaultStakePool = compose(get(0), configuredStakePools);
export const selectedStakePool = get(["stakepool", "selectedStakePool"]);

const currentStakePoolConfigRequest = get([
  "stakepool",
  "currentStakePoolConfigRequest"
]);

export const purchaseTicketsRequestAttempt = get([
  "control",
  "purchaseTicketsRequestAttempt"
]);

const importScriptRequestAttempt = get([
  "control",
  "importScriptRequestAttempt"
]);

// LEGACY selectors.
// Keep them while we still support old version of vsps.
export const isSavingStakePoolConfig = bool(currentStakePoolConfigRequest);
export const isAddingCustomStakePool = bool(
  get(["stakePool", "addCustomStakePoolAttempt"])
);
export const isPurchasingTickets = bool(purchaseTicketsRequestAttempt);
export const isImportingScript = bool(importScriptRequestAttempt);

// end of LEGACY selectors

export const newUnminedMessage = get(["notifications", "newUnminedMessage"]);

export const lastBlockTimestamp = get(["grpc", "recentBlockTimestamp"]);

export const getNextAccountSuccess = get(["control", "getNextAccountSuccess"]);
export const getNextAccountError = get(["control", "getNextAccountError"]);
export const getNextAccountRequestAttempt = get([
  "control",
  "getNextAccountRequestAttempt"
]);
export const hiddenAccounts = get(["daemon", "hiddenAccounts"]);
export const renameAccountError = get(["control", "renameAccountError"]);
export const renameAccountSuccess = get(["control", "renameAccountSuccess"]);
export const renameAccountRequestAttempt = get([
  "control",
  "renameAccountRequestAttempt"
]);

export const location = get(["router", "location"]);
export const isGetStarted = compose(
  (l) => /^\/getstarted\//.test(l.pathname),
  location
);

export const showingSidebarMenu = not(isGetStarted);
export const expandSideBar = get(["sidebar", "expandSideBar"]);
export const sidebarOnBottom = get(["sidebar", "sidebarOnBottom"]);

export const snackbarMessages = get(["snackbar", "messages"]);

export const mainWindow = () => window;

export const shutdownRequested = get(["daemon", "shutdownRequested"]);
export const daemonStopped = get(["daemon", "daemonStopped"]);

export const blocksPassedOnTicketInterval = createSelector(
  [chainParams, currentBlockHeight],
  (chainParams, currentBlockHeight) => {
    if (!chainParams || !currentBlockHeight) return 0;
    const { WorkDiffWindowSize } = chainParams;
    return currentBlockHeight % WorkDiffWindowSize;
  }
);

export const blocksNumberToNextTicket = createSelector(
  [chainParams, blocksPassedOnTicketInterval],
  (chainParams, blocksPassedOnTicketInterval) => {
    const { WorkDiffWindowSize } = chainParams;
    return WorkDiffWindowSize - blocksPassedOnTicketInterval;
  }
);

// blocksFromBestBlock is a selector that returns a function that can be used
// to calculate how many blocks a given block hieght is away from the current
// best block.
export const blocksFromBestBlock = createSelector(
  [currentBlockHeight],
  (currentHeight) => (block) => block - currentHeight
);

// blockTimestampFromNow is a selector that returns a function that can be used
// to estimate when a given future block will be received. This is isn't super
// accurate, and depends on the fact that blocks will take on average the
// TargetTimePerBlock of their chain, but is sufficient for most display
// purposes.
export const blockTimestampFromNow = createSelector(
  [chainParams, currentBlockHeight],
  (chainParams, currentHeight) => {
    const currentTimestamp = new Date().getTime() / 1000;
    return (block) => {
      return Math.trunc(
        currentTimestamp +
          (block - currentHeight) * chainParams.TargetTimePerBlock
      );
    };
  }
);
export const exportingData = get(["control", "exportingData"]);

export const voteTimeStats = get(["statistics", "voteTime"]);
export const averageVoteTime = createSelector(
  [voteTimeStats],
  (voteTimeStats) => {
    if (!voteTimeStats || !voteTimeStats.data.length) return 0;
    const ticketCount = voteTimeStats.data.reduce(
      (s, v) => s + v.series.count,
      0
    );
    if (ticketCount === 0) return 0;
    let sum = 0;
    for (let i = 0; i < voteTimeStats.data.length; i++) {
      sum += voteTimeStats.data[i].series.count * i;
    }
    return sum / ticketCount;
  }
);
export const medianVoteTime = createSelector(
  [voteTimeStats],
  (voteTimeStats) => {
    if (!voteTimeStats || !voteTimeStats.data.length) return 0;
    const ticketCount = voteTimeStats.data.reduce(
      (s, v) => s + v.series.count,
      0
    );
    if (ticketCount === 0) return 0;
    const ticketLimit = ticketCount * 0.5;
    let sum = 0;
    for (let i = 0; i < voteTimeStats.data.length; i++) {
      sum += voteTimeStats.data[i].series.count;
      if (sum >= ticketLimit) return i;
    }
  }
);
export const ninetyFifthPercentileVoteTime = createSelector(
  [voteTimeStats],
  (voteTimeStats) => {
    if (!voteTimeStats || !voteTimeStats.data.length) return 0;
    const ticketCount = voteTimeStats.data.reduce(
      (s, v) => s + v.series.count,
      0
    );
    if (ticketCount === 0) return 0;
    const ticketLimit = ticketCount * 0.95;
    let sum = 0;
    for (let i = 0; i < voteTimeStats.data.length; i++) {
      sum += voteTimeStats.data[i].series.count;
      if (sum >= ticketLimit) return i;
    }
  }
);
export const getMyTicketsStatsRequest = get([
  "statistics",
  "getMyTicketsStatsRequest"
]);

export const fullDailyBalancesStats = get(["statistics", "fullDailyBalances"]);

export const stakeRewardsStats = createSelector(
  [fullDailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.slice(-15).map((s) => ({
      time: s.time,
      stakeRewards: s.series.stakeRewards / unitDivisor,
      stakeFees: s.series.stakeFees / unitDivisor,
      totalStake: s.series.totalStake / unitDivisor,
      stakeRewardPerc: s.series.stakeRewards / (s.series.totalStake || 1),
      stakeFeesPerc: s.series.stakeFees / (s.series.totalStake || 1)
    }))
);

export const modalVisible = get(["control", "modalVisible"]);
export const aboutModalMacOSVisible = get([
  "control",
  "aboutModalMacOSVisible"
]);
export const cantCloseModalVisible = get(["control", "cantCloseModalVisible"]);

export const confirmationDialogModalVisible = bool(
  get(["control", "confirmationDialogModalVisible"])
);

export const isTrezor = get(["trezor", "enabled"]);
export const isPerformingTrezorUpdate = get(["trezor", "performingUpdate"]);

export const isSignMessageDisabled = and(isWatchingOnly, not(isTrezor));
export const isChangePassPhraseDisabled = isWatchingOnly;
export const isTransactionsSendTabDisabled = not(isTrezor);

export const politeiaURL = createSelector([isTestNet], (isTestNet) =>
  isTestNet ? POLITEIA_URL_TESTNET : POLITEIA_URL_MAINNET
);

export const dcrdataURL = createSelector([isTestNet], (isTestNet) =>
  isTestNet ? DCRDATA_URL_TESTNET : DCRDATA_URL_MAINNET
);

export const politeiaEnabled = compose(
  (l) => l.indexOf(EXTERNALREQUEST_POLITEIA) > -1,
  allowedExternalRequests
);

export const dcrdataEnabled = compose(
  (l) => l.indexOf(EXTERNALREQUEST_DCRDATA) > -1,
  allowedExternalRequests
);

const getAgendasResponse = get(["grpc", "getAgendasResponse"]);

const currentAgenda = createSelector([getAgendasResponse], (response) =>
  response ? response.agendasList : EMPTY_ARRAY
);

const allAgendasNotNormalized = get(["grpc", "allAgendas"]);

// allAgendasVerify verifies if dcrdata is enabled. If it is not we only return
// the current agenda which we got from dcrwallet.
const allAgendasVerify = createSelector(
  [currentAgenda, dcrdataEnabled, allAgendasNotNormalized],
  // If allAgendas length is 0 we return the agenda from dcrwallet, as dcrdata
  // may be down.
  (currentAgenda, dcrdataEnabled, allAgendas) =>
    !dcrdataEnabled || allAgendas.length === 0 ? currentAgenda : allAgendas
);

const normalizeAgenda = createSelector([currentAgenda], (currentAgenda) => {
  return (agenda) => {
    // When agenda has getId function (this happens when dcrdata privacy is disabled
    // or a possible dcrdata crash) or the agenda is the same for dcrwallet and dcrdata.
    // We use the information from our dcrwallet grpc request.
    for (let i = 0; i < currentAgenda.length; i++) {
      if (
        currentAgenda[i].id === agenda.id ||
        currentAgenda[i].id === agenda.name
      ) {
        currentAgenda[i].isCurrent = true;
        const agendaObj = {};
        agendaObj.name = currentAgenda[i].id;
        agendaObj.choices = currentAgenda[i].choicesList;
        agendaObj.description = currentAgenda[i].description;
        agendaObj.isCurrent = true;
        agendaObj.finished = agenda.status === "finished";
        agendaObj.passed = !!agenda.activated;
        return agendaObj;
      }
    }
    agenda.isCurrent = false;
    agenda.finished = agenda.status === "finished";
    agenda.passed = !!agenda.activated;
    // right now we left it empty as there is no easy way to get past vote choices.
    agenda.choices = [];

    return agenda;
  };
});

export const allAgendas = createSelector(
  [allAgendasVerify, normalizeAgenda],
  (agendas, cb) => agendas.map(cb)
);

export const treasuryBalance = get(["grpc", "treasuryBalance"]);

export const proposals = get(["governance", "proposals"]);
export const proposallistpagesize = get(["governance", "proposallistpagesize"]);
export const getProposalsAttempt = get(["governance", "getProposalsAttempt"]);
export const preVoteProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.preVote
);
export const activeVoteProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.activeVote
);
export const finishedProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.finishedVote
);
export const abandonedProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.abandonedVote
);
export const inventory = get(["governance", "inventory"]);
export const newActiveVoteProposalsCount = compose(
  reduce((acc, p) => (p.votingSinceLastAccess ? acc + 1 : acc), 0),
  activeVoteProposals
);
export const newPreVoteProposalsCount = compose(
  reduce((acc, p) => (p && p.modifiedSinceLastAccess ? acc + 1 : acc), 0),
  preVoteProposals
);
export const newProposalsStartedVoting = compose(
  some((p) => p.votingSinceLastAccess),
  activeVoteProposals
);

export const getProposalError = get(["governance", "getProposalError"]);
export const getVotesInventoryError = get([
  "governance",
  "getVotesInventoryError"
]);
export const proposalsDetails = get(["governance", "proposalsDetails"]);
export const lastPoliteiaAccessBlock = get([
  "governance",
  "lastPoliteiaAccessBlock"
]);
export const lastPoliteiaAccessTime = get([
  "governance",
  "lastPoliteiaAccessTime"
]);
export const setVoteChoicesAttempt = get([
  "grpc",
  "setVoteChoicesRequestAttempt"
]);
export const setVspdVoteChoicesAttempt = get([
  "vsp",
  "setVspdVoteChoicesRequestAttempt"
]);
export const getVSPTicketStatusAttempt = get([
  "vsp",
  "getVSPTicketStatusAttempt"
]);
export const voteChoices = get(["grpc", "getVoteChoicesResponse"]);
export const newNotYetVotedAgendasCount = createSelector(
  [allAgendas, voteChoices],
  (ca, vcs) =>
    ca.reduce((acc, a) => {
      const choice =
        vcs.find((vc) => vc.agendaId === a.name)?.choiceId || "abstain";
      return !a.finished && choice === "abstain" ? acc + 1 : acc;
    }, 0)
);
export const newNotYetVotedActiveProposalsCount = compose(
  reduce((acc, p) => (p.currentVoteChoice === "abstain" ? acc + 1 : acc), 0),
  activeVoteProposals
);
export const treasuryPolicies = get(["grpc", "getTreasuryPoliciesResponse"]);
export const setTreasuryPolicyRequestAttempt = get([
  "grpc",
  "setTreasuryPolicyRequestAttempt"
]);

export const trezorWaitingForPin = get(["trezor", "waitingForPin"]);
export const trezorWaitingForPassPhrase = get([
  "trezor",
  "waitingForPassPhrase"
]);
export const trezorWaitingForWord = get(["trezor", "waitingForWord"]);
export const trezorPerformingRecoverDevice = get([
  "trezor",
  "performingRecoverDevice"
]);
export const trezorConfirmingTogglePassphrase = get([
  "trezor",
  "confirmingTogglePassphrase"
]);
export const trezorEnablePassphraseProtection = get([
  "trezor",
  "enablePassphraseProtection"
]);
export const trezorPerformingOperation = get(["trezor", "performingOperation"]);
export const trezorDevice = get(["trezor", "device"]);
export const trezorLabel = get(["trezor", "deviceLabel"]);
export const trezorWalletCreationMasterPubkeyAttempt = get([
  "trezor",
  "walletCreationMasterPubkeyAttempt"
]);

// selectors for checking if decrediton can be closed.

// TODO remove duplicated auto buyer running selector
const startAutoBuyerResponse = get(["control", "startAutoBuyerResponse"]);
export const isTicketAutoBuyerEnabled = bool(startAutoBuyerResponse);

// getRunningIndicator is a indicator for indicate something is runnning on
// decrediton, like the ticket auto buyer or the mixer.
export const getRunningIndicator = or(
  getAccountMixerRunning,
  getTicketAutoBuyerRunning,
  purchaseTicketsRequestAttempt,
  isTicketAutoBuyerEnabled
);

export const restoredFromSeed = get(["dex", "restoredFromSeed"]);
export const dexOrdersOpen = get(["dex", "openOrder"]);
export const loggedInDex = bool(get(["dex", "loggedIn"]));

// end of selectors for closing decrediton.

// ln selectors

export const lnEnabled = bool(and(not(isWatchingOnly), not(isTrezor)));
export const lnActive = bool(get(["ln", "active"]));
export const lnStartupStage = get(["ln", "startupStage"]);
export const lnStartAttempt = bool(get(["ln", "startAttempt"]));
export const lnWalletExists = bool(get(["ln", "exists"]));
export const lnInfo = get(["ln", "info"]);
export const lnNetwork = get(["ln", "network"]);
export const lnGetNodeInfoAttempt = bool(get(["ln", "getNodeInfoAttempt"]));
export const lnNodeInfo = get(["ln", "nodeInfo"]);
export const lnGetRoutesInfoAttempt = bool(get(["ln", "getRoutesInfoAttempt"]));
export const lnRoutesInfo = get(["ln", "routes"]);
export const lnWalletBalances = get(["ln", "walletBalances"]);
export const lnChannelBalances = get(["ln", "channelBalances"]);
export const lnChannels = get(["ln", "channels"]);
export const lnPendingChannels = get(["ln", "pendingChannels"]);
export const lnClosedChannels = get(["ln", "closedChannels"]);
export const lnInvoices = get(["ln", "invoices"]);
export const lnPayments = get(["ln", "payments"]);
export const lnOutstandingPayments = get(["ln", "outstandingPayments"]);
export const lnFailedPayments = get(["ln", "failedPayments"]);
export const lnAddInvoiceAttempt = get(["ln", "addInvoiceAttempt"]);
export const lnCancelInvoiceAttempt = get(["ln", "cancelInvoiceAttempt"]);
export const lnSCBPath = get(["ln", "scbPath"]);
export const lnSCBUpdatedTime = get(["ln", "scbUpdatedTime"]);
export const lnTowersList = get(["ln", "towersList"]);
export const lnInvoiceFilter = get(["ln", "invoiceFilter"]);
export const lnPaymentFilter = get(["ln", "paymentFilter"]);
export const lnChannelFilter = get(["ln", "channelFilter"]);
export const lnRecentlyOpenedChannel = get(["ln", "recentlyOpenedChannel"]);
export const lnDescribeGraph = get(["ln", "describeGraph"]);
export const lnAutopilotEnabled = get(["ln", "autopilotEnabled"]);
export const lnTransactions = get(["ln", "transactions"]);
export const lnLastLogLine = get(["ln", "lastDcrlndLogLine"]);
export const lnRouterPruneTarget = get(["ln", "routerPruneTarget"]);
export const lnRouterPruneHeight = get(["ln", "routerPruneHeight"]);
export const lnRouterPruneStart = get(["ln", "routerPruneStart"]);

// end of ln selectors

// start of dex selectors

export const dexEnabled = bool(get(["walletLoader", "dexEnabled"]));
export const dexReady = bool(get(["walletLoader", "dexReady"]));
export const enableDexAttempt = bool(get(["dex", "enableDexAttempt"]));
export const dexActive = bool(get(["dex", "active"]));
export const dexInit = bool(get(["dex", "dexInit"]));
export const initDexAttempt = bool(get(["dex", "initAttempt"]));
export const checkInitDexAttempt = bool(get(["dex", "dexCheckInitAttempt"]));
export const registerDexAttempt = bool(get(["dex", "registerAttempt"]));
export const createWalletDexAttempt = bool(get(["dex", "createWalletAttempt"]));
export const btcCreateWalletDexAttempt = bool(
  get(["dex", "btcCreateWalletAttempt"])
);
export const loginDexAttempt = bool(get(["dex", "loginAttempt"]));
export const dexUser = get(["dex", "user"]);

export const dexConnected = compose(
  (u) => u && u.exchanges && Object.keys(u.exchanges).length > 0,
  dexUser
);

export const dexRegistered = compose(
  // XXX check if any of the exchanges that come back from users request are registered
  (u) => u && u.exchanges && Object.keys(u.exchanges).length > 0,
  dexUser
);

export const dexDCRWalletRunning = compose(
  (user) =>
    user &&
    user.assets &&
    user.assets["42"] &&
    user.assets["42"].wallet &&
    user.assets["42"].wallet.running,
  dexUser
);

export const dexBTCWalletRunning = compose(
  (user) =>
    user &&
    user.assets &&
    user.assets["0"] &&
    user.assets["0"].wallet &&
    user.assets["0"].wallet.running,
  dexUser
);

export const dexAddr = get(["dex", "addr"]);
export const dexConfig = get(["dex", "config"]);
export const alreadyPaid = get(["dex", "alreadyPaid"]);
export const getConfigAttempt = get(["dex", "getConfigAttempt"]);
export const askDexBtcSpv = get(["walletLoader", "askDexBtcSpv"]);
export const dexBtcSpv = get(["walletLoader", "dexBtcSpv"]);
export const dexSeed = get(["dex", "dexSeed"]);
export const confirmDexSeed = get(["walletLoader", "confirmDexSeed"]);
export const dexAccount = get(["walletLoader", "dexAccount"]);
export const dexAccountNumber = createSelector(
  [dexAccount, balances],
  (dexAccount, balances) =>
    !dexAccount
      ? null
      : balances
          .filter(({ accountName }) => accountName === dexAccount)
          .map(({ accountNumber }) => accountNumber)[0]
);
export const dexAccountSpendable = createSelector(
  [dexAccount, balances],
  (dexAccount, balances) =>
    !dexAccount
      ? null
      : balances
          .filter(({ accountName }) => accountName === dexAccount)
          .map(({ spendable }) => spendable)[0]
);
export const dexAccountAttempt = bool(get(["dex", "dexAccountAttempt"]));
export const dexSelectAccountAttempt = bool(
  get(["dex", "dexSelectAccountAttempt"])
);

export const defaultDEXServer = compose(
  (isTestNet) => (isTestNet ? TestNetDexServer : MainNetDexServer),
  isTestNet
);

export const dexGetFeeError = get(["dex", "getConfigError"]);
export const dexRegisterError = get(["dex", "registerError"]);
export const dexLoginError = get(["dex", "loginError"]);
export const dexLogoutError = get(["dex", "logoutError"]);
export const dexCreateWalletError = get(["dex", "createWalletError"]);
export const userError = get(["dex", "userError"]);
export const initError = get(["dex", "initError"]);
export const dexAccountError = get(["dex", "dexAccountError"]);
export const dexEnableError = get(["dex", "enabledError"]);
export const btcConfig = get(["dex", "btcConfig"]);
export const btcInstallNeeded = get(["dex", "btcInstallNeeded"]);
export const btcConfigUpdateNeeded = get(["dex", "btcConfigUpdateNeeded"]);
export const btcWalletName = get(["walletLoader", "btcWalletName"]);

export const getVSPInfoTimeoutTime = () => 5000;
