// @flow
import { wallet } from "wallet-preload-shim";
import * as sel from "selectors";
import { isValidAddress, isValidMasterPubKey } from "helpers";
import {
  getStakeInfoAttempt,
  startWalletServices,
  getStartupWalletInfo
} from "./ClientActions";
import { rawToHex } from "helpers/byteActions";
import { listUnspentOutputs } from "./TransactionActions";
import { updateUsedVSPs, getVSPTrackedTickets } from "./VSPActions";
import { isNumber } from "fp";
import { setNeedsVSPdProcessTickets } from "./SettingsActions";

export const GETNEXTADDRESS_ATTEMPT = "GETNEXTADDRESS_ATTEMPT";
export const GETNEXTADDRESS_FAILED = "GETNEXTADDRESS_FAILED";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";

export const getNextAddressAttempt = (accountNumber) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: GETNEXTADDRESS_ATTEMPT });
    return wallet
      .getNextAddress(sel.walletService(getState()), accountNumber)
      .then((res) => {
        res.accountNumber = accountNumber;
        dispatch({
          getNextAddressResponse: res,
          type: GETNEXTADDRESS_SUCCESS
        });
        resolve(res);
      })
      .catch((error) => {
        dispatch({ error, type: GETNEXTADDRESS_FAILED });
        reject(error);
      });
  });

export const GETNEXTCHANGEADDRESS_ATTEMPT = "GETNEXTCHANGEADDRESS_ATTEMPT";
export const GETNEXTCHANGEADDRESS_FAILED = "GETNEXTCHANGEADDRESS_FAILED";
export const GETNEXTCHANGEADDRESS_SUCCESS = "GETNEXTCHANGEADDRESS_SUCCESS";

export const getNextChangeAddressAttempt = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const changeAccount = sel.getChangeAccount(getState());
    dispatch({ type: GETNEXTCHANGEADDRESS_ATTEMPT });
    return wallet
      .getNextAddress(sel.walletService(getState()), changeAccount)
      .then((res) => {
        res.accountNumber = changeAccount;
        dispatch({
          getNextChangeAddressResponse: res,
          type: GETNEXTCHANGEADDRESS_SUCCESS
        });
        resolve(res);
      })
      .catch((error) => {
        dispatch({ error, type: GETNEXTCHANGEADDRESS_FAILED });
        reject(error);
      });
  });

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
  const request = { beginHash, beginHeight };
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({ request, type: RESCAN_ATTEMPT });
      const { walletService } = getState().grpc;
      const rescanCall = wallet.rescan(walletService, beginHeight, beginHash);
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

export const getNextAccountAttempt = (passphrase, accountName) => async (
  dispatch,
  getState
) => {
  dispatch({ type: GETNEXTACCOUNT_ATTEMPT });
  try {
    const getNextAccountResponse = await wallet.getNextAccount(
      sel.walletService(getState()),
      passphrase,
      accountName
    );
    const accountNumber = getNextAccountResponse.accountNumber;
    await dispatch(
      setAccountPassphrase(
        sel.walletService(getState()),
        accountNumber,
        null,
        passphrase,
        passphrase
      )
    );
    return dispatch({ getNextAccountResponse, type: GETNEXTACCOUNT_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETNEXTACCOUNT_FAILED });
    throw error;
  }
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
export const importScriptAttempt = (script) => async (dispatch, getState) => {
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
export const manualImportScriptAttempt = (script) => async (dispatch) => {
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
    .then(async (res) => {
      if (priv) {
        const oldAccounts = sel.balances(getState());
        await Promise.all(
          oldAccounts.map(async (acct) => {
            // just skip if imported account.
            if (acct.accountNumber >= Math.pow(2, 31) - 1) {
              return acct;
            }
            // we set the account passphrase as the wallet passphrase to avoid the user
            // ending with multiple passphrases.

            await dispatch(
              setAccountPassphrase(
                sel.walletService(getState()),
                acct.accountNumber,
                oldPass,
                newPass,
                null
              )
            );
            return acct;
          })
        );
      }
      dispatch({
        changePassphraseResponse: res,
        type: CHANGEPASSPHRASE_SUCCESS
      });
    })
    .catch((error) => dispatch({ error, type: CHANGEPASSPHRASE_FAILED }));
};

export const CLEARTX = "CLEARTX";

export const clearTransaction = () => ({ type: CLEARTX });

export const SIGNTX_ATTEMPT = "SIGNTX_ATTEMPT";
export const SIGNTX_FAILED = "SIGNTX_FAILED";
export const SIGNTX_SUCCESS = "SIGNTX_SUCCESS";

export const signTransactionAttempt = (passphrase, rawTx, acctNumber) => async (
  dispatch,
  getState
) => {
  dispatch({ type: SIGNTX_ATTEMPT });
  try {
    const signTransactionResponse = await dispatch(
      unlockAcctAndExecFn(passphrase, [acctNumber], () =>
        wallet.signTransaction(
          sel.walletService(getState()),
          sel.decodeMessageService(getState()),
          rawTx
        )
      )
    );

    dispatch({
      signTransactionResponse: signTransactionResponse,
      type: SIGNTX_SUCCESS
    });
    dispatch(publishTransactionAttempt(signTransactionResponse.transaction));
  } catch (error) {
    if (sel.isTestNet(getState()) === true) {
      wallet.log(
        "warn",
        "Sign Transaction Failed: " +
          JSON.stringify({
            error: error.message,
            passphrase,
            rawTx,
            acctNumber
          })
      );
    }
    dispatch({ error, type: SIGNTX_FAILED });
  }
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
          if (
            Buffer.from(out.script).equals(
              Buffer.from(changeScriptByAccount[account])
            )
          ) {
            return true;
          }
        });
        if (!foundScript) {
          newChangeScriptByAccount[account] = changeScriptByAccount[account];
        }
      });

      dispatch({
        hash: res.transactionHash,
        changeScriptByAccount: newChangeScriptByAccount,
        type: PUBLISHTX_SUCCESS
      });
    })
    .catch((error) => dispatch({ error, type: PUBLISHTX_FAILED }));
};

