// @flow
import * as wallet from "wallet";
import * as sel from "selectors";
import { isValidAddress, isValidMasterPubKey } from "helpers";
import { getStakeInfoAttempt, startWalletServices,
  getStartupWalletInfo } from "./ClientActions";
import { getWalletCfg } from "../config";
import { RescanRequest, ConstructTransactionRequest } from "../middleware/walletrpc/api_pb";
import { reverseRawHash } from "../helpers/byteActions";

export const GETNEXTADDRESS_ATTEMPT = "GETNEXTADDRESS_ATTEMPT";
export const GETNEXTADDRESS_FAILED = "GETNEXTADDRESS_FAILED";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";

export const getNextAddressAttempt = accountNumber => (dispatch, getState) => {
  dispatch({ type: GETNEXTADDRESS_ATTEMPT });
  return wallet.getNextAddress(sel.walletService(getState()), accountNumber)
    .then(res => {
      res.accountNumber = accountNumber;
      return dispatch({
        getNextAddressResponse: res,
        type: GETNEXTADDRESS_SUCCESS
      });
    })
    .catch(error => dispatch({ error, type: GETNEXTACCOUNT_FAILED }));
};

export const RENAMEACCOUNT_ATTEMPT = "RENAMEACCOUNT_ATTEMPT";
export const RENAMEACCOUNT_FAILED = "RENAMEACCOUNT_FAILED";
export const RENAMEACCOUNT_SUCCESS = "RENAMEACCOUNT_SUCCESS";

export const renameAccountAttempt = (accountNumber, newName) => (dispatch, getState) => {
  dispatch({ type: RENAMEACCOUNT_ATTEMPT });
  return wallet.renameAccount(sel.walletService(getState()), accountNumber, newName)
    .then(renameAccountResponse => {
      setTimeout(() => dispatch({
        renameAccountResponse, type: RENAMEACCOUNT_SUCCESS
      }), 1000);
    })
    .catch(error => dispatch({ error, type: RENAMEACCOUNT_FAILED }));
};

export const RESCAN_ATTEMPT = "RESCAN_ATTEMPT";
export const RESCAN_FAILED = "RESCAN_FAILED";
export const RESCAN_PROGRESS = "RESCAN_PROGRESS";
export const RESCAN_COMPLETE = "RESCAN_COMPLETE";
export const RESCAN_CANCEL = "RESCAN_CANCEL";

export function rescanAttempt(beginHeight, beginHash, startup) {
  var request = new RescanRequest();
  if (beginHeight !== null) {
    request.setBeginHeight(beginHeight);
  } else {
    request.setBeginHash(new Uint8Array(Buffer.from(beginHash)));
  }
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({ request: request, type: RESCAN_ATTEMPT });
      const { walletService } = getState().grpc;
      var rescanCall = walletService.rescan(request);
      rescanCall.on("data", function(response) {
        dispatch({ rescanCall: rescanCall, rescanResponse: response, type: RESCAN_PROGRESS });
      });
      rescanCall.on("end", function() {
        dispatch({ type: RESCAN_COMPLETE });
        if (startup) {
          dispatch(startWalletServices());
        } else {
          dispatch(getStartupWalletInfo());
        }
      });
      rescanCall.on("error", function(status) {
        status = status + "";
        if (status.indexOf("Cancelled") < 0) {
          console.error("Rescan error", status);
          reject(status);
          dispatch({ type: RESCAN_FAILED });
        }
      });
    });

  };
}

export function rescanCancel() {
  return (dispatch, getState) => {
    const { rescanCall } = getState().control;
    if (rescanCall) {
      rescanCall.cancel();
      dispatch({ type: RESCAN_CANCEL });
    }
  };
}

export const GETNEXTACCOUNT_ATTEMPT = "GETNEXTACCOUNT_ATTEMPT";
export const GETNEXTACCOUNT_FAILED = "GETNEXTACCOUNT_FAILED";
export const GETNEXTACCOUNT_SUCCESS = "GETNEXTACCOUNT_SUCCESS";

export const getNextAccountAttempt = (passphrase, accountName) => (dispatch, getState) => {
  dispatch({ type: GETNEXTACCOUNT_ATTEMPT });
  return wallet.getNextAccount(sel.walletService(getState()), passphrase, accountName)
    .then(getNextAccountResponse => {
      setTimeout( () => dispatch({
        getNextAccountResponse, type: GETNEXTACCOUNT_SUCCESS
      }), 1000);
    })
    .catch(error => dispatch({ error, type: GETNEXTACCOUNT_FAILED }));
};

