import { loader } from '../middleware/grpc/client';
import { getWalletServiceAttempt } from './ClientActions';
import { getVersionServiceAttempt } from './VersionActions';
import { getSeederAttempt, generateRandomSeedAttempt } from './SeedServiceActions';
import { getCfg, getCfgPath, getDcrdCert } from '../config.js';
import { WalletExistsRequest, CreateWalletRequest, OpenWalletRequest,
  CloseWalletRequest, StartConsensusRpcRequest, DiscoverAddressesRequest,
  SubscribeToBlockNotificationsRequest, FetchHeadersRequest } from '../middleware/walletrpc/api_pb';

export const DISCLAIMER_OK = 'DISCLAIMER_OK';

export function disclaimerOKAction() {
  return (dispatch) => {
    dispatch({ type: DISCLAIMER_OK });
    dispatch(getVersionServiceAttempt());
  };
}

export const LOADER_ATTEMPT = 'LOADER_ATTEMPT';
export const LOADER_FAILED = 'LOADER_FAILED';
export const LOADER_SUCCESS = 'LOADER_SUCCESS';

function loaderError(error) {
  return { error, type: LOADER_FAILED };
}

function loaderSuccess(loader) {
  return (dispatch) => {
    dispatch({loader: loader, type: LOADER_SUCCESS });
    dispatch(getSeederAttempt());
    dispatch(walletExistRequest());
  };
}

export function loaderRequest(address, port) {
  var request = {
    address: address,
    port: port,
  };
  return (dispatch) => {
    dispatch({request: request, type: LOADER_ATTEMPT });
    setTimeout(dispatch(getLoader()), 3000);
  };
}

function getLoader() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    loader(getLoaderRequest, function(loader, err) {
      if (err) {
        dispatch(loaderError(err + ' Please try again'));
        //throw err
      } else {
        dispatch(loaderSuccess(loader));
      }
    });
  };
}

export const WALLETEXIST_ATTEMPT = 'WALLETEXIST_ATTEMPT';
export const WALLETEXIST_FAILED = 'WALLETEXIST_FAILED';
export const WALLETEXIST_SUCCESS = 'WALLETEXIST_SUCCESS';

function walletExistError(error) {
  return (dispatch) => {
    dispatch({ error, type: WALLETEXIST_FAILED });
  };
}

function walletExistSuccess(response) {
  return (dispatch) => {
    dispatch({response: response, type: WALLETEXIST_SUCCESS });
    if (response.getExists()) {
      setTimeout(dispatch(openWalletAttempt('public')), 1000);
    } else {
      setTimeout(() => dispatch(generateRandomSeedAttempt()), 500);
    }
  };
}

export function walletExistRequest() {
  var request = new WalletExistsRequest();
  return (dispatch) => {
    dispatch({request: request, type: WALLETEXIST_ATTEMPT });
    setTimeout(dispatch(checkWalletExist()), 3000);
  };
}

function checkWalletExist() {
  return (dispatch, getState) => {
    const { loader, walletExistRequest } = getState().walletLoader;
    loader.walletExists(walletExistRequest,
        function(err, response) {
          if (err) {
            dispatch(walletExistError(err + ' Please try again'));
          } else {
            dispatch(walletExistSuccess(response));
          }
        });
  };
}
export const CREATEWALLET_NEWSEED_CONFIRM = 'CREATEWALLET_NEWSEED_CONFIRM';
export const CREATEWALLET_NEWSEED_BACK = 'CREATEWALLET_NEWSEED_BACK';
export const CREATEWALLET_EXISTINGSEED = 'CREATEWALLET_EXISTINGSEED';
export const CREATEWALLET_NEWSEED = 'CREATEWALLET_NEWSEED';

export function createWalletConfirmNewSeed(){
  return{ type: CREATEWALLET_NEWSEED_CONFIRM };
}
export function createWalletGoBackNewSeed(){
  return{ type: CREATEWALLET_NEWSEED_BACK };
}

export function createWalletExistingToggle(existing) {
  return (dispatch) => {
    if (existing){
      dispatch({ type: CREATEWALLET_EXISTINGSEED });
    }   else {
      setTimeout(()=>dispatch({ type: CREATEWALLET_NEWSEED }), 50);
      dispatch(generateRandomSeedAttempt());
    }
  };
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
  };
}

export function createWalletRequest(pubPass, privPass, seed, existing) {
  return (dispatch) => {
    dispatch({ existing: existing, type: CREATEWALLET_ATTEMPT });
    dispatch(createNewWallet(pubPass, privPass, seed));
  };
}

function createNewWallet(pubPass, privPass, seed) {
  var request = new CreateWalletRequest();
  //request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
  request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
  request.setSeed(seed);
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    loader.createWallet(request,
        function(err) {
          if (err) {
            dispatch(createWalletError(err + ' Please try again'));
          } else {
            dispatch(createWalletSuccess());
          }
        });
  };
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
  };
}

export function openWalletAttempt(pubPass) {
  return (dispatch) => {
    dispatch({type: OPENWALLET_ATTEMPT});
    dispatch(openWalletAction(pubPass));
  };
}

function openWalletAction(pubPass) {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    var request = new OpenWalletRequest();
    request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
    loader.openWallet(request,
        function(err) {
          if (err) {
            if (err.message.includes('wallet already loaded')) {
              dispatch(openWalletSuccess());
              return;
            }
            dispatch(openWalletError(err + ' Please try again'));
          } else {
            dispatch(openWalletSuccess());
          }
        });
  };
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
  };
}

function closeWalletAction() {
  var request = new CloseWalletRequest();
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    loader.closeWallet(request,
        function(err) {
          if (err) {
            dispatch(closeWalletError(err + ' Please try again'));
          } else {
            dispatch(closeWalletSuccess());
          }
        });
  };
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
    dispatch(subscribeBlockAttempt());
  };
}

