// @flow
import {
  getLoader, getWalletExists, createWallet, openWallet, closeWallet, getStakePoolInfo, rescanPoint
} from "wallet";
import * as wallet from "wallet";
import { rescanCancel, ticketBuyerCancel } from "./ControlActions";
import { getWalletServiceAttempt, startWalletServices, getBestBlockHeightAttempt,
  cancelPingAttempt } from "./ClientActions";
import { WALLETREMOVED_FAILED } from "./DaemonActions";
import { getWalletCfg, getDcrdCert } from "config";
import { getWalletPath } from "main_dev/paths";
import { isTestNet, isSPV } from "selectors";
import { SpvSyncRequest, SyncNotificationType, RpcSyncRequest } from "../middleware/walletrpc/api_pb";
import { push as pushHistory } from "react-router-redux";
import { stopNotifcations } from "./NotificationActions";
import { clearDeviceSession as trezorClearDeviceSession } from "./TrezorActions";
import { stopDcrlnd } from "./LNActions";
import { TESTNET } from "constants";
import { ipcRenderer } from "electron";

const MAX_RPC_RETRIES = 5;
const RPC_RETRY_DELAY = 5000;
// const cliOptions = ipcRenderer.sendSync("get-cli-options");

export const LOADER_ATTEMPT = "LOADER_ATTEMPT";
export const LOADER_FAILED = "LOADER_FAILED";
export const LOADER_SUCCESS = "LOADER_SUCCESS";

export const loaderRequest = () => (dispatch, getState) => new Promise((resolve) => {
  const get = async () => {
    const { grpc: { address, port } } = getState();
    const { daemon: { walletName } } = getState();
    const request = { isTestNet: isTestNet(getState()), walletName, address, port };
    dispatch({ request, type: LOADER_ATTEMPT });
    try {
      const loader = await getLoader(request);
      dispatch({ loader, type: LOADER_SUCCESS });
      dispatch(walletExistRequest());
      resolve(true);
    } catch (error) {
      dispatch({ error, type: LOADER_FAILED });
    }
  };

  get();
});

export const GETWALLETSEEDSVC_ATTEMPT = "GETWALLETSEEDSVC_ATTEMPT";
export const GETWALLETSEEDSVC_FAILED = "GETWALLETSEEDSVC_FAILED";
export const GETWALLETSEEDSVC_SUCCESS = "GETWALLETSEEDSVC_SUCCESS";

export const getWalletSeedService = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETWALLETSEEDSVC_ATTEMPT });
  return wallet.getSeedService(isTestNet(getState()), walletName, address, port)
    .then(seedService => {
      dispatch({ seedService, type: GETWALLETSEEDSVC_SUCCESS });
    })
    .catch(error => dispatch({ error, type: GETWALLETSEEDSVC_FAILED }));
};

export const WALLETEXIST_ATTEMPT = "WALLETEXIST_ATTEMPT";
export const WALLETEXIST_FAILED = "WALLETEXIST_FAILED";
export const WALLETEXIST_SUCCESS = "WALLETEXIST_SUCCESS";

export const walletExistRequest = () => (dispatch, getState) =>
  getWalletExists(getState().walletLoader.loader)
    .then(response => {
      dispatch({ response: response, type: WALLETEXIST_SUCCESS });
      if (response.getExists()) {
        dispatch(openWalletAttempt("public", false));
      }
    })
    .catch(error => dispatch({ error, type: WALLETEXIST_FAILED }));

export const CREATEWALLET_GOBACK = "CREATEWALLET_GOBACK";

// cancelCreateWallet stops and remove the wallet being created
// removing its directories. It is used when a wallet starts being created
// but the user has given up.
export const cancelCreateWallet = () => async (dispatch, getState) => {
  const { daemon: { walletName } } = getState();
  const { currentSettings } = getState().settings;
  const network = currentSettings.network;
  try {
    await wallet.stopWallet();
    await wallet.removeWallet(walletName, network == TESTNET);
    dispatch(setSelectedWallet(null));
    dispatch({ type: CREATEWALLET_GOBACK });
  } catch (err) {
    dispatch({ error: err, type: WALLETREMOVED_FAILED });
  }
};