export const IMPORTPRIVKEY_ATTEMPT = "IMPORTPRIVKEY_ATTEMPT";
export const IMPORTPRIVKEY_FAILED = "IMPORTPRIVKEY_FAILED";
export const IMPORTPRIVKEY_SUCCESS = "IMPORTPRIVKEY_SUCCESS";

export const importPrivateKeyAttempt = (...args) => (dispatch, getState) => {
  dispatch({ type: IMPORTPRIVKEY_ATTEMPT });
  return wallet.importPrivateKey(sel.walletService(getState()), ...args)
    .then(res => dispatch({ importPrivateKeyResponse: res, type: IMPORTPRIVKEY_SUCCESS }))
    .catch(error => dispatch({ error, type: IMPORTPRIVKEY_FAILED }));
};

export const IMPORTSCRIPT_ATTEMPT = "IMPORTSCRIPT_ATTEMPT";
export const IMPORTSCRIPT_FAILED = "IMPORTSCRIPT_FAILED";
export const IMPORTSCRIPT_SUCCESS = "IMPORTSCRIPT_SUCCESS";
export const IMPORTSCRIPT_SUCCESS_PURCHASE_TICKETS = "IMPORTSCRIPT_SUCCESS_PURCHASE_TICKETS";

const importScriptSuccess = (importScriptResponse, votingAddress, purchaseTickets, cb, willRescan) => (dispatch) => {
  const importScriptSuccess = "Script successfully imported, rescanning now";
  if (purchaseTickets) {
    dispatch({ importScriptSuccess, importScriptResponse, willRescan, type: IMPORTSCRIPT_SUCCESS_PURCHASE_TICKETS });
  } else {
    dispatch({ importScriptSuccess, importScriptResponse, willRescan, type: IMPORTSCRIPT_SUCCESS });
  }
  if (votingAddress) {
    if (importScriptResponse.getP2shAddress() == votingAddress) {
      dispatch(() => cb());
    } else {
      const error = "The stakepool voting address is not the P2SH address of the voting redeem script. This could be due to trying to use a stakepool that is configured for a different wallet. If this is not the case, please report this to the stakepool administrator and the Decred devs.";
      dispatch(() => cb(error));
    }
  }
};

export const importScriptAttempt = (passphrase, script, rescan, scanFrom, votingAddress, purchaseTickets, cb) =>
  (dispatch, getState) => {
    dispatch({ type: IMPORTSCRIPT_ATTEMPT });
    return wallet.importScript(sel.walletService(getState()), passphrase, script, false, 0)
      .then(importScriptResponse => {
        if (rescan) dispatch(rescanAttempt(0));
        dispatch(importScriptSuccess(importScriptResponse, votingAddress, purchaseTickets, cb));
        if (!votingAddress && !cb) setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 1000);
      })
      .catch(error => {
        dispatch({ error, type: IMPORTSCRIPT_FAILED });
        if (votingAddress || cb) {
          if (String(error).indexOf("master private key") !== -1) {
            dispatch(() => cb(error));
          } else {
            error = error + ". This probably means you are trying to use a stakepool account that is already associated with another wallet.  If you have previously used a voting account, please create a new account and try again.  Otherwise, please set up a new stakepool account for this wallet.";
            dispatch(() => cb(error));
          }
        }
      });
  };

export const CHANGEPASSPHRASE_ATTEMPT = "CHANGEPASSPHRASE_ATTEMPT";
export const CHANGEPASSPHRASE_FAILED = "CHANGEPASSPHRASE_FAILED";
export const CHANGEPASSPHRASE_SUCCESS = "CHANGEPASSPHRASE_SUCCESS";

export const changePassphraseAttempt = (oldPass, newPass, priv) => (dispatch, getState) => {
  dispatch({ type: CHANGEPASSPHRASE_ATTEMPT });
  return wallet.changePassphrase(sel.walletService(getState()), oldPass, newPass, priv)
    .then(res => dispatch({ changePassphraseResponse: res, type: CHANGEPASSPHRASE_SUCCESS }))
    .catch(error => dispatch({ error, type: CHANGEPASSPHRASE_FAILED }));
};

