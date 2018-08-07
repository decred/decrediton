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
  STARTAUTOBUYER_SUCCESS, STARTAUTOBUYER_FAILED,
  STOPAUTOBUYER_SUCCESS,
  REVOKETICKETS_SUCCESS, REVOKETICKETS_FAILED,
  IMPORTSCRIPT_SUCCESS, IMPORTSCRIPT_FAILED,
  RENAMEACCOUNT_SUCCESS, RENAMEACCOUNT_FAILED,
  GETNEXTACCOUNT_SUCCESS, GETNEXTACCOUNT_FAILED,
  CHANGEPASSPHRASE_SUCCESS, CHANGEPASSPHRASE_FAILED,
  SIGNMESSAGE_FAILED, VERIFYMESSAGE_FAILED,
  PUBLISHUNMINEDTRANSACTIONS_SUCCESS, PUBLISHUNMINEDTRANSACTIONS_FAILED,
  GETACCOUNTEXTENDEDKEY_FAILED,
} from "../actions/ControlActions";
import {
  UPDATESTAKEPOOLCONFIG_SUCCESS, UPDATESTAKEPOOLCONFIG_FAILED,
  SETSTAKEPOOLVOTECHOICES_SUCCESS, SETSTAKEPOOLVOTECHOICES_FAILED,
  REMOVESTAKEPOOLCONFIG,
  ADDCUSTOMSTAKEPOOL_SUCCESS, ADDCUSTOMSTAKEPOOL_FAILED,
} from "../actions/StakePoolActions";
import {
  NEW_TRANSACTIONS_RECEIVED,
  GETSTARTUPWALLETINFO_FAILED,
  SEEDCOPIEDTOCLIPBOARD,
} from "../actions/ClientActions";
import { SNACKBAR_DISMISS_MESSAGES, SNACKBAR_SIMPLE_MESSAGE } from "../actions/SnackbarActions";
import {
  EXPORT_ERROR,
  EXPORT_COMPLETED,
  GETSTARTUPSTATS_FAILED,
  GETMYTICKETSSTATS_FAILED,
} from "actions/StatisticsActions";
import { WALLETREMOVED_FAILED } from "actions/DaemonActions";
import {
  GETWALLETSEEDSVC_FAILED,
  SPVSYNC_FAILED,
} from "actions/WalletLoaderActions";

import {
  GETACTIVEVOTE_FAILED, GETVETTED_FAILED, GETPROPOSAL_FAILED,
  UPDATEVOTECHOICE_FAILED
} from "actions/GovernanceActions";

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
  PUBLISHTX_SUCCESS: {
    id: "send.publishedTxHeader",
    defaultMessage: "Published tx: {hash}"
  },
  PUBLISHTX_FAILED: {
    id: "send.errors.publishTxFailed",
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
  IMPORTSCRIPT_SUCCESS: {
    id: "tickets.importScriptHeader",
    defaultMessage: "You successfully imported a script tickets"
  },
  IMPORTSCRIPT_FAILED: {
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
  SETSTAKEPOOLVOTECHOICES_SUCCESS: {
    id: "tickets.setStakePoolVoteChoices",
    defaultMessage: "Successfully set vote choices."
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
    defaultMessage: "{originalError}"
  },
  DECODERAWTXS_FAILED: {
    id: "decodeRawTx.errors.decodeFailed",
    defaultMessage: "{originalError}"
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
    defaultMessage: "Export of file '{filename}' completed!"
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
  }
});

export default function snackbar(state = {}, action) {
  let values, type, message;

  switch (action.type) {
  case SNACKBAR_SIMPLE_MESSAGE: {
    return {
      ...state,
      messages: [action],
    }
  }
  // snackbar management events
  case SNACKBAR_DISMISS_MESSAGES:
    return { ...state, messages: Array() };

  case NEW_TRANSACTIONS_RECEIVED: {
    // TODO: show more notifications or a summary when receiving many transactions.
    const tx = action.newlyMinedTransactions.length
      ? action.newlyMinedTransactions[0]
      : action.newlyUnminedTransactions[0];

    type = tx.direction || wallet.TRANSACTION_TYPES[tx.type];
    message = { ...tx, type };
    values = { message };
    break;
  }

  // all simple success notifications. Just add the type below and the message
  // on the messages variable above if you need a simple message, without extra
  // data.
  case EXPORT_COMPLETED:
    values = { filename: action.filename };
  case RENAMEACCOUNT_SUCCESS:
  case GETNEXTACCOUNT_SUCCESS:
  case CHANGEPASSPHRASE_SUCCESS:
  case REVOKETICKETS_SUCCESS:
  case IMPORTSCRIPT_SUCCESS:
    // willRescan will be false when importing just prior to a ticket purchase
    if (action.willRescan === false) break;
  case STOPAUTOBUYER_SUCCESS:
  case STARTAUTOBUYER_SUCCESS:
  case UPDATESTAKEPOOLCONFIG_SUCCESS:
  case SETSTAKEPOOLVOTECHOICES_SUCCESS:
  case REMOVESTAKEPOOLCONFIG:
  case SEEDCOPIEDTOCLIPBOARD:
  case PUBLISHUNMINEDTRANSACTIONS_SUCCESS:
    type = "Success";
    message = messages[action.type] || messages.defaultSuccessMessage;
    break;

  // all simple error messages. Note that the action *must* have an action.error
  // attribute.
  case WALLETREMOVED_FAILED:
  case RENAMEACCOUNT_FAILED:
  case GETNEXTACCOUNT_FAILED:
  case CHANGEPASSPHRASE_FAILED:
  case CONSTRUCTTX_FAILED:
  case SIGNTX_FAILED:
  case PUBLISHTX_FAILED:
  case PURCHASETICKETS_FAILED:
  case REVOKETICKETS_FAILED:
  case IMPORTSCRIPT_FAILED:
  case STARTAUTOBUYER_FAILED:
  case UPDATESTAKEPOOLCONFIG_FAILED:
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
  case GETPROPOSAL_FAILED:
  case SPVSYNC_FAILED:
  case UPDATEVOTECHOICE_FAILED:
  case GETACCOUNTEXTENDEDKEY_FAILED:
    type = "Error";
    message = messages[action.type] || messages.defaultErrorMessage;
    values = { originalError: String(action.error) };
    break;

  // success messages that add some context/interpolation/values.
  case PURCHASETICKETS_SUCCESS:
    type = "Success";
    message = messages[PURCHASETICKETS_SUCCESS];
    values = { numTickets: action.purchaseTicketsResponse.getTicketHashesList().length };
    break;

  case ADDCUSTOMSTAKEPOOL_SUCCESS:
    type = "Success";
    message = messages[ADDCUSTOMSTAKEPOOL_SUCCESS];
    values = { host: action.poolInfo.Host };
    break;
  }

  if (message && type) {
    const newMessage = { type, message, values };
    return { ...state, messages: [ ...state.messages, newMessage ] };
  }

  return { ...state };
}