export const PURCHASETICKETS_ATTEMPT = "PURCHASETICKETS_ATTEMPT";
export const PURCHASETICKETS_FAILED = "PURCHASETICKETS_FAILED";
export const PURCHASETICKETS_SUCCESS = "PURCHASETICKETS_SUCCESS";
export const PURCHASETICKETS_SUCCESS_LESS = "PURCHASETICKETS_SUCCESS_LESS";
export const CREATE_UNSIGNEDTICKETS_SUCCESS = "CREATE_UNSIGNEDTICKETS_SUCCESS";

// TODO move purchaseTicketsAttempt to TransactionActions
export const purchaseTicketsAttempt = (
  passphrase,
  account,
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

    let purchaseTicketsResponse = null;
    let accountNum = null;
    // If we need to sign the tx, we re-import the script to ensure the
    // wallet will control the ticket. And unlock the wallet
    if (!dontSignTx) {
      const importScriptResponse = await dispatch(
        importScriptAttempt(stakepool.Script)
      );
      if (importScriptResponse.p2shAddress !== stakepool.TicketAddress) {
        throw new Error(
          "Trying to use a ticket address not corresponding to script"
        );
      }
      accountNum = account.encrypted ? account.value : null;
      // Since we are currently using the default account for the ticket's
      // voting address we also need to unlock that account in case we need
      // that as well during purchasing tickets.
      const accts = accountNum !== 0 ? [accountNum, 0] : [accountNum];
      purchaseTicketsResponse = await dispatch(
        unlockAcctAndExecFn(passphrase, accts, () =>
          wallet.purchaseTickets(
            walletService,
            account,
            spendLimit,
            requiredConf,
            numTickets,
            expiry,
            ticketFee,
            txFee,
            stakepool,
            !dontSignTx
          )
        )
      );
      if (dontSignTx) {
        return dispatch({
          purchaseTicketsResponse,
          type: CREATE_UNSIGNEDTICKETS_SUCCESS
        });
      }
    }
    dispatch({ purchaseTicketsResponse, type: PURCHASETICKETS_SUCCESS });
  } catch (error) {
    dispatch({ error, type: PURCHASETICKETS_FAILED });
  }
};

export const newPurchaseTicketsAttempt = (
  passphrase,
  account,
  numTickets,
  vsp
) => async (dispatch, getState) => {
  const walletService = sel.walletService(getState());
  try {
    const dontSignTx = sel.isWatchingOnly(getState());
    dispatch({ numTicketsToBuy: numTickets, type: PURCHASETICKETS_ATTEMPT });
    const csppReq = {
      mixedAccount: sel.getMixedAccount(getState()),
      changeAccount: sel.getChangeAccount(getState()),
      csppServer: sel.getCsppServer(getState()),
      csppPort: sel.getCsppPort(getState()),
      mixedAcctBranch: sel.getMixedAccountBranch(getState())
    };
    // Since we are currently using the default account for the ticket's
    // voting address we also need to unlock that account so communication
    // with the VSP may occur.
    const accts = account.value !== 0 ? [account.value, 0] : [account.value];
    const purchaseTicketsResponse = await dispatch(
      unlockAcctAndExecFn(passphrase, accts, async () => {
        // Since we're about to purchase a ticket, ensure on next startup we'll
        // process managed tickets.
        dispatch(setNeedsVSPdProcessTickets(true));

        const res = await wallet.purchaseTicketsV3(
          walletService,
          account,
          numTickets,
          !dontSignTx,
          vsp,
          csppReq
        );

        // Update the list of dcrwallet tracked VSP tickets. This figures out
        // which accounts need to be left unlocked.
        await dispatch(getVSPTrackedTickets());

        return res;
      })
    );
    if (dontSignTx) {
      return dispatch({
        purchaseTicketsResponse,
        type: CREATE_UNSIGNEDTICKETS_SUCCESS
      });
    }
    // save vsp for future checking if the wallet has all tickets synced.
    dispatch(updateUsedVSPs(vsp));
    const numBought = purchaseTicketsResponse.ticketHashes.length;
    if (numBought < numTickets) {
      dispatch({
        purchaseTicketsResponse,
        numAttempted: numTickets,
        type: PURCHASETICKETS_SUCCESS_LESS
      });
    } else {
      dispatch({ purchaseTicketsResponse, type: PURCHASETICKETS_SUCCESS });
    }
  } catch (error) {
    if (String(error).indexOf("insufficient balance") > 0) {
      const unspentOutputs = await dispatch(listUnspentOutputs(account.value));
      // we need at least one 2 utxo for each ticket, one for paying the fee
      // and another for the splitTx and ticket purchase.
      // Note: at least one of them needs to be big enough for ticket purchase.
      if (unspentOutputs.length < numTickets * 2) {
        // check if amount is indeed insufficient
        const ticketPrice = sel.ticketPrice(getState());
        if (account.spendable > ticketPrice * numTickets) {
          return dispatch({
            error: `Not enough utxo. Need to break the input so one can be reserved
            for paying the fee.`,
            type: PURCHASETICKETS_FAILED
          });
        }
      }
    }
    dispatch({ error, type: PURCHASETICKETS_FAILED });
  }
};

