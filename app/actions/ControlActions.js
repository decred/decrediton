import { getBalanceAttempt, getTransactionInfoAttempt, getAccountsAttempt } from './ClientActions';
import { ChangePassphraseRequest, RenameAccountRequest,  RescanRequest,
  NextAccountRequest, NextAddressRequest, ImportPrivateKeyRequest, ImportScriptRequest,
  ConstructTransactionRequest, SignTransactionRequest,
  PublishTransactionRequest, PurchaseTicketsRequest, RevokeTicketsRequest, LoadActiveDataFiltersRequest,
  StartAutoBuyerRequest, StopAutoBuyerRequest, TicketBuyerConfigRequest,
  SetAccountRequest, SetBalanceToMaintainRequest, SetMaxFeeRequest, SetMaxPriceAbsoluteRequest,
  SetMaxPriceRelativeRequest, SetVotingAddressRequest, SetPoolAddressRequest, SetPoolFeesRequest,
  SetMaxPerBlockRequest,
  } from '../middleware/walletrpc/api_pb';
import { getCfg } from '../config.js';

export const GETNEXTADDRESS_ATTEMPT = 'GETNEXTADDRESS_ATTEMPT';
export const GETNEXTADDRESS_FAILED = 'GETNEXTADDRESS_FAILED';
export const GETNEXTADDRESS_SUCCESS = 'GETNEXTADDRESS_SUCCESS';

function getNextAddressError(error) {
  return { error, type: GETNEXTADDRESS_FAILED };
}

function getNextAddressSuccess(getNextAddressResponse) {
  return { getNextAddressResponse: getNextAddressResponse, type: GETNEXTADDRESS_SUCCESS };
}

export function getNextAddressAttempt(accountNum) {
  var request = new NextAddressRequest();
  request.setAccount(accountNum);
  request.setKind(0);
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETNEXTADDRESS_ATTEMPT });
    dispatch(getNextAddressAction());
  };
}

function getNextAddressAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { getNextAddressRequest } = getState().control;
    walletService.nextAddress(getNextAddressRequest,
        function(err, getNextAddressResponse) {
          if (err) {
            dispatch(getNextAddressError(err + ' Please try again'));
          } else {
            getNextAddressResponse.accountNumber = getNextAddressRequest.getAccount();
            dispatch(getNextAddressSuccess(getNextAddressResponse));
          }
        });
  };
}

export const RENAMEACCOUNT_ATTEMPT = 'RENAMEACCOUNT_ATTEMPT';
export const RENAMEACCOUNT_FAILED = 'RENAMEACCOUNT_FAILED';
export const RENAMEACCOUNT_SUCCESS = 'RENAMEACCOUNT_SUCCESS';
export const RENAMEACCOUNT_CLEAR_ERROR = 'RENAMEACCOUNT_CLEAR_ERROR';
export const RENAMEACCOUNT_CLEAR_SUCCESS= 'RENAMEACCOUNT_CLEAR_SUCCESS';
function renameAccountError(error) {
  return { error, type: RENAMEACCOUNT_FAILED };
}

function renameAccountSuccess(renameAccountResponse) {
  var successMsg = 'You have successfully updated the account name.';
  return (dispatch) => {
    dispatch({ renameAccountSuccess: successMsg, renameAccountResponse: renameAccountResponse, type: RENAMEACCOUNT_SUCCESS });
    dispatch(getAccountsAttempt());
  };

}

export function renameAccountAttempt(accountNumber, newName) {
  var request = new RenameAccountRequest();
  request.setAccountNumber(accountNumber);
  request.setNewName(newName);
  return (dispatch) => {
    dispatch({
      request: request,
      type: RENAMEACCOUNT_ATTEMPT });
    dispatch(renameAccountAction());
  };
}

function renameAccountAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { renameAccountRequest } = getState().control;
    walletService.renameAccount(renameAccountRequest,
        function(err, renameAccountResponse) {
          if (err) {
            dispatch(renameAccountError(err + ' Please try again'));
          } else {
            dispatch(renameAccountSuccess(renameAccountResponse));
          }
        });
  };
}
export function clearRenameAccountSuccess() {
  return (dispatch, getState) => {
    const { renameAccountSuccess } = getState().control;
    if (renameAccountSuccess !== null) {
      dispatch({type: RENAMEACCOUNT_CLEAR_SUCCESS});
    }
  };
}

export function clearRenameAccountError() {
  return (dispatch, getState) => {
    const { renameAccountError } = getState().control;
    if ( renameAccountError !== null) {
      dispatch({type: RENAMEACCOUNT_CLEAR_ERROR});
    }
  };
}
export const RESCAN_ATTEMPT = 'RESCAN_ATTEMPT';
export const RESCAN_FAILED = 'RESCAN_FAILED';
export const RESCAN_PROGRESS = 'RESCAN_PROGRESS';
export const RESCAN_COMPLETE = 'RESCAN_COMPLETE';

function rescanProgress(rescanResponse) {
  return { rescanResponse: rescanResponse, type: RESCAN_PROGRESS };
}

