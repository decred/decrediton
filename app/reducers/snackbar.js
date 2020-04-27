/* eslint-disable no-fallthrough */
// we disable no-fallthrough rule in this file to simplify the select/case below.
import * as wallet from "wallet";
import { defineMessages } from "react-intl";
import {
  DECODERAWTXS_FAILED
} from "../actions/DecodeMessageActions";
import {
  PUBLISHTX_FAILED,
  SIGNTX_FAILED, CONSTRUCTTX_FAILED,
  PURCHASETICKETS_SUCCESS, PURCHASETICKETS_FAILED,
  STARTTICKETBUYERV2_SUCCESS, STARTTICKETBUYERV2_FAILED,
  STOPTICKETBUYERV2_SUCCESS,
  REVOKETICKETS_SUCCESS, REVOKETICKETS_FAILED,
  IMPORTSCRIPT_MANUAL_SUCCESS, IMPORTSCRIPT_MANUAL_FAILED,
  RENAMEACCOUNT_SUCCESS, RENAMEACCOUNT_FAILED,
  GETNEXTACCOUNT_SUCCESS, GETNEXTACCOUNT_FAILED,
  CHANGEPASSPHRASE_SUCCESS, CHANGEPASSPHRASE_FAILED,
  SIGNMESSAGE_FAILED, VERIFYMESSAGE_FAILED,
  PUBLISHUNMINEDTRANSACTIONS_SUCCESS, PUBLISHUNMINEDTRANSACTIONS_FAILED,
  GETACCOUNTEXTENDEDKEY_FAILED
} from "../actions/ControlActions";
import {
  UPDATESTAKEPOOLCONFIG_SUCCESS, UPDATESTAKEPOOLCONFIG_FAILED,
  SETSTAKEPOOLVOTECHOICES_FAILED,
  REMOVESTAKEPOOLCONFIG,
  ADDCUSTOMSTAKEPOOL_SUCCESS, ADDCUSTOMSTAKEPOOL_FAILED,
  REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED
} from "../actions/StakePoolActions";
import {
  ABANDONTRANSACTION_SUCCESS, ABANDONTRANSACTION_FAILED,
  NEW_TRANSACTIONS_RECEIVED,
  GETSTARTUPWALLETINFO_FAILED,
  SEEDCOPIEDTOCLIPBOARD
} from "../actions/ClientActions";
import { SNACKBAR_DISMISS_MESSAGES, SNACKBAR_SIMPLE_MESSAGE } from "../actions/SnackbarActions";
import {
  EXPORT_ERROR,
  EXPORT_COMPLETED,
  GETSTARTUPSTATS_FAILED,
  GETMYTICKETSSTATS_FAILED
} from "actions/StatisticsActions";
import { WALLETREMOVED_FAILED, CONNECTDAEMON_FAILURE } from "actions/DaemonActions";
import {
  GETWALLETSEEDSVC_FAILED,
  SPVSYNC_FAILED
} from "actions/WalletLoaderActions";
import {
  TRZ_TOGGLEPINPROTECTION_SUCCESS, TRZ_TOGGLEPINPROTECTION_FAILED,
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS, TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED,
  TRZ_CHANGEHOMESCREEN_SUCCESS, TRZ_CHANGEHOMESCREEN_FAILED,
  TRZ_CHANGELABEL_SUCCESS, TRZ_CHANGELABEL_FAILED,
  TRZ_WIPEDEVICE_SUCCESS, TRZ_WIPEDEVICE_FAILED,
  TRZ_RECOVERDEVICE_SUCCESS, TRZ_RECOVERDEVICE_FAILED,
  TRZ_INITDEVICE_SUCCESS, TRZ_INITDEVICE_FAILED,
  TRZ_UPDATEFIRMWARE_SUCCESS, TRZ_UPDATEFIRMWARE_FAILED,
  TRZ_NOCONNECTEDDEVICE,
  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED
} from "actions/TrezorActions";

import {
  GETACTIVEVOTE_FAILED, GETVETTED_FAILED, GETPROPOSAL_FAILED,
  UPDATEVOTECHOICE_SUCCESS, UPDATEVOTECHOICE_FAILED,
  GETVETTED_UPDATEDVOTERESULTS_FAILED
} from "actions/GovernanceActions";

