// @flow
import { transactionNtfs, accountNtfs } from "../middleware/grpc/client";
import { getAccountsAttempt, getStakeInfoAttempt,
  getTicketPriceAttempt, getNetworkAttempt } from "./ClientActions";
import { reverseHash } from "../helpers/byteActions";
import { TransactionNotificationsRequest, AccountNotificationsRequest} from "../middleware/walletrpc/api_pb";
import { GETTRANSACTIONS_PROGRESS_REGULAR, GETTRANSACTIONS_PROGRESS_COINBASE, GETTRANSACTIONS_PROGRESS_TICKET, GETTRANSACTIONS_PROGRESS_VOTE, GETTRANSACTIONS_PROGRESS_REVOKE } from "./ClientActions";
import { TransactionDetails }  from "../middleware/walletrpc/api_pb";
import { UPDATETIMESINCEBLOCK } from "./ClientActions";

export const TRANSACTIONNTFNS_START = "TRANSACTIONNTFNS_START";
export const TRANSACTIONNTFNS_FAILED = "TRANSACTIONNTFNS_FAILED";
export const TRANSACTIONNTFNS_DATA = "TRANSACTIONNTFNS_DATA";
export const TRANSACTIONNTFNS_DATA_UNMINED = "TRANSACTIONNTFNS_DATA_UNMINED";
export const TRANSACTIONNTFNS_DATA_UNMINED_UPDATE = "TRANSACTIONNTFNS_DATA_UNMINED_UPDATE";
export const TRANSACTIONNTFNS_SYNCING = "TRANSACTIONNTFNS_SYNCING";
export const TRANSACTIONNTFNS_END = "TRANSACTIONNTFNS_END";