export const REVOKETICKETS_ATTEMPT = "REVOKETICKETS_ATTEMPT";
export const REVOKETICKETS_FAILED = "REVOKETICKETS_FAILED";
export const REVOKETICKETS_SUCCESS = "REVOKETICKETS_SUCCESS";

export const revokeTicketsAttempt = (passphrase) => async (
  dispatch,
  getState
) => {
  dispatch({ type: REVOKETICKETS_ATTEMPT });
  const walletService = sel.walletService(getState());
  try {
    const revokeTicketsResponse = await dispatch(
      unlockAllAcctAndExecFn(passphrase, () =>
        wallet.revokeTickets(walletService)
      )
    );
    dispatch({ revokeTicketsResponse, type: REVOKETICKETS_SUCCESS });
    setTimeout(() => {
      dispatch(getStakeInfoAttempt());
    }, 4000);
  } catch (error) {
    dispatch({ error, type: REVOKETICKETS_FAILED });
  }
};

export const REVOKETICKET_ATTEMPT = "REVOKETICKET_ATTEMPT";
export const REVOKETICKET_FAILED = "REVOKETICKET_FAILED";
export const REVOKETICKET_SUCCESS = "REVOKETICKET_SUCCESS";

export const revokeTicketAttempt = (passphrase, ticketHash) => async (
  dispatch,
  getState
) => {
  dispatch({ type: REVOKETICKET_ATTEMPT });
  const walletService = sel.walletService(getState());
  try {
    const revokeTicketResponse = await dispatch(
      unlockAllAcctAndExecFn(passphrase, () =>
        wallet.revokeTicket(walletService, ticketHash)
      )
    );
    dispatch({ revokeTicketResponse, type: REVOKETICKET_SUCCESS });
    setTimeout(() => {
      dispatch(getStakeInfoAttempt());
    }, 4000);
  } catch (error) {
    dispatch({ error, type: REVOKETICKET_FAILED });
  }
};

export const DISCOVERUSAGE_ATTEMPT = "DISCOVERUSAGE_ATTEMPT";
export const DISCOVERUSAGE_FAILED = "DISCOVERUSAGE_FAILED";
export const DISCOVERUSAGE_SUCCESS = "DISCOVERUSAGE_SUCCESS";

export const discoverUsageAttempt = (gapLimit) => async (
  dispatch,
  getState
) => {
  dispatch({ type: DISCOVERUSAGE_ATTEMPT });
  const walletService = sel.walletService(getState());
  try {
    const discoverUsageResponse = await wallet.discoverUsage(
      walletService,
      gapLimit
    );
    dispatch({ discoverUsageResponse, type: DISCOVERUSAGE_SUCCESS });
    await wallet.loadActiveDataFilters(walletService);
    dispatch(rescanAttempt(0));
  } catch (error) {
    dispatch({ error, type: DISCOVERUSAGE_FAILED });
  }
};

export const STARTTICKETBUYERV3_ATTEMPT = "STARTTICKETBUYERV3_ATTEMPT";
export const STARTTICKETBUYERV3_FAILED = "STARTTICKETBUYERV3_FAILED";
export const STARTTICKETBUYERV3_SUCCESS = "STARTTICKETBUYERV3_SUCCESS";

export const STOPTICKETBUYER_ATTEMPT = "STOPTICKETBUYER_ATTEMPT";
export const STOPTICKETBUYER_FAILED = "STOPTICKETBUYER_FAILED";
export const STOPTICKETBUYER_SUCCESS = "STOPTICKETBUYER_SUCCESS";

