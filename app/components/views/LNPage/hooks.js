import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as lna from "actions/LNActions";
import * as sel from "selectors";

export function useLNPage() {
  const lnActive = useSelector(sel.lnActive);
  const startupStage = useSelector(sel.lnStartupStage);
  const startAttempt = useSelector(sel.lnStartAttempt);
  const walletBalances = useSelector(sel.lnWalletBalances);
  const channelBalances = useSelector(sel.lnChannelBalances);
  const channels = useSelector(sel.lnChannels);
  const pendingChannels = useSelector(sel.lnPendingChannels);
  const closedChannels = useSelector(sel.lnClosedChannels);
  const invoices = useSelector(sel.lnInvoices);
  const payments = useSelector(sel.lnPayments);
  const outstandingPayments = useSelector(sel.lnOutstandingPayments);
  const failedPayments = useSelector(sel.lnFailedPayments);
  const tsDate = useSelector(sel.tsDate);
  const addInvoiceAttempt = useSelector(sel.lnAddInvoiceAttempt);
  const info = useSelector(sel.lnInfo);
  const defaultAccount = useSelector(sel.defaultSpendingAccount);
  const lightningWalletExists = useSelector(sel.lnWalletExists);
  const isMainNet = useSelector(sel.isMainNet);
  const scbPath = useSelector(sel.lnSCBPath);
  const scbUpdatedTime = useSelector(sel.lnSCBUpdatedTime);

  const dispatch = useDispatch();

  const updateWalletBalances = useCallback(
    () => dispatch(lna.updateLNWalletBalances()),
    [dispatch]
  );
  const addInvoice = useCallback(
    (memo, value) => dispatch(lna.addInvoice(memo, value)),
    [dispatch]
  );
  const decodePayRequest = useCallback(
    (payReq) => dispatch(lna.decodePayRequest(payReq)),
    [dispatch]
  );
  const sendPayment = useCallback(
    (payReq, value) => dispatch(lna.sendPayment(payReq, value)),
    [dispatch]
  );
  const openChannel = useCallback(
    (node, localAmt, pushAmt) =>
      dispatch(lna.openChannel(node, localAmt, pushAmt)),
    [dispatch]
  );
  const closeChannel = useCallback(
    (channelPoint, force) => dispatch(lna.closeChannel(channelPoint, force)),
    [dispatch]
  );
  const fundWallet = useCallback(
    (amount, accountNb, passphrase) =>
      dispatch(lna.fundWallet(amount, accountNb, passphrase)),
    [dispatch]
  );
  const withdrawWallet = useCallback(
    (amount, accountNb) => dispatch(lna.withdrawWallet(amount, accountNb)),
    [dispatch]
  );
  const startDcrlnd = useCallback(
    (passphrase, autopilotEnabled, walletAccount, scbFile) =>
      dispatch(
        lna.startDcrlnd(passphrase, autopilotEnabled, walletAccount, scbFile)
      ),
    [dispatch]
  );
  const exportBackup = useCallback((path) => dispatch(lna.exportBackup(path)), [
    dispatch
  ]);
  const verifyBackup = useCallback((path) => dispatch(lna.verifyBackup(path)), [
    dispatch
  ]);

  return {
    lnActive,
    startupStage,
    startAttempt,
    walletBalances,
    channelBalances,
    channels,
    pendingChannels,
    closedChannels,
    invoices,
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    addInvoiceAttempt,
    info,
    defaultAccount,
    lightningWalletExists,
    isMainNet,
    scbPath,
    scbUpdatedTime,
    updateWalletBalances,
    addInvoice,
    decodePayRequest,
    sendPayment,
    openChannel,
    closeChannel,
    fundWallet,
    withdrawWallet,
    startDcrlnd,
    exportBackup,
    verifyBackup
  };
}
