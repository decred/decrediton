// @flow
import { loader } from "../middleware/grpc/client";
import { getWalletServiceAttempt, getTicketBuyerServiceAttempt, getAgendaServiceAttempt, getVotingServiceAttempt } from "./ClientActions";
import { getVersionServiceAttempt } from "./VersionActions";
import { getCfg, getCfgPath, getDcrdCert,RPCDaemonPort, RPCDaemonHost } from "../config.js";
import { WalletExistsRequest, CreateWalletRequest, OpenWalletRequest,
  CloseWalletRequest, StartConsensusRpcRequest, DiscoverAddressesRequest,
  SubscribeToBlockNotificationsRequest, FetchHeadersRequest } from "../middleware/walletrpc/api_pb";
import { stakePoolInfo } from "../middleware/stakepoolapi";

export function versionCheckAction() {
  return (dispatch) => {
    dispatch(getVersionServiceAttempt());
  };
}

export const LOADER_ATTEMPT = "LOADER_ATTEMPT";
export const LOADER_FAILED = "LOADER_FAILED";
export const LOADER_SUCCESS = "LOADER_SUCCESS";

export function loaderRequest(address, port) {
  var request = {
    address: address,
    port: port,
  };
  return (dispatch) => {
    dispatch({request: request, type: LOADER_ATTEMPT });
    loader(request, function(loader, error) {
      if (error) {
        dispatch({ error, type: LOADER_FAILED });
      } else {
        dispatch({loader: loader, type: LOADER_SUCCESS });
        dispatch(walletExistRequest());
      }
    });
  };
}

export const WALLETEXIST_ATTEMPT = "WALLETEXIST_ATTEMPT";
export const WALLETEXIST_FAILED = "WALLETEXIST_FAILED";
export const WALLETEXIST_SUCCESS = "WALLETEXIST_SUCCESS";

export function walletExistRequest() {
  var request = new WalletExistsRequest();
  return (dispatch, getState) => {
    dispatch({ type: WALLETEXIST_ATTEMPT });
    const { loader } = getState().walletLoader;
    loader.walletExists(request, function(error, response) {
      if (error) {
        dispatch({ error, type: WALLETEXIST_FAILED });
      } else {
        dispatch({response: response, type: WALLETEXIST_SUCCESS });
        if (response.getExists()) {
          dispatch(openWalletAttempt("public", false));
        }
        else {
          dispatch({ type: CREATEWALLET_NEWSEED_INPUT });
        }
      }
    });
  };
}

export const CREATEWALLET_NEWSEED_CONFIRM_INPUT = "CREATEWALLET_NEWSEED_CONFIRM_INPUT";
export const CREATEWALLET_NEWSEED_BACK_INPUT = "CREATEWALLET_NEWSEED_BACK_INPUT";
export const CREATEWALLET_EXISTINGSEED_INPUT = "CREATEWALLET_EXISTINGSEED_INPUT";
export const CREATEWALLET_NEWSEED_INPUT = "CREATEWALLET_NEWSEED_INPUT";

export function createWalletConfirmNewSeed(){
  return{ type: CREATEWALLET_NEWSEED_CONFIRM_INPUT };
}
export function createWalletGoBackNewSeed(){
  return{ type: CREATEWALLET_NEWSEED_BACK_INPUT };
}

export function createWalletExistingToggle(existing) {
  return (dispatch) => {
    if (existing){
      dispatch({ type: CREATEWALLET_EXISTINGSEED_INPUT });
    }   else {
      setTimeout(()=>dispatch({ type: CREATEWALLET_NEWSEED_INPUT }), 50);
    }
  };
}

export const CREATEWALLET_ATTEMPT = "CREATEWALLET_ATTEMPT";
export const CREATEWALLET_FAILED = "CREATEWALLET_FAILED";
export const CREATEWALLET_SUCCESS = "CREATEWALLET_SUCCESS";

export function createWalletRequest(pubPass, privPass, seed, existing) {
  var request = new CreateWalletRequest();
  //request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
  request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
  request.setSeed(seed);
  return (dispatch, getState) => {
    dispatch({ existing: existing, type: CREATEWALLET_ATTEMPT });
    const { loader } = getState().walletLoader;
    loader.createWallet(request,
      function(error) {
        if (error) {
          dispatch({ error, type: CREATEWALLET_FAILED });
        } else {
          dispatch({response: {}, type: CREATEWALLET_SUCCESS });
          dispatch(clearStakePoolConfigNewWallet(existing));
          dispatch(startRpcRequestFunc());
        }
      });
  };
}

export const OPENWALLET_INPUT = "OPENWALLET_INPUT";
export const OPENWALLET_FAILED_INPUT = "OPENWALLET_FAILED_INPUT";
export const OPENWALLET_ATTEMPT = "OPENWALLET_ATTEMPT";
export const OPENWALLET_FAILED = "OPENWALLET_FAILED";
export const OPENWALLET_SUCCESS = "OPENWALLET_SUCCESS";

