/* eslint-disable no-fallthrough */
// we disable no-fallthrough rule in this file to simplify the select/case below.
import { defineMessages } from "react-intl";
import {
  DEX_STARTUP_FAILED,
  DEX_LOGIN_FAILED,
  DEX_ENABLE_FAILED,
  DEX_INIT_FAILED,
  DEX_CREATEWALLET_FAILED,
  DEX_CHECKINIT_FAILED,
  DEX_LAUNCH_WINDOW_FAILED,
  CREATEDEXACCOUNT_FAILED,
  DEX_LOGOUT_FAILED,
  DEX_USER_FAILED,
  DEX_EXPORT_SEED_FAILED
} from "actions/DexActions";
import {
  PUBLISHTX_FAILED,
  SIGNTX_FAILED,
  CONSTRUCTTX_FAILED,
  PURCHASETICKETS_SUCCESS,
  PURCHASETICKETS_SUCCESS_LESS,
  PURCHASETICKETS_FAILED,
  STARTTICKETBUYERV2_SUCCESS,
  STARTTICKETBUYERV3_SUCCESS,
  STARTTICKETBUYERV2_FAILED,
  STOPTICKETBUYERV2_SUCCESS,
  STOPTICKETBUYER_SUCCESS,
  IMPORTSCRIPT_MANUAL_SUCCESS,
  IMPORTSCRIPT_MANUAL_FAILED,
  RENAMEACCOUNT_SUCCESS,
  RENAMEACCOUNT_FAILED,
  GETNEXTACCOUNT_SUCCESS,
  GETNEXTACCOUNT_FAILED,
  CHANGEPASSPHRASE_SUCCESS,
  CHANGEPASSPHRASE_FAILED,
  SETACCOUNTPASSPHRASE_FAILED,
  SIGNMESSAGE_FAILED,
  VERIFYMESSAGE_FAILED,
  PUBLISHUNMINEDTRANSACTIONS_SUCCESS,
  PUBLISHUNMINEDTRANSACTIONS_FAILED,
  GETACCOUNTEXTENDEDKEY_FAILED,
  STARTTICKETBUYERV3_FAILED,
  SETACCOUNTSPASSPHRASE_FAILED,
  DISCOVERUSAGE_FAILED,
  DISCOVERUSAGE_SUCCESS
} from "actions/ControlActions";
import {
  UPDATESTAKEPOOLCONFIG_SUCCESS,
  UPDATESTAKEPOOLCONFIG_FAILED,
  SETSTAKEPOOLVOTECHOICES_FAILED,
  REMOVESTAKEPOOLCONFIG,
  ADDCUSTOMSTAKEPOOL_SUCCESS,
  ADDCUSTOMSTAKEPOOL_FAILED,
  REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED,
  SYNCVSPTICKETS_SUCCESS,
  SYNCVSPTICKETS_FAILED,
  PROCESSMANAGEDTICKETS_FAILED,
  SETVSPDVOTECHOICE_FAILED,
  GETVSP_TICKET_STATUS_FAILED
} from "actions/VSPActions";
import {
  ABANDONTRANSACTION_SUCCESS,
  ABANDONTRANSACTION_FAILED,
  GETSTARTUPWALLETINFO_FAILED,
  SEEDCOPIEDTOCLIPBOARD,
  SETVOTECHOICES_FAILED,
  SETVOTECHOICES_SUCCESS,
  SETTREASURY_POLICY_SUCCESS,
  SETTREASURY_POLICY_FAILED
} from "actions/ClientActions";
import {
  SNACKBAR_DISMISS_MESSAGES,
  SNACKBAR_SIMPLE_MESSAGE
} from "actions/SnackbarActions";
import {
  EXPORT_ERROR,
  EXPORT_COMPLETED,
  GETSTARTUPSTATS_FAILED,
  GETMYTICKETSSTATS_FAILED
} from "actions/StatisticsActions";
import {
  WALLETREMOVED_FAILED,
  CONNECTDAEMON_FAILURE
} from "actions/DaemonActions";
import {
  GETWALLETSEEDSVC_FAILED,
  SPVSYNC_FAILED
} from "actions/WalletLoaderActions";
import {
  TRZ_TOGGLEPINPROTECTION_SUCCESS,
  TRZ_TOGGLEPINPROTECTION_FAILED,
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS,
  TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED,
  TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS,
  TRZ_TOGGLEPASSPHRASEONDEVICE_FAILED,
  TRZ_CHANGEHOMESCREEN_SUCCESS,
  TRZ_CHANGEHOMESCREEN_FAILED,
  TRZ_CHANGELABEL_SUCCESS,
  TRZ_CHANGELABEL_FAILED,
  TRZ_WIPEDEVICE_SUCCESS,
  TRZ_WIPEDEVICE_FAILED,
  TRZ_RECOVERDEVICE_SUCCESS,
  TRZ_RECOVERDEVICE_FAILED,
  TRZ_INITDEVICE_SUCCESS,
  TRZ_INITDEVICE_FAILED,
  TRZ_BACKUPDEVICE_FAILED,
  TRZ_BACKUPDEVICE_SUCCESS,
  TRZ_UPDATEFIRMWARE_SUCCESS,
  TRZ_UPDATEFIRMWARE_FAILED,
  TRZ_NOCONNECTEDDEVICE,
  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED,
  TRZ_NOTBACKEDUP
} from "actions/TrezorActions";
import {
  NEW_TRANSACTIONS_RECEIVED,
  TRANSACTION_TYPES,
  DECODERAWTXS_FAILED
} from "actions/TransactionActions";
import {
  GETACTIVEVOTE_FAILED,
  GETVETTED_FAILED,
  UPDATEVOTECHOICE_SUCCESS,
  UPDATEVOTECHOICE_FAILED,
  GETVETTED_UPDATEDVOTERESULTS_FAILED
} from "actions/GovernanceActions";
import {
  LNWALLET_INVOICE_SETTLED,
  LNWALLET_SENDPAYMENT_FAILED,
  LNWALLET_SENDPAYMENT_SUCCESS,
  LNWALLET_OPENCHANNEL_CHANPENDING,
  LNWALLET_OPENCHANNEL_CHANOPEN,
  LNWALLET_OPENCHANNEL_FAILED,
  LNWALLET_CLOSECHANNEL_CLOSEPENDING,
  LNWALLET_CLOSECHANNEL_CHANCLOSE,
  LNWALLET_CLOSECHANNEL_FAILED,
  LNWALLET_FUNDWALLET_FAILED,
  LNWALLET_WITHDRAWWALLET_FAILED,
  LNWALLET_FUNDWALLET_SUCCESS,
  LNWALLET_WITHDRAWWALLET_SUCCESS,
  LNWALLET_CREATEACCOUNT_FAILED,
  LNWALLET_STARTDCRLND_FAILED,
  LNWALLET_CONNECT_FAILED,
  LNWALLET_UNLOCK_FAILED,
  LNWALLET_STARTUPSYNC_FAILED,
  LNWALLET_SCBRESTORE_FAILED,
  LNWALLET_SCBRESTOREUNPACK_FAILED,
  LNWALLET_EXPORTBACKUP_SUCCESS,
  LNWALLET_EXPORTBACKUP_FAILED,
  LNWALLET_VERIFYBACKUP_SUCCESS,
  LNWALLET_VERIFYBACKUP_FAILED,
  LNWALLET_GETNETWORKINFO_FAILED,
  LNWALLET_ADDWATCHTOWER_SUCCESS,
  LNWALLET_ADDWATCHTOWER_FAILED,
  LNWALLET_REMOVEWATCHTOWER_SUCCESS,
  LNWALLET_REMOVEWATCHTOWER_FAILED,
  LNWALLET_LISTWATCHTOWERS_FAILED,
  LNWALLET_CANCELINVOICE_SUCCESS,
  LNWALLET_CANCELINVOICE_FAILED,
  LNWALLET_ADDINVOICE_SUCCESS,
  LNWALLET_ADDINVOICE_FAILED,
  LNWALLET_MODIFY_AUTOPILOT_STATUS_SUCCESS,
  LNWALLET_MODIFY_AUTOPILOT_STATUS_FAILED
} from "actions/LNActions";
import {
  CREATEMIXERACCOUNTS_SUCCESS,
  CREATEMIXERACCOUNTS_FAILED,
  RUNACCOUNTMIXER_FAILED
} from "actions/AccountMixerActions";
import { SETTINGS_SAVE } from "actions/SettingsActions";

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
    defaultMessage:
      "You bought {numTickets, plural, one { # ticket } other { # tickets }}"
  },
  PURCHASETICKETS_SUCCESS_LESS: {
    id: "tickets.purchaseTicketsHeaderLess",
    defaultMessage:
      "You bought {numTickets, plural, one { # ticket } other { # tickets }}.  This was less than your requested amount of {numAttempted}.  While your balance was sufficient, you lacked enough spendable outputs.  You may try and purchase more now."
  },
  PURCHASETICKETS_FAILED: {
    id: "tickets.errors.purchaseTicketsFailed",
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
    defaultMessage:
      "You have successfully updated your legacy stakepool settings."
  },
  UPDATESTAKEPOOLCONFIG_FAILED: {
    id: "tickets.errors.updateStakePoolConfigFailed",
    defaultMessage: "{originalError}"
  },
  REFRESHSTAKEPOOLPURCHASEINFORMATION_FAILED: {
    id: "tickets.errors.refreshStakePoolInfo",
    defaultMessage:
      "Error refreshing stakepool data from {host}: {originalError}"
  },
  SETSTAKEPOOLVOTECHOICES_FAILED: {
    id: "tickets.errors.setStakePoolVoteChoicesFailed",
    defaultMessage: "{originalError}"
  },
  RENAMEACCOUNT_SUCCESS: {
    id: "accounts.renameAccount",
    defaultMessage: "Successfully renamed account."
  },
  RENAMEACCOUNT_FAILED: {
    id: "accounts.errors.renameAccountFailed",
    defaultMessage: "{originalError}"
  },
  GETNEXTACCOUNT_SUCCESS: {
    id: "accounts.nextAccount",
    defaultMessage: "Successfully created a new account."
  },
  GETNEXTACCOUNT_FAILED: {
    id: "accounts.errors.getNextAccountFailed",
    defaultMessage: "{originalError}"
  },
  CHANGEPASSPHRASE_SUCCESS: {
    id: "settings.changePassphrase",
    defaultMessage: "Successfully changed private passphrase."
  },
  CHANGEPASSPHRASE_FAILED: {
    id: "settings.errors.changePassphraseFailed",
    defaultMessage:
      "Update passphrase failed. Incorrect private passphrase, please try again."
  },
  SETACCOUNTPASSPHRASE_FAILED: {
    id: "settings.errors.setPassphraseAcctFailed",
    defaultMessage:
      "Update passphrase failed. Incorrect passphrase, please try again."
  },
  DAEMONCONNECTING_TIMEOUT: {
    id: "daemonSyncingTimeout.errors",
    defaultMessage:
      "Daemon connection timeout exceeded.\n That Probably means you filled your parameters wrong. Please review it."
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
    defaultMessage: "Successfully added stakepool {host}."
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
  STARTTICKETBUYERV3_SUCCESS: {
    id: "runTicketBuyerNew.Success",
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
  STOPTICKETBUYER_SUCCESS: {
    id: "stopTicketBuyerNew.Success",
    defaultMessage: "Ticket Buyer successfully stopped."
  },
  WRONG_PASSPHRASE_MSG: {
    id: "errors.wrongPassphrase",
    defaultMessage: "Wrong private passphrase entered."
  },
  TRZ_TOGGLEPINPROTECTION_SUCCESS_ENABLED: {
    id: "trezor.pinProtectionSuccess.enabled",
    defaultMessage: "Pin protection has been enabled in Trezor {label}"
  },
  TRZ_TOGGLEPINPROTECTION_SUCCESS_DISABLED: {
    id: "trezor.pinProtectionSuccess.disabled",
    defaultMessage: "Pin protection has been disabled in Trezor {label}"
  },
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS_ENABLED: {
    id: "trezor.passphraseProtectionSuccess.enabled",
    defaultMessage: "Passphrase protection has been enabled in Trezor {label}"
  },
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS_DISABLED: {
    id: "trezor.passphraseProtectionSuccess.disabled",
    defaultMessage: "Passphrase protection has been disabled in Trezor {label}"
  },
  TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS_ENABLED: {
    id: "trezor.passphraseOnDevice.enabled",
    defaultMessage: "Passphrase on device has been enabled in Trezor {label}"
  },
  TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS_DISABLED: {
    id: "trezor.passphraseOnDevice.disabled",
    defaultMessage: "Passphrase on device has been disabled in Trezor {label}"
  },
  TRZ_CHANGEHOMESCREEN_SUCCESS: {
    id: "trezor.changeHomeScreen.success",
    defaultMessage: "Trezor home screen successfully changed"
  },
  TRZ_CHANGELABEL_SUCCESS: {
    id: "trezor.changeLabel.success",
    defaultMessage: "Changed label on selected Trezor to {label}"
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
  TRZ_BACKUPDEVICE_SUCCESS: {
    id: "trezor.backupDevice.success",
    defaultMessage: "Trezor device backed up."
  },
  TRZ_UPDATEFIRMWARE_SUCCESS: {
    id: "trezor.updateFirmware.success",
    defaultMessage: "Firmware updated on Trezor device"
  },
  TRZ_NOCONNECTEDDEVICE: {
    id: "trezor.noConnectedDevice",
    defaultMessage:
      "No Trezor device connected. Check the device connection and Trezor bridge."
  },
  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED: {
    id: "trezor.getWalletCreationMasterPubKey.failed",
    defaultMessage:
      "Failed to obtain master extended pubkey from Trezor device: {originalError}"
  },
  TRZ_NOTBACKEDUP: {
    id: "trezor.notBackedUp",
    defaultMessage:
      "Trezor must be backed up in order to perform this operation."
  },
  ERROR_IS_OBJECT: {
    id: "snackbar.errorObject",
    defaultMessage: "The following error happened: {error}"
  },
  LNWALLET_STARTDCRLND_FAILED: {
    id: "ln.ntf.startDcrlndFailed",
    defaultMessage: "dcrlnd failed to start: {originalError}"
  },
  LNWALLET_CONNECT_FAILED: {
    id: "ln.ntf.connectFailed",
    defaultMessage: "Failed to connect to LN wallet: {originalError}"
  },
  LNWALLET_CREATEACCOUNT_FAILED: {
    id: "ln.ntf.createAccountFailed",
    defaultMessage: "Failed to create LN-specific account: {originalError}"
  },
  LNWALLET_UNLOCK_FAILED: {
    id: "ln.ntf.unlockFailed",
    defaultMessage: "Failed to unlock LN wallet: {originalError}"
  },
  LNWALLET_STARTUPSYNC_FAILED: {
    id: "ln.ntf.startupSyncFailed",
    defaultMessage: "Failed to sync to dcrlnd during startup: {originalError}"
  },
  LNWALLET_SCBRESTORE_FAILED: {
    id: "ln.ntf.scbRestoreFailed",
    defaultMessage: "SCB restore failed: {originalError}"
  },
  LNWALLET_SCBRESTOREUNPACK_FAILED: {
    id: "ln.ntf.scbRestoreUnpackFailed",
    defaultMessage:
      "SCB restore failed due to backup file being for a different wallet, account or the file being damaged.\nTry other accounts, wallets or check the documentation for additional info."
  },
  LNWALLET_INVOICE_SETTLED: {
    id: "ln.ntf.invoiceSettled",
    defaultMessage: "Invoice ‘{memo}’ settled!"
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
  LNWALLET_EXPORTBACKUP_SUCCESS: {
    id: "ln.ntf.exportBackupSuccess",
    defaultMessage: "Exported SCB backup file to {destPath}"
  },
  LNWALLET_EXPORTBACKUP_FAILED: {
    id: "ln.ntf.exportBackupFailed",
    defaultMessage: "Unable to export SCB file: {originalError}"
  },
  LNWALLET_VERIFYBACKUP_SUCCESS: {
    id: "ln.ntf.verifyBackupSuccess",
    defaultMessage: "SCB backup file is valid for this wallet!"
  },
  LNWALLET_VERIFYBACKUP_FAILED: {
    id: "ln.ntf.verifyBackupFailed",
    defaultMessage:
      "SCB backup file is invalid for this wallet: {originalError}"
  },
  LNWALLET_GETNETWORKINFO_FAILED: {
    id: "ln.ntf.getNetworkInfoFailed",
    defaultMessage: "Failed to get LN network info: {originalError}"
  },
  LNWALLET_ADDWATCHTOWER_SUCCESS: {
    id: "ln.ntf.addWatchtowerSuccess",
    defaultMessage: "Successfully added watchtower!"
  },
  LNWALLET_ADDWATCHTOWER_FAILED: {
    id: "ln.ntf.addWatchtowerFailed",
    defaultMessage: "Failed to add watchtower: {originalError}"
  },
  LNWALLET_REMOVEWATCHTOWER_SUCCESS: {
    id: "ln.ntf.removeWatchtowerSuccess",
    defaultMessage: "Watchtower successfully removed!"
  },
  LNWALLET_REMOVEWATCHTOWER_FAILED: {
    id: "ln.ntf.removeWatchtowerFailed",
    defaultMessage: "Failed to remove watchtower: {originalError}"
  },
  LNWALLET_LISTWATCHTOWERS_FAILED: {
    id: "ln.ntf.listWatchtowerFailed",
    defaultMessage: "Failed to list watchtowers: {originalError}"
  },
  LNWALLET_CANCELINVOICE_SUCCESS: {
    id: "ln.ntf.cancelInvoiceSuccess",
    defaultMessage: "Invoice successfully canceled!"
  },
  LNWALLET_MODIFY_AUTOPILOT_STATUS_SUCCESS: {
    id: "ln.ntf.autopilotStatusModifySuccess",
    defaultMessage: "Autopilot has been successfully modified!"
  },
  LNWALLET_ADDINVOICE_SUCCESS: {
    id: "ln.ntf.addInvoiceSuccess",
    defaultMessage: "Successfully added invoice!"
  },
  LNWALLET_CANCELINVOICE_FAILED: {
    id: "ln.ntf.cancelInvoiceFailed",
    defaultMessage: "Failed to cancel invoice: {originalError}"
  },
  LNWALLET_ADDINVOICE_FAILED: {
    id: "ln.ntf.addInvoiceFailed",
    defaultMessage: "Failed to create invoice: {originalError}"
  },
  LNWALLET_MODIFY_AUTOPILOT_STATUS_FAILED: {
    id: "ln.ntf.autopilotStatusModifyFailed",
    defaultMessage: "Failed to modify autopilot status: {originalError}"
  },
  UPDATEVOTECHOICE_SUCCESS: {
    id: "governance.ntf.updateVoteChoiceSuccess",
    defaultMessage:
      "Your vote has been cast!\nThanks for participating in Decred's governance"
  },
  SETTREASURY_POLICY_SUCCESS: {
    id: "setTreasuryPolicy.updateVoteChoiceSuccess",
    defaultMessage:
      "Your treasury policy has been successfully updated! Thanks for participating in Decred's governance."
  },
  SETTREASURY_POLICY_FAILED: {
    id: "setTreasuryPolicy.updateVoteChoiceFailed",
    defaultMessage: "Set treasury policy failed: {originalError}"
  },
  CREATEMIXERACCOUNTS_SUCCESS: {
    id: "mixer.ntf.createdAcct",
    defaultMessage: "Accounts successfully created and mixer configured."
  },
  RUNACCOUNTMIXER_FAILED: {
    id: "mixer.ntf.startMixerFailed",
    defaultMessage: "{originalError}"
  },
  SYNCVSPTICKETS_SUCCESS: {
    id: "sync.vsp.success",
    defaultMessage:
      "All tickets in error have been successfully attempted to be paid. Please make sure all tickets now show paid.  Otherwise, try again or use a different VSP."
  },
  SYNCVSPTICKETS_FAILED: {
    id: "sync.vsp.failed",
    defaultMessage: "{originalError}"
  },
  PROCESSMANAGEDTICKETS_FAILED: {
    id: "processmanaged.failed",
    defaultMessage: "{originalError}"
  },
  SETVOTECHOICES_FAILED: {
    id: "set.vote.failed",
    defaultMessage: "Set wallet vote choices failed: {originalError}"
  },
  SETVOTECHOICES_SUCCESS: {
    id: "set.vote.success",
    defaultMessage:
      "You have successfully updated your wallet vote choices on any legacy stakepools you may have had set up."
  },
  SETVSPDVOTECHOICE_FAILED: {
    id: "set.vspdvote.failed",
    defaultMessage: "Set vspd vote choices failed: {originalError}"
  },
  GETVSP_TICKET_STATUS_FAILED: {
    id: "set.getvspticketstatus.failed",
    defaultMessage: "Fetch vsp ticket status failed: {originalError}"
  },
  DEX_STARTUP_FAILED: {
    id: "dex.startup.failed",
    defaultMessage: "DEX Client Failed to Start: {originalError}"
  },
  DEX_LOGIN_FAILED: {
    id: "dex.login.failed",
    defaultMessage: "DEX Login Failed: {originalError}"
  },
  DEX_ENABLE_FAILED: {
    id: "dex.enable.failed",
    defaultMessage: "Enabling DEX Failed: {originalError}"
  },
  DEX_INIT_FAILED: {
    id: "dex.init.failed",
    defaultMessage: "Setting DEX Passphrase Failed: {originalError}"
  },
  DEX_CREATEWALLET_FAILED: {
    id: "dex.connectWallet.failed",
    defaultMessage: "Connecting to DCR wallet Failed: {originalError}"
  },
  DEX_CHECKINIT_FAILED: {
    id: "dex.checkInit.failed",
    defaultMessage:
      "Could not check DEX whether it is initialized: {originalError}"
  },
  DEX_LAUNCH_WINDOW_FAILED: {
    id: "dex.launchWindow.failed",
    defaultMessage: "DEX Windows failed to be launched: {originalError}"
  },
  CREATEDEXACCOUNT_FAILED: {
    id: "dex.createDEXAccount.failed",
    defaultMessage: "Failed to create an account for DEX: {originalError}"
  },
  DEX_LOGOUT_FAILED: {
    id: "dex.logout.failed",
    defaultMessage: "Unable to logout from DEX: {originalError}"
  },
  DEX_USER_FAILED: {
    id: "dex.user.failed",
    defaultMessage: "Failed to retrieve user information: {originalError}"
  },
  STARTTICKETBUYERV3_FAILED: {
    id: "vsp.runautobuyer.failed",
    defaultMessage: "{originalError}"
  },
  SETACCOUNTSPASSPHRASE_FAILED: {
    id: "setupWallet.processAccounts.failed",
    defaultMessage: "{originalError}"
  },
  DISCOVERUSAGE_FAILED: {
    id: "discoverAddress.failed",
    defaultMessage: "{originalError}"
  },
  DISCOVERUSAGE_SUCCESS: {
    id: "discoverAddress.success",
    defaultMessage:
      "You have successfully discovered address usage.  Rescan now commencing."
  },
  DEX_EXPORT_SEED_FAILED: {
    id: "dex.export.seed.failed",
    defaultMessage: "{originalError}"
  },
  SETTINGS_SAVE: {
    id: "settings.saved",
    defaultMessage: "Settings saved successfully."
  }
});

export default function snackbar(state = {}, action) {
  let values, type, message, error;

  const oldMessages = state.messages || [];

  switch (action.type) {
    case SNACKBAR_SIMPLE_MESSAGE: {
      return {
        ...state,
        messages: [action]
      };
    }
    // snackbar management events
    case SNACKBAR_DISMISS_MESSAGES:
      return { ...state, messages: action.newMessages };

    case NEW_TRANSACTIONS_RECEIVED: {
      const tx = action.newlyMinedTransactions.length
        ? action.newlyMinedTransactions[
            action.newlyMinedTransactions.length - 1
          ]
        : action.newlyUnminedTransactions[
            action.newlyUnminedTransactions.length - 1
          ];

      // check if this transaction is already in the message stack and don't add it
      // if it is to prevent double notifications (eg: published tx and it got mined
      // very fast)
      if (oldMessages.some((m) => m.message.txHash === tx.txHash)) {
        break;
      }

      type = tx.direction || TRANSACTION_TYPES[tx.type];
      message = { ...tx, type };
      values = { message };
      break;
    }

    // Success messages
    case EXPORT_COMPLETED:
    case RENAMEACCOUNT_SUCCESS:
    case GETNEXTACCOUNT_SUCCESS:
    case CHANGEPASSPHRASE_SUCCESS:
    case IMPORTSCRIPT_MANUAL_SUCCESS:
    case STARTTICKETBUYERV2_SUCCESS:
    case STARTTICKETBUYERV3_SUCCESS:
    case STOPTICKETBUYERV2_SUCCESS:
    case STOPTICKETBUYER_SUCCESS:
    case UPDATESTAKEPOOLCONFIG_SUCCESS:
    case REMOVESTAKEPOOLCONFIG:
    case SEEDCOPIEDTOCLIPBOARD:
    case PUBLISHUNMINEDTRANSACTIONS_SUCCESS:
    case ABANDONTRANSACTION_SUCCESS:
    case PURCHASETICKETS_SUCCESS:
    case PURCHASETICKETS_SUCCESS_LESS:
    case ADDCUSTOMSTAKEPOOL_SUCCESS:
    case TRZ_CHANGEHOMESCREEN_SUCCESS:
    case TRZ_WIPEDEVICE_SUCCESS:
    case TRZ_RECOVERDEVICE_SUCCESS:
    case TRZ_INITDEVICE_SUCCESS:
    case TRZ_UPDATEFIRMWARE_SUCCESS:
    case TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS:
    case TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS:
    case TRZ_CHANGELABEL_SUCCESS:
    case TRZ_TOGGLEPINPROTECTION_SUCCESS:
    case TRZ_BACKUPDEVICE_SUCCESS:
    case LNWALLET_INVOICE_SETTLED:
    case LNWALLET_SENDPAYMENT_SUCCESS:
    case LNWALLET_OPENCHANNEL_CHANPENDING:
    case LNWALLET_OPENCHANNEL_CHANOPEN:
    case LNWALLET_CLOSECHANNEL_CLOSEPENDING:
    case LNWALLET_CLOSECHANNEL_CHANCLOSE:
    case LNWALLET_FUNDWALLET_SUCCESS:
    case LNWALLET_WITHDRAWWALLET_SUCCESS:
    case LNWALLET_EXPORTBACKUP_SUCCESS:
    case LNWALLET_VERIFYBACKUP_SUCCESS:
    case LNWALLET_ADDWATCHTOWER_SUCCESS:
    case LNWALLET_REMOVEWATCHTOWER_SUCCESS:
    case LNWALLET_CANCELINVOICE_SUCCESS:
    case LNWALLET_ADDINVOICE_SUCCESS:
    case LNWALLET_MODIFY_AUTOPILOT_STATUS_SUCCESS:
    case UPDATEVOTECHOICE_SUCCESS:
    case CREATEMIXERACCOUNTS_SUCCESS:
    case SYNCVSPTICKETS_SUCCESS:
    case SETVOTECHOICES_SUCCESS:
    case SETTREASURY_POLICY_SUCCESS:
    case DISCOVERUSAGE_SUCCESS:
    case SETTINGS_SAVE:
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
        case PURCHASETICKETS_SUCCESS_LESS:
          values = {
            numTickets: action.purchaseTicketsResponse.ticketHashes.length,
            numAttempted: action.numAttempted
          };
          break;
        case PURCHASETICKETS_SUCCESS:
          values = {
            numTickets: action.purchaseTicketsResponse.ticketHashes.length
          };
          break;
        case TRZ_TOGGLEPINPROTECTION_SUCCESS:
          message =
            messages[
              "TRZ_TOGGLEPINPROTECTION_SUCCESS_" +
                (action.clearProtection ? "DISABLED" : "ENABLED")
            ];
          values = { label: action.deviceLabel };
          break;
        case TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS:
          message =
            messages[
              "TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS_" +
                (action.enablePassphraseProtection ? "ENABLED" : "DISABLED")
            ];
          values = { label: action.deviceLabel };
          break;
        case TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS:
          message =
            messages[
              "TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS_" +
                (action.enablePassphraseOnDevice ? "ENABLED" : "DISABLED")
            ];
          values = { label: action.deviceLabel };
          break;
        case TRZ_CHANGELABEL_SUCCESS:
          values = { label: action.deviceLabel };
          break;
        case LNWALLET_INVOICE_SETTLED:
          values = { memo: action.invoice.memo };
          break;
        case LNWALLET_EXPORTBACKUP_SUCCESS:
          values = { destPath: action.destPath };
          break;
      }

      break;

    // Error messages
    case WALLETREMOVED_FAILED:
    case RENAMEACCOUNT_FAILED:
    case GETNEXTACCOUNT_FAILED:
    case CHANGEPASSPHRASE_FAILED:
    case SETACCOUNTPASSPHRASE_FAILED:
    case CONSTRUCTTX_FAILED:
    case SIGNTX_FAILED:
    case PUBLISHTX_FAILED:
    case ABANDONTRANSACTION_FAILED:
    case PURCHASETICKETS_FAILED:
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
    case SPVSYNC_FAILED:
    case UPDATEVOTECHOICE_FAILED:
    case SETTREASURY_POLICY_FAILED:
    case GETACCOUNTEXTENDEDKEY_FAILED:
    case STARTTICKETBUYERV2_FAILED:
    case TRZ_TOGGLEPINPROTECTION_FAILED:
    case TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED:
    case TRZ_TOGGLEPASSPHRASEONDEVICE_FAILED:
    case TRZ_CHANGEHOMESCREEN_FAILED:
    case TRZ_CHANGELABEL_FAILED:
    case TRZ_WIPEDEVICE_FAILED:
    case TRZ_RECOVERDEVICE_FAILED:
    case TRZ_INITDEVICE_FAILED:
    case TRZ_UPDATEFIRMWARE_FAILED:
    case TRZ_NOCONNECTEDDEVICE:
    case TRZ_NOTBACKEDUP:
    case TRZ_BACKUPDEVICE_FAILED:
    case TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED:
    case LNWALLET_CREATEACCOUNT_FAILED:
    case LNWALLET_STARTDCRLND_FAILED:
    case LNWALLET_CONNECT_FAILED:
    case LNWALLET_UNLOCK_FAILED:
    case LNWALLET_STARTUPSYNC_FAILED:
    case LNWALLET_SCBRESTORE_FAILED:
    case LNWALLET_SCBRESTOREUNPACK_FAILED:
    case LNWALLET_SENDPAYMENT_FAILED:
    case LNWALLET_OPENCHANNEL_FAILED:
    case LNWALLET_CLOSECHANNEL_FAILED:
    case LNWALLET_FUNDWALLET_FAILED:
    case LNWALLET_WITHDRAWWALLET_FAILED:
    case LNWALLET_EXPORTBACKUP_FAILED:
    case LNWALLET_VERIFYBACKUP_FAILED:
    case LNWALLET_GETNETWORKINFO_FAILED:
    case CREATEMIXERACCOUNTS_FAILED:
    case LNWALLET_ADDWATCHTOWER_FAILED:
    case LNWALLET_REMOVEWATCHTOWER_FAILED:
    case LNWALLET_LISTWATCHTOWERS_FAILED:
    case LNWALLET_CANCELINVOICE_FAILED:
    case LNWALLET_ADDINVOICE_FAILED:
    case LNWALLET_MODIFY_AUTOPILOT_STATUS_FAILED:
    case RUNACCOUNTMIXER_FAILED:
    case SYNCVSPTICKETS_FAILED:
    case PROCESSMANAGEDTICKETS_FAILED:
    case SETVOTECHOICES_FAILED:
    case SETVSPDVOTECHOICE_FAILED:
    case GETVSP_TICKET_STATUS_FAILED:
    case DEX_STARTUP_FAILED:
    case DEX_LOGIN_FAILED:
    case DEX_ENABLE_FAILED:
    case DEX_INIT_FAILED:
    case DEX_CREATEWALLET_FAILED:
    case CREATEDEXACCOUNT_FAILED:
    case DEX_CHECKINIT_FAILED:
    case DEX_LAUNCH_WINDOW_FAILED:
    case DEX_LOGOUT_FAILED:
    case DEX_USER_FAILED:
    case STARTTICKETBUYERV3_FAILED:
    case SETACCOUNTSPASSPHRASE_FAILED:
    case DISCOVERUSAGE_FAILED:
    case DEX_EXPORT_SEED_FAILED:
      type = "Error";
      if (
        action.error &&
        String(action.error).indexOf("invalid passphrase") > -1
      ) {
        // intercepting all wrong passphrase errors, independently of which error
        // state was triggered. Not terribly pretty.
        message = messages[WRONG_PASSPHRASE_MSG];
      } else if (String(action.error).indexOf("[object Object]") > -1) {
        const keys = Object.keys(action.error);
        error = keys.map((key) => `${key}: ${action.error[key]}`);
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

      if (process.env.NODE_ENV === "development" && action.error) {
        // in development mode, log failures as errors in the console which helps
        // in determining where the failure came from when it's being correctly
        // handled in an action.
        console.error(action.type, "\n", action.error);
      }
      break;
    case CONNECTDAEMON_FAILURE:
      type = "Error";
      action.daemonTimeout
        ? (message = messages["DAEMONCONNECTING_TIMEOUT"])
        : (message = messages["DAEMONCONNECTING_ERROR"]);
      action.error && action.error.code
        ? (message.defaultMessage = action.error.code)
        : null;
      break;
  }

  if (!message || !type) {
    // no new messages
    return { ...state };
  }

  const key = "ntf" + Math.random();
  const newMessage = { type, message, values, key };

  return { ...state, messages: [...oldMessages, newMessage] };
}
