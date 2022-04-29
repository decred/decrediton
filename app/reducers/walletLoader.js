import {
  LOADER_ATTEMPT,
  LOADER_FAILED,
  LOADER_SUCCESS,
  OPENWALLET_SUCCESS,
  CLOSEWALLET_FAILED,
  CLOSEWALLET_SUCCESS,
  UPDATEDISCOVERACCOUNTS,
  GETWALLETSEEDSVC_ATTEMPT,
  GETWALLETSEEDSVC_SUCCESS,
  SYNC_UPDATE,
  RESCANPOINT_ATTEMPT,
  RESCANPOINT_FAILED,
  RESCANPOINT_SUCCESS,
  SYNC_FETCHED_HEADERS_FINISHED,
  SYNC_FAILED,
  SYNC_ATTEMPT,
  SYNC_INPUT,
  SYNC_SYNCED,
  SYNC_UNSYNCED,
  SYNC_FETCHED_HEADERS_STARTED,
  SYNC_FETCHED_HEADERS_PROGRESS,
  SYNC_PEER_CONNECTED,
  SYNC_PEER_DISCONNECTED,
  SYNC_FETCHED_MISSING_CFILTERS_STARTED,
  SYNC_FETCHED_MISSING_CFILTERS_PROGRESS,
  SYNC_FETCHED_MISSING_CFILTERS_FINISHED,
  SYNC_DISCOVER_ADDRESSES_STARTED,
  SYNC_DISCOVER_ADDRESSES_FINISHED,
  SYNC_RESCAN_STARTED,
  SYNC_RESCAN_PROGRESS,
  SYNC_RESCAN_FINISHED,
  SYNC_CANCEL,
  WALLET_SELECTED,
  SET_SHOW_STAKING_WARNING
} from "actions/WalletLoaderActions";
import { WALLETCREATED } from "actions/DaemonActions";
import {
  CREATEDEXACCOUNT_SUCCESS,
  SELECT_DEXACCOUNT_SUCCESS,
  DEX_USE_SPV_BTC_SUCCESS,
  DEX_CONFIRM_SEED_SUCCESS,
  RESET_DEXACCOUNT,
  DEX_READY
} from "actions/DexActions";
import {
  CREATEMIXERACCOUNTS_SUCCESS,
  TOGGLE_ALLOW_SEND_FROM_UNMIXED
} from "actions/AccountMixerActions";

import { WALLET_LOADER_SETTINGS } from "actions/DaemonActions";

