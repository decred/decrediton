import { FormattedMessage as T } from "react-intl";
import styles from "./OpenChannelDetails.module.css";
import { Balance, ExternalLink } from "shared";
import { CopyableText } from "pi-ui";

const OpenChannelDetails = ({ channel }) => (
  <div className={styles.channelDetails}>
    <T id="ln.openChannelDetails.chanId" m="Channel ID" />
    <span>{channel.chanId}</span>
    <T id="ln.openChannelDetails.channelPoint" m="Channel Point" />
    <ExternalLink href={channel.channelPointURL}>
      {channel.channelPoint}
    </ExternalLink>
    <T id="ln.openChannelDetails.commitFee" m="Commit Fee" />
    <Balance amount={channel.commitFee} />
    <span>
      <T id="ln.openChannelDetails.csvDelay" m="CSV Delay" />
    </span>
    <span>
      <T
        id="ln.openChannelDetails.csvDelayValue"
        m="{csvDelay} blocks"
        values={{ csvDelay: channel.csvDelay }}
      />
    </span>
    <span>
      <T id="ln.openChannelDetails.remotePubKey" m="Remote PubKey" />
    </span>
    <span>
      <CopyableText id="copyable" className={styles.copyableText}>
        {channel.remotePubkey}
      </CopyableText>
    </span>
    <T id="ln.openChannelDetails.numUpdates" m="Number of Updates" />
    <span>{channel.numUpdates}</span>
    <T id="ln.openChannelDetails.localChannelReserve" m="Local Reserve" />
    <Balance amount={channel.localChanReserveAtoms} />
    <T id="ln.openChannelDetails.remoteChannelReserve" m="Remote Reserve" />
    <Balance amount={channel.remoteChanReserveAtoms} />
    <T id="ln.openChannelDetails.unsettledBalance" m="Unsettled Balance" />
    <Balance amount={channel.unsettledBalance} />
    <T id="ln.openChannelDetails.totalSent" m="Total Sent" />
    <Balance amount={channel.totalAtomsSent} />
    <T id="ln.openChannelDetails.totalReceived" m="Total Received" />
    <Balance amount={channel.totalAtomsReceived} />
  </div>
);

export default OpenChannelDetails;