export const LOADACTIVEDATAFILTERS_ATTEMPT = "LOADACTIVEDATAFILTERS_ATTEMPT";
export const LOADACTIVEDATAFILTERS_FAILED= "LOADACTIVEDATAFILTERS_FAILED";
export const LOADACTIVEDATAFILTERS_SUCCESS = "LOADACTIVEDATAFILTERS_SUCCESS";

export const loadActiveDataFiltersAttempt = () => (dispatch, getState) => {
  const { walletCreateExisting, walletCreateResponse, rescanPointResponse } = getState().walletLoader;
  dispatch({ type: LOADACTIVEDATAFILTERS_ATTEMPT });
  return wallet.loadActiveDataFilters(sel.walletService(getState()))
    .then(res => {
      dispatch({ response: res, type: LOADACTIVEDATAFILTERS_SUCCESS });

      // Check here to see if wallet was just created from an existing
      // seed.  If it was created from a newly generated seed there is no
      // expectation of address use so rescan can be skipped.
      if (walletCreateExisting) {
        setTimeout(() => { dispatch(rescanAttempt(0, null, true)); }, 1000);
      } else if (walletCreateResponse) {
        wallet.bestBlock(sel.walletService(getState()))
          .then(resp => dispatch(rescanAttempt(resp.getHeight(), null, true)));
      } else if (walletCreateResponse == null && rescanPointResponse != null && rescanPointResponse.getRescanPointHash().length !== 0) {
        setTimeout(() => { dispatch(rescanAttempt(null, rescanPointResponse != null && rescanPointResponse.getRescanPointHash(), true)); }, 1000);
      } else {
        dispatch(startWalletServices());
      }
    }
    )
    .catch(error => dispatch({ error, type: LOADACTIVEDATAFILTERS_FAILED }));
};

export const CLEARTX = "CLEARTX";

export const clearTransaction = () => ({ type: CLEARTX });

export const SIGNTX_ATTEMPT = "SIGNTX_ATTEMPT";
export const SIGNTX_FAILED = "SIGNTX_FAILED";
export const SIGNTX_SUCCESS = "SIGNTX_SUCCESS";

export const signTransactionAttempt = (passphrase, rawTx) => (dispatch, getState) => {
  dispatch({ type: SIGNTX_ATTEMPT });
  return wallet.signTransaction(sel.walletService(getState()), passphrase, rawTx)
    .then(signTransactionResponse => {
      dispatch({ signTransactionResponse: signTransactionResponse, type: SIGNTX_SUCCESS });
      dispatch(publishTransactionAttempt(signTransactionResponse.getTransaction()));
    })
    .catch(error => dispatch({ error, type: SIGNTX_FAILED }));
};

export const PUBLISHTX_ATTEMPT = "PUBLISHTX_ATTEMPT";
export const PUBLISHTX_FAILED = "PUBLISHTX_FAILED";
export const PUBLISHTX_SUCCESS = "PUBLISHTX_SUCCESS";

export const publishTransactionAttempt = (tx) => (dispatch, getState) => {
  dispatch({ type: PUBLISHTX_ATTEMPT });
  return wallet.publishTransaction(sel.walletService(getState()), tx)
    .then(res => {
      dispatch({ hash: reverseRawHash(res.getTransactionHash()), type: PUBLISHTX_SUCCESS });
    })
    .catch(error => dispatch({ error, type: PUBLISHTX_FAILED }));
};

export const PURCHASETICKETS_ATTEMPT = "PURCHASETICKETS_ATTEMPT";
export const PURCHASETICKETS_FAILED = "PURCHASETICKETS_FAILED";
export const PURCHASETICKETS_SUCCESS = "PURCHASETICKETS_SUCCESS";