export const startTicketBuyerV3Attempt = (
  passphrase,
  account,
  balanceToMaintain,
  vsp
) => async (dispatch, getState) => {
  const mixedAccount = sel.getMixedAccount(getState());
  const changeAccount = sel.getChangeAccount(getState());
  const csppServer = sel.getCsppServer(getState());
  const csppPort = sel.getCsppPort(getState());
  const mixedAcctBranch = sel.getMixedAccountBranch(getState());
  const ticketBuyerConfig = { vsp, balanceToMaintain, account };

  const { ticketBuyerService } = getState().grpc;
  dispatch({ ticketBuyerConfig, type: STARTTICKETBUYERV3_ATTEMPT });

  try {
    const accountNum = account.encrypted ? account.value : null;
    const accountUnlocks = mixedAccount
      ? [accountNum, changeAccount]
      : [accountNum];
    const ticketBuyer = await dispatch(
      unlockAcctAndExecFn(
        passphrase,
        accountUnlocks,
        () => {
          dispatch(setNeedsVSPdProcessTickets(true));
          return wallet.startTicketAutoBuyerV3(ticketBuyerService, {
            mixedAccount,
            mixedAcctBranch,
            changeAccount,
            csppServer,
            csppPort,
            balanceToMaintain,
            accountNum,
            pubkey: vsp.pubkey,
            host: vsp.host
          });
        },
        true
      )
    );
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
          dispatch({ error: status, type: STARTTICKETBUYERV3_FAILED });
        }
      } else {
        dispatch({ type: STOPTICKETBUYER_SUCCESS });
      }
    });
    // update used vsps
    dispatch(updateUsedVSPs(vsp));
    dispatch({
      ticketBuyerCall: ticketBuyer,
      vsp,
      balanceToMaintain,
      account,
      type: STARTTICKETBUYERV3_SUCCESS
    });
    return ticketBuyer;
  } catch (error) {
    dispatch({ error, type: STARTTICKETBUYERV3_FAILED });
  }
};