function rescanComplete() {
  return (dispatch) => {
    dispatch({ type: RESCAN_COMPLETE });
    setTimeout( () => {dispatch(getBalanceAttempt());}, 1000);
    setTimeout( () => {dispatch(getTransactionInfoAttempt());}, 1000);
  };
}

export function rescanAttempt(beginHeight) {
  var request = new RescanRequest();
  request.setBeginHeight(beginHeight);
  return (dispatch) => {
    dispatch({
      request: request,
      type: RESCAN_ATTEMPT });
    dispatch(rescanAction());
  };
}

function rescanAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { rescanRequest } = getState().control;
    var rescanCall = walletService.rescan(rescanRequest);
    rescanCall.on('data', function(response) {
      console.log('Rescanned thru', response.getRescannedThrough());
      dispatch(rescanProgress(response));
    });
    rescanCall.on('end', function() {
      console.log('Rescan done');
      dispatch(rescanComplete());
    });
    rescanCall.on('status', function(status) {
      console.log('Rescan status:', status);
    });
  };
}

export const GETNEXTACCOUNT_ATTEMPT = 'GETNEXTACCOUNT_ATTEMPT';
export const GETNEXTACCOUNT_FAILED = 'GETNEXTACCOUNT_FAILED';
export const GETNEXTACCOUNT_SUCCESS = 'GETNEXTACCOUNT_SUCCESS';
export const GETNEXTACCOUNT_CLEAR_ERROR = 'GETNEXTACCOUNT_CLEAR_ERROR';
export const GETNEXTACCOUNT_CLEAR_SUCCESS= 'GETNEXTACCOUNT_CLEAR_SUCCESS';

function getNextAccountError(error) {
  return { error, type: GETNEXTACCOUNT_FAILED };
}

function getNextAccountSuccess(getNextAccountResponse, accountName) {
  var success = 'Account - ' + accountName + ' - has been successfully created.';
  return (dispatch) => {
    dispatch({getNextAccountResponse: getNextAccountResponse, type: GETNEXTACCOUNT_SUCCESS, successMessage: success });
    dispatch(getAccountsAttempt());
  };
}

export function getNextAccountAttempt(passphrase, accountName) {
  var request = new NextAccountRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccountName(accountName);
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETNEXTACCOUNT_ATTEMPT });
    dispatch(getNextAccountAction());
  };
}

function getNextAccountAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { getNextAccountRequest } = getState().control;
    walletService.nextAccount(getNextAccountRequest,
        function(err, getNextAccountResponse) {
          if (err) {
            dispatch(getNextAccountError(err + ' Please try again'));
          } else {
            dispatch(getNextAccountSuccess(getNextAccountResponse, getNextAccountRequest.getAccountName()));
          }
        });
  };
}

export function clearNewAccountSuccess() {
  return (dispatch, getState) => {
    const { getNextAccountSuccess } = getState().control;
    if (getNextAccountSuccess !== null) {
      dispatch({type: GETNEXTACCOUNT_CLEAR_SUCCESS});
    }
  };
}

export function clearNewAccountError() {
  return (dispatch, getState) => {
    const { getNextAccountError } = getState().control;
    if (getNextAccountError !== null) {
      dispatch({type: GETNEXTACCOUNT_CLEAR_ERROR});
    }
  };
}
export const IMPORTPRIVKEY_ATTEMPT = 'IMPORTPRIVKEY_ATTEMPT';
export const IMPORTPRIVKEY_FAILED = 'IMPORTPRIVKEY_FAILED';
export const IMPORTPRIVKEY_SUCCESS = 'IMPORTPRIVKEY_SUCCESS';

function importPrivateKeyError(error) {
  return { error, type: IMPORTPRIVKEY_FAILED };
}

function importPrivateKeySuccess(importPrivateKeyResponse) {
  return { importPrivateKeyResponse: importPrivateKeyResponse, type: IMPORTPRIVKEY_SUCCESS };
}

export function importPrivateKeyAttempt(passphrase, accountNum, wif, rescan, scanFrom) {
  var request = new ImportPrivateKeyRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccount(accountNum);
  request.setPrivateKeyWif(wif);
  request.setRescan(rescan);
  request.setScanFrom(scanFrom);

  return (dispatch) => {
    dispatch({
      request: request,
      type: IMPORTPRIVKEY_ATTEMPT });
    dispatch(importPrivateKeyAction());
  };
}

function importPrivateKeyAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { importPrivateKeyRequest } = getState().control;
    walletService.importPrivateKey(importPrivateKeyRequest,
        function(err, importPrivateKeyResponse) {
          if (err) {
            dispatch(importPrivateKeyError(err + ' Please try again'));
          } else {
            dispatch(importPrivateKeySuccess(importPrivateKeyResponse));
          }
        });
  };
}