export function openWalletAttempt(pubPass, retryAttempt) {
  var request = new OpenWalletRequest();
  request.setPublicPassphrase(new Uint8Array(Buffer.from(pubPass)));
  return (dispatch, getState) => {
    dispatch({type: OPENWALLET_ATTEMPT});
    const { loader } = getState().walletLoader;
    loader.openWallet(request,
      function(error) {
        if (error) {
          if (error.message.includes("wallet already loaded")) {
            dispatch({response: {}, type: OPENWALLET_SUCCESS});
            dispatch(startRpcRequestFunc());
            return;
          }
          else if (error.message.includes("invalid passphrase") && error.message.includes("public key")) {
            if (retryAttempt) {
              dispatch({ error, type: OPENWALLET_FAILED_INPUT });
            }
            else {
              dispatch({ type: OPENWALLET_INPUT });
            }
            return;
          }

          dispatch({ error, type: OPENWALLET_FAILED });
        } else {
          dispatch({ type: OPENWALLET_SUCCESS });
          dispatch(startRpcRequestFunc());
        }
      });
  };
}

export const CLOSEWALLET_ATTEMPT = "CLOSEWALLET_ATTEMPT";
export const CLOSEWALLET_FAILED = "CLOSEWALLET_FAILED";
export const CLOSEWALLET_SUCCESS = "CLOSEWALLET_SUCCESS";

export function closeWalletRequest() {
  var request = new CloseWalletRequest();
  return (dispatch, getState) => {
    dispatch({ type: CLOSEWALLET_ATTEMPT });
    const { loader } = getState().walletLoader;
    loader.closeWallet(request,
      function(error) {
        if (error) {
          dispatch({ error, type: CLOSEWALLET_FAILED });
        } else {
          dispatch({ type: CLOSEWALLET_SUCCESS });
        }
      });
  };
}

export const STARTRPC_ATTEMPT = "STARTRPC_ATTEMPT";
export const STARTRPC_FAILED = "STARTRPC_FAILED";
export const STARTRPC_SUCCESS = "STARTRPC_SUCCESS";
export const STARTRPC_RETRY = "STARTRPC_RETRY";

function startRpcError(error, request) {
  return (dispatch, getState) => {
    const {rpcRetryAttempts} = getState().walletLoader;
    if (rpcRetryAttempts < 5) {
      dispatch({ rpcRetryAttempts: rpcRetryAttempts+1, type: STARTRPC_RETRY });
      setTimeout(() => dispatch(startRpcAction(request)), 5000);
    } else {
      dispatch({ error, type: STARTRPC_FAILED });
    }
  };
}

export function startRpcRequestFunc(localHost) {
  var cfg = getCfg();
  var rpcport = RPCDaemonPort();
  var daemonhost = RPCDaemonHost();
  var request = new StartConsensusRpcRequest();

  // This is an attempt to deal with different setups
  // that may not like 127.0.0.1 as the loopback address
  if (localHost) {
    request.setNetworkAddress("localhost:" + rpcport);
    request.setUsername(cfg.get("rpc_user"));
    request.setPassword(new Uint8Array(Buffer.from(cfg.get("rpc_pass"))));
    request.setCertificate(new Uint8Array(getDcrdCert()));
    return (dispatch) => {
      dispatch(startRpcAction(request, true));
    };
  } else {
    request.setNetworkAddress(daemonhost + ":" + rpcport);
    request.setUsername(cfg.get("rpc_user"));
    request.setPassword(new Uint8Array(Buffer.from(cfg.get("rpc_pass"))));
    request.setCertificate(new Uint8Array(getDcrdCert()));
    return (dispatch) => {
      dispatch({request: request, type: STARTRPC_ATTEMPT});
      dispatch(startRpcAction(request));
    };
  }
}

function startRpcAction(request, second) {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    loader.startConsensusRpc(request,
        function(error) {
          if (error) {
            if (error.message.includes("RPC client already created")) {
              dispatch({ type: STARTRPC_SUCCESS});
              dispatch(subscribeBlockAttempt());
              return;
            }
            if (second) {
              dispatch(startRpcError(error + ".  You may need to edit " + getCfgPath() + " and try again", request));
            } else {
              dispatch(startRpcRequestFunc(true));
            }
          } else {
            dispatch({ type: STARTRPC_SUCCESS});
            dispatch(subscribeBlockAttempt());
          }
        });
  };
}

export const DISCOVERADDRESS_INPUT = "DISCOVERADDRESS_INPUT";
export const DISCOVERADDRESS_FAILED_INPUT = "DISCOVERADDRESS_FAILED_INPUT";
export const DISCOVERADDRESS_ATTEMPT = "DISCOVERADDRESS_ATTEMPT";
export const DISCOVERADDRESS_FAILED = "DISCOVERADDRESS_FAILED";
export const DISCOVERADDRESS_SUCCESS = "DISCOVERADDRESS_SUCCESS";

