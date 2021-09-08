import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLNPage } from "../hooks";
import * as lna from "actions/LNActions";
import * as sel from "selectors";
import { INVOICE_STATUS_SETTLED } from "constants";

export const LN_RECENT_ACTIVITY_CHANNEL = "LN_RECENT_ACTIVITY_CHANNEL";
export const LN_RECENT_ACTIVITY_INVOICE = "LN_RECENT_ACTIVITY_INVOICE";
export const LN_RECENT_ACTIVITY_PAYMENT = "LN_RECENT_ACTIVITY_PAYMENT";

export function useOverviewTab() {
  const dispatch = useDispatch();
  const network = useSelector(sel.lnNetwork);
  useEffect(() => {
    !network && dispatch(lna.getNetworkInfo());
  }, [network, dispatch]);

  const {
    channels,
    pendingChannels,
    closedChannels,
    transactions,
    invoices,
    payments,
    tsDate,
    walletBalances,
    cancelInvoice,
    closeChannel
  } = useLNPage();

  const channelsCapacity = channels.reduce(
    (acc, currVal) => acc + currVal.capacity,
    0
  );
  const channelsCount = channels.length;

  const cancelInvoiceAttempt = useSelector(sel.lnCancelInvoiceAttempt);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const onCancelInvoice = ({ rHash }) => {
    cancelInvoice(rHash).then(() =>
      // close the modal
      setSelectedInvoice(null)
    );
  };
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const onCloseChannel = (channel) => {
    closeChannel(channel.channelPoint, !channel.active);
    setSelectedChannel(null);
  };

  const recentListLengthMax = 5;

  const recentActivity = useMemo(() => {
    const recentChannels = [];

    // recent channel fundings and closes
    if (transactions && transactions.length > 0) {
      let i = 0;
      const mergedChannels = [
        ...pendingChannels,
        ...channels,
        ...closedChannels
      ];
      do {
        const tx = transactions[i++];
        const txHash = tx.txHash;
        const channel = mergedChannels.find(
          ({ channelPoint, closingTxHash }) =>
            channelPoint?.includes(txHash) || closingTxHash?.includes(txHash)
        );

        if (channel) {
          recentChannels.push({
            ...channel,
            tx: tx,
            sortTs: tx.timeStamp,
            recentActivityType: LN_RECENT_ACTIVITY_CHANNEL
          });
        }
      } while (
        recentChannels.length < recentListLengthMax &&
        i < transactions.length
      );
    }

    // recent invoices
    const recentInvoices = invoices
      .slice(0, recentListLengthMax)
      .map((invoice) => ({
        ...invoice,
        sortTs:
          invoice.status === INVOICE_STATUS_SETTLED
            ? invoice.settleDate
            : invoice.creationDate,
        recentActivityType: LN_RECENT_ACTIVITY_INVOICE
      }));

    // recent payments
    const recentPayments = payments
      .slice(0, recentListLengthMax)
      .map((payment) => ({
        ...payment,
        sortTs: payment.creationDate,
        recentActivityType: LN_RECENT_ACTIVITY_PAYMENT
      }));

    return [...recentChannels, ...recentInvoices, ...recentPayments]
      .sort((a, b) => (a.sortTs < b.sortTs ? 1 : -1))
      .slice(0, recentListLengthMax);
  }, [
    pendingChannels,
    channels,
    closedChannels,
    transactions,
    invoices,
    payments
  ]);

  return {
    recentActivity,
    tsDate,
    walletBalances,
    network,
    channelsCount,
    channelsCapacity,
    cancelInvoiceAttempt,
    selectedInvoice,
    setSelectedInvoice,
    onCancelInvoice,
    selectedPayment,
    setSelectedPayment,
    selectedChannel,
    setSelectedChannel,
    onCloseChannel
  };
}
