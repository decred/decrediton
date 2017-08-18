import { compose, get, or, and, eq, createSelector } from "./fp";

const START_STEP_OPEN = 2;
const START_STEP_RPC1 = 3;
const START_STEP_RPC2 = 4;
const START_STEP_DISCOVER = 5;
const START_STEP_FETCH = 6;

const versionInvalid = get(["version", "versionInvalid"]);
const walletExistResponse = get(["walletLoader", "walletExistResponse"]);
export const startStepIndex = get(["walletLoader", "stepIndex"]);
export const getVersionServiceError = get(["version", "getVersionServiceError"]);
export const getLoaderError = get(["version", "getLoaderError"]);
export const hasExistingWallet = compose(r => !!(r && r.getExists()), walletExistResponse);
export const confirmNewSeed = get(["walletLoader", "confirmNewSeed"]);
export const versionInvalidError = createSelector(
  [versionInvalid, get(["version", "versionInvalidError"])],
  (invalid, error) => invalid ? error || "Unknown Error" : null
);

const walletOpenRequestAttempt = get(["walletLoader", "walletOpenRequestAttempt"]);
const walletCreateRequestAttempt = get(["walletLoader", "walletCreateRequestAttempt"]);
const discoverAddressRequestAttempt = get(["walletLoader", "discoverAddressRequestAttempt"]);
const startRpcRequestAttempt = get(["walletLoader", "startRpcRequestAttempt"]);
const fetchHeadersRequestAttempt = get(["walletLoader", "fetchHeadersRequestAttempt"]);
const isStartStepOpen = compose(eq(START_STEP_OPEN), startStepIndex);
const isStartStepDiscover = compose(eq(START_STEP_DISCOVER), startStepIndex);
const isStartStepRPC = compose(or(eq(START_STEP_RPC1), eq(START_STEP_RPC2)), startStepIndex);
const isStartStepFetch = compose(eq(START_STEP_FETCH), startStepIndex);
const isOpeningWallet = and(isStartStepOpen, hasExistingWallet, walletOpenRequestAttempt);
const isCreatingWallet = and(isStartStepOpen, walletCreateRequestAttempt);
const isDiscoveringAddresses = and(isStartStepDiscover, discoverAddressRequestAttempt);
const isStartingRPC = and(isStartStepRPC, startRpcRequestAttempt);
const isFetchingHeaders = and(isStartStepFetch, fetchHeadersRequestAttempt);
export const isStartupProcessing = or(
  isOpeningWallet,
  isCreatingWallet,
  isDiscoveringAddresses,
  isStartingRPC,
  isFetchingHeaders
);

const walletExistError = and(get(["walletLoader", "walletExistError"]), isStartStepOpen);
const walletCreateError = and(get(["walletLoader", "walletCreateError"]), isStartStepOpen);
const walletOpenError = and(get(["walletLoader", "walletOpenError"]), isStartStepOpen);
const startRpcError = and(get(["walletLoader", "startRpcError"]), isStartStepRPC);
const discoverAddrError = and(get(["walletLoader", "discoverAddressError"]), isStartStepDiscover);
const fetchHeadersError = and(get(["walletLoader", "fetchHeadersError"]), isStartStepFetch);
export const startupError = or(
  walletExistError,
  walletCreateError,
  walletOpenError,
  startRpcError,
  discoverAddrError,
  fetchHeadersError
);
