import {
  compose, reduce, filter, get, not, or, and, eq, find, bool, map,
  createSelectorEager as createSelector
} from "./fp";
import { reverseHash } from "./helpers/byteActions";

const EMPTY_ARRAY = [];  // Maintaining identity (will) improve performance;

export const daemonStarted = get(["daemon", "daemonStarted"]);
export const daemonSyncing = get(["daemon", "daemonSyncing"]);
export const daemonSynced = get(["daemon", "daemonSynced"]);
export const walletReady = get(["daemon", "walletReady"]);

const START_STEP_OPEN = 2;
const START_STEP_RPC1 = 3;
const START_STEP_RPC2 = 4;
const START_STEP_DISCOVER = 5;
const START_STEP_FETCH = 6;

const versionInvalid = get(["version", "versionInvalid"]);
const walletExistResponse = get(["walletLoader", "walletExistResponse"]);
export const startStepIndex = get(["walletLoader", "stepIndex"]);
export const getVersionServiceError = get(["version", "getVersionServiceError"]);
export const getWalletRPCVersionError = get(["version", "getWalletRPCVersionError"]);
export const getLoaderError = get(["version", "getLoaderError"]);
export const hasExistingWallet = compose(r => !!(r && r.getExists()), walletExistResponse);
export const confirmNewSeed = get(["walletLoader", "confirmNewSeed"]);
export const versionInvalidError = createSelector(
  [versionInvalid, get(["version", "versionInvalidError"])],
  (invalid, error) => invalid ? error || "Unknown Error" : null
);

const isStartStepOpen = compose(eq(START_STEP_OPEN), startStepIndex);
const isStartStepDiscover = compose(eq(START_STEP_DISCOVER), startStepIndex);
const isStartStepRPC = compose(or(eq(START_STEP_RPC1), eq(START_STEP_RPC2)), startStepIndex);
const isStartStepFetch = compose(eq(START_STEP_FETCH), startStepIndex);

const walletExistError = and(get(["walletLoader", "walletExistError"]), isStartStepOpen);
const walletCreateError = and(get(["walletLoader", "walletCreateError"]), isStartStepOpen);
const walletOpenError = and(get(["walletLoader", "walletOpenError"]), isStartStepOpen);
const startRpcError = and(get(["walletLoader", "startRpcError"]), isStartStepRPC);
const discoverAddrError = and(get(["walletLoader", "discoverAddressError"]), isStartStepDiscover);
const fetchHeadersError = and(get(["walletLoader", "fetchHeadersError"]), isStartStepFetch);
export const startupError = or(
  getVersionServiceError,
  getWalletRPCVersionError,
  getLoaderError,
  walletExistError,
  walletCreateError,
  walletOpenError,
  startRpcError,
  discoverAddrError,
  fetchHeadersError
);

const openWalletInputRequest = get(["walletLoader", "openWalletInputRequest"]);
const createWalletInputRequest = get(["walletLoader", "createWalletInputRequest"]);
const discoverAddressInputRequest = get(["walletLoader", "discoverAddressInputRequest"]);

export const isInputRequest = or(
  openWalletInputRequest,
  createWalletInputRequest,
  discoverAddressInputRequest,
);
export const isStartupProcessing = and(
  not(isInputRequest),
  not(startupError)
);

const balances = get(["grpc", "balances"]);
export const walletService = get(["grpc", "walletService"]);
export const txPerPage = get(["grpc", "txPerPage"]);
export const getBalanceRequestAttempt = get(["grpc", "getBalanceRequestAttempt"]);
export const transactionDetails = get(["grpc", "transactionDetails"]);
export const getAccountsResponse = get(["grpc", "getAccountsResponse"]);
export const getNetworkResponse = get(["grpc", "getNetworkResponse"]);
export const spendableTotalBalance = createSelector(
  [balances],
  reduce(
    (total, { accountName, spendable }) =>
      (accountName === "imported") ? total : total + spendable,
    0
  )
);

const regularTransactionsInfo = get(["grpc", "regularTransactionsInfo"]);
export const transactions = createSelector(
  [
    regularTransactionsInfo,
    get(["grpc", "ticketTransactionsInfo"]),
    get(["grpc", "voteTransactionsInfo"]),
    get(["grpc", "revokeTransactionsInfo"])
  ],
  ( Regular, Tickets, Votes, Revokes ) => ({
    All: Regular.concat(Tickets).concat(Votes).concat(Revokes)
      .sort((a, b) => b.timestamp - a.timestamp),
    Regular, Tickets, Votes, Revokes,
  })
);


const rescanResponse = get(["control", "rescanResponse"]);
export const rescanRequest = get(["control", "rescanRequest"]);
export const synced = get(["notifications", "synced"]);
export const unmined = get(["notifications", "unmined"]);
export const getTransactionsRequestAttempt = get(["grpc", "getTransactionsRequestAttempt"]);


