import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as lna from "../actions/LNActions";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  lnActive: sel.lnActive,
  startAttempt: sel.lnStartAttempt,
  connectAttempt: sel.lnConnectAttempt,
  walletBalances: sel.lnWalletBalances,
  channelBalances: sel.lnChannelBalances,
  channels: sel.lnChannels,
  pendingChannels: sel.lnPendingChannels,
  closedChannels: sel.lnClosedChannels,
  invoices: sel.lnInvoices,
  payments: sel.lnPayments,
  tsDate: sel.tsDate,
  addInvoiceAttempt: sel.lnAddInvoiceAttempt,
  info: sel.lnInfo,
  defaultAccount: sel.defaultSpendingAccount,
  lightningWalletExists: sel.lnWalletExists,
  isMainNet: sel.isMainNet
});

const mapDispatchToProps = dispatch => bindActionCreators({
  connectToLNWallet: lna.connectToLNWallet,
  updateWalletBalances: lna.updateLNWalletBalances,
  addInvoice: lna.addInvoice,
  decodePayRequest: lna.decodePayRequest,
  sendPayment: lna.sendPayment,
  openChannel: lna.openChannel,
  closeChannel: lna.closeChannel,
  fundWallet: lna.fundWallet,
  withdrawWallet: lna.withdrawWallet,
  getWalletConfig: lna.getLNWalletConfig,
  startDcrlnd: lna.startDcrlnd
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
