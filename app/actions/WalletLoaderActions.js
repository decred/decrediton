import { loader, createWallet, walletExists, openWallet, 
  closeWallet, discoverAddresses, subscribeBlockNtfns,
  startConsensusRpc, fetchHeaders} from '../middleware/grpc/loader';
import { loginRequest } from './LoginActions';
import { transactionNftnsStart } from './NotificationActions';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { getDcrdCert } from '../middleware/grpc/client';
import { getCfg } from '../config.js';

var Buffer = require('buffer/').Buffer;

export const LOADER_ATTEMPT = 'LOADER_ATTEMPT';
export const LOADER_FAILED = 'LOADER_FAILED';
export const LOADER_SUCCESS = 'LOADER_SUCCESS';

function loaderError(error) {
  return { error, type: LOADER_FAILED };
}

function loaderSuccess(loader) {
  return (dispatch) => {
    dispatch({loader: loader, type: LOADER_SUCCESS });
    dispatch(walletExistRequest());
  };
}

export function loaderRequest(address, port) {
  var request = {
    address: address,
    port: port,
  }
  return (dispatch) => {
    dispatch({request: request, type: LOADER_ATTEMPT });
    setTimeout(dispatch(getLoader()), 3000);
  }
}

function getLoader() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    loader(getLoaderRequest, function(loader, err) {
      if (err) {
        dispatch(loaderError(err + " Please try again"));
        //throw err
      } else {
        dispatch(loaderSuccess(loader));
      }
    })
  }
}

export const WALLETEXIST_ATTEMPT = 'WALLETEXIST_ATTEMPT';
export const WALLETEXIST_FAILED = 'WALLETEXIST_FAILED';
export const WALLETEXIST_SUCCESS = 'WALLETEXIST_SUCCESS';

function walletExistError(error) {
  return { error, type: WALLETEXIST_FAILED };
}

function walletExistSuccess(response) {
  return (dispatch) => {
    dispatch({response: response, type: WALLETEXIST_SUCCESS });
  }
}

export function walletExistRequest() {
  var request = {};
  return (dispatch) => {
    dispatch({request: {}, type: WALLETEXIST_ATTEMPT });
    setTimeout(dispatch(checkWalletExist()), 3000);
  }
}

function checkWalletExist() {
  return (dispatch, getState) => {
    const { loader, walletExistRequest } = getState().walletLoader;
    walletExists(loader, walletExistRequest, 
        function(response, err) {
      if (err) {
        dispatch(walletExistError(err + " Please try again"));
      } else {
        dispatch(walletExistSuccess(response));
      }
    })
  }
}

export const CREATEWALLET_ATTEMPT = 'CREATEWALLET_ATTEMPT';
export const CREATEWALLET_FAILED = 'CREATEWALLET_FAILED';
export const CREATEWALLET_SUCCESS = 'CREATEWALLET_SUCCESS';

function createWalletError(error) {
  return { error, type: CREATEWALLET_FAILED };
}

function createWalletSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: CREATEWALLET_SUCCESS });
    dispatch(startRpcRequest());
    dispatch(loginRequest());
  }
}

export function createWalletRequest(pubPass, privPass, seed) {
  var request = {
    public_passphrase: Buffer.from(pubPass),
    private_passphrase: Buffer.from(privPass),
    seed: Buffer.from(seed),
  };
  return (dispatch) => { 
    dispatch({
      request: request,
      pubPass: pubPass,
      privPass: privPass,
      type: CREATEWALLET_ATTEMPT });
    setTimeout(dispatch(createNewWallet()), 3000);
  }
}

function createNewWallet() {
  return (dispatch, getState) => {
    const { loader, walletCreateRequest } = getState().walletLoader;
    createWallet(loader, walletCreateRequest, 
        function(err) {
      if (err) {
        dispatch(createWalletError(err + " Please try again"));
      } else {
        dispatch(createWalletSuccess());
      }
    })
  }
}

export const OPENWALLET_ATTEMPT = 'OPENWALLET_ATTEMPT';
export const OPENWALLET_FAILED = 'OPENWALLET_FAILED';
export const OPENWALLET_SUCCESS = 'OPENWALLET_SUCCESS';

function openWalletError(error) {
  return { error, type: OPENWALLET_FAILED };
}

function openWalletSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: OPENWALLET_SUCCESS});
    dispatch(startRpcRequest());
    dispatch(loginRequest());
  };
}

export function openWalletRequest(pubPass, privPass) {
  var request = {
    public_passphrase: Buffer.from(pubPass),
  }
  return (dispatch) => {
    dispatch({
      request: request, 
      pubPass: pubPass,
      privPass: privPass,
      type: OPENWALLET_ATTEMPT});

    setTimeout(dispatch(openWalletAction()), 3000);
  }
}

function openWalletAction() {
  return (dispatch, getState) => {
    const { loader, walletOpenRequest } = getState().walletLoader;
    openWallet(loader, walletOpenRequest, 
        function(err) {
      if (err) {
        dispatch(openWalletError(pubPass + err + " Please try again"));
      } else {
        dispatch(openWalletSuccess());
      }
    })
  }
}

export const CLOSEWALLET_ATTEMPT = 'CLOSEWALLET_ATTEMPT';
export const CLOSEWALLET_FAILED = 'CLOSEWALLET_FAILED';
export const CLOSEWALLET_SUCCESS = 'CLOSEWALLET_SUCCESS';

function closeWalletError(error) {
  return { error, type: CLOSEWALLET_FAILED };
}

function closeWalletSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: CLOSEWALLET_SUCCESS});
  };
}