export const IMPORTSCRIPT_ATTEMPT = 'IMPORTSCRIPT_ATTEMPT';
export const IMPORTSCRIPT_FAILED = 'IMPORTSCRIPT_FAILED';
export const IMPORTSCRIPT_SUCCESS = 'IMPORTSCRIPT_SUCCESS';
export const IMPORTSCRIPT_CLEAR_ERROR = 'IMPORTSCRIPT_CLEAR_ERROR';
export const IMPORTSCRIPT_CLEAR_SUCCESS= 'IMPORTSCRIPT_CLEAR_SUCCESS';


function importScriptError(error) {
  return { error, type: IMPORTSCRIPT_FAILED };
}

function importScriptSuccess(importScriptResponse, votingAddress) {
  var message = 'Script successfully imported, rescanning now';
  return (dispatch) => {
    if (!votingAddress) {
      if (importScriptResponse.getRedeemable()) {
        dispatch({ importScriptSuccess: message, importScriptResponse: importScriptResponse, type: IMPORTSCRIPT_SUCCESS });
      } else {
        var error = 'This script is not redeemable by this wallet.';
        dispatch({ error, type: IMPORTSCRIPT_FAILED });
      }
    } else {
      if (importScriptResponse.getRedeemable() && importScriptResponse.getP2shAddress() == votingAddress) {
        dispatch(purchaseTicketsAction());
      } else {
        if (importScriptResponse.getP2shAddress() != votingAddress) {
          error = 'The stakepool voting address is not the P2SH address of the voting redeem script. This could be due to trying to use a stakepool that is configured for a different wallet. If this is not the case, please report this to the stakepool administrator and the Decred devs.';
          dispatch({ error, type: PURCHASETICKETS_FAILED });
        } else {
          error = 'This script is not redeemable by this wallet.';
          dispatch({ error, type: PURCHASETICKETS_FAILED });
        }
      }
    }
  };
}

export function importScriptAttempt(passphrase, script, rescan, scanFrom, votingAddress) {
  var request = new ImportScriptRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setScript(new Uint8Array(Buffer.from(hexToBytes(script))));
  request.setRescan(rescan);
  request.setScanFrom(scanFrom);
  return (dispatch) => {
    dispatch({
      request: request,
      type: IMPORTSCRIPT_ATTEMPT });
    dispatch(importScriptAction(votingAddress));
  };
}

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function importScriptAction(purchaseTickets) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { importScriptRequest } = getState().control;
    walletService.importScript(importScriptRequest,
        function(err, importScriptResponse) {
          if (err) {
            dispatch(importScriptError(err + ' Please try again'));
          } else {
            dispatch(importScriptSuccess(importScriptResponse, purchaseTickets));
          }
        });
  };
}

export function clearImportScriptSuccess() {
  return (dispatch, getState) => {
    const { importScriptSuccess } = getState().control;
    if (importScriptSuccess !== '') {
      dispatch({type: IMPORTSCRIPT_CLEAR_SUCCESS});
    }
  };
}

export function clearImportScriptError() {
  return (dispatch, getState) => {
    const { importScriptError } = getState().control;
    if (importScriptError !== null) {
      dispatch({type: IMPORTSCRIPT_CLEAR_ERROR});
    }
  };
}

export const CHANGEPASSPHRASE_ATTEMPT = 'CHANGEPASSPHRASE_ATTEMPT';
export const CHANGEPASSPHRASE_FAILED = 'CHANGEPASSPHRASE_FAILED';
export const CHANGEPASSPHRASE_SUCCESS = 'CHANGEPASSPHRASE_SUCCESS';
export const CHANGEPASSPHRASE_CLEAR_ERROR = 'CHANGEPASSPHRASE_CLEAR_ERROR';
export const CHANGEPASSPHRASE_CLEAR_SUCCESS = 'CHANGEPASSPHRASE_CLEAR_SUCCESS';

function changePassphraseError(error) {
  return { error, type: CHANGEPASSPHRASE_FAILED };
}

function changePassphraseSuccess(changePassphraseResponse) {
  return { changePassphraseResponse: changePassphraseResponse, type: CHANGEPASSPHRASE_SUCCESS };
}

export function changePassphraseAttempt(oldPass, newPass, priv) {
  var request = new ChangePassphraseRequest();
  if (priv) {
    request.setKey(ChangePassphraseRequest.Key.PRIVATE);
  } else {
    request.setKey(ChangePassphraseRequest.Key.PUBLIC);
  }
  request.setOldPassphrase(new Uint8Array(Buffer.from(oldPass)));
  request.setNewPassphrase(new Uint8Array(Buffer.from(newPass)));
  return (dispatch) => {
    dispatch({
      request: request,
      type: CHANGEPASSPHRASE_ATTEMPT });
    dispatch(changePassphraseAction());
  };
}

function changePassphraseAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { changePassphraseRequest } = getState().control;
    walletService.changePassphrase(changePassphraseRequest,
        function(err, changePassphraseResponse) {
          if (err) {
            dispatch(changePassphraseError(err + ' Please try again'));
          } else {
            dispatch(changePassphraseSuccess(changePassphraseResponse));
          }
        });
  };
}

export function clearChangePassphraseSuccess() {
  return (dispatch, getState) => {
    const { changePassphraseSuccess } = getState().control;
    if (changePassphraseSuccess !== '') {
      dispatch({type: CHANGEPASSPHRASE_CLEAR_SUCCESS});
    }
  };
}

