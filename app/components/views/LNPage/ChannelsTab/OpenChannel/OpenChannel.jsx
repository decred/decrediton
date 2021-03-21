import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./OpenChannel.module.css";
import { Balance, Documentation } from "shared";

export const CloseChannelModalContent = ({ channel }) => (
  <>
    <p>
      {channel.active ? (
        <T
          id="ln.closeChannelModal.descr"
          m="Attempt cooperative close of channel?"
        />
      ) : (
        <T
          id="ln.closeChannelModa.descrForce"
          m="Attempt forced close of the channel?"
        />
      )}
    </p>

    {channel.active ? null : (
      <Documentation name="LNForceCloseChannelWarning" />
    )}

    <div className={styles.modalChaninfo}>
      <T id="ln.closeChannelModal.capacity" m="Capacity" />
      <div className={styles.capacity}>
        <Balance amount={channel.capacity} />
      </div>
      <T id="ln.closeChannelModal.localBalance" m="Local Balance" />
      <div className="local-balance">
        <Balance amount={channel.localBalance} />
      </div>
      <T id="ln.closeChannelModal.node" m="Counterparty" />
      <div className={styles.node}>{channel.remotePubkey}</div>
      <T id="ln.closeChannelModal.channelPoint" m="Channel Point" />
      <div className="channelpoint">{channel.channelPoint}</div>
    </div>
  </>
);

const ChannelStatus = ({ localBalance, remoteBalance }) => {
  const totalBalance = localBalance + remoteBalance;
  const localStyle = {
    border: "3px solid var(--cyan-bold)",
    borderRadius: "5px 0 0 5px",
    width: `${(localBalance * 100) / totalBalance}%`
  };

  const remoteStyle = {
    border: "3px solid var(--link-color)",
    borderRadius: "0 5px 5px 0",
    width: `${(remoteBalance * 100) / totalBalance}%`,
    right: "2em",
    posisiton: "absolute"
  };

  const separator = {
    border: "2px solid var(--sidebar-color)"
  };

  if (localBalance === 0) {
    separator.display = "none";
    localStyle.display = "none";
    remoteStyle.borderRadius = "5px";
  }
  if (remoteBalance === 0) {
    separator.display = "none";
    remoteStyle.display = "none";
    localStyle.borderRadius = "5px";
  }

  return (
    <div className={styles.channelStatusWrapper}>
      <div style={localStyle}></div>
      <div style={separator}></div>
      <div style={remoteStyle}></div>
    </div>
  );
};

const OpenChannel = ({ channel }) => (
  <div
    className={classNames(
      styles.openChannel,
      channel.active ? styles.channelActive : styles.channelInactive
    )}>
    <div className={styles.dataWrapper}>
      <div className={styles.capacity}>
        <Balance amount={channel.capacity} />
      </div>
      <div className={styles.peerBalances}>
        <div className="local-balance">
          <T id="ln.channelsTab.openChannel.localBalance" m="Local" />
          <Balance amount={channel.localBalance} />
        </div>
        <div className="remote-balance">
          <T id="ln.channelsTab.openChannel.remoteBalance" m="Remote" />
          <Balance amount={channel.remoteBalance} />
        </div>
      </div>
    </div>
    <div className={styles.remotePubkey}>{channel.channelPoint}</div>
    <ChannelStatus
      localBalance={channel.localBalance}
      remoteBalance={channel.remoteBalance}
    />
  </div>
);

export default OpenChannel;
