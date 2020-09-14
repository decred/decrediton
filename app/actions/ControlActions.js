// @flow
import * as wallet from "wallet";
import * as sel from "selectors";
import { isValidAddress, isValidMasterPubKey } from "helpers";
import {
  getStakeInfoAttempt,
  startWalletServices,
  getStartupWalletInfo
} from "./ClientActions";
import {
  RescanRequest,
  ConstructTransactionRequest,
  RunTicketBuyerRequest
} from "../middleware/walletrpc/api_pb";
import { reverseRawHash, rawToHex } from "helpers/byteActions";

export const GETNEXTADDRESS_ATTEMPT = "GETNEXTADDRESS_ATTEMPT";
export const GETNEXTADDRESS_FAILED = "GETNEXTADDRESS_FAILED";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";

export const getNextAddressAttempt = (accountNumber) => (
  dispatch,
  getState
) => {
  dispatch({ type: GETNEXTADDRESS_ATTEMPT });
  return wallet
    .getNextAddress(sel.walletService(getState()), accountNumber)
    .then((res) => {
      res.accountNumber = accountNumber;
      return dispatch({
        getNextAddressResponse: res,
        type: GETNEXTADDRESS_SUCCESS
      });
    })
    .catch((error) => dispatch({ error, type: GETNEXTACCOUNT_FAILED }));
};

export const RENAMEACCOUNT_ATTEMPT = "RENAMEACCOUNT_ATTEMPT";
export const RENAMEACCOUNT_FAILED = "RENAMEACCOUNT_FAILED";
export const RENAMEACCOUNT_SUCCESS = "RENAMEACCOUNT_SUCCESS";

export const renameAccountAttempt = (accountNumber, newName) => (
  dispatch,
  getState
) => {
  dispatch({ type: RENAMEACCOUNT_ATTEMPT });
  return wallet
    .renameAccount(sel.walletService(getState()), accountNumber, newName)
    .then((renameAccountResponse) => {
      setTimeout(
        () =>
          dispatch({
            renameAccountResponse,
            type: RENAMEACCOUNT_SUCCESS
          }),
        1000
      );
    })
    .catch((error) => dispatch({ error, type: RENAMEACCOUNT_FAILED }));
};

export const RESCAN_ATTEMPT = "RESCAN_ATTEMPT";
export const RESCAN_FAILED = "RESCAN_FAILED";
export const RESCAN_PROGRESS = "RESCAN_PROGRESS";
export const RESCAN_COMPLETE = "RESCAN_COMPLETE";
export const RESCAN_CANCEL = "RESCAN_CANCEL";