function transactionNtfnsData(response) {
  return (dispatch, getState) => {
    const { neededBlocks } = getState().walletLoader;
    const { unmined } = getState().notifications;
    var currentHeight = 0;
    var { recentBlockTimestamp } = getState().grpc;
    if (response.getAttachedBlocksList().length > 0) {
      currentHeight = response.getAttachedBlocksList()[0].getHeight();
      if (currentHeight > neededBlocks) {
        const attachedBlocks = response.getAttachedBlocksList();
        var lastBlockTimestamp = attachedBlocks[attachedBlocks.length-1].getTimestamp();
        var recentBlockTime = new Date(recentBlockTimestamp*1000);
        var seconds = Math.floor((new Date() - recentBlockTime) / 1000);

        if (lastBlockTimestamp !== recentBlockTimestamp) {
          dispatch({recentBlockTimestamp: lastBlockTimestamp, type: UPDATETIMESINCEBLOCK });
        }

        // Only request other wallet information if it is within 30 minutes.
        // 60 * 30 == 30 minutes worth of seconds
        if (seconds < 60 * 30) {
          dispatch({response: response, type: TRANSACTIONNTFNS_DATA });
          setTimeout( () => {dispatch(getStakeInfoAttempt());}, 1000);
          setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);
          setTimeout( () => {dispatch(getAccountsAttempt());}, 1000);
          setTimeout( () => {dispatch(getNetworkAttempt());}, 1000);

          // check to see if any recent unmined tx have been mined
          var updatedUnmined = Array();
          const { regularTransactionsInfo } = getState().grpc;
          const { coinbaseTransactionsInfo } = getState().grpc;
          const { ticketTransactionsInfo } = getState().grpc;
          const { voteTransactionsInfo } = getState().grpc;
          const { revokeTransactionsInfo } = getState().grpc;
          var updatedRegular = regularTransactionsInfo.slice();
          var updatedCoinbase = coinbaseTransactionsInfo.slice();
          var updatedTicket = ticketTransactionsInfo.slice();
          var updatedVote = voteTransactionsInfo.slice();
          var updatedRevoke = revokeTransactionsInfo.slice();
          for (var k = 0; k < unmined.length; k++) {
            var unminedFound = false;
            for (var j = 0; j < attachedBlocks.length; j++){
              var index = 0;
              for (var i = 0; i < attachedBlocks[j].getTransactionsList().length; i++) {
                if (Buffer.from(unmined[k].getHash()).toString("hex") == Buffer.from(attachedBlocks[j].getTransactionsList()[i].getHash()).toString("hex")) {
                  var tx = {
                    height: attachedBlocks[j].getHeight(),
                    index: index,
                    hash: attachedBlocks[j].getTransactionsList()[i].getHash(),
                    tx: attachedBlocks[j].getTransactionsList()[i],
                    timestamp: attachedBlocks[j].getTimestamp(),
                    blockHash: attachedBlocks[j].getHash(),
                    type: attachedBlocks[j].getTransactionsList()[i].getTransactionType(),
                  };
                  if (tx.type == TransactionDetails.TransactionType.REGULAR) {
                    console.log("here somehow?");
                    updatedRegular.unshift(tx);
                  } else if (tx.type == TransactionDetails.TransactionType.COINBASE) {
                    updatedCoinbase.unshift(tx);
                  } else if (tx.type == TransactionDetails.TransactionType.TICKET_PURCHASE) {
                    updatedTicket.unshift(tx);
                  } else if (tx.type == TransactionDetails.TransactionType.VOTE) {
                    updatedVote.unshift(tx);
                  } else if (tx.type == TransactionDetails.TransactionType.REVOKE) {
                    updatedRevoke.unshift(tx);
                  }
                  unminedFound = true;
                  index++;
                  break;
                }
              }
              if (unminedFound) {
                break;
              }
            }
            if (!unminedFound) {
              updatedUnmined.push(unmined[k]);
            }
          }
          if (unmined.length != updatedUnmined.length) {
            if (updatedRegular.length !== regularTransactionsInfo.length) {
              dispatch({ regularTransactionsInfo: updatedRegular, type: GETTRANSACTIONS_PROGRESS_REGULAR });
            }
            if (updatedCoinbase.length !== coinbaseTransactionsInfo.length) {
              dispatch({ coinbaseTransactionsInfo: updatedCoinbase, type: GETTRANSACTIONS_PROGRESS_COINBASE });
            }
            if (updatedTicket.length !== ticketTransactionsInfo.length) {
              dispatch({ ticketTransactionsInfo: updatedTicket, type: GETTRANSACTIONS_PROGRESS_TICKET });
            }
            if (updatedVote.length !== voteTransactionsInfo.length) {
              dispatch({ voteTransactionsInfo: updatedVote, type: GETTRANSACTIONS_PROGRESS_VOTE });
            }
            if (updatedRevoke.length !== revokeTransactionsInfo.length) {
              dispatch({ revokeTransactionsInfo: updatedRevoke, type: GETTRANSACTIONS_PROGRESS_REVOKE });
            }
            dispatch({unmined: updatedUnmined, type: TRANSACTIONNTFNS_DATA_UNMINED_UPDATE});
          }
        } else if (attachedBlocks[attachedBlocks.length-1].getHeight()%100 == 0) {
          dispatch({response: response, type: TRANSACTIONNTFNS_DATA });
        }
      } else if (currentHeight%100 == 0) {
        var syncedToTimestamp = response.getAttachedBlocksList()[0].getTimestamp();
        dispatch({
          currentHeight: currentHeight,
          syncedToTimestamp: syncedToTimestamp,
          type: TRANSACTIONNTFNS_SYNCING });
      }
    } else if (response.getUnminedTransactionsList().length > 0) {
      for (var z = 0; z < response.getUnminedTransactionsList().length; z++) {
        var found = false;
        for (var y = 0; y < unmined.length; y++) {
          if (Buffer.from(unmined[y].getHash()).toString("hex") == Buffer.from(response.getUnminedTransactionsList()[z].getHash()).toString("hex")) {
            found = true;
            break;
          }
        }
        if (!found) {
          var type = "Regular";
          var fee = response.getUnminedTransactionsList()[z].getFee();
          var inputAmts = 0;
          var outputAmts = 0;
          for (i = 0; i < response.getUnminedTransactionsList()[z].getDebitsList().length; i++) {
            inputAmts += response.getUnminedTransactionsList()[z].getDebitsList()[i].getPreviousAmount();
          }
          for (i = 0; i < response.getUnminedTransactionsList()[z].getCreditsList().length; i++) {
            outputAmts += response.getUnminedTransactionsList()[z].getCreditsList()[i].getAmount();
          }
          var amount = outputAmts - inputAmts;
          if (response.getUnminedTransactionsList()[z].getTransactionType() == TransactionDetails.TransactionType.COINBASE) {
            type = "Coinbase";
          } else if (response.getUnminedTransactionsList()[z].getTransactionType() == TransactionDetails.TransactionType.TICKET_PURCHASE) {
            amount = outputAmts;
            type = "Ticket";
          } else if (response.getUnminedTransactionsList()[z].getTransactionType() == TransactionDetails.TransactionType.VOTE) {
            type = "Vote";
            setTimeout( () => {dispatch(getAccountsAttempt());}, 4000);
          } else if (response.getUnminedTransactionsList()[z].getTransactionType() == TransactionDetails.TransactionType.REVOKE) {
            type = "Revoke";
            setTimeout( () => {dispatch(getAccountsAttempt());}, 4000);
          }

          if (type == "Regular" && amount > 0) {
            type = "Receive";
            setTimeout( () => {dispatch(getAccountsAttempt());}, 4000);
          } else if (type == "Regular" && amount < 0 && (fee == Math.abs(amount))) {
            type = "Transfer";
          } else if (type == "Regular" && amount < 0 && (fee != Math.abs(amount))) {
            type = "Send";
          }
          var message = {
            txHash: reverseHash(Buffer.from(response.getUnminedTransactionsList()[z].getHash()).toString("hex")),
            type: type,
            amount: amount,
            fee: fee,
          };
          dispatch({unmined: response.getUnminedTransactionsList()[z], unminedMessage: message, type: TRANSACTIONNTFNS_DATA_UNMINED });
        }
      }
    }
  };
}