export default function walletLoader(state = {}, action) {
  switch (action.type) {
    case LOADER_ATTEMPT:
      return { ...state, getLoaderError: null, getLoaderRequestAttempt: true };
    case LOADER_FAILED:
      return {
        ...state,
        getLoaderError: String(action.error),
        getLoaderRequestAttempt: false,
        loader: null
      };
    case LOADER_SUCCESS:
      return {
        ...state,
        getLoaderError: null,
        loader: action.loader,
        getLoaderRequestAttempt: false
      };
    case WALLETCREATED:
      return {
        ...state,
        isWatchingOnly: action.isWatchingOnly,
        isTrezor: action.isTrezor
      };
    case WALLET_SELECTED:
      return { ...state, selectedWallet: action.selectedWallet };
    case OPENWALLET_SUCCESS:
      return {
        ...state,
        isWatchingOnly: action.isWatchingOnly,
        needsPassPhrase: false
      };
    case CLOSEWALLET_FAILED:
      return {
        ...state,
        walletCloseError: String(action.error),
        walletCloseRequestAttempt: false
      };
    case CLOSEWALLET_SUCCESS:
      return {
        ...state,
        walletCloseError: null,
        walletCloseRequestAttempt: false,
        walletCloseResponse: action.response,
        loader: null,
        advancedDaemonInputRequest: true,
        walletExistResponse: null,
        seedService: null,
        rescanPointResponse: null,
        syncInput: false,
        syncAttemptRequest: null,
        syncError: null,
        synced: false,
        syncLastFetchedHeaderTime: null,
        needsPassPhrase: false
      };
    case UPDATEDISCOVERACCOUNTS:
      return { ...state, discoverAccountsComplete: action.complete };
    case WALLET_LOADER_SETTINGS:
      return {
        ...state,
        discoverAccountsComplete: action.discoverAccountsComplete,
        needsPassPhrase: action.needsPassPhrase,
        privacyEnabled: action.enablePrivacy,
        allowSendFromUnmixed: action.sendFromUnmixed,
        mixedAccount: action.mixedAccount,
        changeAccount: action.changeAccount,
        csppServer: action.csppServer,
        csppPort: action.csppPort,
        mixedAccountBranch: action.mixedAccountBranch,
        dexEnabled: action.enableDex,
        dexReady: action.dexReady,
        dexAccount: action.dexAccount,
        dexRpcSettings: action.rpcCreds,
        btcWalletName: action.btcWalletName,
        askDexBtcSpv: action.askDexBtcSpv,
        dexBtcSpv: action.dexBtcSpv,
        confirmDexSeed: action.confirmDexSeed
      };
    case GETWALLETSEEDSVC_ATTEMPT:
      return { ...state, seedService: null };
    case GETWALLETSEEDSVC_SUCCESS:
      return { ...state, seedService: action.seedService };
    case RESCANPOINT_ATTEMPT:
      return {
        ...state,
        rescanPointAttemptRequest: true,
        rescanPointError: null,
        rescanPointResponse: null
      };
    case RESCANPOINT_FAILED:
      return {
        ...state,
        rescanPointAttemptRequest: false,
        rescanPointError: action.error,
        rescanPointResponse: null
      };
    case RESCANPOINT_SUCCESS:
      return {
        ...state,
        rescanPointAttemptRequest: false,
        rescanPointError: null,
        rescanPointResponse: action.response
      };
    case SYNC_INPUT:
      return { ...state, syncInput: true };
    case SYNC_ATTEMPT:
      return {
        ...state,
        syncInput: false,
        syncAttemptRequest: true,
        syncError: null,
        synced: false
      };
    case SYNC_FAILED:
      return {
        ...state,
        syncInput: false,
        syncAttemptRequest: false,
        synced: false,
        syncCall: null
      };
    case SYNC_UPDATE:
      return { ...state, syncError: null, syncCall: action.syncCall };
    case SYNC_CANCEL:
      return { ...state, syncError: null, synced: false, syncCall: null };
    case SYNC_SYNCED:
      return {
        ...state,
        syncAttemptRequest: false,
        synced: true
      };
    case SYNC_UNSYNCED:
      return { ...state, synced: false };
    case SYNC_PEER_CONNECTED:
      return { ...state, peerCount: action.peerCount };
    case SYNC_PEER_DISCONNECTED:
      return { ...state, peerCount: action.peerCount };
    case SYNC_FETCHED_MISSING_CFILTERS_STARTED:
      return { ...state, syncFetchMissingCfiltersAttempt: true };
    case SYNC_FETCHED_MISSING_CFILTERS_PROGRESS:
      return {
        ...state,
        syncFetchMissingCfiltersStart: action.cFiltersStart,
        syncFetchMissingCfiltersEnd: action.cFiltersEnd
      };
    case SYNC_FETCHED_MISSING_CFILTERS_FINISHED:
      return { ...state, syncFetchMissingCfiltersAttempt: false };
    case SYNC_FETCHED_HEADERS_STARTED:
      return {
        ...state,
        syncFetchTimeStart: action.fetchTimeStart,
        syncFetchHeadersAttempt: true
      };
    case SYNC_FETCHED_HEADERS_PROGRESS:
      return {
        ...state,
        syncFetchHeadersCount: action.fetchHeadersCount,
        syncLastFetchedHeaderTime: action.lastFetchedHeaderTime
      };
    case SYNC_FETCHED_HEADERS_FINISHED:
      return {
        ...state,
        syncFetchHeadersAttempt: false,
        syncFetchHeadersComplete: true
      };
    case SYNC_DISCOVER_ADDRESSES_STARTED:
      return { ...state, syncDiscoverAddressesAttempt: true };
    case SYNC_DISCOVER_ADDRESSES_FINISHED:
      return { ...state, syncDiscoverAddressesAttempt: false };
    case SYNC_RESCAN_STARTED:
      return { ...state, syncRescanAttempt: true };
    case SYNC_RESCAN_PROGRESS:
      return {
        ...state,
        syncRescanProgress: action.rescannedThrough,
        rescanResponse: action.rescanResponse
      };
    case SYNC_RESCAN_FINISHED:
      return { ...state, syncRescanAttempt: false };
    case CREATEMIXERACCOUNTS_SUCCESS:
      return {
        ...state,
        mixedAccount: action.mixedAccount,
        changeAccount: action.changeAccount,
        csppServer: action.csppServer,
        csppPort: action.csppPort,
        mixedAccountBranch: action.mixedAccountBranch
      };
    case TOGGLE_ALLOW_SEND_FROM_UNMIXED:
      return {
        ...state,
        allowSendFromUnmixed: action.allow
      };
    case CREATEDEXACCOUNT_SUCCESS:
      return {
        ...state,
        dexAccount: action.dexAccount
      };
    case SELECT_DEXACCOUNT_SUCCESS:
      return {
        ...state,
        dexAccount: action.dexAccount
      };
    case DEX_USE_SPV_BTC_SUCCESS:
      return {
        ...state,
        dexBtcSpv: action.dexBtcSpv,
        askDexBtcSpv: action.askDexBtcSpv
      };
    case DEX_CONFIRM_SEED_SUCCESS:
      return {
        ...state,
        confirmDexSeed: true
      };
    case RESET_DEXACCOUNT:
      return {
        ...state,
        dexAccount: null
      };
    case SET_SHOW_STAKING_WARNING:
      return {
        ...state,
        showStakingWarning: action.showStakingWarning
      };
    case DEX_READY:
      return {
        ...state,
        dexReady: true
      };
    default:
      return state;
  }
}