export const CREATEWALLET_ATTEMPT = "CREATEWALLET_ATTEMPT";
export const CREATEWALLET_FAILED = "CREATEWALLET_FAILED";
export const CREATEWALLET_SUCCESS = "CREATEWALLET_SUCCESS";

export const createWalletRequest = (pubPass, privPass, seed, isNew) => (dispatch, getState) => {
  dispatch({ existing: !isNew, type: CREATEWALLET_ATTEMPT });
  return createWallet(getState().walletLoader.loader, pubPass, privPass, seed)
    .then(() => {
      const { daemon: { walletName } } = getState();
      const config = getWalletCfg(isTestNet(getState()), walletName);
      config.delete("discoveraccounts");
      config.set("discoveraccounts", isNew);
      dispatch({ complete: isNew, type: UPDATEDISCOVERACCOUNTS });
      dispatch({ response: {}, type: CREATEWALLET_SUCCESS });
      dispatch(clearStakePoolConfigNewWallet());
      dispatch(getWalletServiceAttempt());
    })
    .catch(error => dispatch({ error, type: CREATEWALLET_FAILED }));
};

export const CREATEWATCHONLYWALLET_ATTEMPT = "CREATEWATCHONLYWALLET_ATTEMPT";
export const CREATEWATCHONLYWALLET_FAILED = "CREATEWATCHONLYWALLET_FAILED";
export const CREATEWATCHONLYWALLET_SUCCESS = "CREATEWATCHONLYWALLET_SUCCESS";

export const createWatchOnlyWalletRequest = (extendedPubKey, pubPass ="") => (dispatch, getState) => {
  dispatch({ type: CREATEWATCHONLYWALLET_ATTEMPT });
  return wallet.createWatchingOnlyWallet(getState().walletLoader.loader, extendedPubKey, pubPass)
    .then(() => {
      const { daemon: { walletName } } = getState();
      const config = getWalletCfg(isTestNet(getState()), walletName);
      config.set("iswatchonly", true);
      config.delete("discoveraccounts");
      dispatch({ response: {}, type: CREATEWATCHONLYWALLET_SUCCESS });
      dispatch(getWalletServiceAttempt());
      if (isSPV(getState())) {
        dispatch(spvSyncAttempt());
      } else {
        dispatch(startRpcRequestFunc());
      }
    })
    .catch(error => dispatch({ error, type: CREATEWATCHONLYWALLET_FAILED }));
};

export const OPENWALLET_INPUT = "OPENWALLET_INPUT";
export const OPENWALLET_FAILED_INPUT = "OPENWALLET_FAILED_INPUT";
export const OPENWALLET_ATTEMPT = "OPENWALLET_ATTEMPT";
export const OPENWALLET_FAILED = "OPENWALLET_FAILED";
export const OPENWALLET_SUCCESS = "OPENWALLET_SUCCESS";

export const openWalletAttempt = (pubPass, retryAttempt) => (dispatch, getState) => {
  dispatch({ type: OPENWALLET_ATTEMPT });
  return openWallet(getState().walletLoader.loader, pubPass)
    .then((response) => {
      dispatch(getWalletServiceAttempt());
      wallet.setIsWatchingOnly(response.getWatchingOnly());
      dispatch({ isWatchingOnly: response.getWatchingOnly(),  type: OPENWALLET_SUCCESS });
    })
    .catch(async error => {
      if (error.message.includes("wallet already")) {
        dispatch(getWalletServiceAttempt());
        const isWatchingOnly = await wallet.getIsWatchingOnly();
        dispatch({ isWatchingOnly, type: OPENWALLET_SUCCESS });
      } else if (error.message.includes("invalid passphrase:: wallet.Open")) {
        if (retryAttempt) {
          dispatch({ error, type: OPENWALLET_FAILED_INPUT });
        } else {
          dispatch({ type: OPENWALLET_INPUT });
        }
      } else {
        dispatch({ error, type: OPENWALLET_FAILED });
      }
    });
};

