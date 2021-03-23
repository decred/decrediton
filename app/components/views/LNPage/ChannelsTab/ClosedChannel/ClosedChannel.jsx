import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { classNames } from "pi-ui";
import styles from "./ClosedChannel.module.css";

const ClosedChannel = ({ channel }) => (
  <div className={classNames(styles.openChannel, styles.channelClosed)}>
    <div className={styles.dataWrapper}>
      <div className={styles.capacity}>
        <Balance amount={channel.capacity} />
      </div>
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
    </div>
    <div className={styles.remotePubkey}>{channel.channelPoint}</div>
  </div>
);

export default ClosedChannel;
