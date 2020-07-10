import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as lna from "../actions/LNActions";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  lnActive: sel.lnActive,
  startupStage: sel.lnStartupStage,
  startAttempt: sel.lnStartAttempt,
  walletBalances: sel.lnWalletBalances,
  channelBalances: sel.lnChannelBalances,
  channels: sel.lnChannels,
  pendingChannels: sel.lnPendingChannels,
  closedChannels: sel.lnClosedChannels,
  invoices: sel.lnInvoices,
  payments: sel.lnPayments,
  outstandingPayments: sel.lnOutstandingPayments,
  failedPayments: sel.lnFailedPayments,
  tsDate: sel.tsDate,
  addInvoiceAttempt: sel.lnAddInvoiceAttempt,
  info: sel.lnInfo,
  defaultAccount: sel.defaultSpendingAccount,
  lightningWalletExists: sel.lnWalletExists,
  isMainNet: sel.isMainNet,
  scbPath: sel.lnSCBPath,
  scbUpdatedTime: sel.lnSCBUpdatedTime
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateWalletBalances: lna.updateLNWalletBalances,
      addInvoice: lna.addInvoice,
      decodePayRequest: lna.decodePayRequest,
      sendPayment: lna.sendPayment,
      openChannel: lna.openChannel,
      closeChannel: lna.closeChannel,
      fundWallet: lna.fundWallet,
      withdrawWallet: lna.withdrawWallet,
      startDcrlnd: lna.startDcrlnd,
      exportBackup: lna.exportBackup,
      verifyBackup: lna.verifyBackup
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