export function discoverAddressAttempt(privPass) {
  return (dispatch, getState) => {
    var request = new DiscoverAddressesRequest();
    const { discoverAccountsComplete } = getState().walletLoader;
    request.setDiscoverAccounts(!discoverAccountsComplete);
    if (!discoverAccountsComplete) {
      request.setPrivatePassphrase(new Uint8Array(Buffer.from(privPass)));
    }
    dispatch({ type: DISCOVERADDRESS_ATTEMPT });
    const { loader } = getState().walletLoader;
    loader.discoverAddresses(request,
        function(error) {
          if (error) {
            if (error.message.includes("invalid passphrase") && error.message.includes("private key")) {
              dispatch({ error, type: DISCOVERADDRESS_FAILED_INPUT });
              return;
            }
            dispatch({ error, type: DISCOVERADDRESS_FAILED });
          }
          else {
            if (!discoverAccountsComplete) {
              var config = getCfg();
              config.delete("discoveraccounts");
              config.set("discoveraccounts", true);
              dispatch({complete: true, type: UPDATEDISCOVERACCOUNTS});
            }
            dispatch({response: {}, type: DISCOVERADDRESS_SUCCESS});
            const { subscribeBlockNtfnsResponse } = getState().walletLoader;
            if ( subscribeBlockNtfnsResponse !== null ) {
              dispatch(fetchHeadersAttempt());
            }
          }
        });
  };
}

export const SUBSCRIBEBLOCKNTFNS_ATTEMPT = "SUBSCRIBEBLOCKNTFNS_ATTEMPT";
export const SUBSCRIBEBLOCKNTFNS_FAILED = "SUBSCRIBEBLOCKNTFNS_FAILED";
export const SUBSCRIBEBLOCKNTFNS_SUCCESS = "SUBSCRIBEBLOCKNTFNS_SUCCESS";

export function subscribeBlockAttempt() {
  var request = new SubscribeToBlockNotificationsRequest();
  return (dispatch, getState) => {
    dispatch({request: {}, type: SUBSCRIBEBLOCKNTFNS_ATTEMPT});
    const { loader, discoverAccountsComplete } = getState().walletLoader;
    loader.subscribeToBlockNotifications(request,
        function(error) {
          if (error) {
            dispatch({ error, type: SUBSCRIBEBLOCKNTFNS_FAILED });
          } else {
            dispatch({response: {}, type: SUBSCRIBEBLOCKNTFNS_SUCCESS});
            if (discoverAccountsComplete) {
              dispatch(discoverAddressAttempt());
            }
            else {
              // This is dispatched to indicate we should wait for user input to discover addresses.
              dispatch({response: {}, type: DISCOVERADDRESS_INPUT});
            }
          }
        });
  };
}

export const FETCHHEADERS_ATTEMPT = "FETCHHEADER_ATTEMPT";
export const FETCHHEADERS_FAILED = "FETCHHEADERS_FAILED";
export const FETCHHEADERS_SUCCESS = "FETCHHEADERS_SUCCESS";
export const FETCHHEADERS_PROGRESS = "FETCHHEADERS_PROGRESS";

export function fetchHeadersAttempt() {
  var request = new FetchHeadersRequest();
  return (dispatch, getState) => {
    dispatch({request: {}, type: FETCHHEADERS_ATTEMPT});
    const { loader } = getState().walletLoader;
    loader.fetchHeaders(request,
        function(error, response) {
          if (error) {
            dispatch({ error, type: FETCHHEADERS_FAILED });
          } else {
            dispatch({response: response, type: FETCHHEADERS_SUCCESS});
            dispatch(getWalletServiceAttempt());
            dispatch(getTicketBuyerServiceAttempt());
            dispatch(getVotingServiceAttempt());
            dispatch(getAgendaServiceAttempt());
          }
        });
  };
}

export const UPDATEDISCOVERACCOUNTS = "UPDATEDISCOVERACCOUNTS";
export const CLEARSTAKEPOOLCONFIG = "CLEARSTAKEPOOLCONFIG";

export function clearStakePoolConfigNewWallet(existing) {
  return (dispatch) => {
    stakePoolInfo(function(response, err) {
      if (response == null) {
        console.log(err);
      } else {
        var stakePoolNames = Object.keys(response.data);
        // Only add matching network stakepool info
        var foundStakePoolConfigs = Array();
        for (var i = 0; i < stakePoolNames.length; i++) {
          if (response.data[stakePoolNames[i]].APIEnabled) {
            foundStakePoolConfigs.push({
              Host:response.data[stakePoolNames[i]].URL,
              Network: response.data[stakePoolNames[i]].Network,
              APIVersionsSupported: response.data[stakePoolNames[i]].APIVersionsSupported,
            });
          }
        }
        var config = getCfg();
        config.delete("stakepools");
        config.set("stakepools", foundStakePoolConfigs);
        dispatch({currentStakePoolConfig: foundStakePoolConfigs, type: CLEARSTAKEPOOLCONFIG});
        config.delete("discoveraccounts");
        config.set("discoveraccounts", !existing);
        dispatch({complete: !existing, type: UPDATEDISCOVERACCOUNTS});
      }
    });
  };
}