export function clearChangePassphraseError() {
  return (dispatch, getState) => {
    const { changePassphraseError } = getState().control;
    if (changePassphraseError !== null) {
      dispatch({type: CHANGEPASSPHRASE_CLEAR_ERROR});
    }
  };
}

export const LOADACTIVEDATAFILTERS_ATTEMPT = 'LOADACTIVEDATAFILTERS_ATTEMPT';
export const LOADACTIVEDATAFILTERS_FAILED= 'LOADACTIVEDATAFILTERS_FAILED';
export const LOADACTIVEDATAFILTERS_SUCCESS = 'LOADACTIVEDATAFILTERS_SUCCESS';

function loadActiveDataFiltersError(error) {
  return { error, type: LOADACTIVEDATAFILTERS_FAILED };
}

function loadActiveDataFiltersSuccess(response) {
  return (dispatch) => {
    dispatch({response: response, type: LOADACTIVEDATAFILTERS_SUCCESS });
  };
}

export function loadActiveDataFiltersAttempt() {
  var request = new LoadActiveDataFiltersRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: LOADACTIVEDATAFILTERS_ATTEMPT });
    dispatch(loadActiveDataFiltersAction());
  };
}

function loadActiveDataFiltersAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { loadActiveDataFiltersRequest } = getState().control;
    walletService.loadActiveDataFilters(loadActiveDataFiltersRequest,
        function(err, response) {
          if (err) {
            dispatch(loadActiveDataFiltersError(err + ' Please try again'));
          } else {
            dispatch(loadActiveDataFiltersSuccess(response));
          }
        });
  };
}

export const CLEARTX = 'CLEARTX';

export function clearTransaction() {
  return{ type: CLEARTX };
}

export const SIGNTX_ATTEMPT = 'SIGNTX_ATTEMPT';
export const SIGNTX_FAILED = 'SIGNTX_FAILED';
export const SIGNTX_SUCCESS = 'SIGNTX_SUCCESS';

function signTransactionError(error) {
  return { error, type: SIGNTX_FAILED };
}

function signTransactionSuccess(signTransactionResponse) {
  return (dispatch) => {
    dispatch({signTransactionResponse: signTransactionResponse, type: SIGNTX_SUCCESS });
    dispatch(publishTransactionAttempt(signTransactionResponse.getTransaction()));
  };
}

export function signTransactionAttempt(passphrase, rawTx) {

  return (dispatch) => {
    dispatch({
      request: {},
      type: SIGNTX_ATTEMPT });
    dispatch(signTransactionAction(passphrase, rawTx));
  };
}

function signTransactionAction(passphrase, rawTx) {
  var request = new SignTransactionRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setSerializedTransaction(new Uint8Array(Buffer.from(rawTx)));
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    walletService.signTransaction(request,
        function(err, signTransactionResponse) {
          if (err) {
            dispatch(signTransactionError(err + ' Please try again'));
          } else {
            dispatch(signTransactionSuccess(signTransactionResponse));
          }
        });
  };
}

export const PUBLISHTX_ATTEMPT = 'PUBLISHTX_ATTEMPT';
export const PUBLISHTX_FAILED = 'PUBLISHTX_FAILED';
export const PUBLISHTX_SUCCESS = 'PUBLISHTX_SUCCESS';

function publishTransactionError(error) {
  return { error, type: PUBLISHTX_FAILED };
}

function publishTransactionSuccess(publishTransactionResponse) {
  return { publishTransactionResponse: Buffer.from(publishTransactionResponse.getTransactionHash()), type: PUBLISHTX_SUCCESS };
}

export function publishTransactionAttempt(tx) {
  var request = new PublishTransactionRequest();
  request.setSignedTransaction(new Uint8Array(Buffer.from(tx)));
  return (dispatch) => {
    dispatch({
      request: request,
      type: PUBLISHTX_ATTEMPT });
    dispatch(publishTransactionAction());
  };
}

function publishTransactionAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { publishTransactionRequest } = getState().control;
    walletService.publishTransaction(publishTransactionRequest,
        function(err, publishTransactionResponse) {
          if (err) {
            dispatch(publishTransactionError(err + ' Please try again'));
          } else {
            dispatch(publishTransactionSuccess(publishTransactionResponse));
          }
        });
  };
}

export const CONSTRUCTTX_CLEAR_ERROR = 'CONSTRUCTTX_CLEAR_ERROR';
export const PUBLISHTX_CLEAR_ERROR = 'PUBLISHTX_CLEAR_ERROR';
export const SIGNTX_CLEAR_ERROR = 'SIGNTX_CLEAR_ERROR';
export const PUBLISHTX_CLEAR_SUCCESS = 'PUBLISHTX_CLEAR_SUCCESS';

export function clearConstructTxError() {
  return (dispatch, getState) => {
    const { constructTxError } = getState().control;
    if (constructTxError !== null) {
      dispatch({type: CONSTRUCTTX_CLEAR_ERROR});
    }
  };
}