export function rescanAttempt(beginHeight, beginHash, startup) {
  const request = new RescanRequest();
  if (beginHeight !== null) {
    request.setBeginHeight(beginHeight);
  } else {
    request.setBeginHash(new Uint8Array(Buffer.from(beginHash)));
  }
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({ request: request, type: RESCAN_ATTEMPT });
      const { walletService } = getState().grpc;
      const rescanCall = walletService.rescan(request);
      rescanCall.on("data", function (response) {
        dispatch({
          rescanCall: rescanCall,
          rescanResponse: response,
          type: RESCAN_PROGRESS
        });
      });
      rescanCall.on("end", function () {
        dispatch({ type: RESCAN_COMPLETE });
        if (startup) {
          dispatch(startWalletServices());
        } else {
          dispatch(getStartupWalletInfo());
        }
      });
      rescanCall.on("error", function (status) {
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

export const getNextAccountAttempt = (passphrase, accountName) => (
  dispatch,
  getState
) => {
  dispatch({ type: GETNEXTACCOUNT_ATTEMPT });
  return wallet
    .getNextAccount(sel.walletService(getState()), passphrase, accountName)
    .then((getNextAccountResponse) =>
      dispatch({ getNextAccountResponse, type: GETNEXTACCOUNT_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: GETNEXTACCOUNT_FAILED }));
};

export const IMPORTPRIVKEY_ATTEMPT = "IMPORTPRIVKEY_ATTEMPT";
export const IMPORTPRIVKEY_FAILED = "IMPORTPRIVKEY_FAILED";
export const IMPORTPRIVKEY_SUCCESS = "IMPORTPRIVKEY_SUCCESS";

export const importPrivateKeyAttempt = (...args) => (dispatch, getState) => {
  dispatch({ type: IMPORTPRIVKEY_ATTEMPT });
  return wallet
    .importPrivateKey(sel.walletService(getState()), ...args)
    .then((res) =>
      dispatch({ importPrivateKeyResponse: res, type: IMPORTPRIVKEY_SUCCESS })
    )
    .catch((error) => dispatch({ error, type: IMPORTPRIVKEY_FAILED }));
};

export const IMPORTSCRIPT_ATTEMPT = "IMPORTSCRIPT_ATTEMPT";
export const IMPORTSCRIPT_FAILED = "IMPORTSCRIPT_FAILED";
export const IMPORTSCRIPT_SUCCESS = "IMPORTSCRIPT_SUCCESS";

// importScriptAttempt tries to import the given script into the wallet. It will
// throw an exception in case of errors.
export const importScriptAttempt = (script) => async (
  dispatch,
  getState
) => {
  dispatch({ type: IMPORTSCRIPT_ATTEMPT });
  const walletService = sel.walletService(getState());
  try {
    const importScriptResponse = await wallet.importScript(
      walletService,
      script
    );
    dispatch({ importScriptResponse, type: IMPORTSCRIPT_SUCCESS });
    return importScriptResponse;
  } catch (error) {
    dispatch({ error, type: IMPORTSCRIPT_FAILED });
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error);
  }
};

export const IMPORTSCRIPT_MANUAL_SUCCESS = "IMPORTSCRIPT_MANUAL_SUCCESS";
export const IMPORTSCRIPT_MANUAL_FAILED = "IMPORTSCRIPT_MANUAL_FAILED";

// manualImportScriptAttempt imports a script from a "manual" (ie,
// user-initiated) entry. This is in contrast of importScriptAttempt which is
// meant as a step during some other operation (eg: linking to a stakepool).
//
// This function always initiates a complete wallet rescan in case of success.
export const manualImportScriptAttempt = (script) => async (
  dispatch
) => {
  try {
    await dispatch(importScriptAttempt(script));
    dispatch({ type: IMPORTSCRIPT_MANUAL_SUCCESS });
    dispatch(rescanAttempt(0));
  } catch (error) {
    dispatch({ error, type: IMPORTSCRIPT_MANUAL_FAILED });
  }
};

export const CHANGEPASSPHRASE_ATTEMPT = "CHANGEPASSPHRASE_ATTEMPT";
export const CHANGEPASSPHRASE_FAILED = "CHANGEPASSPHRASE_FAILED";
export const CHANGEPASSPHRASE_SUCCESS = "CHANGEPASSPHRASE_SUCCESS";

export const changePassphraseAttempt = (oldPass, newPass, priv) => (
  dispatch,
  getState
) => {
  dispatch({ type: CHANGEPASSPHRASE_ATTEMPT });
  return wallet
    .changePassphrase(sel.walletService(getState()), oldPass, newPass, priv)
    .then((res) =>
      dispatch({
        changePassphraseResponse: res,
        type: CHANGEPASSPHRASE_SUCCESS
      })
    )
    .catch((error) => dispatch({ error, type: CHANGEPASSPHRASE_FAILED }));
};

export const CLEARTX = "CLEARTX";

export const clearTransaction = () => ({ type: CLEARTX });

export const SIGNTX_ATTEMPT = "SIGNTX_ATTEMPT";
export const SIGNTX_FAILED = "SIGNTX_FAILED";
export const SIGNTX_SUCCESS = "SIGNTX_SUCCESS";

export const signTransactionAttempt = (passphrase, rawTx) => (
  dispatch,
  getState
) => {
  dispatch({ type: SIGNTX_ATTEMPT });
  return wallet
    .signTransaction(sel.walletService(getState()), passphrase, rawTx)
    .then((signTransactionResponse) => {
      dispatch({
        signTransactionResponse: signTransactionResponse,
        type: SIGNTX_SUCCESS
      });
      dispatch(
        publishTransactionAttempt(signTransactionResponse.getTransaction())
      );
    })
    .catch((error) => dispatch({ error, type: SIGNTX_FAILED }));
};

export const PUBLISHTX_ATTEMPT = "PUBLISHTX_ATTEMPT";
export const PUBLISHTX_FAILED = "PUBLISHTX_FAILED";
export const PUBLISHTX_SUCCESS = "PUBLISHTX_SUCCESS";

export const publishTransactionAttempt = (tx) => (dispatch, getState) => {
  dispatch({ type: PUBLISHTX_ATTEMPT });
  const chainParams = sel.chainParams(getState());
  return wallet
    .publishTransaction(sel.walletService(getState()), tx)
    .then((res) => {
      // If one of the outputs of the just published tx is one of the recorded
      // change scripts, clear it as to prevent address reuse. This is needed
      // due to dcrwallet#1622.
      const rawTx = Buffer.from(tx, "hex");
      const decoded = wallet.decodeRawTransaction(rawTx, chainParams);
      const changeScriptByAccount =
        getState().control.changeScriptByAccount || {};
      const newChangeScriptByAccount = {};
      Object.keys(changeScriptByAccount).forEach((account) => {
        const foundScript = decoded.outputs.some((out) => {
          if (out.script.equals(changeScriptByAccount[account])) {
            return true;
          }
        });
        if (!foundScript) {
          newChangeScriptByAccount[account] = changeScriptByAccount[account];
        }
      });

      dispatch({
        hash: reverseRawHash(res.getTransactionHash()),
        changeScriptByAccount: newChangeScriptByAccount,
        type: PUBLISHTX_SUCCESS
      });
    })
    .catch((error) => dispatch({ error, type: PUBLISHTX_FAILED }));
};

export const PURCHASETICKETS_ATTEMPT = "PURCHASETICKETS_ATTEMPT";
export const PURCHASETICKETS_FAILED = "PURCHASETICKETS_FAILED";
export const PURCHASETICKETS_SUCCESS = "PURCHASETICKETS_SUCCESS";
export const CREATE_UNSIGNEDTICKETS_SUCCESS = "CREATE_UNSIGNEDTICKETS_SUCCESS";

// TODO move purchaseTicketsAttempt to TransactionActions
export const purchaseTicketsAttempt = (
  passphrase,
  accountNum,
  spendLimit,
  requiredConf,
  numTickets,
  expiry,
  ticketFee,
  txFee,
  stakepool
) => async (dispatch, getState) => {
  try {
    const currentBlockHeight = sel.currentBlockHeight(getState());
    const walletService = sel.walletService(getState());
    expiry = expiry === 0 ? expiry : currentBlockHeight + expiry;
    txFee = txFee * 1e8;
    ticketFee = ticketFee * 1e8;
    const dontSignTx = sel.isWatchingOnly(getState());

    dispatch({ numTicketsToBuy: numTickets, type: PURCHASETICKETS_ATTEMPT });

    const stakePoolStats = await wallet.getStakePoolStats(stakepool.Host);

    if (stakePoolStats.data.data.PoolStatus == "Closed") {
      throw new Error(
        "Unable to purchase a ticket from a closed VSP (" + stakepool.Host + ")"
      );
    }

    if (!dontSignTx) {
      // If we need to sign the tx, we re-import the script to ensure the
      // wallet will control the ticket.
      const importScriptResponse = await dispatch(
        importScriptAttempt(stakepool.Script)
      );
      if (importScriptResponse.getP2shAddress() !== stakepool.TicketAddress) {
        throw new Error(
          "Trying to use a ticket address not corresponding to script"
        );
      }
    }

    const purchaseTicketsResponse = await wallet.purchaseTickets(
      walletService,
      passphrase,
      accountNum,
      spendLimit,
      requiredConf,
      numTickets,
      expiry,
      ticketFee,
      txFee,
      stakepool,
      !dontSignTx
    );
    if (dontSignTx) {
      return dispatch({
        purchaseTicketsResponse,
        type: CREATE_UNSIGNEDTICKETS_SUCCESS
      });
    }
    dispatch({ purchaseTicketsResponse, type: PURCHASETICKETS_SUCCESS });
  } catch (error) {
    dispatch({ error, type: PURCHASETICKETS_FAILED });
  }
};

export const REVOKETICKETS_ATTEMPT = "REVOKETICKETS_ATTEMPT";
export const REVOKETICKETS_FAILED = "REVOKETICKETS_FAILED";
export const REVOKETICKETS_SUCCESS = "REVOKETICKETS_SUCCESS";

export const revokeTicketsAttempt = (passphrase) => (dispatch, getState) => {
  dispatch({ type: REVOKETICKETS_ATTEMPT });
  return wallet
    .revokeTickets(sel.walletService(getState()), passphrase)
    .then((revokeTicketsResponse) => {
      setTimeout(() => {
        dispatch(getStakeInfoAttempt());
      }, 4000);
      dispatch({ revokeTicketsResponse, type: REVOKETICKETS_SUCCESS });
    })
    .catch((error) => dispatch({ error, type: REVOKETICKETS_FAILED }));
};

export const STARTTICKETBUYERV2_ATTEMPT = "STARTTICKETBUYERV2_ATTEMPT";
export const STARTTICKETBUYERV2_FAILED = "STARTTICKETBUYERV2_FAILED";
export const STARTTICKETBUYERV2_SUCCESS = "STARTTICKETBUYERV2_SUCCESS";

export const STOPTICKETBUYERV2_ATTEMPT = "STOPTICKETBUYERV2_ATTEMPT";
export const STOPTICKETBUYERV2_FAILED = "STOPTICKETBUYERV2_FAILED";
export const STOPTICKETBUYERV2_SUCCESS = "STOPTICKETBUYERV2_SUCCESS";

export const startTicketBuyerV2Attempt = (
  passphrase,
  account,
  balanceToMaintain,
  stakepool
) => (dispatch, getState) => {
  const request = new RunTicketBuyerRequest();
  request.setBalanceToMaintain(balanceToMaintain);
  request.setAccount(account.value);
  request.setVotingAccount(account.value);
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setVotingAddress(stakepool.TicketAddress);
  request.setPoolAddress(stakepool.PoolAddress);
  request.setPoolFees(stakepool.PoolFees);
  const ticketBuyerConfig = { stakepool, balanceToMaintain, account };
  return new Promise(() => {
    const { ticketBuyerService } = getState().grpc;
    dispatch({ ticketBuyerConfig, type: STARTTICKETBUYERV2_ATTEMPT });
    const ticketBuyer = ticketBuyerService.runTicketBuyer(request);
    ticketBuyer.on("data", function (response) {
      // No expected responses but log in case.
      console.log(response);
    });
    ticketBuyer.on("end", function (response) {
      // No expected response in end but log in case.
      console.log(response);
    });
    ticketBuyer.on("error", function (status) {
      status = status + "";
      if (status.indexOf("Cancelled") < 0) {
        if (status.indexOf("invalid passphrase") > 0) {
          dispatch({ error: status, type: STARTTICKETBUYERV2_FAILED });
        }
      } else {
        dispatch({ type: STOPTICKETBUYERV2_SUCCESS });
      }
    });
    dispatch({
      ticketBuyerCall: ticketBuyer,
      type: STARTTICKETBUYERV2_SUCCESS
    });
  });
};

export function ticketBuyerCancel() {
  return (dispatch, getState) => {
    const { ticketBuyerCall } = getState().control;
    if (!ticketBuyerCall) return;
    if (ticketBuyerCall) {
      dispatch({ type: STOPTICKETBUYERV2_ATTEMPT });
      ticketBuyerCall.cancel();
    }
  };
}

export const CONSTRUCTTX_ATTEMPT = "CONSTRUCTTX_ATTEMPT";
export const CONSTRUCTTX_FAILED = "CONSTRUCTTX_FAILED";
export const CONSTRUCTTX_FAILED_LOW_BALANCE = "CONSTRUCTTX_FAILED_LOW_BALANCE";
export const CONSTRUCTTX_SUCCESS = "CONSTRUCTTX_SUCCESS";

export const constructTransactionAttempt = (
  account,
  confirmations,
  outputs,
  all
) => (dispatch, getState) => {
  const request = new ConstructTransactionRequest();
  let totalAmount;
  request.setSourceAccount(parseInt(account));
  request.setRequiredConfirmations(parseInt(parseInt(confirmations)));
  if (!all) {
    request.setOutputSelectionAlgorithm(0);
    totalAmount = 0;
    outputs.forEach((output) => {
      const outputDest = new ConstructTransactionRequest.OutputDestination();
      outputDest.setAddress(output.destination);
      const newOutput = new ConstructTransactionRequest.Output();
      newOutput.setDestination(outputDest);
      newOutput.setAmount(parseInt(output.amount));
      request.addNonChangeOutputs(newOutput);
      totalAmount += output.amount;
    });

    // If there's a previously stored change address for this account, use it.
    // This alleviates a possible gap limit address exhaustion. See
    // issue dcrwallet#1622.
    const changeScript =
      getState().control.changeScriptByAccount[account] || null;
    if (changeScript) {
      const changeDest = new ConstructTransactionRequest.OutputDestination();
      changeDest.setScript(changeScript);
      request.setChangeDestination(changeDest);
    }
  } else if (outputs.length > 1) {
    return (dispatch) => {
      const error = "Too many outputs provided for a send all request.";
      dispatch({ error, type: CONSTRUCTTX_FAILED });
    };
  } else if (outputs.length == 0) {
    return (dispatch) => {
      const error = "No destination specified for send all request.";
      dispatch({ error, type: CONSTRUCTTX_FAILED });
    };
  } else {
    request.setOutputSelectionAlgorithm(1);
    const outputDest = new ConstructTransactionRequest.OutputDestination();
    outputDest.setAddress(outputs[0].data.destination);
    request.setChangeDestination(outputDest);
  }

  dispatch({ type: CONSTRUCTTX_ATTEMPT });
  const chainParams = sel.chainParams(getState());
  const { walletService } = getState().grpc;
  walletService.constructTransaction(request, function (
    error,
    constructTxResponse
  ) {
    if (error) {
      if (String(error).indexOf("insufficient balance") > 0) {
        dispatch({ error, type: CONSTRUCTTX_FAILED_LOW_BALANCE });
      } else if (
        String(error).indexOf("violates the unused address gap limit policy") >
        0
      ) {
        // Work around dcrwallet#1622: generate a new address in the internal
        // branch using the wrap gap policy so that change addresses can be
        // regenerated again.
        // We'll still error out to let the user know wrapping has occurred.
        wallet.getNextAddress(
          sel.walletService(getState()),
          parseInt(account),
          1
        );
        dispatch({ error, type: CONSTRUCTTX_FAILED });
      } else {
        dispatch({ error, type: CONSTRUCTTX_FAILED });
      }
      return;
    }

    const changeScriptByAccount =
      getState().control.changeScriptByAccount || {};
    if (!all) {
      // Store the change address we just generated so that future changes to
      // the tx being constructed will use the same address and prevent gap
      // limit exhaustion (see above note on issue dcrwallet#1622).
      const changeIndex = constructTxResponse.getChangeIndex();
      if (changeIndex > -1) {
        const rawTx = Buffer.from(constructTxResponse.getUnsignedTransaction());
        const decoded = wallet.decodeRawTransaction(rawTx, chainParams);
        changeScriptByAccount[account] = decoded.outputs[changeIndex].script;
      }

      constructTxResponse.totalAmount = totalAmount;
    } else {
      constructTxResponse.totalAmount = constructTxResponse.getTotalOutputAmount();
    }
    constructTxResponse.rawTx = rawToHex(
      constructTxResponse.getUnsignedTransaction()
    );
    dispatch({
      constructTxResponse: constructTxResponse,
      changeScriptByAccount,
      type: CONSTRUCTTX_SUCCESS
    });
  });
};

export const VALIDATEADDRESS_ATTEMPT = "VALIDATEADDRESS_ATTEMPT";
export const VALIDATEADDRESS_FAILED = "VALIDATEADDRESS_FAILED";
export const VALIDATEADDRESS_SUCCESS = "VALIDATEADDRESS_SUCCESS";
export const VALIDATEADDRESS_CLEANSTORE = "VALIDATEADDRESS_CLEANSTORE";

export const validateAddress = (address) => async (dispatch, getState) => {
  try {
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;
    const validationErr = isValidAddress(address, network);
    if (validationErr) {
      dispatch({ type: VALIDATEADDRESS_FAILED });
      return {
        isValid: false,
        error: validationErr,
        getIsValid() {
          return false;
        }
      };
    }
    dispatch({ type: VALIDATEADDRESS_ATTEMPT });
    const response = await wallet.validateAddress(
      sel.walletService(getState()),
      address
    );
    dispatch({ response, type: VALIDATEADDRESS_SUCCESS });
    return {
      isValid: response.getIsValid(),
      error: null,
      getIsValid() {
        return response.getIsValid();
      }
    };
  } catch (error) {
    dispatch({ type: VALIDATEADDRESS_FAILED });
    return {
      isValid: false,
      error,
      getIsValid() {
        return false;
      }
    };
  }
};

export const VALIDATEMASTERPUBKEY_FAILED = "VALIDATEMASTERPUBKEY_FAILED";
export const VALIDATEMASTERPUBKEY_SUCCESS = "VALIDATEMASTERPUBKEY_SUCCESS";

export const validateMasterPubKey = (masterPubKey) => (dispatch) => {
  try {
    const validationErr = isValidMasterPubKey(masterPubKey);
    if (validationErr) {
      dispatch({ type: VALIDATEMASTERPUBKEY_FAILED });
      return { isValid: false, error: validationErr };
    }
    dispatch({ type: VALIDATEMASTERPUBKEY_SUCCESS });
    return { isValid: true, error: null };
  } catch (error) {
    dispatch({ error, type: VALIDATEMASTERPUBKEY_FAILED });
    return { isValid: false, error };
  }
};

export const validateAddressCleanStore = (dispatch) =>
  dispatch({ type: VALIDATEADDRESS_CLEANSTORE });

export const SIGNMESSAGE_ATTEMPT = "SIGNMESSAGE_ATTEMPT";
export const SIGNMESSAGE_FAILED = "SIGNMESSAGE_FAILED";
export const SIGNMESSAGE_SUCCESS = "SIGNMESSAGE_SUCCESS";
export const SIGNMESSAGE_CLEANSTORE = "SIGNMESSAGE_CLEANSTORE";

export function signMessageAttempt(address, message, passphrase) {
  return (dispatch, getState) => {
    dispatch({ type: SIGNMESSAGE_ATTEMPT });
    wallet
      .signMessage(sel.walletService(getState()), address, message, passphrase)
      .then((getSignMessageResponse) =>
        dispatch({
          getSignMessageSignature: getSignMessageResponse.toObject().signature,
          type: SIGNMESSAGE_SUCCESS
        })
      )
      .catch((error) => dispatch({ error, type: SIGNMESSAGE_FAILED }));
  };
}

export const signMessageCleanStore = (dispatch) =>
  dispatch({ type: SIGNMESSAGE_CLEANSTORE });

export const VERIFYMESSAGE_ATTEMPT = "VERIFYMESSAGE_ATTEMPT";
export const VERIFYMESSAGE_FAILED = "VERIFYMESSAGE_FAILED";
export const VERIFYMESSAGE_SUCCESS = "VERIFYMESSAGE_SUCCESS";
export const VERIFYMESSAGE_CLEANSTORE = "VERIFYMESSAGE_CLEANSTORE";

export function verifyMessageAttempt(address, message, signature) {
  return (dispatch, getState) => {
    dispatch({ type: VERIFYMESSAGE_ATTEMPT });
    wallet
      .verifyMessage(
        sel.messageVerificationService(getState()),
        address,
        message,
        signature
      )
      .then((getVerifyMessageResponse) => {
        dispatch({ getVerifyMessageResponse, type: VERIFYMESSAGE_SUCCESS });
      })
      .catch((error) => dispatch({ error, type: VERIFYMESSAGE_FAILED }));
  };
}

export const verifyMessageCleanStore = (dispatch) =>
  dispatch({ type: VERIFYMESSAGE_CLEANSTORE });

export const PUBLISHUNMINEDTRANSACTIONS_ATTEMPT =
  "PUBLISHUNMINEDTRANSACTIONS_ATTEMPT";
export const PUBLISHUNMINEDTRANSACTIONS_SUCCESS =
  "PUBLISHUNMINEDTRANSACTIONS_SUCCESS";
export const PUBLISHUNMINEDTRANSACTIONS_FAILED =
  "PUBLISHUNMINEDTRANSACTIONS_FAILED";

export const publishUnminedTransactionsAttempt = () => (dispatch, getState) => {
  dispatch({ type: PUBLISHUNMINEDTRANSACTIONS_ATTEMPT });
  const {
    grpc: { unminedTransactions }
  } = getState();
  if (unminedTransactions && unminedTransactions.length > 0) {
    wallet
      .publishUnminedTransactions(sel.walletService(getState()))
      .then(() => dispatch({ type: PUBLISHUNMINEDTRANSACTIONS_SUCCESS }))
      .catch((error) =>
        dispatch({ error, type: PUBLISHUNMINEDTRANSACTIONS_FAILED })
      );
  }
};

export const SHOW_ABOUT_MODAL_MACOS = "SHOW_ABOUT_MODAL_MACOS";
export const showAboutModalMacOS = () => (dispatch) =>
  dispatch({ type: SHOW_ABOUT_MODAL_MACOS });

export const HIDE_ABOUT_MODAL_MACOS = "HIDE_ABOUT_MODAL_MACOS";
export const hideAboutModalMacOS = () => (dispatch) =>
  dispatch({ type: HIDE_ABOUT_MODAL_MACOS });

export const SHOW_AUTOBUYER_RUNNING_MODAL = "SHOW_AUTOBUYER_RUNNING_MODAL";
export const showAutobuyerRunningModal = () => (dispatch) =>
  dispatch({ type: SHOW_AUTOBUYER_RUNNING_MODAL });

export const HIDE_AUTOBUYER_RUNNING_MODAL = "HIDE_AUTOBUYER_RUNNING_MODAL";
export const hideAutobuyerRunningModal = () => (dispatch) =>
  dispatch({ type: HIDE_AUTOBUYER_RUNNING_MODAL });

export const GETACCOUNTEXTENDEDKEY_ATTEMPT = "GETACCOUNTEXTENDEDKEY_ATTEMPT";
export const GETACCOUNTEXTENDEDKEY_FAILED = "GETACCOUNTEXTENDEDKEY_FAILED";
export const GETACCOUNTEXTENDEDKEY_SUCCESS = "GETACCOUNTEXTENDEDKEY_SUCCESS";

export const getAccountExtendedKeyAttempt = (accountNumber) => (
  dispatch,
  getState
) => {
  dispatch({ type: GETACCOUNTEXTENDEDKEY_ATTEMPT });
  return wallet
    .getAccountExtendedKey(sel.walletService(getState()), accountNumber)
    .then((res) => {
      res.accountNumber = accountNumber;
      return dispatch({
        getAccountExtendedKeyResponse: res,
        type: GETACCOUNTEXTENDEDKEY_SUCCESS
      });
    })
    .catch((error) => dispatch({ error, type: GETACCOUNTEXTENDEDKEY_FAILED }));
};
