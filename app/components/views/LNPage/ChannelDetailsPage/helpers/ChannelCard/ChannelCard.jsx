import { FormattedMessage as T } from "react-intl";
import { classNames, StatusBar, Text } from "pi-ui";
import styles from "./ChannelCard.module.css";
import { Balance, TruncatedText, LNChannelStatus } from "shared";
import { CHANNEL_STATUS_CLOSED } from "constants";
import StatusBarBalance from "../StatusBarBalance";

const ChannelCard = ({ channel, className }) => (
  <div className={classNames(styles.channel, className)}>
    <div className={styles.header}>
      <Balance
        amount={channel.capacity}
        classNameWrapper={styles.capacity}
        classNameSecondary={styles.capacitySecondary}
      />
      <Text backgroundColor="blueLighter">
        <TruncatedText text={channel.channelPoint} max={10} />
      </Text>
      <LNChannelStatus channel={channel} />
    </div>
    {channel.status === CHANNEL_STATUS_CLOSED ? (
      <div className={styles.peerBalances}>
        <div>
          <T id="ln.channelsTab.closedChannel.settledBalance" m="Settled" />
          <Balance amount={channel.settledBalance} />
        </div>
        <div>
          <T
            id="ln.channelsTab.closedChannel.timeLockedBalance"
            m="Timelocked"
          />
          <Balance amount={channel.timeLockedBalance} />
        </div>
      </div>
    ) : (
      <>
        <div>
          <StatusBar
            status={[
              {
                label: (
                  <T id="ln.channelsTab.openChannel.localBalance" m="Local" />
                ),
                amount: channel.localBalance,
                color: "#2970FF",
                renderAmountComponent: (
                  <StatusBarBalance amount={channel.localBalance} />
                )
              },
              {
                label: (
                  <T id="ln.channelsTab.openChannel.remoteBalance" m="Remote" />
                ),
                amount: channel.remoteBalance,
                color: "#3D5873",
                renderAmountComponent: (
                  <StatusBarBalance amount={channel.remoteBalance} />
                )
              }
            ]}
            max={channel.localCapacity}
            layout="balance"
            showPercent={false}
            renderStatusInfoComponent={<div />}
            renderMarkerComponent={
              <div className={classNames(styles.marker, "flex-centralize")} />
            }
          />
        </div>
        <div className={styles.footer}>
          <T id="ln.channelsTab.channelCard.capacity" m="Capacity" />
        </div>
      </>
    )}
  </div>
);

export default ChannelCard;