export function clearPublishTxError() {
  return (dispatch, getState) => {
    const { publishTransactionError } = getState().control;
    if (publishTransactionError !== null) {
      dispatch({type: PUBLISHTX_CLEAR_ERROR});
    }
  };
}

export function clearSignTxError() {
  return (dispatch, getState) => {
    const { signTransactionError } = getState().control;
    if (signTransactionError !== null) {
      dispatch({type: SIGNTX_CLEAR_ERROR});
    }
  };
}

export function clearPublishTxSuccess() {
  return (dispatch, getState) => {
    const { publishTransactionResponse } = getState().control;
    if (publishTransactionResponse !== null) {
      dispatch({type: PUBLISHTX_CLEAR_SUCCESS});
    }
  };
}

export const PURCHASETICKETS_ATTEMPT = 'PURCHASETICKETS_ATTEMPT';
export const PURCHASETICKETS_FAILED = 'PURCHASETICKETS_FAILED';
export const PURCHASETICKETS_SUCCESS = 'PURCHASETICKETS_SUCCESS';
export const PURCHASETICKETS_CLEAR_ERROR = 'PURCHASETICKETS_CLEAR_ERROR';
export const PURCHASETICKETS_CLEAR_SUCCESS= 'PURCHASETICKETS_CLEAR_SUCCESS';

function purchaseTicketsError(error) {
  return { error, type: PURCHASETICKETS_FAILED };
}

function purchaseTicketsSuccess(purchaseTicketsResponse) {
  var success = 'You successfully purchased ' + purchaseTicketsResponse.getTicketHashesList().length + ' tickets.';
  return { success: success, purchaseTicketsResponse: purchaseTicketsResponse, type: PURCHASETICKETS_SUCCESS };
}

export function purchaseTicketsAttempt(passphrase, accountNum, spendLimit, requiredConf,
numTickets, expiry, ticketFee, txFee, stakepool) {
  var request = new PurchaseTicketsRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccount(accountNum);
  request.setSpendLimit(spendLimit);
  request.setRequiredConfirmations(requiredConf);
  request.setTicketAddress(stakepool.TicketAddress);
  request.setNumTickets(numTickets);
  request.setPoolAddress(stakepool.PoolAddress);
  request.setPoolFees(stakepool.PoolFees);
  request.setExpiry(0);
  request.setTxFee(txFee*1e8);
  request.setTicketFee(ticketFee*1e8);

  return (dispatch) => {
    dispatch({
      request: request,
      type: PURCHASETICKETS_ATTEMPT });
    dispatch(importScriptAttempt(passphrase, stakepool.Script, true, 0, stakepool.TicketAddress));
  };
}

function purchaseTicketsAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { purchaseTicketsRequest } = getState().control;
    walletService.purchaseTickets(purchaseTicketsRequest,
        function(err, purchaseTicketsResponse) {
          if (err) {
            dispatch(purchaseTicketsError(err + ' Please try again'));
          } else {
            dispatch(purchaseTicketsSuccess(purchaseTicketsResponse));
          }
        });
  };
}

export function clearPurchaseTicketsSuccess() {
  return (dispatch, getState) => {
    const { purchaseTicketsSuccess } = getState().control;
    if (purchaseTicketsSuccess !== '') {
      dispatch({type: PURCHASETICKETS_CLEAR_SUCCESS});
    }
  };
}

export function clearPurchaseTicketsError() {
  return (dispatch, getState) => {
    const { purchaseTicketsError } = getState().control;
    if (purchaseTicketsError !== null) {
      dispatch({type: PURCHASETICKETS_CLEAR_ERROR});
    }
  };
}

export const REVOKETICKETS_ATTEMPT = 'REVOKETICKETS_ATTEMPT';
export const REVOKETICKETS_FAILED = 'REVOKETICKETS_FAILED';
export const REVOKETICKETS_SUCCESS = 'REVOKETICKETS_SUCCESS';
export const REVOKETICKETS_CLEAR_ERROR = 'REVOKETICKETS_CLEAR_ERROR';
export const REVOKETICKETS_CLEAR_SUCCESS= 'REVOKETICKETS_CLEAR_SUCCESS';

function revokeTicketsError(error) {
  return { error, type: REVOKETICKETS_FAILED };
}

function revokeTicketsSuccess(revokeTicketsResponse) {
  var success = 'You successfully revoked tickets.';
  return { success: success, revokeTicketsResponse: revokeTicketsResponse, type: REVOKETICKETS_SUCCESS };
}

export function revokeTicketsAttempt(passphrase) {
  var request = new RevokeTicketsRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));

  return (dispatch) => {
    dispatch({
      request: request,
      type: REVOKETICKETS_ATTEMPT });
    dispatch(revokeTicketsAction());
  };
}

function revokeTicketsAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { revokeTicketsRequest } = getState().control;
    walletService.revokeTickets(revokeTicketsRequest,
        function(err, revokeTicketsResponse) {
          if (err) {
            dispatch(revokeTicketsError(err + ' Please try again'));
          } else {
            dispatch(revokeTicketsSuccess(revokeTicketsResponse));
          }
        });
  };
}