export const CLOSEWALLET_ATTEMPT = "CLOSEWALLET_ATTEMPT";
export const CLOSEWALLET_FAILED = "CLOSEWALLET_FAILED";
export const CLOSEWALLET_SUCCESS = "CLOSEWALLET_SUCCESS";

export const closeWalletRequest = () => async(dispatch, getState) => {
  const { walletReady } = getState().daemon;
  dispatch({ type: CLOSEWALLET_ATTEMPT });
  try {
    await dispatch(cancelPingAttempt());
    await dispatch(stopNotifcations());
    await dispatch(syncCancel());
    await dispatch(rescanCancel());
    await dispatch(trezorClearDeviceSession());
    await dispatch(stopDcrlnd());
    await dispatch(ticketBuyerCancel());
    await dispatch(setSelectedWallet(null));
    if (walletReady) {
      await closeWallet(getState().walletLoader.loader);
    }
    await wallet.stopWallet();
    dispatch({ type: CLOSEWALLET_SUCCESS });
    dispatch(pushHistory("/getstarted/initial"));
  } catch (error) {
    dispatch({ error, type: CLOSEWALLET_FAILED });
    dispatch(pushHistory("/error"));
  }
};

export const STARTRPC_ATTEMPT = "STARTRPC_ATTEMPT";
export const STARTRPC_FAILED = "STARTRPC_FAILED";
export const STARTRPC_SUCCESS = "STARTRPC_SUCCESS";
export const STARTRPC_RETRY = "STARTRPC_RETRY";

export const startRpcRequestFunc = (privPass, isRetry) =>
  (dispatch, getState) => {
    const { syncAttemptRequest } =  getState().walletLoader;
    if (syncAttemptRequest) {
      return;
    }
    const { daemon: { walletName }, walletLoader: { discoverAccountsComplete,isWatchingOnly } }= getState();

    const credentials = ipcRenderer.sendSync("get-dcrd-rpc-credentials");
    const { rpc_user, rpc_cert, rpc_pass, rpc_host, rpc_port } = credentials;

    var request = new RpcSyncRequest();
    const cert = getDcrdCert(rpc_cert);
    request.setNetworkAddress(rpc_host + ":" + rpc_port);
    request.setUsername(rpc_user);
    request.setPassword(new Uint8Array(Buffer.from(rpc_pass)));
    request.setCertificate(new Uint8Array(cert));
    if (!discoverAccountsComplete && privPass) {
      request.setDiscoverAccounts(true);
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
    } else if (!discoverAccountsComplete && !privPass && !isWatchingOnly) {
      dispatch({ type: SYNC_INPUT });
      return;
    }
    return new Promise(() => {
      if (!isRetry) dispatch({ type: SYNC_ATTEMPT });
      const { loader } = getState().walletLoader;
      setTimeout(async () => {
        const rpcSyncCall = await loader.rpcSync(request);
        dispatch({ syncCall: rpcSyncCall, type: SYNC_UPDATE });
        rpcSyncCall.on("data", function(response) {
          dispatch(syncConsumer(response));
        });
        rpcSyncCall.on("end", function() {
          dispatch({ type: SYNC_SUCCESS });
        });
        rpcSyncCall.on("error", function(status) {
          status = status + "";
          if (status.indexOf("Cancelled") < 0) {
            console.error(status);
            if (isRetry) {
              const { rpcRetryAttempts } = getState().walletLoader;
              if (rpcRetryAttempts < MAX_RPC_RETRIES) {
                dispatch({ rpcRetryAttempts: rpcRetryAttempts+1, type: STARTRPC_RETRY });
                setTimeout(() => dispatch(startRpcRequestFunc(isRetry, privPass)), RPC_RETRY_DELAY);
              } else {
                dispatch({
                  error: `${status}.  You may need to edit ${getWalletPath(isTestNet(getState()), walletName)} and try again`,
                  type: STARTRPC_FAILED
                });
              }
            } else {
              if (status.indexOf("invalid passphrase") > 0 || status.indexOf("Stream removed")) {
                dispatch({ error: status, type: SYNC_FAILED });
              } else {
                dispatch(startRpcRequestFunc(true, privPass));
              }
            }
          }
        });
      }, 500);
    });
  };

