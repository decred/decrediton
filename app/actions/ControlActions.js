import { getNextAddress, renameAccount, getNextAccount,
  rescan, importPrivateKey, importScript, changePassphrase,
  loadActiveDataFilters, getFundingTransaction, signTransaction, publishTransaction,
purchaseTickets, constructTransaction } from '../middleware/grpc/control';

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
  var request = {
    account: accountNum,
    kind: 0,
  };
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
    getNextAddress(walletService, getNextAddressRequest,
        function(getNextAddressResponse, err) {
          if (err) {
            dispatch(getNextAddressError(err + ' Please try again'));
          } else {
            dispatch(getNextAddressSuccess(getNextAddressResponse));
          }
        });
  };
}

export const RENAMEACCOUNT_ATTEMPT = 'RENAMEACCOUNT_ATTEMPT';
export const RENAMEACCOUNT_FAILED = 'RENAMEACCOUNT_FAILED';
export const RENAMEACCOUNT_SUCCESS = 'RENAMEACCOUNT_SUCCESS';

function renameAccountError(error) {
  return { error, type: RENAMEACCOUNT_FAILED };
}

function renameAccountSuccess(renameAccountResponse) {
  return { renameAccountResponse: renameAccountResponse, type: RENAMEACCOUNT_SUCCESS };
}

export function renameAccountAttempt(accountNumber, newName) {
  var request = {
    account_number: accountNum,
    new_name: newName
  };
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
    renameAccount(walletService, renameAccountRequest,
        function(renameAccountResponse, err) {
          if (err) {
            dispatch(renameAccountError(err + ' Please try again'));
          } else {
            dispatch(renameAccountSuccess(renameAccountResponse));
          }
        });
  };
}

export const RESCAN_ATTEMPT = 'RESCAN_ATTEMPT';
export const RESCAN_FAILED = 'RESCAN_FAILED';
export const RESCAN_SUCCESS = 'RESCAN_SUCCESS';

function rescanError(error) {
  return { error, type: RESCAN_FAILED };
}

function rescanSuccess(rescanResponse) {
  return { rescanResponse: rescanResponse, type: RESCAN_SUCCESS };
}

export function rescanAttempt(beginHeight) {
  var request = {
    begin_height: parseInt(beginHeight)
  };
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
    rescan(walletService, rescanRequest,
        function(rescanResponse, err) {
          if (err) {
            dispatch(rescanError(err + ' Please try again'));
          } else {
            dispatch(rescanSuccess(rescanResponse));
          }
        });
  };
}

export const GETNEXTACCOUNT_ATTEMPT = 'GETNEXTACCOUNT_ATTEMPT';
export const GETNEXTACCOUNT_FAILED = 'GETNEXTACCOUNT_FAILED';
export const GETNEXTACCOUNT_SUCCESS = 'GETNEXTACCOUNT_SUCCESS';

function getNextAccountError(error) {
  return { error, type: GETNEXTACCOUNT_FAILED };
}

function getNextAccountSuccess(getNextAccountResponse) {
  return { getNextAccountResponse: getNextAccountResponse, type: GETNEXTACCOUNT_SUCCESS };
}

export function getNextAccountAttempt(passphrase, accountName) {
  var request = {
    passphrase: Buffer.from(passphrase),
    account_name: accountName
  };
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
    getNextAccount(walletService, getNextAccountRequest,
        function(getNextAccountResponse, err) {
          if (err) {
            dispatch(getNextAccountError(err + ' Please try again'));
          } else {
            dispatch(getNextAccountSuccess(getNextAccountResponse));
          }
        });
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
  var request = {
    passphrase: Buffer.from(passphrase),
    account: accountNum,
    private_key_wif: wif,
    rescan: rescan,
    scan_from: scanFrom
  };

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
    importPrivateKey(walletService, importPrivateKeyRequest,
        function(importPrivateKeyResponse, err) {
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

function importScriptError(error) {
  return { error, type: IMPORTSCRIPT_FAILED };
}

function importScriptSuccess(importScriptResponse) {
  return { importScriptResponse: importScriptResponse, type: IMPORTSCRIPT_SUCCESS };
}

export function importScriptAttempt(passphrase, script, rescan, scanFrom) {
  var request = {
    passphrase: Buffer.from(passphrase),
    script: script,
    rescan: rescan,
    scan_from: scanFrom
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: IMPORTSCRIPT_ATTEMPT });
    dispatch(importScriptAction());
  };
}

function importScriptAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { importScriptRequest } = getState().control;
    importScript(walletService, importScriptRequest,
        function(importScriptResponse, err) {
          if (err) {
            dispatch(importScriptError(err + ' Please try again'));
          } else {
            dispatch(importScriptSuccess(importScriptResponse));
          }
        });
  };
}

export const CHANGEPASSPHRASE_ATTEMPT = 'CHANGEPASSPHRASE_ATTEMPT';
export const CHANGEPASSPHRASE_FAILED = 'CHANGEPASSPHRASE_FAILED';
export const CHANGEPASSPHRASE_SUCCESS = 'CHANGEPASSPHRASE_SUCCESS';

function changePassphraseError(error) {
  return { error, type: CHANGEPASSPHRASE_FAILED };
}

function changePassphraseSuccess(changePassphraseResponse) {
  return { changePassphraseResponse: changePassphraseResponse, type: CHANGEPASSPHRASE_SUCCESS };
}