export function clearRevokeTicketsSuccess() {
  return (dispatch, getState) => {
    const { revokeTicketsSuccess } = getState().control;
    if (revokeTicketsSuccess !== '') {
      dispatch({type: REVOKETICKETS_CLEAR_SUCCESS});
    }
  };
}

export function clearRevokeTicketsError() {
  return (dispatch, getState) => {
    const { revokeTicketsError } = getState().control;
    if (revokeTicketsError !== null) {
      dispatch({type: REVOKETICKETS_CLEAR_ERROR});
    }
  };
}

export const GETTICKETBUYERCONFIG_ATTEMPT = 'GETTICKETBUYERCONFIG_ATTEMPT';
export const GETTICKETBUYERCONFIG_FAILED = 'GETTICKETBUYERCONFIG_FAILED';
export const GETTICKETBUYERCONFIG_SUCCESS = 'GETTICKETBUYERCONFIG_SUCCESS';

function getTicketBuyerConfigError(error) {
  return { error, type: GETTICKETBUYERCONFIG_FAILED };
}

function getTicketBuyerConfigSuccess(ticketBuyerConfig) {
  return (dispatch) => {
    dispatch({ ticketBuyerConfig: ticketBuyerConfig, type: GETTICKETBUYERCONFIG_SUCCESS });
  };
}

export function getTicketBuyerConfigAttempt() {
  return (dispatch) => {
    dispatch({ type: GETTICKETBUYERCONFIG_ATTEMPT });
    dispatch(getTicketBuyerConfigAction());
  };
}

function getTicketBuyerConfigAction() {
  var request = new TicketBuyerConfigRequest();
  return (dispatch, getState) => {
    const { ticketBuyerService } = getState().grpc;
    ticketBuyerService.ticketBuyerConfig(request, function (err, ticketBuyerConfig) {
      if (err) {
        dispatch(getTicketBuyerConfigError(err + ' Please try again'));
      } else {
        dispatch(getTicketBuyerConfigSuccess(ticketBuyerConfig));
      }
    });
  };
}

export const SETTICKETBUYERCONFIG_ATTEMPT = 'SETTICKETBUYERCONFIG_ATTEMPT';
export const SETTICKETBUYERCONFIG_FAILED = 'SETTICKETBUYERCONFIG_FAILED';
export const SETTICKETBUYERCONFIG_SUCCESS = 'SETTICKETBUYERCONFIG_SUCCESS';

function setTicketBuyerConfigError(error) {
  return { error, type: SETTICKETBUYERCONFIG_FAILED };
}

function setTicketBuyerConfigSuccess() {
  return (dispatch) => {
    dispatch({ success: 'Ticket buyer settings have been successfully updated.', type: SETTICKETBUYERCONFIG_SUCCESS });
    // something is hanging config request XXX
    dispatch(getTicketBuyerConfigAttempt());
  };
}

export function setTicketBuyerConfigAttempt(account, balanceToMaintain, maxFee, maxPriceAbsolute, maxPriceRelative,
  stakePool, maxPerBlock) {
  return (dispatch) => {
    dispatch({ type: SETTICKETBUYERCONFIG_ATTEMPT });
    dispatch(setTicketBuyerConfigAction(account, balanceToMaintain, maxFee, maxPriceAbsolute, maxPriceRelative,
      stakePool, maxPerBlock));
  };
}

export const SETBALANCETOMAINTAIN = 'SETBALANCETOMAINTAIN';
export const SETMAXFEE = 'SETMAXFEE';
export const SETMAXPRICEABSOLUTE = 'SETMAXPRICEABSOLUTE';
export const SETMAXPRICERELATIVE = 'SETMAXPRICERELATIVE';
export const SETMAXPERBLOCK = 'SETMAXPERBLOCK';