export const purchaseTicketsAttempt = (
  passphrase, accountNum, spendLimit, requiredConf, numTickets, expiry, ticketFee, txFee, stakepool
) => (dispatch, getState) => {
  const state = getState();
  const currentBlockHeight = sel.currentBlockHeight(state);
  expiry = expiry === 0 ? expiry : currentBlockHeight + expiry;
  txFee = txFee * 1e8;
  ticketFee = ticketFee * 1e8;
  dispatch({ numTicketsToBuy: numTickets, type: PURCHASETICKETS_ATTEMPT });
  dispatch(importScriptAttempt(passphrase, stakepool.Script, false, 0, stakepool.TicketAddress, true,
    error => error
      ? dispatch({ error, type: PURCHASETICKETS_FAILED })
      : wallet.purchaseTickets(
        sel.walletService(state), passphrase, accountNum, spendLimit, requiredConf, numTickets,
        expiry, ticketFee, txFee, stakepool
      )
        .then(purchaseTicketsResponse => {
          dispatch({ purchaseTicketsResponse, type: PURCHASETICKETS_SUCCESS });
        })
        .catch(error => dispatch({ error, type: PURCHASETICKETS_FAILED }))
  ));
};

export const REVOKETICKETS_ATTEMPT = "REVOKETICKETS_ATTEMPT";
export const REVOKETICKETS_FAILED = "REVOKETICKETS_FAILED";
export const REVOKETICKETS_SUCCESS = "REVOKETICKETS_SUCCESS";

export const revokeTicketsAttempt = (passphrase) => (dispatch, getState) => {
  dispatch({ type: REVOKETICKETS_ATTEMPT });
  return wallet.revokeTickets(sel.walletService(getState()), passphrase)
    .then(revokeTicketsResponse => {
      setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 4000);
      dispatch({ revokeTicketsResponse, type: REVOKETICKETS_SUCCESS });
    })
    .catch(error => dispatch({ error, type: REVOKETICKETS_FAILED }));
};

export const GETTICKETBUYERCONFIG_ATTEMPT = "GETTICKETBUYERCONFIG_ATTEMPT";
export const GETTICKETBUYERCONFIG_FAILED = "GETTICKETBUYERCONFIG_FAILED";
export const GETTICKETBUYERCONFIG_SUCCESS = "GETTICKETBUYERCONFIG_SUCCESS";

export const getTicketBuyerConfigAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETTICKETBUYERCONFIG_ATTEMPT });
  return wallet.getTicketBuyerConfig(sel.ticketBuyerService(getState()))
    .then(res => dispatch({ ticketBuyerConfig: res, type: GETTICKETBUYERCONFIG_SUCCESS }))
    .catch(error => dispatch({ error, type: GETTICKETBUYERCONFIG_FAILED }));
};

export const SETTICKETBUYERCONFIG_ATTEMPT = "SETTICKETBUYERCONFIG_ATTEMPT";
export const SETTICKETBUYERCONFIG_FAILED = "SETTICKETBUYERCONFIG_FAILED";
export const SETTICKETBUYERCONFIG_SUCCESS = "SETTICKETBUYERCONFIG_SUCCESS";
export const SETBALANCETOMAINTAIN = "SETBALANCETOMAINTAIN";
export const SETMAXFEE = "SETMAXFEE";
export const SETMAXPRICEABSOLUTE = "SETMAXPRICEABSOLUTE";
export const SETMAXPRICERELATIVE = "SETMAXPRICERELATIVE";
export const SETMAXPERBLOCK = "SETMAXPERBLOCK";