import {
  LNWALLET_CONNECT_FAILED,
  LNWALLET_INVOICE_SETTLED,
  LNWALLET_SENDPAYMENT_FAILED, LNWALLET_SENDPAYMENT_SUCCESS,
  LNWALLET_OPENCHANNEL_CHANPENDING, LNWALLET_OPENCHANNEL_CHANOPEN,
  LNWALLET_OPENCHANNEL_FAILED,
  LNWALLET_CLOSECHANNEL_CLOSEPENDING, LNWALLET_CLOSECHANNEL_CHANCLOSE,
  LNWALLET_CLOSECHANNEL_FAILED,
  LNWALLET_FUNDWALLET_FAILED, LNWALLET_WITHDRAWWALLET_FAILED,
  LNWALLET_FUNDWALLET_SUCCESS, LNWALLET_WITHDRAWWALLET_SUCCESS,
  LNWALLET_STARTDCRLND_FAILED
} from "actions/LNActions";

const WRONG_PASSPHRASE_MSG = "WRONG_PASSPHRASE_MSG";
const ERROR_IS_OBJECT = "ERROR_IS_OBJECT";

const messages = defineMessages({
  defaultSuccessMessage: {
    id: "snackbar.defaults.success",
    defaultMessage: "Success!"
  },
  defaultErrorMessage: {
    id: "snackbar.defaults.error",
    defaultMessage: "{originalError}"
  },
  WALLETREMOVED_FAILED: {
    id: "createwallet.errors.walletRemoveFailed",
    defaultMessage: "{originalError}"
  },
  PUBLISHTX_FAILED: {
    id: "send.errors.publishTxFailed",
    defaultMessage: "{originalError}"
  },
  ABANDONTRANSACTION_SUCCESS: {
    id: "send.errors.abandonTxSuccess",
    defaultMessage: "Transaction successfully abandoned!"
  },
  ABANDONTRANSACTION_FAILED: {
    id: "send.errors.abandonTxFailed",
    defaultMessage: "{originalError}"
  },
  SIGNTX_FAILED: {
    id: "send.errors.signTxFailed",
    defaultMessage: "{originalError}"
  },
  CONSTRUCTTX_FAILED: {
    id: "send.errors.constructTxFailed",
    defaultMessage: "{originalError}"
  },
  VALIDATEADDRESS_FAILED: {
    id: "send.errors.validateAddressFailed",
    defaultMessage: "{originalError}"
  },
  PURCHASETICKETS_SUCCESS: {
    id: "tickets.purchaseTicketsHeader",
    defaultMessage: "You bought {numTickets, plural, one { # ticket } other { # tickets }}"
  },
  PURCHASETICKETS_FAILED: {
    id: "tickets.errors.purchaseTicketsFailed",
    defaultMessage: "{originalError}"
  },
  REVOKETICKETS_SUCCESS: {
    id: "tickets.revokeTicketsHeader",
    defaultMessage: "You successfully revoked tickets"
  },
  REVOKETICKETS_FAILED: {
    id: "tickets.errors.revokeTicketsFailed",
    defaultMessage: "{originalError}"
  },
  IMPORTSCRIPT_MANUAL_SUCCESS: {
    id: "tickets.importScriptHeader",
    defaultMessage: "You successfully imported a script"
  },
  IMPORTSCRIPT_MANUAL_FAILED: {
    id: "tickets.errors.importScriptFailed",
    defaultMessage: "{originalError}"
  },
  STARTAUTOBUYER_SUCCESS: {
    id: "tickets.startAutoBuyerHeader",
    defaultMessage: "Ticket buyer is now running."
  },
  STARTAUTOBUYER_FAILED: {
    id: "tickets.errors.startAutoBuyerFailed",
    defaultMessage: "{originalError}"
  },
  STOPAUTOBUYER_SUCCESS: {
    id: "tickets.stopAutoBuyerHeader",
    defaultMessage: "Ticket buyer is now stopped."
  },
  UPDATESTAKEPOOLCONFIG_SUCCESS: {
    id: "tickets.updateStakePoolConfigHeader",
    defaultMessage: "You have successfully updated your stakepool settings."
  },
  UPDATESTAKEPOOLCONFIG_FAILED: {
    id: "tickets.errors.updateStakePoolConfigFailed",
    defaultMessage: "{originalError}"
  },
  REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED: {
    id: "tickets.errors.refreshStakePoolInfo",
    defaultMessage: "Error refreshing stakepool data from {host}: {originalError}"
  },
  SETSTAKEPOOLVOTECHOICES_FAILED: {
    id: "tickets.errors.setStakePoolVoteChoicesFailed",
    defaultMessage: "{originalError}"
  },
  RENAMEACCOUNT_SUCCESS: {
    id: "accounts.renameAccount",
    defaultMessage: "Successfully renamed account."
  },
  RENAMEACCOUNT_FAILED:{
    id: "accounts.errors.renameAccountFailed",
    defaultMessage: "{originalError}"
  },
  GETNEXTACCOUNT_SUCCESS:{
    id: "accounts.nextAccount",
    defaultMessage: "Successfully created a new account."
  },
  GETNEXTACCOUNT_FAILED:{
    id: "accounts.errors.getNextAccountFailed",
    defaultMessage: "{originalError}"
  },
  CHANGEPASSPHRASE_SUCCESS:{
    id: "settings.changePassphrase",
    defaultMessage: "Successfully changed private passphrase."
  },
  CHANGEPASSPHRASE_FAILED: {
    id: "settings.errors.changePassphraseFailed",
    defaultMessage: "Update passphrase failed. Incorrect private passphrase, please try again."
  },
  DECODERAWTXS_FAILED: {
    id: "decodeRawTx.errors.decodeFailed",
    defaultMessage: "{originalError}"
  },
  DAEMONCONNECTING_TIMEOUT: {
    id: "daemonSyncingTimeout.errors",
    defaultMessage: "Daemon connection timeout exceded.\n That Probably means you filled your parameters wrong. Please review it."
  },
  DAEMONCONNECTING_ERROR: {
    id: "daemon.connect.error",
    defaultMessage: "Error connecting to daemon"
  },
  REMOVESTAKEPOOLCONFIG: {
    id: "stakepools.removedStakePoolConfig",
    defaultMessage: "Successfully removed StakePool config"
  },
  SIGNMESSAGE_FAILED: {
    id: "security.sign.failed",
    defaultMessage: "{originalError}"
  },
  VERIFYMESSAGE_FAILED: {
    id: "security.verify.failed",
    defaultMessage: "{originalError}"
  },
  SEEDCOPIEDTOCLIPBOARD: {
    id: "createWallet.seedCopiedToClipboard",
    defaultMessage: "Seed copied to clipboard!"
  },
  PUBLISHUNMINEDTRANSACTIONS_SUCCESS: {
    id: "send.publishUnminedTransactions.success",
    defaultMessage: "Republished unmined transactions to the decred network."
  },
  EXPORT_COMPLETED: {
    id: "export.completed",
    defaultMessage: "Export of file ‘{filename}’ completed!"
  },
  ADDCUSTOMSTAKEPOOL_FAILED: {
    id: "addCustomStakePool.failed",
    defaultMessage: "Error trying to add custom stakepool: {originalError}"
  },
  ADDCUSTOMSTAKEPOOL_SUCCESS: {
    id: "addCustomStakePool.success",
    defaultMessage: "Successfully added stakepool {host}!"
  },
  GETACCOUNTEXTENDEDKEY_FAILED: {
    id: "accountExtendedKey.failed",
    defaultMessage: "Error getting account extended key: {originalError}"
  },
  SPVSYNC_FAILED: {
    id: "spvSync.Failed",
    defaultMessage: "Error syncing SPV wallet: {originalError}"
  },
  STARTTICKETBUYERV2_SUCCESS: {
    id: "runTicketBuyer.Success",
    defaultMessage: "Ticket Buyer successfully started."
  },
  STARTTICKETBUYERV2_FAILED: {
    id: "runTicketBuyer.Failed",
    defaultMessage: "Invalid private password. Please try again."
  },
  STOPTICKETBUYERV2_SUCCESS: {
    id: "stopTicketBuyer.Success",
    defaultMessage: "Ticket Buyer successfully stopped."
  },
  WRONG_PASSPHRASE_MSG: {
    id: "errors.wrongPassphrase",
    defaultMessage: "Wrong private passphrase entered. Please verify you have typed the correct private passphrase for the wallet."
  },
  TRZ_TOGGLEPINPROTECTION_SUCCESS_ENABLED: {
    id: "trezor.pinProtectionSuccess.enabled",
    defaultMessage: "Pin protection has been enabled in trezor '{label}'"
  },
  TRZ_TOGGLEPINPROTECTION_SUCCESS_DISABLED: {
    id: "trezor.pinProtectionSuccess.disabled",
    defaultMessage: "Pin protection has been disabled in trezor '{label}'"
  },
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS_ENABLED: {
    id: "trezor.passphraseProtectionSuccess.enabled",
    defaultMessage: "Passphrase protection has been enabled in trezor '{label}'"
  },
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS_DISABLED: {
    id: "trezor.passphraseProtectionSuccess.disabled",
    defaultMessage: "Passphrase protection has been disabled in trezor '{label}'"
  },
  TRZ_CHANGEHOMESCREEN_SUCCESS: {
    id: "trezor.changeHomeScreen.success",
    defaultMessage: "Trezor home screen successfully changed"
  },
  TRZ_CHANGELABEL_SUCCESS: {
    id: "trezor.changeLabel.success",
    defaultMessage: "Changed label on selected trezor to '{label}'"
  },
  TRZ_WIPEDEVICE_SUCCESS: {
    id: "trezor.wipeDevice.success",
    defaultMessage: "Trezor device wiped"
  },
  TRZ_RECOVERDEVICE_SUCCESS: {
    id: "trezor.recoverDevice.success",
    defaultMessage: "Trezor device recovered"
  },
  TRZ_INITDEVICE_SUCCESS: {
    id: "trezor.initDevice.success",
    defaultMessage: "Trezor device initialized with new seed"
  },
  TRZ_UPDATEFIRMWARE_SUCCESS: {
    id: "trezor.updateFirmware.success",
    defaultMessage: "Firmware updated on trezor device"
  },
  TRZ_NOCONNECTEDDEVICE: {
    id: "trezor.noConnectedDevice",
    defaultMessage: "No trezor device connected. Check the device connection and trezor bridge."
  },
  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED: {
    id: "trezor.getWalletCreationMasterPubKey.failed",
    defaultMessage: "Failed to obtain master extended pubkey from trezor device: {originalError}"
  },
  ERROR_IS_OBJECT: {
    id: "snackbar.errorObject",
    defaultMessage: "The following error happened: {error}"
  },
  LNWALLET_CONNECT_FAILED: {
    id: "ln.ntf.connectFailed",
    defaultMessage: "Failed to connect to LN wallet: {originalError}"
  },
  LNWALLET_INVOICE_SETTLED: {
    id: "ln.ntf.invoiceSettled",
    defaultMessage: "Invoice '{memo}' settled!"
  },
  LNWALLET_SENDPAYMENT_FAILED: {
    id: "ln.ntf.sendPaymentFailed",
    defaultMessage: "Error sending payment: {originalError}"
  },
  LNWALLET_SENDPAYMENT_SUCCESS: {
    id: "ln.ntf.sendPaymentSuccess",
    defaultMessage: "Payment sent successfully!"
  },
  LNWALLET_OPENCHANNEL_CHANPENDING: {
    id: "ln.ntf.openchannelChanPending",
    defaultMessage: "New channel in pending state"
  },
  LNWALLET_OPENCHANNEL_CHANOPEN: {
    id: "ln.ntf.openchannelChanOpen",
    defaultMessage: "New channel successfully opened and confirmed"
  },
  LNWALLET_OPENCHANNEL_FAILED: {
    id: "ln.ntf.openchannelFailed",
    defaultMessage: "Unable to open channel: {originalError}"
  },
  LNWALLET_CLOSECHANNEL_CLOSEPENDING: {
    id: "ln.ntf.closechannelClosepending",
    defaultMessage: "Channel close procedures started"
  },
  LNWALLET_CLOSECHANNEL_CHANCLOSE: {
    id: "ln.ntf.closechannelChanclose",
    defaultMessage: "Channel closed"
  },
  LNWALLET_CLOSECHANNEL_FAILED: {
    id: "ln.ntf.closechannelFailed",
    defaultMessage: "Unable to close channel: {originalError}"
  },
  LNWALLET_FUNDWALLET_FAILED: {
    id: "ln.ntf.fundWalletFailed",
    defaultMessage: "Funding LN Wallet failed: {originalError}"
  },
  LNWALLET_FUNDWALLET_SUCCESS: {
    id: "ln.ntf.fundWalletSucces",
    defaultMessage: "Sent LN Wallet fund transaction"
  },
  LNWALLET_WITHDRAWWALLET_FAILED: {
    id: "ln.ntf.withdrawWalletFailed",
    defaultMessage: "Withdrawing from LN Wallet failed: {originalError}"
  },
  LNWALLET_WITHDRAWWALLET_SUCCESS: {
    id: "ln.ntf.withdrawWalletSuccess",
    defaultMessage: "Sent withdraw transaction for LN Wallet"
  },
  LNWALLET_STARTDCRLND_FAILED: {
    id: "ln.ntf.startDcrlndFailed",
    defaultMessage: "{originalError}"
  },
  UPDATEVOTECHOICE_SUCCESS: {
    id: "governance.ntf.updateVoteChoiceSuccess",
    defaultMessage: "Your vote has been casted with success!\n Thanks for participating in decred's governance"
  }
});