function setTicketBuyerConfigAction(account, balanceToMaintain, maxFee, maxPriceAbsolute, maxPriceRelative,
  stakePool, maxPerBlock) {
  var cfg = getCfg();
  return (dispatch, getState) => {
    const { ticketBuyerService } = getState().grpc;
    const { getTicketBuyerConfigResponse } = getState().control;
    var hitError = '';
    if (account != getTicketBuyerConfigResponse.getAccount()) {
      var request = new SetAccountRequest();
      request.setAccount(account);
      ticketBuyerService.setAccount(request, function (err) {
        if (err) {
          hitError += err + '. ';
        }
      });
    }
    if (balanceToMaintain*1e8 != getTicketBuyerConfigResponse.getBalanceToMaintain()) {
      request = new SetBalanceToMaintainRequest();
      request.setBalanceToMaintain(balanceToMaintain*1e8);
      ticketBuyerService.setBalanceToMaintain(request, function (err) {
        if (err) {
          hitError += err + '. ';
        } else {
          cfg.set('balancetomaintain', balanceToMaintain);
          dispatch({balanceToMaintain: balanceToMaintain, type: SETBALANCETOMAINTAIN});
        }
      });
    }
    if (maxFee*1e8 != getTicketBuyerConfigResponse.getMaxFee()) {
      request = new SetMaxFeeRequest();
      request.setMaxFeePerKb(maxFee*1e8);
      ticketBuyerService.setMaxFee(request, function (err) {
        if (err) {
          hitError += err + '. ';
        } else {
          cfg.set('maxfee', maxFee);
          dispatch({maxFee: maxFee, type: SETMAXFEE});
        }
      });
    }
    if (maxPriceAbsolute*1e8 != getTicketBuyerConfigResponse.getMaxPriceAbsolute()) {
      request = new SetMaxPriceAbsoluteRequest();
      request.setMaxPriceAbsolute(maxPriceAbsolute*1e8);
      ticketBuyerService.setMaxPriceAbsolute(request, function (err) {
        if (err) {
          hitError += err + '. ';
        } else {
          cfg.set('maxpriceabsolute',maxPriceAbsolute);
          dispatch({maxPriceAbsolute: maxPriceAbsolute, type: SETMAXPRICEABSOLUTE});
        }
      });
    }
    if (maxPriceRelative != getTicketBuyerConfigResponse.getMaxPriceRelative()) {
      request = new SetMaxPriceRelativeRequest();
      request.setMaxPriceRelative(maxPriceRelative);
      ticketBuyerService.setMaxPriceRelative(request, function (err) {
        if (err) {
          hitError += err + '. ';
        } else {
          cfg.set('maxpricerelative',maxPriceRelative);
          dispatch({maxPriceRelative: maxPriceRelative, type: SETMAXPRICERELATIVE});
        }
      });
    }
    if (stakePool.TicketAddress != getTicketBuyerConfigResponse.getVotingAddress()) {
      request = new SetVotingAddressRequest();
      request.setVotingAddress(stakePool.TicketAddress);
      ticketBuyerService.setVotingAddress(request, function (err) {
        if (err) {
          hitError += err + '. ';
        }
      });
    }
    if (stakePool.PoolAddress != getTicketBuyerConfigResponse.getPoolAddress()) {
      request = new SetPoolAddressRequest();
      request.setPoolAddress(stakePool.PoolAddress);
      ticketBuyerService.setPoolAddress(request, function (err) {
        if (err) {
          hitError += err + '. ';
        }
      });
    }
    if (stakePool.PoolFees != getTicketBuyerConfigResponse.getPoolFees()) {
      request = new SetPoolFeesRequest();
      request.setPoolFees(stakePool.PoolFees);
      ticketBuyerService.setPoolFees(request, function (err) {
        if (err) {
          hitError += err + '. ';
        }
      });
    }
    if (maxPerBlock != getTicketBuyerConfigResponse.getMaxPerBlock()) {
      request = new SetMaxPerBlockRequest();
      request.setMaxPerBlock(maxPerBlock);
      ticketBuyerService.setMaxPerBlock(request, function (err) {
        if (err) {
          hitError += err + '. ';
        } else {
          cfg.set('maxperblock',maxPerBlock);
          dispatch({maxPerBlock: maxPerBlock, type: SETMAXPERBLOCK});
        }
      });
    }
    if (hitError != '') {
      dispatch(setTicketBuyerConfigError(hitError + ' Please try again'));
    } else {
      dispatch(setTicketBuyerConfigSuccess());
    }
  };
}

export const STARTAUTOBUYER_ATTEMPT = 'STARTAUTOBUYER_ATTEMPT';
export const STARTAUTOBUYER_FAILED = 'STARTAUTOBUYER_FAILED';
export const STARTAUTOBUYER_SUCCESS = 'STARTAUTOBUYER_SUCCESS';
export const STARTAUTOBUYER_CLEAR_ERROR = 'STARTAUTOBUYER_CLEAR_ERROR';
export const STARTAUTOBUYER_CLEAR_SUCCESS= 'STARTAUTOBUYER_CLEAR_SUCCESS';

function startAutoBuyerError(error) {
  return { error, type: STARTAUTOBUYER_FAILED };
}

function startAutoBuyerSuccess(startAutoBuyerResponse) {
  var success = 'You successfully started the auto ticket buyer.';
  return (dispatch) => {
    dispatch({ success: success, startAutoBuyerResponse: startAutoBuyerResponse, type: STARTAUTOBUYER_SUCCESS });
    dispatch(getTicketBuyerConfigAttempt());
  };
}

export function startAutoBuyerAttempt(passphrase, accountNum, balanceToMaintain,
maxFeePerKb, maxPriceRelative, maxPriceAbsolute, maxPerBlock, stakepool) {
  var request = new StartAutoBuyerRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccount(accountNum);
  request.setBalanceToMaintain(balanceToMaintain);
  request.setMaxFeePerKb(maxFeePerKb*1e8);
  request.setMaxPriceRelative(maxPriceRelative);
  request.setMaxPriceAbsolute(maxPriceAbsolute);
  request.setVotingAddress(stakepool.TicketAddress);
  request.setPoolAddress(stakepool.PoolAddress);
  request.setPoolFees(stakepool.PoolFees);
  request.setMaxPerBlock(maxPerBlock);
  return (dispatch) => {
    dispatch({
      request: request,
      type: STARTAUTOBUYER_ATTEMPT });
    dispatch(startAutoBuyerAction());
  };
}