export const setTicketBuyerConfigAttempt = (
  account, balanceToMaintain, maxFee, maxPriceAbsolute, maxPriceRelative, stakePool, maxPerBlock
) => (dispatch, getState) => {
  const { daemon: { walletName } } = getState();
  const cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
  const ticketBuyerService = sel.ticketBuyerService(getState());
  const getTicketBuyerConfigResponse = sel.getTicketBuyerConfigResponse(getState());
  const promises = [];
  dispatch({ type: SETTICKETBUYERCONFIG_ATTEMPT });

  if (account !== getTicketBuyerConfigResponse.getAccount())
    promises.push(wallet.setTicketBuyerAccount(ticketBuyerService, account));
  if (balanceToMaintain*1e8 !== getTicketBuyerConfigResponse.getBalanceToMaintain())
    promises.push(wallet
      .setTicketBuyerBalanceToMaintain(ticketBuyerService, balanceToMaintain*1e8)
      .then(() => {
        cfg.set("balancetomaintain", balanceToMaintain);
        dispatch({ balanceToMaintain, type: SETBALANCETOMAINTAIN });
      }));
  if (maxFee*1e8 !== getTicketBuyerConfigResponse.getMaxFee())
    promises.push(wallet
      .setTicketBuyerMaxFee(ticketBuyerService, maxFee*1e8)
      .then(() => {
        cfg.set("maxfee", maxFee);
        dispatch({ maxFee, type: SETMAXFEE });
      }));
  if (maxPriceAbsolute*1e8 !== getTicketBuyerConfigResponse.getMaxPriceAbsolute())
    promises.push(wallet
      .setTicketBuyerMaxPriceAbsolute(ticketBuyerService, maxPriceAbsolute*1e8)
      .then(() => {
        cfg.set("maxpriceabsolute",maxPriceAbsolute);
        dispatch({ maxPriceAbsolute, type: SETMAXPRICEABSOLUTE });
      }));
  if (parseFloat(maxPriceRelative) !== getTicketBuyerConfigResponse.getMaxPriceRelative()) {
    promises.push(wallet
      .setTicketBuyerMaxPriceRelative(ticketBuyerService, maxPriceRelative)
      .then(() => {
        cfg.set("maxpricerelative",maxPriceRelative);
        dispatch({ maxPriceRelative, type: SETMAXPRICERELATIVE });
      }));
  }
  if (parseInt(maxPerBlock) !== getTicketBuyerConfigResponse.getMaxPerBlock()) {
    promises.push(wallet
      .setTicketBuyerMaxPerBlock(ticketBuyerService, maxPerBlock)
      .then(() => {
        cfg.set("maxperblock", maxPerBlock);
        dispatch({ maxPerBlock, type: SETMAXPERBLOCK });
      }));
  }
  if (stakePool.TicketAddress !== getTicketBuyerConfigResponse.getVotingAddress())
    promises.push(wallet.setTicketBuyerVotingAddress(ticketBuyerService, stakePool.TicketAddress));
  if (stakePool.PoolAddress !== getTicketBuyerConfigResponse.getPoolAddress())
    promises.push(wallet.setPoolAddress(ticketBuyerService, stakePool.PoolAddress));
  if (stakePool.PoolFees !== getTicketBuyerConfigResponse.getPoolFees())
    promises.push(wallet.setPoolFees(ticketBuyerService, stakePool.PoolFees));
  return Promise.all(promises)
    .then(() => {
      dispatch({
        type: SETTICKETBUYERCONFIG_SUCCESS
      });
      dispatch(getTicketBuyerConfigAttempt());
    })
    .catch(error => dispatch({ error, type: SETTICKETBUYERCONFIG_FAILED }));
};

export const STARTAUTOBUYER_ATTEMPT = "STARTAUTOBUYER_ATTEMPT";
export const STARTAUTOBUYER_FAILED = "STARTAUTOBUYER_FAILED";
export const STARTAUTOBUYER_SUCCESS = "STARTAUTOBUYER_SUCCESS";

export const startAutoBuyerAttempt = (
  passphrase, accountNum, balanceToMaintain, maxFeePerKb, maxPriceRelative, maxPriceAbsolute,
  maxPerBlock, stakepool
) => (dispatch, getState) => {
  dispatch({ type: STARTAUTOBUYER_ATTEMPT, });
  return wallet.startAutoBuyer(
    sel.ticketBuyerService(getState()), passphrase, accountNum, balanceToMaintain*1e8, maxFeePerKb*1e8,
    maxPriceRelative, maxPriceAbsolute*1e8, maxPerBlock, stakepool
  )
    .then(startAutoBuyerResponse => {
      dispatch({
        startAutoBuyerResponse,
        type: STARTAUTOBUYER_SUCCESS,
        balanceToMaintain: balanceToMaintain,
        maxFeePerKb: maxFeePerKb*1e8,
        maxPriceRelative: maxPriceRelative,
        maxPriceAbsolute: maxPriceAbsolute,
        maxPerBlock: maxPerBlock,
      });
      setTimeout(()=>dispatch(getTicketBuyerConfigAttempt(), 1000));
    })
    .catch(error => dispatch({ error, type: STARTAUTOBUYER_FAILED }));
};

export const STOPAUTOBUYER_ATTEMPT = "STOPAUTOBUYER_ATTEMPT";
export const STOPAUTOBUYER_FAILED = "STOPAUTOBUYER_FAILED";
export const STOPAUTOBUYER_SUCCESS = "STOPAUTOBUYER_SUCCESS";

