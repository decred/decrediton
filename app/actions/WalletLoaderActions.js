// @flow
import {
  getLoader, startRpc, getWalletExists, createWallet, openWallet, closeWallet, discoverAddresses,
  subscribeToBlockNotifications, fetchHeaders, getStakePoolInfo, fetchMissingCFilters,
  rescanPoint
} from "wallet";
import * as wallet from "wallet";
import { loadActiveDataFiltersAttempt } from "./ControlActions";
import { getWalletServiceAttempt, startWalletServices, getBestBlockHeightAttempt } from "./ClientActions";
import { getVersionServiceAttempt } from "./VersionActions";
import { getAvailableWallets, WALLETREMOVED_FAILED } from "./DaemonActions";
import { getWalletCfg, getDcrdCert } from "../config";
import { getWalletPath } from "main_dev/paths";
import { isTestNet } from "selectors";
import axios from "axios";
import { SpvSyncRequest } from "../middleware/walletrpc/api_pb";

const MAX_RPC_RETRIES = 5;
const RPC_RETRY_DELAY = 5000;

export const versionCheckAction = () => (dispatch) =>
  setTimeout(() => dispatch(getVersionServiceAttempt()), 2000);

export const LOADER_ATTEMPT = "LOADER_ATTEMPT";
export const LOADER_FAILED = "LOADER_FAILED";
export const LOADER_SUCCESS = "LOADER_SUCCESS";

export const loaderRequest = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  const request = { isTestNet: isTestNet(getState()), walletName, address, port };
  dispatch({ request, type: LOADER_ATTEMPT });
  return getLoader(request)
    .then(loader => {
      dispatch({ loader, type: LOADER_SUCCESS });
      dispatch(walletExistRequest());
    })
    .catch(error => dispatch({ error, type: LOADER_FAILED }));
};

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

export const walletExistRequest = () =>
  (dispatch, getState) =>
    getWalletExists(getState().walletLoader.loader)
      .then(response => {
        dispatch({ response: response, type: WALLETEXIST_SUCCESS });
        if (response.getExists()) {
          dispatch(openWalletAttempt("public", false));
        }
      })
      .catch(error => dispatch({ error, type: WALLETEXIST_FAILED }));

export const CREATEWALLET_NEWSEED_CONFIRM_INPUT = "CREATEWALLET_NEWSEED_CONFIRM_INPUT";
export const CREATEWALLET_NEWSEED_BACK_INPUT = "CREATEWALLET_NEWSEED_BACK_INPUT";
export const CREATEWALLET_EXISTINGSEED_INPUT = "CREATEWALLET_EXISTINGSEED_INPUT";
export const CREATEWALLET_GOBACK_EXISITNG_OR_NEW = "CREATEWALLET_GOBACK_EXISITNG_OR_NEW";
export const CREATEWALLET_GOBACK = "CREATEWALLET_GOBACK";
export const CREATEWALLET_NEWSEED_INPUT = "CREATEWALLET_NEWSEED_INPUT";

export const createWalletConfirmNewSeed = () => ({ type: CREATEWALLET_NEWSEED_CONFIRM_INPUT });
export const createWalletGoBackNewSeed = () => ({ type: CREATEWALLET_NEWSEED_BACK_INPUT });
export const createWalletGoBackExistingOrNew = () => ({ type: CREATEWALLET_GOBACK_EXISITNG_OR_NEW });

export const createWalletGoBackWalletSelection = () => (dispatch, getState) => {
  const { daemon: { walletName, network } } = getState();
  wallet.stopWallet().then(() => {
    wallet.removeWallet(walletName, network == "testnet")
      .then(() => {
        dispatch({ type: CREATEWALLET_GOBACK });
        dispatch(getAvailableWallets());
      })
      .catch((err) => {
        console.error(err);
        dispatch({ error: err, type: WALLETREMOVED_FAILED });
      });
  });
};
export const createWalletExistingToggle = (existing) => (dispatch) =>
  existing
    ? dispatch({ type: CREATEWALLET_EXISTINGSEED_INPUT })
    : setTimeout(() => dispatch({ type: CREATEWALLET_NEWSEED_INPUT }), 50);

