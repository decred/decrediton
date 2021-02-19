import { FormattedMessage as T } from "react-intl";
import { Balance, Subtitle, VerticalAccordion, Tooltip } from "shared";
import { KeyBlueButton, CloseChannelModalButton } from "buttons";
import { TextInput, DcrInput } from "inputs";
import styles from "./ChannelsTab.module.css";
import {
  default as OpenChannel,
  OpenChannelDetails,
  CloseChannelModalContent
} from "./OpenChannel";
import {
  default as PendingChannel,
  PendingChannelDetails
} from "./PendingChannel";
import {
  default as ClosedChannel,
  ClosedChannelDetails
} from "./ClosedChannel";

const BalanceHeader = ({ walletBalance, totalBandwidth }) => (
  <div className={styles.balanceHeader}>
    <div
      className={`${styles.balanceTile} ${
        walletBalance === 0 ? styles.zeroFunds : styles.hasFunds
      }
        `}>
      <div className={styles.balanceValue}>
        <Balance amount={walletBalance} />
      </div>
      <T id="ln.channelsTab.balance.onChain" m="Confirmed on-chain balance" />
    </div>
    <div
      className={`${styles.balanceTile} ${
        totalBandwidth === 0 ? styles.zeroFunds : styles.hasFunds
      }
        `}>
      <div className={styles.balanceValue}>
        <Balance amount={totalBandwidth} />
      </div>
      <T
        id="ln.channelsTab.balance.channelsCapacity"
        m="Total channels capacity"
      />
    </div>
  </div>
);

export default ({
  walletBalances,
  channelBalances,
  channels,
  pendingChannels,
  closedChannels,
  node,
  localAmt,
  pushAmt,
  opening,
  canOpen,
  isMainNet,
  detailedChannel,
  onNodeChanged,
  onLocalAmtChanged,
  onPushAmtChanged,
  onOpenChannel,
  onCloseChannel,
  onToggleChannelDetails
}) => (
  <>
    <Subtitle title={<T id="ln.channelsTab.balance" m="Balance" />} />
    <BalanceHeader
      walletBalance={walletBalances.confirmedBalance}
      totalBandwidth={
        channelBalances.maxInboundAmount + channelBalances.maxOutboundAmount
      }
    />

    <Subtitle title={<T id="ln.channelsTab.openChannel" m="Open Channel" />} />

    <div className={styles.openNewChannel}>
      <div className={styles.node}>
        <T id="ln.openChannel.node" m="Counterparty (node@ip:port)" />
        <TextInput value={node} onChange={onNodeChanged} />
      </div>
      <div className="local-amt">
        <T id="ln.openChannel.localAmt" m="Total Funding Amount" />
        <DcrInput amount={localAmt} onChangeAmount={onLocalAmtChanged} />
      </div>
      {isMainNet ? null : ( // Not allowing to push atoms in mainnet as a precaution from inadvertent user action for the moment.
        <div className="push-amt">
          <T id="ln.openChannel.pushAmt" m="Push Amount (optional)" />
          <DcrInput amount={pushAmt} onChangeAmount={onPushAmtChanged} />
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
      {pendingChannels.length > 0 ? (
        <Subtitle
          title={<T id="ln.channelsTab.pendingList" m="Pending Channels" />}
        />
      ) : null}
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
      {channels.length > 0 ? (
        <Subtitle
          title={<T id="ln.channelsTab.channelList" m="Open Channels" />}
        />
      ) : null}
      {channels.map((c) => (
        <div className={styles.headerWrapper} key={c.channelPoint}>
          <Tooltip
            className={styles.closeChannelBtn}
            text={
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
      {closedChannels.length > 0 ? (
        <Subtitle
          title={<T id="ln.channelsTab.closedList" m="Closed Channels" />}
        />
      ) : null}
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