export const stopAutoBuyerAttempt = () => (dispatch, getState) => {
  dispatch({ type: STOPAUTOBUYER_ATTEMPT });
  return wallet.stopAutoBuyer(sel.ticketBuyerService(getState()))
    .then(stopAutoBuyerResponse => dispatch({
      stopAutoBuyerResponse, type: STOPAUTOBUYER_SUCCESS
    }))
    .catch(() => dispatch({ type: STOPAUTOBUYER_FAILED }));
  // The only error that can be returned here is if the autobuyer is not running when requested to stop.
  // We're currently issuing a stop auto buyer request on startup, so to avoid that error being shown,
  // it makes sense to just remove the error consumption altogether.
};

export const CONSTRUCTTX_ATTEMPT = "CONSTRUCTTX_ATTEMPT";
export const CONSTRUCTTX_FAILED = "CONSTRUCTTX_FAILED";
export const CONSTRUCTTX_FAILED_LOW_BALANCE = "CONSTRUCTTX_FAILED_LOW_BALANCE";
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
          if (String(error).indexOf("insufficient balance") > 0) {
            dispatch({ error, type: CONSTRUCTTX_FAILED_LOW_BALANCE });
          } else {
            dispatch({ error, type: CONSTRUCTTX_FAILED });
          }
        } else {
          if (!all) {
            constructTxResponse.totalAmount = totalAmount;
          } else {
            constructTxResponse.totalAmount = constructTxResponse.getTotalOutputAmount();
          }
          dispatch({ constructTxResponse: constructTxResponse, type: CONSTRUCTTX_SUCCESS });
        }
      });
  };
}

export const VALIDATEADDRESS_ATTEMPT = "VALIDATEADDRESS_ATTEMPT";
export const VALIDATEADDRESS_FAILED = "VALIDATEADDRESS_FAILED";
export const VALIDATEADDRESS_SUCCESS = "VALIDATEADDRESS_SUCCESS";
export const VALIDATEADDRESS_CLEANSTORE ="VALIDATEADDRESS_CLEANSTORE";

export const validateAddress = address => async (dispatch, getState) => {
  try {
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;
    const validationErr = isValidAddress(address, network);
    if (validationErr) {
      dispatch({ type: VALIDATEADDRESS_FAILED });
      return { isValid: false, error: validationErr, getIsValid () { return false; } };
    }
    dispatch({ type: VALIDATEADDRESS_ATTEMPT });
    let response = await wallet.validateAddress(sel.walletService(getState()), address);
    dispatch({ response, type: VALIDATEADDRESS_SUCCESS });
    return { isValid: response.getIsValid(), error: null, getIsValid () { return response.getIsValid(); } };
  } catch (error) {
    dispatch({ type: VALIDATEADDRESS_FAILED });
    return { isValid: false, error, getIsValid () { return false; } };
  }
};

export const VALIDATEMASTERPUBKEY_FAILED = "VALIDATEMASTERPUBKEY_FAILED";
export const VALIDATEMASTERPUBKEY_SUCCESS = "VALIDATEMASTERPUBKEY_SUCCESS";

export const validateMasterPubKey = masterPubKey => async (dispatch) => {
  try {
    const validationErr = isValidMasterPubKey(masterPubKey);
    if (validationErr) {
      dispatch({ type: VALIDATEMASTERPUBKEY_FAILED });
      return { isValid: false, error: validationErr };
    }
    dispatch({ type: VALIDATEMASTERPUBKEY_SUCCESS, isWatchingOnly: true, masterPubKey });
    return { isValid: true, error: null };
  } catch (error) {
    dispatch({ error, type: VALIDATEMASTERPUBKEY_FAILED });
    return { isValid: false, error };
  }
};

export const validateAddressCleanStore = () => async (dispatch) => {
  dispatch({ type: VALIDATEADDRESS_CLEANSTORE });
};

export const SIGNMESSAGE_ATTEMPT = "SIGNMESSAGE_ATTEMPT";
export const SIGNMESSAGE_FAILED = "SIGNMESSAGE_FAILED";
export const SIGNMESSAGE_SUCCESS = "SIGNMESSAGE_SUCCESS";
export const SIGNMESSAGE_CLEANSTORE = "SIGNMESSAGE_CLEANSTORE";