export function transactionNtfnsStart() {
  var request = new TransactionNotificationsRequest();
  return (dispatch, getState) => {
    dispatch({ type: TRANSACTIONNTFNS_START });
    const { walletService } = getState().grpc;
    transactionNtfs(walletService, request,
      function(data) {
        dispatch(transactionNtfnsData(data));
      }
    );
  };
}

export function transactionNtfnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNTFNS_END });
    //
  };
}

export const ACCOUNTNTFNS_START = "ACCOUNTNTFNS_START";
export const ACCOUNTNTFNS_FAILED = "ACCOUNTNTFNS_FAILED";
export const ACCOUNTNTFNS_DATA = "ACCOUNTNTFNS_DATA";
export const ACCOUNTNTFNS_END = "ACCOUNTNTFNS_END";

export function accountNtfnsStart() {
  var request = new AccountNotificationsRequest();
  return (dispatch, getState) => {
    dispatch({request: request, type: ACCOUNTNTFNS_START });
    const { walletService } = getState().grpc;
    accountNtfs(walletService, request,
      function(data) {
        dispatch({ response: data, type: ACCOUNTNTFNS_DATA });
      }
    );
  };
}

export function accountNtfnsEnd() {
  return (dispatch) => {
    dispatch({ type: ACCOUNTNTFNS_END });
    //
  };
}

export const CLEARUNMINEDMESSAGE = "CLEARUNMINEDMESSAGE";
export function clearNewUnminedMessage() {
  return { type: CLEARUNMINEDMESSAGE };
}