export const CREATEWALLET_ATTEMPT = "CREATEWALLET_ATTEMPT";
export const CREATEWALLET_FAILED = "CREATEWALLET_FAILED";
export const CREATEWALLET_SUCCESS = "CREATEWALLET_SUCCESS";

export const createWalletRequest = (pubPass, privPass, seed, existing) =>
  (dispatch, getState) => {
    dispatch({ existing: existing, type: CREATEWALLET_ATTEMPT });
    return createWallet(getState().walletLoader.loader, pubPass, privPass, seed)
      .then(() => {
        const { daemon: { walletName } } = getState();
        const config = getWalletCfg(isTestNet(getState()), walletName);
        config.delete("discoveraccounts");
        config.set("discoveraccounts", !existing);
        dispatch({ complete: !existing, type: UPDATEDISCOVERACCOUNTS });
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
      dispatch(startRpcRequestFunc());
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

export const closeWalletRequest = () => (dispatch, getState) => {
  dispatch({ type: CLOSEWALLET_ATTEMPT });
  return closeWallet(getState().walletLoader.loader)
    .then(() => dispatch({ type: CLOSEWALLET_SUCCESS }))
    .catch(error => dispatch({ error, type: CLOSEWALLET_FAILED }));
};

export const STARTRPC_ATTEMPT = "STARTRPC_ATTEMPT";
export const STARTRPC_FAILED = "STARTRPC_FAILED";
export const STARTRPC_SUCCESS = "STARTRPC_SUCCESS";
export const STARTRPC_RETRY = "STARTRPC_RETRY";

export const startRpcRequestFunc = (isRetry) =>
  (dispatch, getState) => {
    const { daemon: { credentials, appData, walletName } }= getState();
    const cfg = getWalletCfg(isTestNet(getState()), walletName);
    let rpcuser, rpccertPath, rpcpass, daemonhost, rpcport;

    if(credentials) {
      rpcuser = credentials.rpc_user;
      rpccertPath = credentials.rpc_cert;
      rpcpass = credentials.rpc_password;
      daemonhost = credentials.rpc_host;
      rpcport = credentials.rpc_port;
    } else if (appData) {
      rpcuser = cfg.get("rpc_user");
      rpcpass = cfg.get("rpc_pass");
      rpccertPath = `${appData}/rpc.cert`;
      daemonhost = "127.0.0.1";
      rpcport = "9109";
    } else {
      rpcuser = cfg.get("rpc_user");
      rpcpass = cfg.get("rpc_pass");
      daemonhost = "127.0.0.1";
      rpcport = "9109";
    }
    const loader = getState().walletLoader.loader;

    const cert = getDcrdCert(rpccertPath);
    if (!isRetry) dispatch({ type: STARTRPC_ATTEMPT });
    return startRpc(loader, daemonhost, rpcport, rpcuser, rpcpass, cert)
      .then(() => {
        dispatch({ type: STARTRPC_SUCCESS });
        dispatch(subscribeBlockAttempt());
      })
      .catch(error => {
        if (error.message.includes("RPC client already created")) {
          dispatch({ type: STARTRPC_SUCCESS });
          dispatch(subscribeBlockAttempt());
        } else if (isRetry) {
          const { rpcRetryAttempts } = getState().walletLoader;
          if (rpcRetryAttempts < MAX_RPC_RETRIES) {
            dispatch({ rpcRetryAttempts: rpcRetryAttempts+1, type: STARTRPC_RETRY });
            setTimeout(() => dispatch(startRpcRequestFunc(isRetry)), RPC_RETRY_DELAY);
          } else {
            dispatch({
              error: `${error}.  You may need to edit ${getWalletPath(isTestNet(getState()), walletName)} and try again`,
              type: STARTRPC_FAILED
            });
          }
        } else {
          dispatch(startRpcRequestFunc(true));
        }
      });
  };

export const DISCOVERADDRESS_INPUT = "DISCOVERADDRESS_INPUT";
export const DISCOVERADDRESS_FAILED_INPUT = "DISCOVERADDRESS_FAILED_INPUT";
export const DISCOVERADDRESS_ATTEMPT = "DISCOVERADDRESS_ATTEMPT";
export const DISCOVERADDRESS_FAILED = "DISCOVERADDRESS_FAILED";
export const DISCOVERADDRESS_SUCCESS = "DISCOVERADDRESS_SUCCESS";

export const discoverAddressAttempt = (privPass) => (dispatch, getState) => {
  const { walletLoader: { loader, discoverAccountsComplete, rescanPointResponse } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: DISCOVERADDRESS_ATTEMPT });
  var startingBlockHash = "";
  if (rescanPointResponse) {
    startingBlockHash = rescanPointResponse.getRescanPointHash();
  }
  if ((startingBlockHash !== null && startingBlockHash.length !== 0) || !discoverAccountsComplete) {
    discoverAddresses(loader, !discoverAccountsComplete, privPass, startingBlockHash)
      .then(() => {
        dispatch({ response: {}, complete: discoverAccountsComplete, type: DISCOVERADDRESS_SUCCESS });
        if (!discoverAccountsComplete) {
          const config = getWalletCfg(isTestNet(getState()), walletName);
          config.delete("discoveraccounts");
          config.set("discoveraccounts", true);
          dispatch({ complete: true, type: UPDATEDISCOVERACCOUNTS });
        } else {
          dispatch(loadActiveDataFiltersAttempt());
        }
      })
      .catch(error => {
        if (error.message.includes("invalid passphrase") && error.message.includes("private key")) {
          dispatch({ error, type: DISCOVERADDRESS_FAILED_INPUT });
        } else {
          dispatch({ error, type: DISCOVERADDRESS_FAILED });
        }
      });
  } else {
    dispatch(loadActiveDataFiltersAttempt());
  }
};

export const FETCHMISSINGCFILTERS_ATTEMPT = "FETCHMISSINGCFILTERS_ATTEMPT";
export const FETCHMISSINGCFILTERS_FAILED = "FETCHMISSINGCFILTERS_FAILED";
export const FETCHMISSINGCFILTERS_SUCCESS = "FETCHMISSINGCFILTERS_SUCCESS";

const fetchMissingCFiltersAttempt = () => (dispatch, getState) => {
  const { loader } = getState().walletLoader;

  dispatch({ request: {}, type: FETCHMISSINGCFILTERS_ATTEMPT });
  return fetchMissingCFilters(loader)
    .then(() => {
      dispatch({ response: {}, type: FETCHMISSINGCFILTERS_SUCCESS });
      dispatch(fetchHeadersAttempt());
    })
    .catch(error => dispatch({ error, type: FETCHMISSINGCFILTERS_FAILED }));
};

export const SUBSCRIBEBLOCKNTFNS_ATTEMPT = "SUBSCRIBEBLOCKNTFNS_ATTEMPT";
export const SUBSCRIBEBLOCKNTFNS_FAILED = "SUBSCRIBEBLOCKNTFNS_FAILED";
export const SUBSCRIBEBLOCKNTFNS_SUCCESS = "SUBSCRIBEBLOCKNTFNS_SUCCESS";

const subscribeBlockAttempt = () => (dispatch, getState) => {
  const { loader } = getState().walletLoader;

  dispatch({ request: {}, type: SUBSCRIBEBLOCKNTFNS_ATTEMPT });
  return subscribeToBlockNotifications(loader)
    .then(() => {
      dispatch({ response: {}, type: SUBSCRIBEBLOCKNTFNS_SUCCESS });
      dispatch(fetchMissingCFiltersAttempt());
    })
    .catch(error => dispatch({ error, type: SUBSCRIBEBLOCKNTFNS_FAILED }));
};

export const FETCHHEADERS_ATTEMPT = "FETCHHEADER_ATTEMPT";
export const FETCHHEADERS_FAILED = "FETCHHEADERS_FAILED";
export const FETCHHEADERS_SUCCESS = "FETCHHEADERS_SUCCESS";
export const FETCHHEADERS_PROGRESS = "FETCHHEADERS_PROGRESS";

export const fetchHeadersAttempt = () => (dispatch, getState) => {
  dispatch({ request: {}, type: FETCHHEADERS_ATTEMPT });
  return fetchHeaders(getState().walletLoader.loader)
    .then(response => {
      dispatch({ response, type: FETCHHEADERS_SUCCESS });
      dispatch(rescanPointAttempt());
    })
    .catch(error => dispatch({ error, type: FETCHHEADERS_FAILED }));
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

export const NEEDED_BLOCKS_DETERMINED = "NEEDED_BLOCKS_DETERMINED";
export function determineNeededBlocks() {
  return (dispatch, getState) => {
    const network = getState().daemon.network;
    const explorerInfoURL = `https://${network}.decred.org/api/status`;
    axios.get(explorerInfoURL, { timeout: 5000 })
      .then(function (response) {
        const neededBlocks = response.data.info.blocks;
        wallet.log("info", `Determined needed block height as ${neededBlocks}`);
        dispatch({ neededBlocks, type: NEEDED_BLOCKS_DETERMINED });
      })
      .catch(function (error) {
        console.log("Unable to obtain latest block number.", error);
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
    const response = wallet.decodeSeed(seedService, mnemonic);
    dispatch({ type: DECODESEED_SUCCESS });
    return response;
  } catch (error) {
    dispatch({ error, type: DECODESEED_FAILED });
    throw error;
  }
};

export const SPVSYNC_ATTEMPT = "SPVSYNC_ATTEMPT";
export const SPVSYNC_FAILED = "SPVSYNC_FAILED";
export const SPVSYNC_SUCCESS = "SPVSYNC_SUCCESS";
export const SPVSYNC_UPDATE = "SPVSYNC_UPDATE";
export const SPVSYNC_INPUT = "SPVSYNC_INPUT";
export const SPVSYNC_CANCEL = "SPVSYNC_CANCEL";
export const SPVSYNC_FETCH_HEADERS = "SPVSYNC_FETCH_HEADERS";
export const SPVSYNC_DISCOVER_ADDRESS_WORKING = "SPVSYNC_DISCOVER_ADDRESS_WORKING";
export const SPVSYNC_DISCOVER_ADDRESS_COMPLETE = "SPVSYNC_DISCOVER_ADDRESS_COMPLETE";
export const SPVSYNC_RESCAN_PROGRESS = "SPVSYNC_RESCAN_PROGRESS";
export const SPVSYNC_PEER_COUNT = "SPVSYNC_PEER_COUNT";
export const SPVSYNC_UNSYNCED = "SPVSYNC_UNSYNCED";

export const spvSyncAttempt = (privPass) => (dispatch, getState) => {
  const { discoverAccountsComplete, spvConnect } = getState().walletLoader;
  var request = new SpvSyncRequest();
  for (var i = 0; spvConnect && i < spvConnect.length; i++) {
    request.addSpvConnect(spvConnect[i]);
  }
  if (!discoverAccountsComplete && privPass) {
    request.setDiscoverAccounts(true);
    request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
  } else if (!discoverAccountsComplete && !privPass) {
    dispatch({ type: SPVSYNC_INPUT });
    return;
  }
  return new Promise(() => {
    dispatch({ type: SPVSYNC_ATTEMPT });
    const { loader, spvDiscoverAddresses, spvSynced } = getState().walletLoader;
    var spvSyncCall = loader.spvSync(request);
    spvSyncCall.on("data", function(response) {
      if (response.getSyncingStatus()) {
        if (spvSynced) {
          dispatch({ type: SPVSYNC_UNSYNCED });
        }
        if (response.getSyncingStatus().getFetchHeaders()) {
          var fetchedHeadersCount = response.getSyncingStatus().getFetchHeaders().getFetchedHeadersCount();
          var lastFetchedHeaderTime = new Date(response.getSyncingStatus().getFetchHeaders().getLastHeaderTime()/1000000);
          var fetchedMissingCfilters = response.getSyncingStatus().getFetchHeaders().getFetchedCfiltersCount();
          dispatch({ fetchedHeadersCount, lastFetchedHeaderTime, fetchedMissingCfilters, type: SPVSYNC_FETCH_HEADERS });
        } else {
          if (!spvDiscoverAddresses) {
            dispatch({ type: SPVSYNC_DISCOVER_ADDRESS_WORKING });
          } else if (response.getSyncingStatus().getDiscoveredAddresses()) {
            dispatch({ type: SPVSYNC_DISCOVER_ADDRESS_COMPLETE });
          }
          if (spvDiscoverAddresses && response.getSyncingStatus().getRescannedThrough() !== null) {
            dispatch({ rescannedThrough: response.getSyncingStatus().getRescannedThrough(), type: SPVSYNC_RESCAN_PROGRESS });
          }
        }
      } else {
        if (!spvSynced) {
          if (!discoverAccountsComplete) {
            const { daemon: { walletName } } = getState();
            const config = getWalletCfg(isTestNet(getState()), walletName);
            config.delete("discoveraccounts");
            config.set("discoveraccounts", true);
            dispatch({ complete: true, type: UPDATEDISCOVERACCOUNTS });
          }
          dispatch({ syncCall: spvSyncCall, synced: true, type: SPVSYNC_UPDATE });
          dispatch(getBestBlockHeightAttempt(startWalletServices));
        }
        dispatch({ peerCount: response.getPeerCount(), type: SPVSYNC_PEER_COUNT });
      }
    });
    spvSyncCall.on("end", function() {
      dispatch({ type: SPVSYNC_SUCCESS });
    });
    spvSyncCall.on("error", function(status) {
      status = status + "";
      if (status.indexOf("Cancelled") < 0) {
        console.log(status);
        //reject(status);
        dispatch({ error: status, type: SPVSYNC_FAILED });
      }
    });
  });
};

export function spvSyncCancel() {
  return (dispatch, getState) => {
    const { syncCall } = getState().walletLoader;
    if (syncCall) {
      syncCall.cancel();
      dispatch({ type: SPVSYNC_CANCEL });
    }
  };
}

export const RESCANPOINT_ATTEMPT = "RESCANPOINT_ATTEMPT";
export const RESCANPOINT_FAILED = "RESCANPOINT_FAILED";
export const RESCANPOINT_SUCCESS = "RESCANPOINT_SUCCESS";

export const rescanPointAttempt = () => (dispatch, getState) => {
  const { discoverAccountsComplete } = getState().walletLoader;
  dispatch({ type: RESCANPOINT_ATTEMPT });
  return rescanPoint(getState().walletLoader.loader)
    .then((response) => {
      dispatch({ response, type: RESCANPOINT_SUCCESS });
      if (discoverAccountsComplete) {
        dispatch(discoverAddressAttempt());
      } else {
        // This is dispatched to indicate we should wait for user input to discover addresses.
        dispatch({ response: {}, type: DISCOVERADDRESS_INPUT });
      }
    })
    .catch(async error => {
      dispatch({ error, type: RESCANPOINT_FAILED });
    });
};
