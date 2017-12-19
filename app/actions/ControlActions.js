// @flow
import * as wallet from "wallet";
import * as sel from "selectors";
import { isValidAddress } from "helpers";
import { getAccountsAttempt, getStakeInfoAttempt, getMostRecentTransactions,
  getTicketsInfoAttempt } from "./ClientActions";
import { ChangePassphraseRequest, RenameAccountRequest,  RescanRequest,
  NextAccountRequest, NextAddressRequest, ImportPrivateKeyRequest, ImportScriptRequest,
  ConstructTransactionRequest, SignTransactionRequest,
  PublishTransactionRequest, PurchaseTicketsRequest, RevokeTicketsRequest, LoadActiveDataFiltersRequest,
  StartAutoBuyerRequest, StopAutoBuyerRequest, TicketBuyerConfigRequest,
  SetAccountRequest, SetBalanceToMaintainRequest, SetMaxFeeRequest, SetMaxPriceAbsoluteRequest,
  SetMaxPriceRelativeRequest, SetVotingAddressRequest, SetPoolAddressRequest, SetPoolFeesRequest,
  SetMaxPerBlockRequest,
  } from "../middleware/walletrpc/api_pb";
import { getCfg } from "../config.js";

export const GETNEXTADDRESS_ATTEMPT = "GETNEXTADDRESS_ATTEMPT";
export const GETNEXTADDRESS_FAILED = "GETNEXTADDRESS_FAILED";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";