const currentBlockHeight = compose(
  req => req ? req.getCurrentBlockHeight() : 1, getAccountsResponse
);

export const rescanEndBlock = currentBlockHeight;
export const rescanStartBlock = compose(
  req => req ? req.getBeginHeight() : 0, rescanRequest
);
export const rescanCurrentBlock = compose(
  res => res ? res.getRescannedThrough() : 0, rescanResponse
);

export const rescanPercentFinished = createSelector(
  [rescanCurrentBlock, rescanEndBlock],
  (current, end) => ((current / end) * 100).toFixed(2)
);

export const homeHistoryMined = createSelector(
  [unmined, txPerPage, regularTransactionsInfo],
  (unmined, txPerPage, regularTransactionsInfo) =>
    unmined.length > 0
      ? unmined.length > txPerPage
        ? Array()
        : regularTransactionsInfo.length + unmined.length >= txPerPage
          ? regularTransactionsInfo.slice(0,txPerPage-unmined.length)
          : regularTransactionsInfo.slice(0,regularTransactionsInfo.length+unmined.length)
      : regularTransactionsInfo.length >= txPerPage
        ? regularTransactionsInfo.slice(0,txPerPage)
        : regularTransactionsInfo.slice(0,regularTransactionsInfo.length)
);

export const visibleAccounts = createSelector(
  [balances],
  reduce(
    (accounts, { accountName, accountNumber, hidden, ...data }) =>
      (accountName === "imported" || hidden)
        ? accounts
        : [...accounts, {
          value: accountNumber,
          label: accountName,
          hidden,
          ...data
        }],
    []
  )
);

const getNextAddressResponse = get(["control", "getNextAddressResponse"]);
const nextAddressAccountNumber = compose(
  res => res ? res.accountNumber : null, getNextAddressResponse
);

export const getNextAddressRequestAttempt = get(["control", "getNextAddressRequestAttempt"]);
export const nextAddressAccount = createSelector(
  [visibleAccounts, nextAddressAccountNumber],
  (accounts, number) => accounts.find(compose(eq(number), get("value")))
);
export const nextAddress = compose(
  res => res ? res.getAddress() : "", getNextAddressResponse
);

const network = compose(r => r ? r.networkStr : null, getNetworkResponse);

export const isTestNet = compose(eq("testnet"), network);
export const isMainNet = not(isTestNet);
export const currencyDisplay = get(["settings", "currentSettings", "currencyDisplay"]);
export const unitDivisor = compose(disp => disp === "DCR" ? 100000000 : 1, currencyDisplay);

export const spendingAccounts = createSelector(
  [unitDivisor, currencyDisplay, balances],
  (unitDivisor, currencyDisplay, balances) => reduce(
    (accounts, { accountName, accountNumber, spendable, ...data }) =>
      (accountNumber !== 0 && (accountName === "imported" || spendable <= 0))
        ? accounts
        : [...accounts, {
          value: accountNumber,
          label: `${accountName}: ${spendable / unitDivisor} ${currencyDisplay}`,
          name: accountName,
          spendable,
          ...data
        }],
    [],
    balances
  )
);

export const defaultSpendingAccount = createSelector(
  [spendingAccounts], find(compose(eq(0), get("value")))
);

const constructTxResponse = get(["control", "constructTxResponse"]);
const constructTxRequestAttempt = get(["control", "constructTxRequestAttempt"]);
export const constructTxError = get(["control", "constructTxError"]);
const signTransactionRequestAttempt = get(["control", "signTransactionRequestAttempt"]);
export const signTransactionError = get(["control", "signTransactionError"]);
const publishTransactionResponse = get(["control", "publishTransactionResponse"]);
const publishTransactionRequestAttempt = get(["control", "publishTransactionRequestAttempt"]);
export const publishTransactionError = get(["control", "publishTransactionError"]);
const totalOutputAmount = compose(r => r ? r.getTotalOutputAmount() : 0, constructTxResponse);
const totalAmount = compose(res => res ? res.totalAmount : 0, constructTxResponse);
const totalPreviousOutputAmount = compose(
  res => res ? res.getTotalPreviousOutputAmount() : 0, constructTxResponse
);

export const estimatedSignedSize = compose(
  res => res ? res.getEstimatedSignedSize() : 0, constructTxResponse
);

export const unsignedTransaction = createSelector(
  [constructTxResponse],
  res => res ? res.getUnsignedTransaction() : null
);

export const estimatedFee = compose(
  bytes => (bytes / 1000) * 0.001 * 100000000, estimatedSignedSize
);

export const totalSpent = createSelector(
  [totalPreviousOutputAmount, totalOutputAmount, totalAmount],
  (totalPreviousOutputAmount, totalOutputAmount, totalAmount) =>
    totalPreviousOutputAmount - totalOutputAmount + totalAmount
);

