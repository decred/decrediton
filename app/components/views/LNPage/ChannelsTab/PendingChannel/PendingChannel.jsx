import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./PendingChannel.module.css";

const PendingChannel = ({ channel }) => (
  <div
    className={classNames(
      styles.openChannel,
      styles[`pending${channel.pendingStatus}`]
    )}>
    <div className={styles.dataWrapper}>
      <div className={styles.capacity}>
        <Balance amount={channel.capacity} />
      </div>
      <div className={styles.peerBalances}>
        <div className="local-balance">
          <T id="ln.channelsTab.pendingChannel.localBalance" m="Local" />
          <Balance amount={channel.localBalance} />
        </div>
        <div className="remote-balance">
          <T id="ln.channelsTab.pendingChannel.remoteBalance" m="Remote" />
          <Balance amount={channel.remoteBalance} />
        </div>
      </div>
    </div>
    <div className={styles.remotePubkey}>{channel.channelPoint}</div>
  </div>
);

export default PendingChannel;