export function signMessageAttempt(address, message, passphrase ) {
  return (dispatch, getState) => {
    dispatch({ type: SIGNMESSAGE_ATTEMPT });
    wallet.signMessage(sel.walletService(getState()), address, message, passphrase)
      .then(getSignMessageResponse =>
        dispatch({ getSignMessageSignature: getSignMessageResponse.toObject().signature, type: SIGNMESSAGE_SUCCESS }))
      .catch(error => dispatch({ error, type: SIGNMESSAGE_FAILED }));
  };
}

export const signMessageCleanStore = () => ({ type: SIGNMESSAGE_CLEANSTORE });

export const VERIFYMESSAGE_ATTEMPT = "VERIFYMESSAGE_ATTEMPT";
export const VERIFYMESSAGE_FAILED = "VERIFYMESSAGE_FAILED";
export const VERIFYMESSAGE_SUCCESS = "VERIFYMESSAGE_SUCCESS";
export const VERIFYMESSAGE_CLEANSTORE = "VERIFYMESSAGE_CLEANSTORE";

export function verifyMessageAttempt(address, message, signature) {
  return (dispatch, getState) => {
    dispatch({ type: VERIFYMESSAGE_ATTEMPT });
    wallet.verifyMessage(sel.messageVerificationService(getState()), address, message, signature)
      .then(getVerifyMessageResponse => {
        dispatch({ getVerifyMessageResponse, type: VERIFYMESSAGE_SUCCESS });
      })
      .catch(error => dispatch({ error, type: VERIFYMESSAGE_FAILED }));
  };
}

export const verifyMessageCleanStore = () => ({ type: VERIFYMESSAGE_CLEANSTORE });

export const PUBLISHUNMINEDTRANSACTIONS_ATTEMPT = "PUBLISHUNMINEDTRANSACTIONS_ATTEMPT";
export const PUBLISHUNMINEDTRANSACTIONS_SUCCESS = "PUBLISHUNMINEDTRANSACTIONS_SUCCESS";
export const PUBLISHUNMINEDTRANSACTIONS_FAILED = "PUBLISHUNMINEDTRANSACTIONS_FAILED";

export const publishUnminedTransactionsAttempt = () => (dispatch, getState) => {
  dispatch({ type: PUBLISHUNMINEDTRANSACTIONS_ATTEMPT });
  const { grpc: { unminedTransactions } } = getState();
  if (unminedTransactions && unminedTransactions.length > 0) {
    wallet.publishUnminedTransactions(sel.walletService(getState()))
      .then(() => dispatch({ type: PUBLISHUNMINEDTRANSACTIONS_SUCCESS }))
      .catch(error => dispatch({ error, type: PUBLISHUNMINEDTRANSACTIONS_FAILED }));
  }
};

export const MODAL_SHOWN = "MODAL_SHOWN";
export const MODAL_HIDDEN = "MODAL_HIDDEN";
export const modalShown = () => (dispatch) => dispatch({ type: MODAL_SHOWN });
export const modalHidden = () => (dispatch) => dispatch({ type: MODAL_HIDDEN });

export const TOGGLE_ABOUT_MODAL_VISIBILITY = "TOGGLE_ABOUT_MODAL_VISIBILITY";
export const toggleAboutModalVisibility = () => (dispatch) => dispatch({ type: TOGGLE_ABOUT_MODAL_VISIBILITY });

export const GETACCOUNTEXTENDEDKEY_ATTEMPT = "GETACCOUNTEXTENDEDKEY_ATTEMPT";
export const GETACCOUNTEXTENDEDKEY_FAILED = "GETACCOUNTEXTENDEDKEY_FAILED";
export const GETACCOUNTEXTENDEDKEY_SUCCESS = "GETACCOUNTEXTENDEDKEY_SUCCESS";

export const getAccountExtendedKeyAttempt = (accountNumber) => (dispatch, getState) => {
  dispatch({ type: GETACCOUNTEXTENDEDKEY_ATTEMPT });
  return wallet.getAccountExtendedKey(sel.walletService(getState()), accountNumber)
    .then(res => {
      res.accountNumber = accountNumber;
      return dispatch({
        getAccountExtendedKeyResponse: res,
        type: GETACCOUNTEXTENDEDKEY_SUCCESS
      });
    })
    .catch(error => dispatch({ error, type: GETACCOUNTEXTENDEDKEY_FAILED }));
};