export function closeWalletRequest() {
  return (dispatch) => {
    dispatch({request: {}, type: CLOSEWALLET_ATTEMPT});
    dispatch(closeWalletAction());
  }
}

function closeWalletAction() {
  return (dispatch, getState) => {
    const { loader, walletCloseRequest } = getState().walletLoader;
    closeWallet(loader, walletCloseRequest,
        function(err) {
      if (err) {
        dispatch(closeWalletError(err + " Please try again"));
      } else {
        dispatch(closeWalletSuccess());
      }
    })
  }
}

export const STARTRPC_ATTEMPT = 'STARTRPC_ATTEMPT';
export const STARTRPC_FAILED = 'STARTRPC_FAILED';
export const STARTRPC_SUCCESS = 'STARTRPC_SUCCESS';

function startRpcError(error) {
  return { error: error, type: STARTRPC_FAILED };
}

function startRpcSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: STARTRPC_SUCCESS});
    dispatch(discoverAddressAttempt(true));
  };
}

export function startRpcRequest() {
  var cfg = getCfg();
  var rpcport = "";
  if (cfg.network == "testnet") {
    rpcport = cfg.daemon_port_testnet;
  } else {
    rpcport = cfg.daemon_port;
  }
  var request = {
    network_address: "127.0.0.1:" + rpcport,
    username: cfg.rpc_user,
    password: Buffer.from(cfg.rpc_pass),
    certificate: getDcrdCert(),
  };
  return (dispatch) => {
    dispatch({request: request, type: STARTRPC_ATTEMPT});
    dispatch(startRpcAction());
  }
}

function startRpcAction() {
  return (dispatch, getState) => {
    const { loader, startRpcRequest } = getState().walletLoader;
    startConsensusRpc(loader, startRpcRequest,
        function(err) {
      if (err) {
        dispatch(startRpcError(err + " Please try again"));
      } else {
        dispatch(startRpcSuccess());
      }
    })
  }
}

export const DISCOVERADDRESS_ATTEMPT = 'DISCOVERADDRESS_ATTEMPT';
export const DISCOVERADDRESS_FAILED = 'DISCOVERADDRESS_FAILED';
export const DISCOVERADDRESS_SUCCESS = 'DISCOVERADDRESS_SUCCESS';

function discoverAddressError(error) {
  return { error, type: DISCOVERADDRESS_FAILED };
}

function discoverAddressSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: DISCOVERADDRESS_SUCCESS});
    dispatch(fetchHeadersAttempt());
  };
}

export function discoverAddressAttempt(discoverAccts) {

  return (dispatch, getState) => {
    const { privatePassphrase } = getState().walletLoader
    var request = {
      discover_accounts: discoverAccts,
      private_passphrase: Buffer.from(privatePassphrase),
    }
    dispatch({request: request, type: DISCOVERADDRESS_ATTEMPT});
    dispatch(discoverAddressAction());
  }
}

function discoverAddressAction() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    const { discoverAddressRequest } = getState().walletLoader;
    discoverAddresses(loader, discoverAddressRequest,
        function(err) {
      if (err) {
        dispatch(discoverAddressError(err + " Please try again"));
      } else {
        dispatch(discoverAddressSuccess());
      }
    })
  }
}

export const SUBSCRIBEBLOCKNTFNS_ATTEMPT = 'SUBSCRIBEBLOCKNTFNS_ATTEMPT';
export const SUBSCRIBEBLOCKNTFNS_FAILED = 'SUBSCRIBEBLOCKNTFNS_FAILED';
export const SUBSCRIBEBLOCKNTFNS_SUCCESS = 'SUBSCRIBEBLOCKNTFNS_SUCCESS';

function subscribeBlockError(error) {
  return { error, type: SUBSCRIBEBLOCKNTFNS_FAILED };
}

function subscribeBlockSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: SUBSCRIBEBLOCKNTFNS_SUCCESS});
  };
}

export function subscribeBlockAttempt() {
  return (dispatch) => {
    dispatch({request: {}, type: SUBSCRIBEBLOCKNTFNS_ATTEMPT});
    dispatch(subscribeBlockAction());
  }
}

function subscribeBlockAction() {
  return (dispatch, getState) => {
    const { loader, subscribeBlockNtfnsRequest } = getState().walletLoader;
    subscribeBlockNtfns(loader, subscribeBlockNtfnsRequest,
        function(err) {
      if (err) {
        dispatch(subscribeBlockError(err + " Please try again"));
      } else {
        dispatch(subscribeBlockSuccess());
      }
    })
  }
}

export const FETCHHEADERS_ATTEMPT = 'FETCHHEADER_ATTEMPT';
export const FETCHHEADERS_FAILED = 'FETCHHEADERS_FAILED';
export const FETCHHEADERS_SUCCESS = 'FETCHHEADERS_SUCCESS';

function fetchHeadersFailed(error) {
  return { error, type: FETCHHEADERS_FAILED };
}

function fetchHeadersSuccess() {
  return (dispatch) => {
    dispatch({response: {}, type: FETCHHEADERS_SUCCESS});
    dispatch(subscribeBlockAttempt());
    //dispatch(transactionNftnsStart());
  };
}

export function fetchHeadersAttempt() {
  return (dispatch) => {
    dispatch({request: {}, type: FETCHHEADERS_ATTEMPT});
    dispatch(fetchHeadersAction());
  }
}

function fetchHeadersAction() {
  return (dispatch, getState) => {
    const { loader, fetchHeadersRequest } = getState().walletLoader;
    fetchHeaders(loader, fetchHeadersRequest,
        function(err) {
      if (err) {
        dispatch(fetchHeadersFailed(err + " Please try again"));
      } else {
        dispatch(fetchHeadersSuccess());
      }
    })
  }
}
