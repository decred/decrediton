import styles from "./CloseChannelModalContent.module.css";
import { FormattedMessage as T } from "react-intl";
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
    {!channel.active && <Documentation name="LNForceCloseChannelWarning" />}
    <div className={styles.modalChaninfo}>
      <T id="ln.closeChannelModal.capacity" m="Capacity" />
      <div className={styles.capacity}>
        <Balance amount={channel.capacity} />
      </div>
      <T id="ln.closeChannelModal.localBalance" m="Local Balance" />
      <div>
        <Balance amount={channel.localBalance} />
      </div>
      <T id="ln.closeChannelModal.node" m="Counterparty" />
      <div className={styles.node}>{channel.remotePubkey}</div>
      <T id="ln.closeChannelModal.channelPoint" m="Channel Point" />
      <div>{channel.channelPoint}</div>
    </div>
  </>
);

export default CloseChannelModalContent;