export const publishedTransactionHash = compose(
  r => r ? reverseHash(r.toString("hex")) : null, publishTransactionResponse
);

export const isSendingTransaction = bool(or(
  signTransactionRequestAttempt, publishTransactionRequestAttempt
));

export const isConstructingTransaction = bool(constructTxRequestAttempt);


export const tempSettings = get(["settings", "tempSettings"]);
export const settingsChanged = get(["settings", "settingsChanged"]);
export const changePassphraseError = get(["control", "changePassphraseError"]);
export const changePassphraseSuccess = get(["control", "changePassphraseSuccess"]);

const getStakeInfoResponse = get(["grpc", "getStakeInfoResponse"]);

export const ticketPoolSize = compose(r => r ? r.getPoolSize() : 0, getStakeInfoResponse);
export const votedTicketsCount = compose(r => r ? r.getVoted() : 0, getStakeInfoResponse);
export const allMempoolTicketsCount = compose(
  r => r ? r.getAllMempoolTix() : 0, getStakeInfoResponse
);
export const missedTicketsCount = compose(r => r ? r.getMissed() : 0, getStakeInfoResponse);
export const ownMempoolTicketsCount = compose(
  r => r ? r.getOwnMempoolTix() : 0, getStakeInfoResponse
);
export const revokedTicketsCount = compose(r => r ? r.getRevoked() : 0, getStakeInfoResponse);
export const immatureTicketsCount = compose(r => r ? r.getImmature() : 0, getStakeInfoResponse);
export const expiredTicketsCount = compose(r => r ? r.getExpired() : 0, getStakeInfoResponse);
export const liveTicketsCount = compose(r => r ? r.getLive() : 0, getStakeInfoResponse);


export const ticketBuyerService = get(["grpc", "ticketBuyerService"]);
const startAutoBuyerResponse = get(["control", "startAutoBuyerResponse"]);

export const balanceToMaintain = get(["control", "balanceToMaintain"]);
export const maxFee = get(["control", "maxFee"]);
export const maxPriceRelative = get(["control", "maxPriceRelative"]);
export const maxPriceAbsolute = get(["control", "maxPriceAbsolute"]);
export const maxPerBlock = get(["control", "maxPerBlock"]);
export const getTicketBuyerConfigResponse = get(["control", "getTicketBuyerConfigResponse"]);


const getTicketPriceResponse = get(["grpc", "getTicketPriceResponse"]);

export const ticketPrice = compose(r => r ? r.getTicketPrice() : 0, getTicketPriceResponse);

const getAgendasResponse = get(["grpc", "getAgendasResponse"]);
export const agendas = createSelector(
  [getAgendasResponse],
  response => response ? response.getAgendasList() : EMPTY_ARRAY
);

const requiredStakepoolAPIVersion = get(["grpc", "requiredStakepoolAPIVersion"]);

export const currentStakePoolConfigError = get(["stakepool", "currentStakePoolConfigError"]);
export const currentStakePoolConfigSuccessMessage = get(["stakepool", "currentStakePoolConfigSuccessMessage"]);
export const purchaseTicketsError = get(["control", "purchaseTicketsError"]);
export const purchaseTicketsSuccess = get(["control", "purchaseTicketsSuccess"]);
export const revokeTicketsError = get(["control", "revokeTicketsError"]);
export const revokeTicketsSuccess = get(["control", "revokeTicketsSuccess"]);
export const importScriptSuccess = get(["control", "importScriptSuccess"]);
export const importScriptError = get(["control", "importScriptError"]);
export const startAutoBuyerError = get(["control", "startAutoBuyerError"]);
export const startAutoBuyerSuccess = get(["control", "startAutoBuyerSuccess"]);
export const stopAutoBuyerError = get(["control", "stopAutoBuyerError"]);
export const stopAutoBuyerSuccess = get(["control", "stopAutoBuyerSuccess"]);
export const isTicketAutoBuyerEnabled = bool(startAutoBuyerResponse);


const currentStakePoolConfig = get(["stakepool", "currentStakePoolConfig"]);

const allStakePools = createSelector(
  [currentStakePoolConfig, requiredStakepoolAPIVersion],
  (pools, requiredVersion) => map(
    pool => ({
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
  [networkStakePools], filter(bool(get("ApiKey")))
);

export const unconfiguredStakePools = createSelector(
  [networkStakePools], filter(not(get("ApiKey")))
);

export const defaultStakePool = compose(get(0), configuredStakePools);

const currentStakePoolConfigRequest = get(["stakepool", "currentStakePoolConfigRequest"]);

const purchaseTicketsRequestAttempt = get(["control", "purchaseTicketsRequestAttempt"]);

export const isSavingStakePoolConfig = bool(currentStakePoolConfigRequest);
export const isPurchasingTickets = bool(purchaseTicketsRequestAttempt);
