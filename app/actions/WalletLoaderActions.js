import { loader, createWallet, walletExists, openWallet, closeWallet, discoverAddresses, subscribeToConsensusRpc } from '../middleware/grpc/client';
import { loginRequest } from './LoginActions';

export const LOADER_ATTEMPT = 'LOADER_ATTEMPT';
export const LOADER_FAILED = 'LOADER_FAILED';
export const LOADER_SUCCESS = 'LOADER_SUCCESS';

function loaderError(error) {
  return { error, type: LOADER_FAILED };
}

function loaderSuccess(loader) {
  return (dispatch) => {
    dispatch({loader, type: LOADER_SUCCESS });
    dispatch(walletExistRequest());
  };
}

export function loaderRequest(address, port) {
  return (dispatch) => {
    dispatch({address: address, port: port, type: LOADER_ATTEMPT });
    dispatch(getLoader());
  }
}

function getLoader() {
  return (dispatch, getState) => {
    const { address, port } = getState().walletLoader;
    loader(address, port, function(loader, err) {
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

function walletExistSuccess(exists) {
  return (dispatch) => {
    dispatch({exists: exists, type: WALLETEXIST_SUCCESS });
  }
}

export function walletExistRequest() {
  return (dispatch) => {
    dispatch({type: WALLETEXIST_ATTEMPT });
    dispatch(checkWalletExist());
  }
}

function checkWalletExist() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    walletExists(loader,
        function(exists, err) {
      if (err) {
        dispatch(walletExistError(err + " Please try again"));
      } else {
        dispatch(walletExistSuccess(exists));
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
    dispatch({ type: CREATEWALLET_SUCCESS });
    dispatch(loginRequest());
  }
}

export function createWalletRequest(pubPass, privPass, seed) {
  return (dispatch) => { 
    dispatch({
      pubPass: pubPass,
      privPass: privPass,
      seed: seed,
      type: CREATEWALLET_ATTEMPT });
    dispatch(createNewWallet());
  }
}

function createNewWallet() {
  return (dispatch, getState) => {
    const { loader, pubPass, privPass, seed } = getState().walletLoader;
    createWallet(loader, pubPass, privPass, seed, 
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
    dispatch({type: OPENWALLET_SUCCESS});
    dispatch(loginRequest());
  };
}

export function openWalletRequest(pubPass) {
  return (dispatch) => {
    dispatch({pubPass: pubPass, type: OPENWALLET_ATTEMPT});
    dispatch(openWalletAction());
  }
}

function openWalletAction() {
  return (dispatch, getState) => {
    const { loader, pubPass } = getState().walletLoader;
    openWallet(loader, pubPass, 
        function(response, err) {
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
    dispatch({type: CLOSEWALLET_SUCCESS});
  };
}

export function closeWalletRequest() {
  return (dispatch) => {
    dispatch({type: CLOSEWALLET_ATTEMPT});
    dispatch(closeWalletAction());
  }
}

function closeWalletAction() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    closeWallet(loader,
        function(response, err) {
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
  return { error, type: STARTRPC_FAILED };
}

function startRpcSuccess() {
  return (dispatch) => {
    dispatch({type: STARTRPC_SUCCESS});
  };
}

export function startRpcRequest() {
  return (dispatch) => {
    dispatch({type: STARTRPC_ATTEMPT});
    dispatch(startRpcAction());
  }
}

function startRpcAction() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    startRpc(loader,
        function(response, err) {
      if (err) {
        dispatch(startRpcError(err + " Please try again"));
      } else {
        dispatch(startRpcError());
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
    dispatch({type: DISCOVERADDRESS_SUCCESS});
  };
}

export function discoverAddressRequest(discoverAccts, privPass) {
  return (dispatch) => {
    dispatch({discoverAccts: discoverAccts, privPass: privPass, type: DISCOVERADDRESS_ATTEMPT});
    dispatch(discoverAddressAction());
  }
}

function discoverAddressAction() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    const { discoverAccts, privPass } = getState().walletLoader;
    discoverAddresses(loader, discoverAccts, privPass, 
        function(response, err) {
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
    dispatch({type: SUBSCRIBEBLOCKNTFNS_SUCCESS});
  };
}

export function subscribeBlockRequest() {
  return (dispatch) => {
    dispatch({type: SUBSCRIBEBLOCKNTFNS_ATTEMPT});
    dispatch(subscribeBlockAction());
  }
}

function subscribeBlockAction() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    subscribeBlockNtfns(loader,
        function(response, err) {
      if (err) {
        dispatch(subscribeBlockError(err + " Please try again"));
      } else {
        dispatch(subscribeBlockSuccess());
      }
    })
  }
}