export const WALLET_SELECTED = "WALLET_SELECTED";

export const setSelectedWallet = (selectedWallet) => (dispatch) => {
  dispatch({ type: WALLET_SELECTED });
  ipcRenderer.sendSync("set-selected-wallet", selectedWallet);
};

export const GET_SELECTED_WALLET = "GET_SELECTED_WALLET";

export const getSelectedWallet = () => (dispatch) => {
  const wallet = ipcRenderer.sendSync("get-selected-wallet");
  dispatch({ type: GET_SELECTED_WALLET });
  return wallet;
};

export const UPDATEDISCOVERACCOUNTS = "UPDATEDISCOVERACCOUNTS";
export const CLEARSTAKEPOOLCONFIG = "CLEARSTAKEPOOLCONFIG";

export function clearStakePoolConfigNewWallet() {
  return (dispatch, getState) => {
    const { daemon: { walletName } } = getState();
    let config = getWalletCfg(isTestNet(getState()), walletName);
    config.delete("stakepools");

    getStakePoolInfo()
      .then(foundStakePoolConfigs => {
        if (foundStakePoolConfigs) {
          let config = getWalletCfg(isTestNet(getState()), walletName);
          config.set("stakepools", foundStakePoolConfigs);
          dispatch({ currentStakePoolConfig: foundStakePoolConfigs, type: CLEARSTAKEPOOLCONFIG });
        }
      });
  };
}

export const GENERATESEED_ATTEMPT = "GENERATESEED_ATTEMPT";
export const GENERATESEED_FAILED = "GENERATESEED_FAILED";
export const GENERATESEED_SUCCESS = "GENERATESEED_SUCCESS";

// generateSeed generates a new seed for a new wallet. Please note that the seed
// is *not* replicated into the global redux state, to prevent being extracted
// or logged.
// This is an async function, so it returns a promise that resolves once the
// seed is obtained.
export const generateSeed = () => async (dispatch, getState) => {
  const seedService = getState().walletLoader.seedService;
  dispatch({ type: GENERATESEED_ATTEMPT });
  try {
    const response = wallet.generateSeed(seedService);
    dispatch({ type: GENERATESEED_SUCCESS }); // please note: don't copy the seed here.
    return response;
  } catch (error) {
    dispatch({ error, type: GENERATESEED_FAILED });
    throw error;
  }
};

export const DECODESEED_ATTEMPT = "DECODESEED_ATTEMPT";
export const DECODESEED_FAILED = "DECODESEED_FAILED";
export const DECODESEED_SUCCESS = "DECODESEED_SUCCESS";

// decodeSeed tries to decode the given mnemonic as a seed. Please note that
// this mnenomic is *not* replicated into the global redux state, to prevent
// being extracted or logged.
export const decodeSeed = (mnemonic) => async (dispatch, getState) => {
  const seedService = getState().walletLoader.seedService;
  dispatch({ type: DECODESEED_ATTEMPT }); // please note: don't copy the seed here.
  try {
    const response = await wallet.decodeSeed(seedService, mnemonic);
    dispatch({ type: DECODESEED_SUCCESS });
    return response;
  } catch (error) {
    dispatch({ error, type: DECODESEED_FAILED });
    throw error;
  }
};

export const SYNC_ATTEMPT = "SYNC_ATTEMPT";
export const SYNC_FAILED = "SYNC_FAILED";
export const SYNC_SUCCESS = "SYNC_SUCCESS";
export const SYNC_UPDATE = "SYNC_UPDATE";
export const SYNC_INPUT = "SYNC_INPUT";
export const SYNC_CANCEL = "SYNC_CANCEL";