export default function snackbar(state = {}, action) {
  let values, type, message, error;

  const oldMessages = state.messages || [];

  switch (action.type) {
  case SNACKBAR_SIMPLE_MESSAGE: {
    return {
      ...state,
      messages: [ action ]
    };
  }
  // snackbar management events
  case SNACKBAR_DISMISS_MESSAGES:
    return { ...state, messages: action.newMessages };

  case NEW_TRANSACTIONS_RECEIVED: {
    const tx = action.newlyMinedTransactions.length
      ? action.newlyMinedTransactions[action.newlyMinedTransactions.length-1]
      : action.newlyUnminedTransactions[action.newlyUnminedTransactions.length-1];

    // check if this transaction is already in the message stack and don't add it
    // if it is to prevent double notifications (eg: published tx and it got mined
    // very fast)
    if (oldMessages.some(m => m.txHash === tx.txHash)) {
      break;
    }

    type = tx.direction || wallet.TRANSACTION_TYPES[tx.type];
    message = { ...tx, type };
    values = { message };
    break;
  }

  // Success messages

  case EXPORT_COMPLETED:
  case RENAMEACCOUNT_SUCCESS:
  case GETNEXTACCOUNT_SUCCESS:
  case CHANGEPASSPHRASE_SUCCESS:
  case REVOKETICKETS_SUCCESS:
  case IMPORTSCRIPT_MANUAL_SUCCESS:
  case STARTTICKETBUYERV2_SUCCESS:
  case STOPTICKETBUYERV2_SUCCESS:
  case UPDATESTAKEPOOLCONFIG_SUCCESS:
  case REMOVESTAKEPOOLCONFIG:
  case SEEDCOPIEDTOCLIPBOARD:
  case PUBLISHUNMINEDTRANSACTIONS_SUCCESS:
  case ABANDONTRANSACTION_SUCCESS:
  case PURCHASETICKETS_SUCCESS:
  case ADDCUSTOMSTAKEPOOL_SUCCESS:
  case TRZ_CHANGEHOMESCREEN_SUCCESS:
  case TRZ_WIPEDEVICE_SUCCESS:
  case TRZ_RECOVERDEVICE_SUCCESS:
  case TRZ_INITDEVICE_SUCCESS:
  case TRZ_UPDATEFIRMWARE_SUCCESS:
  case TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS:
  case LNWALLET_INVOICE_SETTLED:
  case LNWALLET_SENDPAYMENT_SUCCESS:
  case LNWALLET_OPENCHANNEL_CHANPENDING:
  case LNWALLET_OPENCHANNEL_CHANOPEN:
  case LNWALLET_CLOSECHANNEL_CLOSEPENDING:
  case LNWALLET_CLOSECHANNEL_CHANCLOSE:
  case LNWALLET_FUNDWALLET_SUCCESS:
  case LNWALLET_WITHDRAWWALLET_SUCCESS:
  case UPDATEVOTECHOICE_SUCCESS:
    type = "Success";
    message = messages[action.type] || messages.defaultSuccessMessage;

    // custom values for some success messages
    switch (action.type) {
    case ADDCUSTOMSTAKEPOOL_SUCCESS:
      values = { host: action.poolInfo.Host };
      break;
    case EXPORT_COMPLETED:
      values = { filename: action.filename };
      break;
    case PURCHASETICKETS_SUCCESS:
      values = { numTickets: action.purchaseTicketsResponse.getTicketHashesList().length };
      break;
    case TRZ_TOGGLEPINPROTECTION_SUCCESS:
    case TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS:
    case TRZ_CHANGELABEL_SUCCESS:
      values = { label: action.deviceLabel };
      break;
    case LNWALLET_INVOICE_SETTLED:
      values = { memo: action.invoice.memo };
    }

    break;

  // Error messages
  case WALLETREMOVED_FAILED:
  case RENAMEACCOUNT_FAILED:
  case GETNEXTACCOUNT_FAILED:
  case CHANGEPASSPHRASE_FAILED:
  case CONSTRUCTTX_FAILED:
  case SIGNTX_FAILED:
  case PUBLISHTX_FAILED:
  case ABANDONTRANSACTION_FAILED:
  case PURCHASETICKETS_FAILED:
  case REVOKETICKETS_FAILED:
  case IMPORTSCRIPT_MANUAL_FAILED:
  case UPDATESTAKEPOOLCONFIG_FAILED:
  case REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED:
  case SETSTAKEPOOLVOTECHOICES_FAILED:
  case ADDCUSTOMSTAKEPOOL_FAILED:
  case DECODERAWTXS_FAILED:
  case SIGNMESSAGE_FAILED:
  case VERIFYMESSAGE_FAILED:
  case GETSTARTUPWALLETINFO_FAILED:
  case PUBLISHUNMINEDTRANSACTIONS_FAILED:
  case EXPORT_ERROR:
  case GETSTARTUPSTATS_FAILED:
  case GETMYTICKETSSTATS_FAILED:
  case GETWALLETSEEDSVC_FAILED:
  case GETACTIVEVOTE_FAILED:
  case GETVETTED_FAILED:
  case GETVETTED_UPDATEDVOTERESULTS_FAILED:
  case GETPROPOSAL_FAILED:
  case SPVSYNC_FAILED:
  case UPDATEVOTECHOICE_FAILED:
  case GETACCOUNTEXTENDEDKEY_FAILED:
  case STARTTICKETBUYERV2_FAILED:
  case TRZ_TOGGLEPINPROTECTION_FAILED:
  case TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED:
  case TRZ_CHANGEHOMESCREEN_FAILED:
  case TRZ_CHANGELABEL_FAILED:
  case TRZ_WIPEDEVICE_FAILED:
  case TRZ_RECOVERDEVICE_FAILED:
  case TRZ_INITDEVICE_FAILED:
  case TRZ_UPDATEFIRMWARE_FAILED:
  case TRZ_NOCONNECTEDDEVICE:
  case TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED:
  case LNWALLET_CONNECT_FAILED:
  case LNWALLET_SENDPAYMENT_FAILED:
  case LNWALLET_OPENCHANNEL_FAILED:
  case LNWALLET_CLOSECHANNEL_FAILED:
  case LNWALLET_FUNDWALLET_FAILED:
  case LNWALLET_WITHDRAWWALLET_FAILED:
  case LNWALLET_STARTDCRLND_FAILED:
    type = "Error";
    if (action.error && String(action.error).indexOf("wallet.Unlock: invalid passphrase:: secretkey.DeriveKey") > -1) {
      // intercepting all wrong passphrase errors, independently of which error
      // state was triggered. Not terribly pretty.
      message = messages[WRONG_PASSPHRASE_MSG];
    } else if (String(action.error).indexOf("[object Object]") > -1) {
      const keys = Object.keys(action.error);
      error = keys.map(key => `${key}: ${action.error[key]}`);
      message = messages[ERROR_IS_OBJECT];
      values = { error };
      break;
    } else {
      message = messages[action.type] || messages.defaultErrorMessage;
    }

    values = { originalError: String(action.error) };

    // custom values for some error messages
    switch (action.type) {
    case REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED:
      values = { ...values, host: action.host };
    }

    if ((process.env.NODE_ENV === "development") && action.error) {
      // in development mode, log failures as errors in the console which helps
      // in determining where the failure came from when it's being correctly
      // handled in an action.
      console.error(action.type, "\n", action.error);
    }
    break;
  case TRZ_TOGGLEPINPROTECTION_SUCCESS:
    type = "Success";
    message = messages["TRZ_TOGGLEPINPROTECTION_SUCCESS_" + (action.clearProtection ? "DISABLED" : "ENABLED")];
    values = { label: action.deviceLabel };
    break;
  case CONNECTDAEMON_FAILURE:
    type = "Error";
    action.daemonTimeout ? message = messages["DAEMONCONNECTING_TIMEOUT"] : message = messages["DAEMONCONNECTING_ERROR"];
    action.error && action.error.code ? message.defaultMessage = action.error.code : null;
    break;
  }

  if (!message || !type) {
    // no new messages
    return { ...state };
  }

  const key = "ntf"+Math.random();
  const newMessage = { type, message, values, key };

  return { ...state, messages: [ ...state.messages, newMessage ] };
}
