import {
  LNWALLET_STARTDCRLND_ATTEMPT, LNWALLET_STARTDCRLND_FAILED, LNWALLET_STARTDCRLND_SUCCESS,
  LNWALLET_INFO_UPDATED,
  LNWALLET_CONNECT_ATTEMPT, LNWALLET_CONNECT_SUCCESS, LNWALLET_CONNECT_FAILED,
  LNWALLET_BALANCE_UPDATED, LNWALLET_CHANNELBALANCE_UPDATED, LNWALLET_CHANNELLIST_UPDATED,
  LNWALLET_LATESTINVOICES_UPDATED, LNWALLET_LATESTPAYMENTS_UPDATED,
  LNWALLET_ADDINVOICE_ATTEMPT, LNWALLET_ADDINVOICE_SUCCESS, LNWALLET_ADDINVOICE_FAILED,
  LNWALLET_INVOICE_SETTLED, LNWALLET_INVOICE_OPENED, LNWALLET_INVOICE_EXPIRED,
  LNWALLET_PAYSTREAM_CREATED,
  LNWALLET_SENDPAYMENT_ATTEMPT, LNWALLET_SENDPAYMENT_SUCCESS,
  LNWALLET_DCRLND_STOPPED,
  LNWALLET_CHECKED
} from "actions/LNActions";

function addOutstandingPayment(oldOut, rhashHex, payData) {
  const newOut = { ...oldOut };
  newOut[rhashHex] = payData;
  return newOut;
}

function delOutstandingPayment(oldOut, rhashHex) {
  const newOut = { ...oldOut };
  delete(newOut, rhashHex);
  return newOut;
}

export default function ln(state = {}, action) {
  switch (action.type) {
  case LNWALLET_STARTDCRLND_ATTEMPT:
    return {
      ...state,
      startAttempt: true
    };
  case LNWALLET_STARTDCRLND_FAILED:
    return {
      ...state,
      startAttempt: false
    };
  case LNWALLET_STARTDCRLND_SUCCESS:
    return {
      ...state,
      startAttempt: false
    };
  case LNWALLET_INFO_UPDATED:
    return {
      ...state,
      info: {
        version: action.version,
        identityPubkey: action.identityPubkey,
        alias: action.alias
      }
    };
  case LNWALLET_CONNECT_ATTEMPT:
    return {
      ...state,
      active: false,
      client: null,
      connectAttempt: true
    };
  case LNWALLET_CONNECT_FAILED:
    return {
      ...state,
      connectAttempt: false
    };
  case LNWALLET_CONNECT_SUCCESS:
    return {
      ...state,
      active: true,
      client: action.lnClient,
      connectAttempt: false
    };
  case LNWALLET_BALANCE_UPDATED:
    return {
      ...state,
      walletBalances: action.balances
    };
  case LNWALLET_CHANNELBALANCE_UPDATED:
    return {
      ...state,
      channelBalances: action.channelBalances
    };
  case LNWALLET_CHANNELLIST_UPDATED:
    return {
      ...state,
      channels: action.channels,
      pendingChannels: action.pendingChannels,
      closedChannels: action.closedChannels
    };
  case LNWALLET_LATESTINVOICES_UPDATED:
    return {
      ...state,
      invoices: action.invoices
    };
  case LNWALLET_LATESTPAYMENTS_UPDATED:
    return {
      ...state,
      payments: action.payments
    };
  case LNWALLET_ADDINVOICE_ATTEMPT:
    return {
      ...state,
      addInvoiceAttempt: true
    };
  case LNWALLET_ADDINVOICE_SUCCESS:
    return {
      ...state,
      addInvoiceAttempt: false
    };
  case LNWALLET_ADDINVOICE_FAILED:
    return {
      ...state,
      addInvoiceAttempt: false
    };
  case LNWALLET_INVOICE_SETTLED:
  case LNWALLET_INVOICE_OPENED:
  case LNWALLET_INVOICE_EXPIRED:
    return {
      ...state,
      invoices: action.invoices
    };
  case LNWALLET_PAYSTREAM_CREATED:
    return {
      ...state,
      payStream: action.payStream
    };
  case LNWALLET_SENDPAYMENT_ATTEMPT:
    return {
      ...state,
      outstandingPayments: addOutstandingPayment(state.outstandingPayments,
        action.rhashHex, action.payData)
    };
  case LNWALLET_SENDPAYMENT_SUCCESS:
    return {
      ...state,
      outstandingPayments: delOutstandingPayment(state.outstandingPayments,
        action.rhashHex)
    };
  case LNWALLET_DCRLND_STOPPED:
    return {
      ...state,
      active: false,
      exists: false,
      client: null,
      channels: [],
      pendingChannels: [],
      closedChannels: [],
      payStream: null,
      payments: [],
      invoices: [],
      info: {
        version: null,
        identityPubkey: null,
        alias: null
      },
      walletBalances: {
        totalBalance: 0,
        confirmedBalance: 0,
        unconfirmedBalance: 0
      },
      channelBalances: {
        balance: 0,
        pendingOpenBalance: 0,
        maxInboundAmount: 0,
        maxOutboundAmount: 0
      }
    };
  case LNWALLET_CHECKED:
    return {
      ...state,
      exists: !!action.exists
    };
  default:
    return state;
  }
}