export const SYNC_SYNCED = "SYNC_SYNCED";
export const SYNC_UNSYNCED = "SYNC_UNSYNCED";
export const SYNC_PEER_CONNECTED = "SYNC_PEER_CONNECTED";
export const SYNC_PEER_DISCONNECTED = "SYNC_PEER_DISCONNECTED";
export const SYNC_FETCHED_MISSING_CFILTERS_STARTED = "SYNC_FETCHED_MISSING_CFILTERS_STARTED";
export const SYNC_FETCHED_MISSING_CFILTERS_PROGRESS = "SYNC_FETCHED_MISSING_CFILTERS_PROGRESS";
export const SYNC_FETCHED_MISSING_CFILTERS_FINISHED = "SYNC_FETCHED_MISSING_CFILTERS_FINISHED";
export const SYNC_FETCHED_HEADERS_STARTED = "SYNC_FETCHED_HEADERS_STARTED";
export const SYNC_FETCHED_HEADERS_PROGRESS = "SYNC_FETCHED_HEADERS_PROGRESS";
export const SYNC_FETCHED_HEADERS_FINISHED = "SYNC_FETCHED_HEADERS_FINISHED";
export const SYNC_DISCOVER_ADDRESSES_FINISHED = "SYNC_DISCOVER_ADDRESSES_FINISHED";
export const SYNC_DISCOVER_ADDRESSES_STARTED= "SYNC_DISCOVER_ADDRESSES_STARTED";
export const SYNC_RESCAN_STARTED = "SYNC_RESCAN_STARTED";
export const SYNC_RESCAN_PROGRESS = "SYNC_RESCAN_PROGRESS";
export const SYNC_RESCAN_FINISHED = "SYNC_RESCAN_FINISHED";

export const spvSyncAttempt = (privPass) => (dispatch, getState) => {
  const { syncAttemptRequest } =  getState().walletLoader;
  if (syncAttemptRequest) {
    return;
  }
  dispatch({ type: SYNC_ATTEMPT });
  const { discoverAccountsComplete } = getState().walletLoader;
  const { currentSettings } = getState().settings;
  const spvConnect = currentSettings.spvConnect;
  var request = new SpvSyncRequest();
  for (var i = 0; spvConnect && i < spvConnect.length; i++) {
    request.addSpvConnect(spvConnect[i]);
  }
  if (!discoverAccountsComplete && privPass) {
    request.setDiscoverAccounts(true);
    request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
  } else if (!discoverAccountsComplete && !privPass) {
    dispatch({ type: SYNC_INPUT });
    return;
  }
  return new Promise(() => {
    const { loader } = getState().walletLoader;
    const spvSyncCall = loader.spvSync(request);
    dispatch({ syncCall: spvSyncCall, type: SYNC_UPDATE });
    spvSyncCall.on("data", function(response) {
      dispatch(syncConsumer(response));
    });
    spvSyncCall.on("end", function() {
      dispatch({ type: SYNC_SUCCESS });
    });
    spvSyncCall.on("error", function(status) {
      status = status + "";
      if (status.indexOf("Cancelled") < 0) {
        console.error(status);
        dispatch({ error: status, type: SYNC_FAILED });
      }
    });
  });
};
export function syncCancel() {
  return (dispatch, getState) => {
    const { syncCall } = getState().walletLoader;
    if (syncCall) {
      syncCall.cancel();
      dispatch({ type: SYNC_CANCEL });
    }
  };
}