function startAutoBuyerAction() {
  return (dispatch, getState) => {
    const { ticketBuyerService } = getState().grpc;
    const { startAutoBuyerRequest } = getState().control;
    ticketBuyerService.startAutoBuyer(startAutoBuyerRequest,
        function(err, startAutoBuyerResponse) {
          if (err) {
            dispatch(startAutoBuyerError(err + ' Please try again'));
          } else {
            dispatch(startAutoBuyerSuccess(startAutoBuyerResponse));
          }
        });
  };
}

export function clearStartAutoBuyerSuccess() {
  return (dispatch, getState) => {
    const { startAutoBuyerSuccess } = getState().control;
    if (startAutoBuyerSuccess !== null) {
      dispatch({type: STARTAUTOBUYER_CLEAR_SUCCESS});
    }
  };
}

export function clearStartAutoBuyerError() {
  return (dispatch, getState) => {
    const { startAutoBuyerError } = getState().control;
    if (startAutoBuyerError !== null) {
      dispatch({type: STARTAUTOBUYER_CLEAR_ERROR});
    }
  };
}

export const STOPAUTOBUYER_ATTEMPT = 'STOPAUTOBUYER_ATTEMPT';
export const STOPAUTOBUYER_FAILED = 'STOPAUTOBUYER_FAILED';
export const STOPAUTOBUYER_SUCCESS = 'STOPAUTOBUYER_SUCCESS';
export const STOPAUTOBUYER_CLEAR_ERROR = 'STOPAUTOBUYER_CLEAR_ERROR';
export const STOPAUTOBUYER_CLEAR_SUCCESS= 'STOPAUTOBUYER_CLEAR_SUCCESS';

function stopAutoBuyerError(error) {
  return { error, type: STOPAUTOBUYER_FAILED };
}

function stopAutoBuyerSuccess(stopAutoBuyerResponse) {
  var success = 'You successfully stopped the auto ticket buyer.';
  return { success: success, stopAutoBuyerResponse: stopAutoBuyerResponse, type: STOPAUTOBUYER_SUCCESS };
}

export function stopAutoBuyerAttempt() {
  var request = new StopAutoBuyerRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: STOPAUTOBUYER_ATTEMPT });
    dispatch(stopAutoBuyerAction());
  };
}

function stopAutoBuyerAction() {
  return (dispatch, getState) => {
    const { ticketBuyerService } = getState().grpc;
    const { stopAutoBuyerRequest } = getState().control;
    ticketBuyerService.stopAutoBuyer(stopAutoBuyerRequest,
        function(err, stopAutoBuyerResponse) {
          if (err) {
            dispatch(stopAutoBuyerError(err + ' Please try again'));
          } else {
            dispatch(stopAutoBuyerSuccess(stopAutoBuyerResponse));
          }
        });
  };
}


export function clearStopAutoBuyerSuccess() {
  return (dispatch, getState) => {
    const { stopAutoBuyerSuccess } = getState().control;
    if (stopAutoBuyerSuccess !== null) {
      dispatch({type: STOPAUTOBUYER_CLEAR_SUCCESS});
    }
  };
}

export function clearStopAutoBuyerError() {
  return (dispatch, getState) => {
    const { stopAutoBuyerError } = getState().control;
    if (stopAutoBuyerError !== null) {
      dispatch({type: STOPAUTOBUYER_CLEAR_ERROR});
    }
  };
}

export const CONSTRUCTTX_ATTEMPT = 'CONSTRUCTTX_ATTEMPT';
export const CONSTRUCTTX_FAILED = 'CONSTRUCTTX_FAILED';
export const CONSTRUCTTX_SUCCESS = 'CONSTRUCTTX_SUCCESS';

function constructTransactionError(error) {
  return { error, type: CONSTRUCTTX_FAILED };
}

function constructTransactionSuccess(constructTxResponse) {
  return (dispatch) => {
    dispatch({constructTxResponse: constructTxResponse, type: CONSTRUCTTX_SUCCESS });
  };
}

export function constructTransactionAttempt(account, confirmations, outputs) {
  var request = new ConstructTransactionRequest();
  request.setSourceAccount(parseInt(account));
  request.setRequiredConfirmations(parseInt(parseInt(confirmations)));
  request.setOutputSelectionAlgorithm(1);
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
  return (dispatch) => {
    dispatch({
      request: request,
      type: CONSTRUCTTX_ATTEMPT });
    dispatch(constructTransactionAction(totalAmount));
  };
}

function constructTransactionAction(totalAmount) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { constructTxRequest } = getState().control;
    walletService.constructTransaction(constructTxRequest,
        function(err, constructTxResponse) {
          if (err) {
            dispatch(constructTransactionError(err + ' Please try again'));
          } else {
            constructTxResponse.totalAmount = totalAmount;
            dispatch(constructTransactionSuccess(constructTxResponse));
          }
        });
  };
}
