import { FormattedMessage as T } from "react-intl";
import { Subtitle, DetailsTable } from "shared";
import { DescriptionHeader } from "layout";
import styles from "./OverviewTab.module.css";
import {
  useOverviewTab,
  LN_RECENT_ACTIVITY_CHANNEL,
  LN_RECENT_ACTIVITY_PAYMENT,
  LN_RECENT_ACTIVITY_INVOICE
} from "./hooks";
import BalancesHeader from "../BalancesHeader";
import InvoiceRow from "../ReceiveTab/InvoiceRow";
import PaymentRow from "../SendTab/PaymentRow";
import { AccountOverview, NetworkStats, RecentChannelRow } from "./helpers";
import { LNInvoiceModal, LNPaymentModal, LNChannelModal } from "modals";
import {
  ChannelCard,
  CloseChannelModalContent,
  getChannelDetails
} from "../ChannelDetailsPage/helpers";
import { CloseChannelModalButton } from "buttons";
import { CHANNEL_STATUS_CLOSED } from "constants";

export const OverviewTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.overview.description"
          m="Off-chain transactions using the Lightning Network."
        />
        <BalancesHeader />
      </>
    }
  />
);

const OverviewTab = () => {
  const {
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
    onCloseChannel,
    onNodeSelected,
    recentNodes
  } = useOverviewTab();

  return (
    <div className={styles.container}>
      <Subtitle
        title={
          <T id="ln.overviewTab.LNAccountOverview" m="LN Account Overview" />
        }
      />
      <AccountOverview
        {...{ walletBalances, channelsCount, channelsCapacity }}
      />
      {!!network && (
        <>
          <Subtitle
            title={<T id="ln.overviewTab.networkStats" m="Network Stats" />}
          />
          <NetworkStats {...{ network, onNodeSelected, recentNodes }} />
        </>
      )}
      <Subtitle
        title={<T id="ln.overviewTab.recentActivity" m="Recent Activity" />}
      />
      {recentActivity && recentActivity.length > 0 ? (
        <div>
          {recentActivity.map((activity) => {
            switch (activity.recentActivityType) {
              case LN_RECENT_ACTIVITY_INVOICE:
                return (
                  <InvoiceRow
                    key={activity.addIndex}
                    invoice={activity}
                    tsDate={tsDate}
                    onClick={() => setSelectedInvoice(activity)}
                  />
                );
              case LN_RECENT_ACTIVITY_PAYMENT:
                return (
                  <PaymentRow
                    key={`row-${activity.paymentHash}`}
                    payment={activity}
                    tsDate={tsDate}
                    onClick={() => setSelectedPayment(activity)}
                  />
                );
              case LN_RECENT_ACTIVITY_CHANNEL:
                return (
                  <RecentChannelRow
                    key={`row-${activity.tx.txHash}`}
                    channel={activity}
                    tsDate={tsDate}
                    onClick={() => setSelectedChannel(activity)}
                  />
                );
            }
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <T id="ln.overviewTab.emptyInvoiceList" m="No activities yet" />
        </div>
      )}

      {selectedInvoice && (
        <LNInvoiceModal
          show={!!selectedInvoice}
          onCancelModal={() => setSelectedInvoice(null)}
          onCancelInvoice={() => onCancelInvoice(selectedInvoice)}
          cancelInvoiceAttempt={cancelInvoiceAttempt}
          invoice={selectedInvoice}
          tsDate={tsDate}
        />
      )}

      {selectedPayment && (
        <LNPaymentModal
          show={!!selectedPayment}
          onCancelModal={() => setSelectedPayment(null)}
          payment={selectedPayment}
          tsDate={tsDate}
        />
      )}

      {selectedChannel && (
        <LNChannelModal
          show={!!selectedChannel}
          onCancelModal={() => setSelectedChannel(null)}
          detailsTable={
            <DetailsTable
              data={getChannelDetails(selectedChannel)}
              headerClassName={styles.modalDetailsHeader}
              gridClassName={styles.modalDetailsGrid}
              title={
                <T id="ln.overviewTab.channelModal.props" m="Properties" />
              }
            />
          }
          channelCard={
            <ChannelCard
              channel={selectedChannel}
              className={styles.modalChanelCard}
            />
          }
          closeButton={
            selectedChannel.status !== CHANNEL_STATUS_CLOSED && (
              <CloseChannelModalButton
                className={styles.modalCloseButton}
                modalTitle={
                  <T
                    id="ln.overviewTab.channelModal.closeChannelModalTitle"
                    m="Close Channel"
                  />
                }
                modalContent={
                  <CloseChannelModalContent channel={selectedChannel} />
                }
                buttonLabel={
                  <T
                    id="ln.overviewTab.channelModal.closeChannelButton"
                    m="Close Channel"
                  />
                }
                onSubmit={() => onCloseChannel(selectedChannel)}
              />
            )
          }
        />
      )}
    </div>
  );
};

export default OverviewTab;