// TODO: move this method to state machine
const syncConsumer = (response) => (dispatch, getState) => {
  const { discoverAccountsComplete } = getState().walletLoader;
  switch (response.getNotificationType()) {
  case SyncNotificationType.SYNCED: {
    dispatch({ type: SYNC_SYNCED });
    dispatch(getBestBlockHeightAttempt(startWalletServices));
    break;
  }
  case SyncNotificationType.UNSYNCED: {
    dispatch({ type: SYNC_UNSYNCED });
    break;
  }
  case SyncNotificationType.PEER_CONNECTED: {
    dispatch({ peerCount: response.getPeerInformation().getPeerCount(), type: SYNC_PEER_CONNECTED });
    break;
  }
  case SyncNotificationType.PEER_DISCONNECTED: {
    dispatch({ peerCount: response.getPeerInformation().getPeerCount(), type: SYNC_PEER_DISCONNECTED });
    break;
  }
  case SyncNotificationType.FETCHED_MISSING_CFILTERS_STARTED: {
    dispatch({ type: SYNC_FETCHED_MISSING_CFILTERS_STARTED });
    break;
  }
  case SyncNotificationType.FETCHED_MISSING_CFILTERS_PROGRESS: {
    const cFiltersStart = response.getFetchMissingCfilters().getFetchedCfiltersStartHeight();
    const cFiltersEnd = response.getFetchMissingCfilters().getFetchedCfiltersEndHeight();
    dispatch({ cFiltersStart, cFiltersEnd, type: SYNC_FETCHED_MISSING_CFILTERS_PROGRESS });
    break;
  }
  case SyncNotificationType.FETCHED_MISSING_CFILTERS_FINISHED: {
    dispatch({ type: SYNC_FETCHED_MISSING_CFILTERS_FINISHED });
    break;
  }
  case SyncNotificationType.FETCHED_HEADERS_STARTED: {
    const fetchTimeStart = new Date();
    dispatch({ fetchTimeStart, type: SYNC_FETCHED_HEADERS_STARTED });
    break;
  }
  case SyncNotificationType.FETCHED_HEADERS_PROGRESS: {
    const lastFetchedHeaderTime = new Date(response.getFetchHeaders().getLastHeaderTime()*1000);
    const fetchHeadersCount = response.getFetchHeaders().getFetchedHeadersCount();

    dispatch({ fetchHeadersCount, lastFetchedHeaderTime, type: SYNC_FETCHED_HEADERS_PROGRESS });
    break;
  }
  case SyncNotificationType.FETCHED_HEADERS_FINISHED: {
    dispatch({ type: SYNC_FETCHED_HEADERS_FINISHED });
    break;
  }
  case SyncNotificationType.DISCOVER_ADDRESSES_STARTED: {
    dispatch({ type: SYNC_DISCOVER_ADDRESSES_STARTED });
    break;
  }
  case SyncNotificationType.DISCOVER_ADDRESSES_FINISHED: {
    dispatch({ type: SYNC_DISCOVER_ADDRESSES_FINISHED });
    if (!discoverAccountsComplete) {
      const { daemon: { walletName } } = getState();
      const config = getWalletCfg(isTestNet(getState()), walletName);
      config.delete("discoveraccounts");
      config.set("discoveraccounts", true);
      dispatch({ complete: true, type: UPDATEDISCOVERACCOUNTS });
    }
    break;
  }
  case SyncNotificationType.RESCAN_STARTED: {
    dispatch({ type: SYNC_RESCAN_STARTED });
    break;
  }
  case SyncNotificationType.RESCAN_PROGRESS: {
    dispatch({ rescannedThrough: response.getRescanProgress().getRescannedThrough(), type: SYNC_RESCAN_PROGRESS });
    break;
  }
  case SyncNotificationType.RESCAN_FINISHED: {
    dispatch({ type: SYNC_RESCAN_FINISHED });
    break;
  }}
};

export const RESCANPOINT_ATTEMPT = "RESCANPOINT_ATTEMPT";
export const RESCANPOINT_FAILED = "RESCANPOINT_FAILED";
export const RESCANPOINT_SUCCESS = "RESCANPOINT_SUCCESS";

export const rescanPointAttempt = () => (dispatch, getState) => {
  dispatch({ type: RESCANPOINT_ATTEMPT });
  return rescanPoint(getState().walletLoader.loader)
    .then((response) => {
      dispatch({ response, type: RESCANPOINT_SUCCESS });
    })
    .catch(async error => {
      dispatch({ error, type: RESCANPOINT_FAILED });
    });
};

export const SET_POLITEIA_LAST_ACCESS_SUCCESS = "SET_POLITEIA_LAST_ACCESS_SUCCESS";

export const setLastPoliteiaAccessTime = () => (dispatch, getState) => {
  const { daemon: { walletName } } = getState();
  const { grpc: { currentBlockHeight } } = getState();
  const config = getWalletCfg(isTestNet(getState()), walletName);
  // time in seconds as politeia uses its proposal time in seconds
  const timestamp = (new Date()).getTime()/1000;
  config.set("politeia_last_access_time", timestamp);
  config.set("politeia_last_access_block", currentBlockHeight);
  dispatch({ type: SET_POLITEIA_LAST_ACCESS_SUCCESS, currentBlockHeight, timestamp });
};
