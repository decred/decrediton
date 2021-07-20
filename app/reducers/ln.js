import {
  LNWALLET_STARTUP_ATTEMPT,
  LNWALLET_STARTUP_FAILED,
  LNWALLET_STARTUP_SUCCESS,
  LNWALLET_STARTUP_CHANGEDSTAGE,
  LNWALLET_INFO_UPDATED,
  LNWALLET_CONNECT_SUCCESS,
  LNWALLET_BALANCE_UPDATED,
  LNWALLET_CHANNELBALANCE_UPDATED,
  LNWALLET_CHANNELLIST_UPDATED,
  LNWALLET_LATESTINVOICES_UPDATED,
  LNWALLET_LATESTPAYMENTS_UPDATED,
  LNWALLET_ADDINVOICE_ATTEMPT,
  LNWALLET_ADDINVOICE_SUCCESS,
  LNWALLET_ADDINVOICE_FAILED,
  LNWALLET_CANCELINVOICE_ATTEMPT,
  LNWALLET_CANCELINVOICE_SUCCESS,
  LNWALLET_CANCELINVOICE_FAILED,
  LNWALLET_INVOICE_SETTLED,
  LNWALLET_INVOICE_OPENED,
  LNWALLET_INVOICE_EXPIRED,
  LNWALLET_INVOICE_CANCELED,
  LNWALLET_PAYSTREAM_CREATED,
  LNWALLET_SENDPAYMENT_ATTEMPT,
  LNWALLET_SENDPAYMENT_SUCCESS,
  LNWALLET_SENDPAYMENT_FAILED,
  LNWALLET_DCRLND_STOPPED,
  LNWALLET_CHECKED,
  LNWALLET_SCBINFO_UPDATED,
  LNWALLET_GETNETWORKINFO_ATTEMPT,
  LNWALLET_GETNETWORKINFO_SUCCESS,
  LNWALLET_GETNETWORKINFO_FAILED,
  LNWALLET_GETNODEINFO_ATTEMPT,
  LNWALLET_GETNODEINFO_SUCCESS,
  LNWALLET_GETNODEINFO_FAILED,
  LNWALLET_GETROUTESINFO_ATTEMPT,
  LNWALLET_GETROUTESINFO_SUCCESS,
  LNWALLET_GETROUTESINFO_FAILED,
  LNWALLET_LISTWATCHTOWERS_SUCCESS,
  LNWALLET_CHANGE_INVOICE_FILTER
} from "actions/LNActions";

function addOutstandingPayment(oldOut, rhashHex, payData) {
  const newOut = { ...oldOut };
  newOut[rhashHex] = payData;
  return newOut;
}

function delOutstandingPayment(oldOut, rhashHex) {
  const newOut = { ...oldOut };
  delete newOut[rhashHex];
  return newOut;
}

export default function ln(state = {}, action) {
  switch (action.type) {
    case LNWALLET_STARTUP_ATTEMPT:
      return {
        ...state,
        startAttempt: true,
        active: false,
        client: null,
        wtClient: null,
        inClient: null,
        startupStage: null
      };
    case LNWALLET_STARTUP_FAILED:
      return {
        ...state,
        startAttempt: false,
        startupStage: null
      };
    case LNWALLET_STARTUP_SUCCESS:
      return {
        ...state,
        startAttempt: false,
        exists: true,
        active: true,
        startupStage: null
      };
    case LNWALLET_STARTUP_CHANGEDSTAGE:
      return {
        ...state,
        startupStage: action.stage
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
    case LNWALLET_CONNECT_SUCCESS:
      return {
        ...state,
        client: action.lnClient,
        wtClient: action.wtClient,
        inClient: action.inClient
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
    case LNWALLET_CANCELINVOICE_ATTEMPT:
      return {
        ...state,
        cancelInvoiceAttempt: true
      };
    case LNWALLET_CANCELINVOICE_SUCCESS:
      return {
        ...state,
        cancelInvoiceAttempt: false
      };
    case LNWALLET_CANCELINVOICE_FAILED:
      return {
        ...state,
        cancelInvoiceAttempt: false
      };
    case LNWALLET_INVOICE_SETTLED:
    case LNWALLET_INVOICE_OPENED:
    case LNWALLET_INVOICE_EXPIRED:
    case LNWALLET_INVOICE_CANCELED:
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
        outstandingPayments: addOutstandingPayment(
          state.outstandingPayments,
          action.rhashHex,
          action.payData
        )
      };
    case LNWALLET_SENDPAYMENT_SUCCESS:
      return {
        ...state,
        outstandingPayments: delOutstandingPayment(
          state.outstandingPayments,
          action.rhashHex
        )
      };
    case LNWALLET_SENDPAYMENT_FAILED:
      return {
        ...state,
        outstandingPayments: delOutstandingPayment(
          state.outstandingPayments,
          action.rhashHex
        ),
        failedPayments: [...state.failedPayments, action.payData]
      };
    case LNWALLET_SCBINFO_UPDATED:
      return {
        ...state,
        scbPath: action.scbPath,
        scbUpdatedTime: action.scbUpdatedTime
      };
    case LNWALLET_DCRLND_STOPPED:
      return {
        ...state,
        active: false,
        exists: false,
        client: null,
        wtClient: null,
        inClient: null,
        channels: [],
        pendingChannels: [],
        closedChannels: [],
        payStream: null,
        payments: [],
        outstandingPayments: {},
        failedPayments: [],
        invoices: [],
        scbPath: "",
        scbUpdatedTime: 0,
        getNetworkInfoAttempt: false,
        network: null,
        getNodeInfoAttempt: false,
        getRoutesInfoAttempt: false,
        nodeInfo: null,
        routes: null,
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
        },
        towersList: []
      };
    case LNWALLET_CHECKED:
      return {
        ...state,
        exists: !!action.exists
      };
    case LNWALLET_GETNETWORKINFO_ATTEMPT:
      return {
        ...state,
        getNetworkInfoAttempt: true
      };
    case LNWALLET_GETNETWORKINFO_SUCCESS:
      return {
        ...state,
        getNetworkInfoAttempt: false,
        network: action.network
      };
    case LNWALLET_GETNETWORKINFO_FAILED:
      return {
        ...state,
        getNetworkInfoAttempt: false
      };
    case LNWALLET_GETNODEINFO_ATTEMPT:
      return {
        ...state,
        getNodeInfoAttempt: true,
        nodeInfo: null
      };
    case LNWALLET_GETNODEINFO_SUCCESS:
      return {
        ...state,
        getNodeInfoAttempt: false,
        nodeInfo: action.nodeInfo
      };
    case LNWALLET_GETNODEINFO_FAILED:
      return {
        ...state,
        getNodeInfoAttempt: false,
        nodeInfo: action.error
      };
    case LNWALLET_GETROUTESINFO_ATTEMPT:
      return {
        ...state,
        getRoutesInfoAttempt: true,
        routes: null
      };
    case LNWALLET_GETROUTESINFO_SUCCESS:
      return {
        ...state,
        getRoutesInfoAttempt: false,
        routes: action.routes,
        nodeInfo: null
      };
    case LNWALLET_GETROUTESINFO_FAILED:
      return {
        ...state,
        getRoutesInfoAttempt: false,
        nodeInfo: action.error
      };
    case LNWALLET_LISTWATCHTOWERS_SUCCESS:
      return {
        ...state,
        towersList: action.towersList
      };
    case LNWALLET_CHANGE_INVOICE_FILTER:
      return {
        ...state,
        invoiceFilter: action.invoiceFilter
      };

    default:
      return state;
  }
}