export function ticketBuyerCancel() {
  return async (dispatch, getState) => {
    const { ticketBuyerCall, account } = getState().vsp;
    if (!ticketBuyerCall) return;
    if (ticketBuyerCall) {
      ticketBuyerCall.cancel();
      dispatch({ type: STOPTICKETBUYER_ATTEMPT });
      const acctNumber = account.encrypted ? account.value : null;
      await dispatch(lockAccount(acctNumber));
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
) => async (dispatch, getState) => {
  const { constructTxRequestAttempt } = getState().control;
  if (constructTxRequestAttempt) {
    return;
  }

  // Determine the change address.
  let change;
  if (!all) {
    // If there's a previously stored change address for this account, use it.
    // This alleviates a possible gap limit address exhaustion. See
    // issue dcrwallet#1622.
    const changeScript =
      getState().control.changeScriptByAccount[account] || null;
    if (changeScript) {
      change = { script: changeScript };
    } else {
      // set change destination. If it is a privacy wallet we get the
      // next unmixed address.
      // Otherwise, we can left it empty and it will be filled by dcrwallet.
      const mixAcct = sel.getMixedAccount(getState());
      const unmixedAcct = sel.getChangeAccount(getState());
      if (unmixedAcct && account === mixAcct) {
        if (!mixAcct) {
          return (dispatch) => {
            const error = "unmixed account set but no mix account found.";
            dispatch({ error, type: CONSTRUCTTX_FAILED });
          };
        }
        await dispatch(getNextChangeAddressAttempt());
        const newChangeAddress = sel.nextChangeAddress(getState());
        change = { address: newChangeAddress };
      }
    }
  }

  const chainParams = sel.chainParams(getState());
  const { walletService } = getState().grpc;

  dispatch({ type: CONSTRUCTTX_ATTEMPT, constructTxRequestAttempt: true });
  try {
    const constructFunc = all
      ? wallet.constructSendAllTransaction
      : wallet.constructTransaction;
    const constructTxResponse = await constructFunc(
      walletService,
      account,
      confirmations,
      outputs,
      change
    );

    const changeScriptByAccount =
      getState().control.changeScriptByAccount || {};

    if (!all) {
      // Store the change address we just generated so that future changes to
      // the tx being constructed will use the same address and prevent gap
      // limit exhaustion (see above note on issue dcrwallet#1622).
      const changeIndex = constructTxResponse.changeIndex;
      if (changeIndex > -1) {
        const rawTx = Buffer.from(
          constructTxResponse.unsignedTransaction,
          "hex"
        );
        const decoded = wallet.decodeRawTransaction(rawTx, chainParams);
        changeScriptByAccount[account] = decoded.outputs[changeIndex].script;
      }
    }

    constructTxResponse.rawTx = rawToHex(
      constructTxResponse.unsignedTransaction
    );

    dispatch({
      constructTxResponse: constructTxResponse,
      changeScriptByAccount,
      type: CONSTRUCTTX_SUCCESS
    });
  } catch (error) {
    if (String(error).indexOf("insufficient balance") > 0) {
      dispatch({ error, type: CONSTRUCTTX_FAILED_LOW_BALANCE });
    } else if (
      String(error).indexOf("violates the unused address gap limit policy") > 0
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
  }
};

export const VALIDATEADDRESS_CLEANSTORE = "VALIDATEADDRESS_CLEANSTORE";

export const validateAddress = (address) => async (dispatch, getState) => {
  try {
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;
    const validationErr = isValidAddress(address, network);
    if (validationErr) {
      return {
        isValid: false,
        error: validationErr,
        getIsValid() {
          return false;
        }
      };
    }
    const response = await wallet.validateAddress(
      sel.walletService(getState()),
      address
    );
    return {
      ...response,
      error: null
    };
  } catch (error) {
    return {
      isValid: false,
      error
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

export const SIGNMESSAGE_ATTEMPT = "SIGNMESSAGE_ATTEMPT";
export const SIGNMESSAGE_FAILED = "SIGNMESSAGE_FAILED";
export const SIGNMESSAGE_SUCCESS = "SIGNMESSAGE_SUCCESS";
export const SIGNMESSAGE_CLEANSTORE = "SIGNMESSAGE_CLEANSTORE";

export const signMessageAttempt = (address, message, passphrase) => async (
  dispatch,
  getState
) => {
  dispatch({ type: SIGNMESSAGE_ATTEMPT });
  try {
    const response = await wallet.validateAddress(
      sel.walletService(getState()),
      address
    );
    const accountNumber = response.accountNumber;
    const getSignMessageResponse = await dispatch(
      unlockAcctAndExecFn(passphrase, [accountNumber], () =>
        wallet.signMessage(sel.walletService(getState()), address, message)
      )
    );
    // Originally, signatures were presented as base64 encoded, so convert
    // from hex to base64.
    const sig = Buffer.from(getSignMessageResponse.signature, "hex").toString(
      "base64"
    );
    dispatch({
      getSignMessageSignature: sig,
      type: SIGNMESSAGE_SUCCESS
    });
    return sig;
  } catch (error) {
    dispatch({ error, type: SIGNMESSAGE_FAILED });
  }
};

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

export const MODAL_VISIBLE = "MODAL_SHOWN";
export const modalVisible = () => (dispatch) =>
  dispatch({ type: MODAL_VISIBLE });

export const MODAL_HIDDEN = "MODAL_HIDDEN";
export const modalHidden = () => (dispatch) => dispatch({ type: MODAL_HIDDEN });

export const SHOW_ABOUT_MODAL_MACOS = "SHOW_ABOUT_MODAL_MACOS";
export const showAboutModalMacOS = () => (dispatch) =>
  dispatch({ type: SHOW_ABOUT_MODAL_MACOS });

export const HIDE_ABOUT_MODAL_MACOS = "HIDE_ABOUT_MODAL_MACOS";
export const hideAboutModalMacOS = () => (dispatch) =>
  dispatch({ type: HIDE_ABOUT_MODAL_MACOS });

export const SHOW_CANTCLOSE_MODAL = "SHOW_CANTCLOSE_MODAL";
export const showCantCloseModal = () => (dispatch) => {
  dispatch({ type: SHOW_CANTCLOSE_MODAL });
};

export const HIDE_CANTCLOSE_MODAL = "HIDE_CANTCLOSE_MODAL";
export const hideCantCloseModal = () => (dispatch) =>
  dispatch({ type: HIDE_CANTCLOSE_MODAL });

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

// LEGACY CODE
// this can be removed after stopping support for vsp v1 and v2.
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
) => async (dispatch, getState) => {
  const ticketBuyerConfig = { stakepool, balanceToMaintain, account };
  dispatch({ ticketBuyerConfig, type: STARTTICKETBUYERV2_ATTEMPT });
  try {
    const request = {
      balanceToMaintain,
      account: account.value,
      votingAccount: account.value,
      votingAddress: stakepool.TicketAddress
    };
    const { ticketBuyerService } = getState().grpc;
    const ticketBuyer = await dispatch(
      unlockAcctAndExecFn(passphrase, [account.value], () =>
        wallet.startTicketAutoBuyerV2(ticketBuyerService, request)
      )
    );
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
      ticketBuyerAcct: account,
      type: STARTTICKETBUYERV2_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: STARTTICKETBUYERV2_FAILED });
  }
};

export function ticketBuyerV2Cancel() {
  return async (dispatch, getState) => {
    const { ticketBuyerCall, ticketBuyerAcct } = getState().control;
    if (!ticketBuyerCall) return;
    if (ticketBuyerCall) {
      dispatch({ type: STOPTICKETBUYERV2_ATTEMPT });
      ticketBuyerCall.cancel();
      const acctNumber = ticketBuyerAcct.encrypted
        ? ticketBuyerAcct.value
        : null;
      await dispatch(lockAccount(acctNumber));
    }
  };
}

export const GETPEERINFO_ATTEMPT = "GETPEERINFO_ATTEMPT";
export const GETPEERINFO_FAILED = "GETPEERINFO_FAILED";
export const GETPEERINFO_SUCCESS = "GETPEERINFO_SUCCESS";

export const getPeerInfo = () => (dispatch, getState) => {
  dispatch({ type: GETPEERINFO_ATTEMPT });
  return wallet
    .getPeerInfo(getState().grpc.walletService)
    .then((resp) => {
      const peersCount = resp.peerInfoList.length;
      dispatch({ type: GETPEERINFO_SUCCESS, peersCount });
    })
    .catch((error) => dispatch({ type: GETPEERINFO_FAILED, error }));
};

export const SAVE_LEGACY_AUTOBUYER_SETTINGS = "SAVE_LEGACY_AUTOBUYER_SETTINGS ";
export const saveLegacyAutoBuyerSettings = ({
  balanceToMaintain,
  account,
  vsp
}) => (dispatch) => {
  dispatch({
    type: SAVE_LEGACY_AUTOBUYER_SETTINGS,
    balanceToMaintain,
    account,
    vsp
  });
};

export const SETACCOUNTPASSPHRASE_ATTEMPT = "SETACCOUNTPASSPHRASE_ATTEMPT";
export const SETACCOUNTPASSPHRASE_FAILED = "SETACCOUNTPASSPHRASE_FAILED";
export const SETACCOUNTPASSPHRASE_SUCCESS = "SETACCOUNTPASSPHRASE_SUCCESS";

const setAccountPassphrase = (
  walletService,
  accountNumber,
  accountPassphrase,
  newAcctPassphrase,
  walletPassphrase
) => async (dispatch, getState) => {
  try {
    dispatch({ type: SETACCOUNTPASSPHRASE_ATTEMPT });
    await wallet.setAccountPassphrase(
      walletService,
      accountNumber,
      accountPassphrase,
      newAcctPassphrase,
      walletPassphrase
    );
    const accounts = sel.balances(getState());
    const acct = accounts.find((acct) => acct.accountNumber === accountNumber);
    acct.encrypted = true;
    acct.locked = true;
    return dispatch({ type: SETACCOUNTPASSPHRASE_SUCCESS, accounts });
  } catch (error) {
    dispatch({ type: SETACCOUNTPASSPHRASE_FAILED, error });
    throw error;
  }
};

export const SETACCOUNTSPASSPHRASE_ATTEMPT = "SETACCOUNTSPASSPHRASE_ATTEMPT";
export const SETACCOUNTSPASSPHRASE_FAILED = "SETACCOUNTSPASSPHRASE_FAILED";
export const SETACCOUNTSPASSPHRASE_SUCCESS = "SETACCOUNTSPASSPHRASE_SUCCESS";

export const setAccountsPass = (walletPassphrase) => async (
  dispatch,
  getState
) => {
  dispatch({ type: SETACCOUNTSPASSPHRASE_ATTEMPT });
  try {
    const oldAccounts = sel.balances(getState());
    const accounts = await Promise.all(
      oldAccounts.map(async (acct) => {
        // just skip if imported account.
        if (acct.accountNumber === Math.pow(2, 31) - 1) {
          return acct;
        }
        // we set the account passphrase as the wallet passphrase to avoid the user
        // ending with multiple passphrases.

        await dispatch(
          setAccountPassphrase(
            sel.walletService(getState()),
            acct.accountNumber,
            null,
            walletPassphrase,
            walletPassphrase
          )
        );
        return acct;
      })
    );
    return dispatch({ type: SETACCOUNTSPASSPHRASE_SUCCESS, accounts });
  } catch (error) {
    dispatch({ error, type: SETACCOUNTSPASSPHRASE_FAILED });
    throw error;
  }
};

// unlock
export const UNLOCKACCOUNT_ATTEMPT = "UNLOCKACCOUNT_ATTEMPT";
export const UNLOCKACCOUNT_FAILED = "UNLOCKACCOUNT_FAILED";
export const UNLOCKACCOUNT_SUCCESS = "UNLOCKACCOUNT_SUCCESS";
// lock
export const LOCKACCOUNT_ATTEMPT = "LOCKACCOUNT_ATTEMPT";
export const LOCKACCOUNT_FAILED = "LOCKACCOUNT_FAILED";
export const LOCKACCOUNT_SUCCESS = "LOCKACCOUNT_SUCCESS";

// These events track whether unlockAcctAndExecFn is currently running.
export const UNLOCKANDEXECFN_ATTEMPT = "UNLOCKANDEXECFN_ATTEMPT";
export const UNLOCKANDEXECFN_FAILED = "UNLOCKANDEXECFN_FAILED";
export const UNLOCKANDEXECFN_SUCCESS = "UNLOCKANDEXECFN_SUCCESS";

// filterUnlockableAccounts returns a subset of the given array of account
// numbers, excluding those that shouldn't be locked.
const filterUnlockableAccounts = (accts, getState) => {
  const accounts = sel.balances(getState());

  // Track list of unlockable accounts.
  const unlockableAccts = {};
  const setUnlockable = (acctNb) => (unlockableAccts[parseInt(acctNb)] = true);

  // Do not allow locking of the dex account, as it isn't supposed to lock.
  const dexAccountName = sel.dexAccount(getState());
  const dexAccount = accounts.find(
    (acct) => acct.accountName === dexAccountName
  );
  dexAccount && setUnlockable(dexAccount.accountNumber);

  // Do not allow locking of the mixed and change account or ticket buyer account
  // while they are running.
  if (sel.getRunningIndicator(getState())) {
    const mixedAcct = sel.getMixedAccount(getState());
    const unmixedAcct = sel.getChangeAccount(getState());
    const ticketBuyerAccount = sel.getVSPTicketBuyerAccount(getState());
    const legacyTicketBuyerCfg = sel.ticketBuyerConfig(getState());
    isNumber(mixedAcct) && setUnlockable(mixedAcct);
    isNumber(unmixedAcct) && setUnlockable(unmixedAcct);
    isNumber(ticketBuyerAccount?.value) &&
      setUnlockable(ticketBuyerAccount?.value);
    isNumber(legacyTicketBuyerCfg?.account?.value) &&
      setUnlockable(legacyTicketBuyerCfg?.account?.value);
  }

  // Do not allow locking of accounts for which there are tickets with
  // outstanding fee payments to be done. The dcrwallet VSP client needs them
  // unlocked to be able to do its job.
  const ticketAcctNbs = sel.getVSPTrackedTicketsCommitAccounts(getState());
  ticketAcctNbs.forEach(setUnlockable);

  // Return the filtered set of accounts.
  return accts.filter((acctNumber) => !unlockableAccts[acctNumber]);
};

// unlockAcctAndExecFn unlocks the account and performs some action. Locks the
// account in case of success or error, if leaveUnlock is not informed.
export const unlockAcctAndExecFn = (
  passphrase,
  accts,
  fn,
  leaveUnlock
) => async (dispatch, getState) => {
  let res = null;
  let fnError = null;
  const walletService = sel.walletService(getState());
  const accounts = sel.balances(getState());

  // Verify all accounts that will be unlocked exist and are encrypted with an
  // individual passphrase.
  accts.forEach((acctNum) => {
    const account = accounts.find((acct) => acct.accountNumber === acctNum);
    if (!account) {
      throw "Account not found";
    }
    if (!account.encrypted) {
      throw "Account not encrypted";
    }
  });

  // Helper function to relock the needed accounts.
  const relockAccounts = async () => {
    try {
      const lockableAccts = filterUnlockableAccounts(accts, getState);
      await Promise.all(
        lockableAccts.map((acctNumber) =>
          wallet.lockAccount(walletService, acctNumber)
        )
      );
    } catch (error) {
      console.error("Unable to re-lock accounts", error);
      throw error;
    }
  };

  // Unlock all needed accounts.
  dispatch({ type: UNLOCKANDEXECFN_ATTEMPT });
  dispatch({ type: UNLOCKACCOUNT_ATTEMPT });
  try {
    await Promise.all(
      accts.map((acctNumber) =>
        wallet.unlockAccount(walletService, passphrase, acctNumber)
      )
    );
    dispatch({ type: UNLOCKACCOUNT_SUCCESS });
  } catch (error) {
    try {
      await relockAccounts();
    } catch (error) {
      dispatch({ type: LOCKACCOUNT_FAILED, error });
    }
    dispatch({ type: UNLOCKACCOUNT_FAILED, error });
    dispatch({ type: UNLOCKANDEXECFN_FAILED, error });
    throw error;
  }

  // execute method
  try {
    res = await fn();
  } catch (error) {
    fnError = error;
  }

  if (leaveUnlock) {
    if (fnError) {
      dispatch({ type: UNLOCKANDEXECFN_FAILED, error: fnError });
      throw fnError;
    }
    dispatch({ type: UNLOCKANDEXECFN_SUCCESS, leaveUnlock });
    return res;
  }

  // lock account
  try {
    await relockAccounts();
    dispatch({ type: LOCKACCOUNT_SUCCESS });
  } catch (error) {
    // no need to lock as unlock errored.
    dispatch({ type: LOCKACCOUNT_FAILED, error });
    dispatch({ type: UNLOCKANDEXECFN_FAILED, error });
    throw error;
  }

  // return fn error in case some happened.
  if (fnError !== null) {
    dispatch({ type: UNLOCKANDEXECFN_FAILED, error: fnError });
    throw fnError;
  }

  dispatch({ type: UNLOCKANDEXECFN_SUCCESS, leaveUnlock });
  return res;
};

// unlockAllAcctAndExecFn unlocks all accounts and performs some action. Then
// locks all accounts that were unlocked.  Dex account is never relocked.
export const unlockAllAcctAndExecFn = (passphrase, fn, leaveUnlock) => (
  dispatch,
  getState
) => {
  const unlockable = sel
    .unlockableAccounts(getState())
    .map((acct) => acct.accountNumber);
  return dispatch(unlockAcctAndExecFn(passphrase, unlockable, fn, leaveUnlock));
};

export const lockAccount = (acctNumber) => async (dispatch, getState) => {
  dispatch({ type: LOCKACCOUNT_ATTEMPT });
  try {
    const accounts = sel.balances(getState());
    const account = accounts.find((acct) => acct.accountNumber === acctNumber);
    if (!account) {
      throw "Account not found";
    }
    if (!account.encrypted) {
      throw "Account not encrypted";
    }
    const lockable = filterUnlockableAccounts([acctNumber], getState);
    if (lockable.length === 0) return;
    await wallet.lockAccount(sel.walletService(getState()), lockable[0]);
    dispatch({ type: LOCKACCOUNT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOCKACCOUNT_FAILED, error });
  }
};

export const checkAllAccountsEncrypted = () => (dispatch, getState) => {
  const { balances } = getState().grpc;
  if (!balances) return;
  let allEncrypted = true;
  balances.forEach((acct) => {
    // imported account can be skipped.
    if (acct.accountNumber === Math.pow(2, 31) - 1) {
      return;
    }
    if (!acct.encrypted) {
      allEncrypted = false;
      return;
    }
  });

  return allEncrypted;
};

export const MONITORLOCKACBLEACCOUNTS_STARTED =
  "MONITORLOCKACBLEACCOUNTS_STARTED";
export const MONITORLOCKACBLEACCOUNTS_STOPPED =
  "MONITORLOCKACBLEACCOUNTS_STOPPED";

// monitorLockableAccounts monitors when changes happen in the app state that
// allow locking some wallet accounts.
export const monitorLockableAccounts = () => (dispatch, getState) => {
  const checkFunc = async () => {
    // Check if the lst of VSP tracked ticket accounts changed and lock any
    // accounts that are no longer needed.
    const oldTicketAccounts = sel.getVSPTrackedTicketsCommitAccounts(
      getState()
    );
    await dispatch(getVSPTrackedTickets());
    const newTicketAccounts = sel.getVSPTrackedTicketsCommitAccounts(
      getState()
    );
    const toLockAccts = oldTicketAccounts.filter(
      (acct) => !(acct in newTicketAccounts)
    );

    // Don't attempt to relock if there's a function running that depends on
    // unlocked accounts.
    if (getState().control.unlockAndExecFnRunning) return;

    // If there are no more tickets being tracked (meaning all were confirmed)
    // and we didn't skip the initial ProcessManagedTickets page and the
    // autobuyer isn't running, disable running processManagedTickets on the
    //  next wallet execution.
    const canDisableProcessManaged = sel.canDisableProcessManaged(getState());
    const getRunningIndicator = sel.getRunningIndicator(getState());
    if (
      newTicketAccounts.length === 0 &&
      canDisableProcessManaged &&
      !getRunningIndicator
    ) {
      dispatch(setNeedsVSPdProcessTickets(false));
    }

    // Attempt to relock all accounts that can now be locked.
    const lockable = filterUnlockableAccounts(toLockAccts, getState);
    if (lockable.length === 0) return;
    const walletService = sel.walletService(getState());
    dispatch({ type: LOCKACCOUNT_ATTEMPT, accounts: lockable });
    try {
      await Promise.all(
        lockable.map(async (acctNumber) => {
          try {
            await wallet.lockAccount(walletService, acctNumber);
          } catch (error) {
            // Only throw locking error if it's not due to account already locked.
            if (String(error).indexOf("account is already locked") === -1) {
              throw error;
            }
          }
        })
      );
      dispatch({ type: LOCKACCOUNT_SUCCESS, accounts: lockable });
    } catch (error) {
      console.error("Unable to re-lock accounts", error);
      dispatch({ type: LOCKACCOUNT_FAILED, error });
    }
  };

  const timer = setInterval(checkFunc, 30 * 1000);
  dispatch({ timer, type: MONITORLOCKACBLEACCOUNTS_STARTED });
};

export const stopMonitorLockableAccounts = () => (dispatch, getState) => {
  const { monitorLockableAccountsTimer } = getState().control;
  monitorLockableAccountsTimer && clearInterval(monitorLockableAccountsTimer);
  dispatch({ type: MONITORLOCKACBLEACCOUNTS_STOPPED });
};

export const CONFIRMATIONDIALOG_REQUESTED = "CONFIRMATIONDIALOG_REQUESTED";
export const CONFIRMATIONDIALOG_HIDDEN = "CONFIRMATIONDIALOG_HIDDEN";

export const listenForConfirmationDialogRequests = () => (dispatch) => {
  const requestedCb = () => dispatch({ type: CONFIRMATIONDIALOG_REQUESTED });
  const hiddenCb = () => dispatch({ type: CONFIRMATIONDIALOG_HIDDEN });
  wallet.onConfirmationDialogCallbacks(requestedCb, hiddenCb);
};

export const SET_PAGEBODY_SCROLLHANDLER = "SET_PAGEBODY_SCROLLHANDLER";
export const setPageBodyScrollHandler = (scrollHandler) => (dispatch) =>
  dispatch({ scrollHandler, type: SET_PAGEBODY_SCROLLHANDLER });

export const SET_PAGEBODY_TOP_REF = "SET_PAGEBODY_TOP_REF";
export const setPageBodyRef = (ref) => (dispatch) =>
  dispatch({ ref, type: SET_PAGEBODY_TOP_REF });