export function startRpcRequest() {
  var cfg = getCfg();
  var rpcport = '';
  if (cfg.get('network') == 'testnet') {
    rpcport = cfg.get('daemon_port_testnet');
  } else {
    rpcport = cfg.get('daemon_port');
  }
  var request = new StartConsensusRpcRequest();
  request.setNetworkAddress('127.0.0.1:' + rpcport);
  request.setUsername(cfg.get('rpc_user'));
  request.setPassword(new Uint8Array(Buffer.from(cfg.get('rpc_pass'))));
  request.setCertificate(new Uint8Array(getDcrdCert()));

  return (dispatch) => {
    dispatch({request: request, type: STARTRPC_ATTEMPT});
    dispatch(startRpcAction());
  };
}

function startRpcAction() {
  return (dispatch, getState) => {
    const { loader, startRpcRequest } = getState().walletLoader;
    loader.startConsensusRpc(startRpcRequest,
        function(err) {
          if (err) {
            if (err.message.includes('RPC client already created')) {
              dispatch(startRpcSuccess());
              return;
            }
            dispatch(startRpcError(err + '.  You may need to edit ' + getCfgPath() + ' and try again'));
          } else {
            dispatch(startRpcSuccess());
          }
        });
  };
}

export const DISCOVERADDRESS_ATTEMPT = 'DISCOVERADDRESS_ATTEMPT';
export const DISCOVERADDRESS_FAILED = 'DISCOVERADDRESS_FAILED';
export const DISCOVERADDRESS_SUCCESS = 'DISCOVERADDRESS_SUCCESS';

function discoverAddressError(error) {
  return { error, type: DISCOVERADDRESS_FAILED };
}

function discoverAddressSuccess() {
  return (dispatch, getState) => {
    dispatch({response: {}, type: DISCOVERADDRESS_SUCCESS});
    const { subscribeBlockNtfnsResponse } = getState().walletLoader;
    if ( subscribeBlockNtfnsResponse !== null ) {
      dispatch(fetchHeadersAttempt());
    }
  };
}

export function discoverAddressAttempt(discoverAccts, privPass) {
  return (dispatch) => {
    dispatch({ type: DISCOVERADDRESS_ATTEMPT });
    dispatch(discoverAddressAction(discoverAccts, privPass));
  };
}

function discoverAddressAction(discoverAccts, privPass) {
  DiscoverAddressesRequest;
  var request = new DiscoverAddressesRequest();
  request.setDiscoverAccounts(discoverAccts);
  if (discoverAccts) {
    request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
  }
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    loader.discoverAddresses(request,
        function(err) {
          if (err) {
            dispatch(discoverAddressError(err + ' Please try again'));
          } else {
            dispatch(discoverAddressSuccess());
          }
        });
  };
}

export const SUBSCRIBEBLOCKNTFNS_ATTEMPT = 'SUBSCRIBEBLOCKNTFNS_ATTEMPT';
export const SUBSCRIBEBLOCKNTFNS_FAILED = 'SUBSCRIBEBLOCKNTFNS_FAILED';
export const SUBSCRIBEBLOCKNTFNS_SUCCESS = 'SUBSCRIBEBLOCKNTFNS_SUCCESS';

function subscribeBlockError(error) {
  return { error, type: SUBSCRIBEBLOCKNTFNS_FAILED };
}

function subscribeBlockSuccess() {
  return (dispatch, getState) => {
    dispatch({response: {}, type: SUBSCRIBEBLOCKNTFNS_SUCCESS});
    const { walletCreateResponse } = getState().walletLoader;
    if (walletCreateResponse == null) {
      // CreateWalletSuccess is null which means this is a previously created wallet
      dispatch(discoverAddressAttempt(false));
    }
    const { discoverAddressResponse } = getState().walletLoader;
    if ( discoverAddressResponse !== null ) {
      dispatch(fetchHeadersAttempt());
    }
  };
}

export function subscribeBlockAttempt() {
  return (dispatch) => {
    dispatch({request: {}, type: SUBSCRIBEBLOCKNTFNS_ATTEMPT});
    dispatch(subscribeBlockAction());
  };
}

function subscribeBlockAction() {
  var request = new SubscribeToBlockNotificationsRequest();
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    loader.subscribeToBlockNotifications(request,
        function(err) {
          if (err) {
            dispatch(subscribeBlockError(err + ' Please try again'));
          } else {
            dispatch(subscribeBlockSuccess());
          }
        });
  };
}

export const FETCHHEADERS_ATTEMPT = 'FETCHHEADER_ATTEMPT';
export const FETCHHEADERS_FAILED = 'FETCHHEADERS_FAILED';
export const FETCHHEADERS_SUCCESS = 'FETCHHEADERS_SUCCESS';
export const FETCHHEADERS_PROGRESS = 'FETCHHEADERS_PROGRESS';

function fetchHeadersFailed(error) {
  return { error, type: FETCHHEADERS_FAILED };
}

function fetchHeadersSuccess(response) {
  return (dispatch) => {
    dispatch({response: response, type: FETCHHEADERS_SUCCESS});
    dispatch(getWalletServiceAttempt());
  };
}

export function fetchHeadersAttempt() {
  return (dispatch) => {
    dispatch({request: {}, type: FETCHHEADERS_ATTEMPT});
    dispatch(fetchHeadersAction());
  };
}

function fetchHeadersAction() {
  var request = new FetchHeadersRequest();
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    loader.fetchHeaders(request,
        function(err, response) {
          if (err) {
            dispatch(fetchHeadersFailed(err + ' Please try again'));
          } else {
            dispatch(fetchHeadersSuccess(response));
          }
        });
  };
}