export function getNextAddressAttempt(accountNum) {
  var request = new NextAddressRequest();
  request.setAccount(accountNum);
  request.setKind(0);
  request.setGapPolicy(NextAddressRequest.GapPolicy.GAP_POLICY_WRAP);
  return (dispatch, getState) => {
    dispatch({ type: GETNEXTADDRESS_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.nextAddress(request,
        function(error, getNextAddressResponse) {
          if (error) {
            dispatch({ error, type: GETNEXTADDRESS_FAILED });
          } else {
            getNextAddressResponse.accountNumber = accountNum;
            dispatch({ getNextAddressResponse: getNextAddressResponse, type: GETNEXTADDRESS_SUCCESS });
          }
        });
  };
}

export const RENAMEACCOUNT_ATTEMPT = "RENAMEACCOUNT_ATTEMPT";
export const RENAMEACCOUNT_FAILED = "RENAMEACCOUNT_FAILED";
export const RENAMEACCOUNT_SUCCESS = "RENAMEACCOUNT_SUCCESS";

export function renameAccountAttempt(accountNumber, newName) {
  var request = new RenameAccountRequest();
  request.setAccountNumber(accountNumber);
  request.setNewName(newName);
  return (dispatch, getState) => {
    dispatch({ type: RENAMEACCOUNT_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.renameAccount(request,
        function(error, renameAccountResponse) {
          if (error) {
            dispatch({ error, type: RENAMEACCOUNT_FAILED });
          } else {
            var successMsg = "You have successfully updated the account name.";
            setTimeout( () => dispatch({ renameAccountSuccess: successMsg, renameAccountResponse: renameAccountResponse, type: RENAMEACCOUNT_SUCCESS }), 1000);
            dispatch(getAccountsAttempt());
          }
        });
  };
}

export const RESCAN_ATTEMPT = "RESCAN_ATTEMPT";
export const RESCAN_FAILED = "RESCAN_FAILED";
export const RESCAN_PROGRESS = "RESCAN_PROGRESS";
export const RESCAN_COMPLETE = "RESCAN_COMPLETE";
export const RESCAN_CANCEL = "RESCAN_CANCEL";

export function rescanAttempt(beginHeight) {
  var request = new RescanRequest();
  request.setBeginHeight(beginHeight);
  return (dispatch, getState) => {
    dispatch({ request: request, type: RESCAN_ATTEMPT });
    const { walletService } = getState().grpc;
    var rescanCall = walletService.rescan(request);
    rescanCall.on("data", function(response) {
      dispatch({ rescanCall: rescanCall, rescanResponse: response, type: RESCAN_PROGRESS });
    });
    rescanCall.on("end", function() {
      dispatch({ type: RESCAN_COMPLETE });
      setTimeout( () => {dispatch(getAccountsAttempt());}, 1000);
      setTimeout( () => {dispatch(getMostRecentTransactions());}, 1000);
      setTimeout( () => {dispatch(getTicketsInfoAttempt());}, 1000);
    });
    rescanCall.on("error", function(status) {
      console.error("Rescan error", status);
    });
  };
}

export function rescanCancel() {
  return (dispatch, getState) => {
    const { rescanCall } = getState().control;
    rescanCall.cancel();
    dispatch({type: RESCAN_CANCEL});
  };
}

export const GETNEXTACCOUNT_ATTEMPT = "GETNEXTACCOUNT_ATTEMPT";
export const GETNEXTACCOUNT_FAILED = "GETNEXTACCOUNT_FAILED";
export const GETNEXTACCOUNT_SUCCESS = "GETNEXTACCOUNT_SUCCESS";

export function getNextAccountAttempt(passphrase, accountName) {
  var request = new NextAccountRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccountName(accountName);
  return (dispatch, getState) => {
    dispatch({ type: GETNEXTACCOUNT_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.nextAccount(request,
      function(error, getNextAccountResponse) {
        if (error) {
          dispatch({ error, type: GETNEXTACCOUNT_FAILED });
        } else {
          var success = "Account - " + accountName + " - has been successfully created.";
          setTimeout( () => dispatch({getNextAccountResponse: getNextAccountResponse, type: GETNEXTACCOUNT_SUCCESS, successMessage: success }), 1000);
          dispatch(getAccountsAttempt());
        }
      });
  };
}

export const IMPORTPRIVKEY_ATTEMPT = "IMPORTPRIVKEY_ATTEMPT";
export const IMPORTPRIVKEY_FAILED = "IMPORTPRIVKEY_FAILED";
export const IMPORTPRIVKEY_SUCCESS = "IMPORTPRIVKEY_SUCCESS";

export function importPrivateKeyAttempt(passphrase, accountNum, wif, rescan, scanFrom) {
  var request = new ImportPrivateKeyRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccount(accountNum);
  request.setPrivateKeyWif(wif);
  request.setRescan(rescan);
  request.setScanFrom(scanFrom);
  return (dispatch, getState) => {
    dispatch({ type: IMPORTPRIVKEY_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.importPrivateKey(request,
      function(error, importPrivateKeyResponse) {
        if (error) {
          dispatch({ error, type: IMPORTPRIVKEY_FAILED });
        } else {
          dispatch({ importPrivateKeyResponse: importPrivateKeyResponse, type: IMPORTPRIVKEY_SUCCESS });
        }
      });
  };
}

export const IMPORTSCRIPT_ATTEMPT = "IMPORTSCRIPT_ATTEMPT";
export const IMPORTSCRIPT_FAILED = "IMPORTSCRIPT_FAILED";
export const IMPORTSCRIPT_SUCCESS = "IMPORTSCRIPT_SUCCESS";

function importScriptSuccess(importScriptResponse, votingAddress, cb) {
  var message = "Script successfully imported, rescanning now";
  return (dispatch) => {
    dispatch({ importScriptSuccess: message, importScriptResponse: importScriptResponse, type: IMPORTSCRIPT_SUCCESS });
    if (votingAddress) {
      if (importScriptResponse.getP2shAddress() == votingAddress) {
        dispatch(() => cb());
      } else {
        var error = "The stakepool voting address is not the P2SH address of the voting redeem script. This could be due to trying to use a stakepool that is configured for a different wallet. If this is not the case, please report this to the stakepool administrator and the Decred devs.";
        dispatch(() => cb(error));
      }
    }
  };
}

export function importScriptAttempt(passphrase, script, rescan, scanFrom, votingAddress, cb) {
  var request = new ImportScriptRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setScript(new Uint8Array(Buffer.from(hexToBytes(script))));
  request.setRescan(false);
  request.setScanFrom(scanFrom);
  request.setRequireRedeemable(true);
  return (dispatch, getState) => {
    dispatch({ type: IMPORTSCRIPT_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.importScript(request,
      function(error, importScriptResponse) {
        if (error) {
          dispatch({ error, type: IMPORTSCRIPT_FAILED });
          if (votingAddress || cb) {
            if (String(error).indexOf("master private key") !== -1) {
              dispatch(() => cb(error));
            } else {
              error = error + ". This probably means you are trying to use a stakepool account that is already associated with another wallet.  If you have previously used a voting account, please create a new account and try again.  Otherwise, please set up a new stakepool account for this wallet.";
              dispatch(() => cb(error));
            }
          }
        } else {
          if (rescan) {
            dispatch(rescanAttempt(0));
          }
          dispatch(importScriptSuccess(importScriptResponse, votingAddress, cb));
          if (!votingAddress && !cb) {
            setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 1000);
          }
        }
      });
  };
}

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export const CHANGEPASSPHRASE_ATTEMPT = "CHANGEPASSPHRASE_ATTEMPT";
export const CHANGEPASSPHRASE_FAILED = "CHANGEPASSPHRASE_FAILED";
export const CHANGEPASSPHRASE_SUCCESS = "CHANGEPASSPHRASE_SUCCESS";

export function changePassphraseAttempt(oldPass, newPass, priv) {
  var request = new ChangePassphraseRequest();
  if (priv) {
    request.setKey(ChangePassphraseRequest.Key.PRIVATE);
  } else {
    request.setKey(ChangePassphraseRequest.Key.PUBLIC);
  }
  request.setOldPassphrase(new Uint8Array(Buffer.from(oldPass)));
  request.setNewPassphrase(new Uint8Array(Buffer.from(newPass)));
  return (dispatch, getState) => {
    dispatch({ type: CHANGEPASSPHRASE_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.changePassphrase(request,
        function(error, changePassphraseResponse) {
          if (error) {
            dispatch({ error, type: CHANGEPASSPHRASE_FAILED });
          } else {
            dispatch({ changePassphraseResponse: changePassphraseResponse, type: CHANGEPASSPHRASE_SUCCESS });
          }
        });
  };
}

export const LOADACTIVEDATAFILTERS_ATTEMPT = "LOADACTIVEDATAFILTERS_ATTEMPT";
export const LOADACTIVEDATAFILTERS_FAILED= "LOADACTIVEDATAFILTERS_FAILED";
export const LOADACTIVEDATAFILTERS_SUCCESS = "LOADACTIVEDATAFILTERS_SUCCESS";

export function loadActiveDataFiltersAttempt() {
  var request = new LoadActiveDataFiltersRequest();
  return (dispatch, getState) => {
    dispatch({ type: LOADACTIVEDATAFILTERS_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.loadActiveDataFilters(request,
      function(error, response) {
        if (error) {
          dispatch({ error, type: LOADACTIVEDATAFILTERS_FAILED });
        } else {
          dispatch({response: response, type: LOADACTIVEDATAFILTERS_SUCCESS });
        }
      });
  };
}

export const CLEARTX = "CLEARTX";

export function clearTransaction() {
  return{ type: CLEARTX };
}

export const SIGNTX_ATTEMPT = "SIGNTX_ATTEMPT";
export const SIGNTX_FAILED = "SIGNTX_FAILED";
export const SIGNTX_SUCCESS = "SIGNTX_SUCCESS";

export function signTransactionAttempt(passphrase, rawTx) {
  var request = new SignTransactionRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setSerializedTransaction(new Uint8Array(Buffer.from(rawTx)));
  return (dispatch, getState) => {
    dispatch({ type: SIGNTX_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.signTransaction(request,
      function(error, signTransactionResponse) {
        if (error) {
          dispatch({ error, type: SIGNTX_FAILED });
        } else {
          dispatch({signTransactionResponse: signTransactionResponse, type: SIGNTX_SUCCESS });
          dispatch(publishTransactionAttempt(signTransactionResponse.getTransaction()));
        }
      });
  };
}

export const PUBLISHTX_ATTEMPT = "PUBLISHTX_ATTEMPT";
export const PUBLISHTX_FAILED = "PUBLISHTX_FAILED";
export const PUBLISHTX_SUCCESS = "PUBLISHTX_SUCCESS";

export function publishTransactionAttempt(tx) {
  var request = new PublishTransactionRequest();
  request.setSignedTransaction(new Uint8Array(Buffer.from(tx)));
  return (dispatch, getState) => {
    dispatch({ type: PUBLISHTX_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.publishTransaction(request,
      function(error, publishTransactionResponse) {
        if (error) {
          dispatch({ error, type: PUBLISHTX_FAILED });
        } else {
          dispatch({ publishTransactionResponse: Buffer.from(publishTransactionResponse.getTransactionHash()), type: PUBLISHTX_SUCCESS });
          setTimeout( () => {dispatch(getAccountsAttempt());}, 4000);
        }
      });
  };
}

export const PURCHASETICKETS_ATTEMPT = "PURCHASETICKETS_ATTEMPT";
export const PURCHASETICKETS_FAILED = "PURCHASETICKETS_FAILED";
export const PURCHASETICKETS_SUCCESS = "PURCHASETICKETS_SUCCESS";

export function purchaseTicketsAttempt(passphrase, accountNum, spendLimit, requiredConf,
  numTickets, expiry, ticketFee, txFee, stakepool) {
  return (dispatch, getState) => {
    const {getAccountsResponse} = getState().grpc;
    var request = new PurchaseTicketsRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setAccount(accountNum);
    request.setSpendLimit(spendLimit);
    request.setRequiredConfirmations(requiredConf);
    request.setTicketAddress(stakepool.TicketAddress);
    request.setNumTickets(numTickets);
    request.setPoolAddress(stakepool.PoolAddress);
    request.setPoolFees(stakepool.PoolFees);
    if (expiry !== 0) {
      request.setExpiry(getAccountsResponse.getCurrentBlockHeight() + expiry);
    } else {
      request.setExpiry(expiry);
    }
    request.setTxFee(txFee*1e8);
    request.setTicketFee(ticketFee*1e8);
    dispatch({ type: PURCHASETICKETS_ATTEMPT });
    dispatch(importScriptAttempt(passphrase, stakepool.Script, false, 0, stakepool.TicketAddress, (error) => {
      if (error) {
        dispatch({ error, type: PURCHASETICKETS_FAILED });
      } else {
        dispatch(purchaseTicketsAction(request));
      }
    }));
  };
}

function purchaseTicketsAction(request) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    walletService.purchaseTickets(request,
      function(error, purchaseTicketsResponse) {
        if (error) {
          dispatch({ error, type: PURCHASETICKETS_FAILED });
        } else {
          dispatch({ purchaseTicketsResponse: purchaseTicketsResponse, type: PURCHASETICKETS_SUCCESS });
          setTimeout( () => {dispatch(getAccountsAttempt());}, 4000);
          setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 4000);
        }
      });
  };
}

export const REVOKETICKETS_ATTEMPT = "REVOKETICKETS_ATTEMPT";
export const REVOKETICKETS_FAILED = "REVOKETICKETS_FAILED";
export const REVOKETICKETS_SUCCESS = "REVOKETICKETS_SUCCESS";

export function revokeTicketsAttempt(passphrase) {
  var request = new RevokeTicketsRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  return (dispatch, getState) => {
    dispatch({ type: REVOKETICKETS_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.revokeTickets(request,
      function(error, revokeTicketsResponse) {
        if (error) {
          dispatch({ error, type: REVOKETICKETS_FAILED });
        } else {
          setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 4000);
          dispatch({ revokeTicketsResponse: revokeTicketsResponse, type: REVOKETICKETS_SUCCESS });
        }
      });
  };
}

export const GETTICKETBUYERCONFIG_ATTEMPT = "GETTICKETBUYERCONFIG_ATTEMPT";
export const GETTICKETBUYERCONFIG_FAILED = "GETTICKETBUYERCONFIG_FAILED";
export const GETTICKETBUYERCONFIG_SUCCESS = "GETTICKETBUYERCONFIG_SUCCESS";

export function getTicketBuyerConfigAttempt() {
  var request = new TicketBuyerConfigRequest();
  return (dispatch, getState) => {
    dispatch({ type: GETTICKETBUYERCONFIG_ATTEMPT });
    const { ticketBuyerService } = getState().grpc;
    ticketBuyerService.ticketBuyerConfig(request, function (error, ticketBuyerConfig) {
      if (error) {
        dispatch({ error, type: GETTICKETBUYERCONFIG_FAILED });
      } else {
        dispatch({ ticketBuyerConfig: ticketBuyerConfig, type: GETTICKETBUYERCONFIG_SUCCESS });
      }
    });
  };
}

export const SETTICKETBUYERCONFIG_ATTEMPT = "SETTICKETBUYERCONFIG_ATTEMPT";
export const SETTICKETBUYERCONFIG_FAILED = "SETTICKETBUYERCONFIG_FAILED";
export const SETTICKETBUYERCONFIG_SUCCESS = "SETTICKETBUYERCONFIG_SUCCESS";
export const SETBALANCETOMAINTAIN = "SETBALANCETOMAINTAIN";
export const SETMAXFEE = "SETMAXFEE";
export const SETMAXPRICEABSOLUTE = "SETMAXPRICEABSOLUTE";
export const SETMAXPRICERELATIVE = "SETMAXPRICERELATIVE";
export const SETMAXPERBLOCK = "SETMAXPERBLOCK";

export function setTicketBuyerConfigAttempt(account, balanceToMaintain, maxFee, maxPriceAbsolute, maxPriceRelative,
  stakePool, maxPerBlock) {
  var cfg = getCfg();
  return (dispatch, getState) => {
    dispatch({ type: SETTICKETBUYERCONFIG_ATTEMPT });
    const { ticketBuyerService } = getState().grpc;
    const { getTicketBuyerConfigResponse } = getState().control;
    var hitError = "";
    if (account != getTicketBuyerConfigResponse.getAccount()) {
      var request = new SetAccountRequest();
      request.setAccount(account);
      ticketBuyerService.setAccount(request, function (error) {
        if (error) {
          hitError += error + ". ";
        }
      });
    }
    if (balanceToMaintain*1e8 != getTicketBuyerConfigResponse.getBalanceToMaintain()) {
      request = new SetBalanceToMaintainRequest();
      request.setBalanceToMaintain(balanceToMaintain*1e8);
      ticketBuyerService.setBalanceToMaintain(request, function (error) {
        if (error) {
          hitError += error + ". ";
        } else {
          cfg.set("balancetomaintain", balanceToMaintain);
          dispatch({balanceToMaintain: balanceToMaintain, type: SETBALANCETOMAINTAIN});
        }
      });
    }
    if (maxFee*1e8 != getTicketBuyerConfigResponse.getMaxFee()) {
      request = new SetMaxFeeRequest();
      request.setMaxFeePerKb(maxFee*1e8);
      ticketBuyerService.setMaxFee(request, function (error) {
        if (error) {
          hitError += error + ". ";
        } else {
          cfg.set("maxfee", maxFee);
          dispatch({maxFee: maxFee, type: SETMAXFEE});
        }
      });
    }
    if (maxPriceAbsolute*1e8 != getTicketBuyerConfigResponse.getMaxPriceAbsolute()) {
      request = new SetMaxPriceAbsoluteRequest();
      request.setMaxPriceAbsolute(maxPriceAbsolute*1e8);
      ticketBuyerService.setMaxPriceAbsolute(request, function (error) {
        if (error) {
          hitError += error + ". ";
        } else {
          cfg.set("maxpriceabsolute",maxPriceAbsolute);
          dispatch({maxPriceAbsolute: maxPriceAbsolute, type: SETMAXPRICEABSOLUTE});
        }
      });
    }
    if (maxPriceRelative != getTicketBuyerConfigResponse.getMaxPriceRelative()) {
      request = new SetMaxPriceRelativeRequest();
      request.setMaxPriceRelative(maxPriceRelative);
      ticketBuyerService.setMaxPriceRelative(request, function (error) {
        if (error) {
          hitError += error + ". ";
        } else {
          cfg.set("maxpricerelative",maxPriceRelative);
          dispatch({maxPriceRelative: maxPriceRelative, type: SETMAXPRICERELATIVE});
        }
      });
    }
    if (stakePool.TicketAddress != getTicketBuyerConfigResponse.getVotingAddress()) {
      request = new SetVotingAddressRequest();
      request.setVotingAddress(stakePool.TicketAddress);
      ticketBuyerService.setVotingAddress(request, function (error) {
        if (error) {
          hitError += error + ". ";
        }
      });
    }
    if (stakePool.PoolAddress != getTicketBuyerConfigResponse.getPoolAddress()) {
      request = new SetPoolAddressRequest();
      request.setPoolAddress(stakePool.PoolAddress);
      ticketBuyerService.setPoolAddress(request, function (error) {
        if (error) {
          hitError += error + ". ";
        }
      });
    }
    if (stakePool.PoolFees != getTicketBuyerConfigResponse.getPoolFees()) {
      request = new SetPoolFeesRequest();
      request.setPoolFees(stakePool.PoolFees);
      ticketBuyerService.setPoolFees(request, function (error) {
        if (error) {
          hitError += error + ". ";
        }
      });
    }
    if (maxPerBlock != getTicketBuyerConfigResponse.getMaxPerBlock()) {
      request = new SetMaxPerBlockRequest();
      request.setMaxPerBlock(maxPerBlock);
      ticketBuyerService.setMaxPerBlock(request, function (error) {
        if (error) {
          hitError += error + ". ";
        } else {
          cfg.set("maxperblock",maxPerBlock);
          dispatch({maxPerBlock: maxPerBlock, type: SETMAXPERBLOCK});
        }
      });
    }
    if (hitError != "") {
      dispatch({ error: hitError, type: SETTICKETBUYERCONFIG_FAILED });
    } else {
      dispatch({ success: "Ticket buyer settings have been successfully updated.", type: SETTICKETBUYERCONFIG_SUCCESS });
      dispatch(getTicketBuyerConfigAttempt());
    }
  };
}

export const STARTAUTOBUYER_ATTEMPT = "STARTAUTOBUYER_ATTEMPT";
export const STARTAUTOBUYER_FAILED = "STARTAUTOBUYER_FAILED";
export const STARTAUTOBUYER_SUCCESS = "STARTAUTOBUYER_SUCCESS";

export function startAutoBuyerAttempt(passphrase, accountNum, balanceToMaintain,
maxFeePerKb, maxPriceRelative, maxPriceAbsolute, maxPerBlock, stakepool) {
  var request = new StartAutoBuyerRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccount(accountNum);
  request.setBalanceToMaintain(balanceToMaintain*1e8);
  request.setMaxFeePerKb(maxFeePerKb*1e8);
  request.setMaxPriceRelative(maxPriceRelative);
  request.setMaxPriceAbsolute(maxPriceAbsolute*1e8);
  request.setVotingAddress(stakepool.TicketAddress);
  request.setPoolAddress(stakepool.PoolAddress);
  request.setPoolFees(stakepool.PoolFees);
  request.setMaxPerBlock(maxPerBlock);
  return (dispatch, getState) => {
    dispatch({
      type: STARTAUTOBUYER_ATTEMPT,
    });
    const { ticketBuyerService } = getState().grpc;
    ticketBuyerService.startAutoBuyer(request,
      function(error, startAutoBuyerResponse) {
        if (error) {
          dispatch({ error, type: STARTAUTOBUYER_FAILED });
        } else {
          var success = "You successfully started the auto ticket buyer.";
          dispatch({ success: success, startAutoBuyerResponse: startAutoBuyerResponse, type: STARTAUTOBUYER_SUCCESS,
            balanceToMaintain: balanceToMaintain,
            maxFeePerKb: maxFeePerKb*1e8,
            maxPriceRelative: maxPriceRelative,
            maxPriceAbsolute: maxPriceAbsolute,
            maxPerBlock: maxPerBlock,
          });
          setTimeout(()=>dispatch(getTicketBuyerConfigAttempt(), 1000));
        }
      });
  };
}

export const STOPAUTOBUYER_ATTEMPT = "STOPAUTOBUYER_ATTEMPT";
export const STOPAUTOBUYER_FAILED = "STOPAUTOBUYER_FAILED";
export const STOPAUTOBUYER_SUCCESS = "STOPAUTOBUYER_SUCCESS";

export function stopAutoBuyerAttempt() {
  var request = new StopAutoBuyerRequest();
  return (dispatch, getState) => {
    dispatch({ type: STOPAUTOBUYER_ATTEMPT });
    const { ticketBuyerService } = getState().grpc;
    ticketBuyerService.stopAutoBuyer(request,
      function(error, stopAutoBuyerResponse) {
        if (error) {
          // The only error that can be returned here is if the autobuyer is not running when requested to stop.
          // We're currently issuing a stop auto buyer request on startup, so to avoid that error being shown,
          // it makes sense to just remove the error consumption altogether.
          dispatch({ type: STOPAUTOBUYER_FAILED });
        } else {
          var success = "You successfully stopped the auto ticket buyer.";
          dispatch({ success: success, stopAutoBuyerResponse: stopAutoBuyerResponse, type: STOPAUTOBUYER_SUCCESS });
        }
      });
  };
}

export const CONSTRUCTTX_ATTEMPT = "CONSTRUCTTX_ATTEMPT";
export const CONSTRUCTTX_FAILED = "CONSTRUCTTX_FAILED";
export const CONSTRUCTTX_SUCCESS = "CONSTRUCTTX_SUCCESS";

export function constructTransactionAttempt(account, confirmations, outputs, all) {
  var request = new ConstructTransactionRequest();
  request.setSourceAccount(parseInt(account));
  request.setRequiredConfirmations(parseInt(parseInt(confirmations)));
  if (!all) {
    request.setOutputSelectionAlgorithm(0);
    var totalAmount = 0;
    outputs.map(output => {
      var outputDest = new ConstructTransactionRequest.OutputDestination();
      outputDest.setAddress(output.destination);
      var newOutput = new ConstructTransactionRequest.Output();
      newOutput.setDestination(outputDest);
      newOutput.setAmount(parseInt(output.amount));
      request.addNonChangeOutputs(newOutput);
      totalAmount += output.amount;
    });
  } else {
    if (outputs.length > 1) {
      return (dispatch) => {
        var error = "Too many outputs provided for a send all request.";
        dispatch({ error, type: CONSTRUCTTX_FAILED });
      };
    } else if (outputs.length == 0) {
      return (dispatch) => {
        var error = "No destination specified for send all request.";
        dispatch({ error, type: CONSTRUCTTX_FAILED });
      };
    } else {
      request.setOutputSelectionAlgorithm(1);
      var outputDest = new ConstructTransactionRequest.OutputDestination();
      outputDest.setAddress(outputs[0].data.destination);
      request.setChangeDestination(outputDest);
    }
  }
  return (dispatch, getState) => {
    dispatch({ type: CONSTRUCTTX_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.constructTransaction(request,
      function(error, constructTxResponse) {
        if (error) {
          dispatch({ error, type: CONSTRUCTTX_FAILED });
        } else {
          if (!all) {
            constructTxResponse.totalAmount = totalAmount;
          } else {
            constructTxResponse.totalAmount = constructTxResponse.getTotalOutputAmount();
          }
          dispatch({constructTxResponse: constructTxResponse, type: CONSTRUCTTX_SUCCESS });
        }
      });
  };
}

export const VALIDATEADDRESS_FAILED = "VALIDATEADDRESS_FAILED";
export const validateAddress = address => async (dispatch, getState) => {
  try {
    const { network } = getState().grpc;
    const validationErr = isValidAddress(address, network);
    if (validationErr) { return { isValid: false, error: validationErr, getIsValid () { false; } }; }
    return await wallet.validateAddress(sel.walletService(getState()), address);
  } catch (error) {
    dispatch({address, error, type: VALIDATEADDRESS_FAILED});
    throw error;
  }
};
