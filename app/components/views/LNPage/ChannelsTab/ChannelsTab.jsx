import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { Subtitle, VerticalAccordion } from "shared";
import { KeyBlueButton, CloseChannelModalButton } from "buttons";
import { TextInput, DcrInput } from "inputs";
import { DescriptionHeader } from "layout";
import styles from "./ChannelsTab.module.css";
import { useChannelsTab } from "./hooks";
import BalanceHeader from "./BalanceHeader/BalanceHeader";
import OpenChannel, {
  CloseChannelModalContent
} from "./OpenChannel/OpenChannel";
import PendingChannel from "./PendingChannel/PendingChannel";
import ClosedChannel from "./ClosedChannel/ClosedChannel";
import OpenChannelDetails from "./OpenChannelDetails/OpenChannelDetails";
import PendingChannelDetails from "./PendingChannelDetails/PendingChannelDetails";
import ClosedChannelDetails from "./ClosedChannelDetails/ClosedChannelDetails";

export const ChannelsTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.channels"
        m="Open and pending channels of this LN Wallet"
      />
    }
  />
);

const ChannelsTab = () => {
  const {
    walletBalances,
    channelBalances,
    channels,
    pendingChannels,
    closedChannels,
    node,
    localAmtAtoms,
    pushAmtAtoms,
    opening,
    canOpen,
    detailedChannel,
    isMainNet,
    onNodeChanged,
    onLocalAmtChanged,
    onPushAmtChanged,
    onOpenChannel,
    onCloseChannel,
    onToggleChannelDetails
  } = useChannelsTab();

  return (
    <>
      <Subtitle title={<T id="ln.channelsTab.balance" m="Balance" />} />
      <BalanceHeader
        walletBalance={walletBalances.confirmedBalance}
        totalBandwidth={
          channelBalances.maxInboundAmount + channelBalances.maxOutboundAmount
        }
      />
      <Subtitle
        title={<T id="ln.channelsTab.openChannel" m="Open Channel" />}
      />
      <div className={styles.openNewChannel}>
        <div className={styles.node}>
          <T id="ln.openChannel.node" m="Counterparty (node@ip:port)" />
          <TextInput
            id="counterpartyInput"
            value={node}
            onChange={onNodeChanged}
          />
        </div>
        <div>
          <T id="ln.openChannel.localAmt" m="Total Funding Amount" />
          <DcrInput amount={localAmtAtoms} onChangeAmount={onLocalAmtChanged} />
        </div>
        {!isMainNet && (
          <div>
            <T id="ln.openChannel.pushAmt" m="Push Amount (optional)" />
            <DcrInput amount={pushAmtAtoms} onChangeAmount={onPushAmtChanged} />
          </div>
        )}
        <KeyBlueButton
          className={styles.openButton}
          onClick={onOpenChannel}
          loading={opening}
          disabled={opening || !canOpen}>
          <T id="ln.openChannel.openBtn" m="Open" />
        </KeyBlueButton>
      </div>
      <div className={styles.channelsContent}>
        {pendingChannels.length > 0 && (
          <Subtitle
            title={<T id="ln.channelsTab.pendingList" m="Pending Channels" />}
          />
        )}
        {pendingChannels.map((c) => (
          <VerticalAccordion
            key={c.channelPoint}
            height={180}
            onToggleAccordion={() => onToggleChannelDetails(c)}
            show={c === detailedChannel}
            header={<PendingChannel channel={c} />}>
            <PendingChannelDetails channel={c} />
          </VerticalAccordion>
        ))}
      </div>
      <div className={styles.channelsContent}>
        {channels.length > 0 && (
          <Subtitle
            title={<T id="ln.channelsTab.channelList" m="Open Channels" />}
          />
        )}
        {channels.map((c) => (
          <div className={styles.headerWrapper} key={c.channelPoint}>
            <Tooltip
              className={styles.closeChannelBtn}
              content={
                <T id="ln.channelsTab.closeChannelBtn" m="Close the channel" />
              }>
              <CloseChannelModalButton
                modalTitle={
                  <T
                    id="ln.channelsTab.closeChannelModalTitle"
                    m="Close Channel"
                  />
                }
                modalContent={<CloseChannelModalContent channel={c} />}
                onSubmit={() => onCloseChannel(c)}
              />
            </Tooltip>
            <VerticalAccordion
              height={280}
              onToggleAccordion={() => onToggleChannelDetails(c)}
              show={c === detailedChannel}
              header={
                <OpenChannel channel={c} onCloseChannel={onCloseChannel} />
              }>
              <OpenChannelDetails channel={c} />
            </VerticalAccordion>
          </div>
        ))}
      </div>
      <div className={styles.channelsContent}>
        {closedChannels.length > 0 && (
          <Subtitle
            title={<T id="ln.channelsTab.closedList" m="Closed Channels" />}
          />
        )}
        {closedChannels.map((c) => (
          <VerticalAccordion
            key={c.channelPoint}
            height={180}
            onToggleAccordion={() => onToggleChannelDetails(c)}
            show={c === detailedChannel}
            header={<ClosedChannel channel={c} />}>
            <ClosedChannelDetails channel={c} />
          </VerticalAccordion>
        ))}
      </div>
    </>
  );
};

export default ChannelsTab;