export function changePassphraseAttempt(oldPass, newPass) {
  var request = {
    old_passphrase: Buffer.from(oldPass),
    new_passphrase: Buffer.from(newPass)
  };
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
    changePassphrase(walletService, changePassphraseRequest,
        function(changePassphraseResponse, err) {
          if (err) {
            dispatch(changePassphraseError(err + ' Please try again'));
          } else {
            dispatch(changePassphraseSuccess(changePassphraseResponse));
          }
        });
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
  var request = { };
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
    loadActiveDataFilters(walletService, loadActiveDataFiltersRequest,
        function(response, err) {
          if (err) {
            dispatch(loadActiveDataFiltersError(err + ' Please try again'));
          } else {
            dispatch(loadActiveDataFiltersSuccess(response));
          }
        });
  };
}

export const FUNDTX_ATTEMPT = 'FUNDTX_ATTEMPT';
export const FUNDTX_FAILED = 'FUNDTX_FAILED';
export const FUNDTX_SUCCESS = 'FUNDTX_SUCCESS';

function fundTransactionError(error) {
  return { error, type: FUNDTX_FAILED };
}

function fundTransactionSuccess(fundTransactionResponse) {
  return { fundTransactionResponse: gfundTransactionResponse, type: FUNDTX_SUCCESS };
}

export function fundTransactionAttempt(accountNum, targetAmount, requiredConf) {
  var request = {
    account: accountNum,
    target_amount: targetAmount,
    required_confirmations: requiredConf
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: FUNDTX_ATTEMPT });
    dispatch(fundTransactionAction());
  };
}

function fundTransactionAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { fundTransactionRequest } = getState().control;
    fundTransaction(walletService, fundTransactionRequest,
        function(fundTransactionResponse, err) {
          if (err) {
            dispatch(fundTransactionError(err + ' Please try again'));
          } else {
            dispatch(fundTransactionSuccess(fundTransactionResponse));
          }
        });
  };
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
    dispatch(publishTransactionAttempt(signTransactionResponse.transaction));
  };
}

export function signTransactionAttempt(passphrase, rawTx) {
  console.log(rawTx);
  var request = {
    passphrase: Buffer.from(passphrase),
    serialized_transaction: rawTx
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: SIGNTX_ATTEMPT });
    dispatch(signTransactionAction());
  };
}

function signTransactionAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { signTransactionRequest } = getState().control;
    signTransaction(walletService, signTransactionRequest,
        function(signTransactionResponse, err) {
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
  return { publishTransactionResponse: publishTransactionResponse, type: PUBLISHTX_SUCCESS };
}

export function publishTransactionAttempt(tx) {
  var request = {
    signed_transaction: tx
  };
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
    publishTransaction(walletService, publishTransactionRequest,
        function(publishTransactionResponse, err) {
          if (err) {
            dispatch(publishTransactionError(err + ' Please try again'));
          } else {
            dispatch(publishTransactionSuccess(publishTransactionResponse));
          }
        });
  };
}

export const PURCHASETICKET_ATTEMPT = 'PURCHASETICKET_ATTEMPT';
export const PURCHASETICKET_FAILED = 'PURCHASETICKET_FAILED';
export const PURCHASETICKET_SUCCESS = 'PURCHASETICKET_SUCCESS';

function purchaseTicketError(error) {
  return { error, type: PURCHASETICKET_FAILED };
}

function purchaseTicketSuccess(purchaseTicketResponse) {
  return { purchaseTicketResponse: purchaseTicketResponse, type: PURCHASETICKET_SUCCESS };
}

export function purchaseTicketAttempt(passphrase, accountNum, spendLimit, requiredConf,
ticketAddress, numTickets, poolAddress, poolFees, expiry, txFee, ticketFee) {
  var request = {
    passphrase: Buffer.from(passphrase),
    account: accountNum,
    spend_limit: spendLimit,
    required_confirmations: requiredConf,
    ticket_address: ticketAddress,
    num_tickets: numTickets,
    pool_address: poolAddress,
    pool_fees: poolFees,
    expiry: expiry,
    tx_fee: txFee,
    ticket_fee: ticketFee
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: PURCHASETICKET_ATTEMPT });
    dispatch(purchaseTicketAction());
  };
}

function purchaseTicketAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { purchaseTicketRequest } = getState().control;
    purchaseTicket(walletService, purchaseTicketRequest,
        function(purchaseTicketResponse, err) {
          if (err) {
            dispatch(purchaseTicketError(err + ' Please try again'));
          } else {
            dispatch(purchaseTicketSuccess(purchaseTicketResponse));
          }
        });
  };
}

export const CONSTRUCTTX_ATTEMPT = 'CONSTRUCTTX_ATTEMPT';
export const CONSTRUCTTX_FAILED = 'CONSTRUCTTX_FAILED';
export const CONSTRUCTTX_SUCCESS = 'CONSTRUCTTX_SUCCESS';

function constructTransactionError(error) {
  return { error, type: CONSTRUCTTX_FAILED };
}

function constructTransactionSuccess(constructTxResponse) {
  return (dispatch, getState) => {
    dispatch({constructTxResponse: constructTxResponse, type: CONSTRUCTTX_SUCCESS });
  };
}

export function constructTransactionAttempt(account, confirmations, destination, amount) {
  var request = {
    source_account: parseInt(account),
    required_confirmations: parseInt(confirmations),
    output_selection_algorithm: 1,
    non_change_outputs: { destination: { address:destination }, amount: parseInt(amount) },
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: CONSTRUCTTX_ATTEMPT });
    dispatch(constructTransactionAction());
  };
}

function constructTransactionAction() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { constructTxRequest } = getState().control;
    constructTransaction(walletService, constructTxRequest,
        function(constructTxResponse, err) {
          if (err) {
            dispatch(constructTransactionError(err + ' Please try again'));
          } else {
            dispatch(constructTransactionSuccess(constructTxResponse));
          }
        });
  };
}
