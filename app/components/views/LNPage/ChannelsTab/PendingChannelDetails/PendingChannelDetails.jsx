import { useMemo } from "react";
import { Balance, ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";
import { CopyableText } from "pi-ui";
import styles from "./PendingChannelDetails.module.css";

const PendingOpenChannelDetails = ({ channel }) => (
  <>
    <span>
      <T id="ln.pendingOpenDetails.commitFee" m="Commit Fee" />
    </span>
    <Balance amount={channel.commitFee} />
  </>
);

const PendingCloseChannelDetails = () => <></>;

const PendingForceCloseChannelDetails = ({ channel }) => (
  <>
    <span>
      <T id="ln.pendingForceCloseDetails.closingTx" m="Closing Tx" />
    </span>
    <ExternalLink href={channel.closingTxidURL}>
      {channel.closingTxid}
    </ExternalLink>
    <span>
      <T id="ln.pendingForceCloseDetails.limboBalance" m="Limbo Balance" />
    </span>
    <Balance amount={channel.limboBalance} />
    <span>
      <T
        id="ln.pendingForceCloseDetails.recoveredBalance"
        m="Recovered Balance"
      />
    </span>
    <Balance amount={channel.recoveredBalance} />
  </>
);

const PendingWaitCloseChannelDetails = ({ channel }) => (
  <>
    <span>
      <T id="ln.waitCloseDetails.limboBalance" m="Limbo Balance" />
    </span>
    <Balance amount={channel.limboBalance} />
  </>
);

const PendingChannelDetails = ({ channel }) => {
  const { DetailsCompo, detailsType } = useMemo(() => {
    switch (channel.pendingStatus) {
      case "open":
        return {
          DetailsCompo: PendingOpenChannelDetails,
          detailsType: <T id="ln.pendingChannelDetails.typeOpen" m="Open" />
        };
      case "close":
        return {
          DetailsCompo: PendingCloseChannelDetails,
          detailsType: <T id="ln.pendingChannelDetails.typeClose" m="Close" />
        };
      case "forceclose":
        return {
          DetailsCompo: PendingForceCloseChannelDetails,
          detailsType: (
            <T id="ln.pendingChannelDetails.typeForceclose" m="Force Close" />
          )
        };
      case "waitclose":
        return {
          DetailsCompo: PendingWaitCloseChannelDetails,
          detailsType: (
            <T id="ln.pendingChannelDetails.typeWaitclose" m="Waiting Close" />
          )
        };
      default:
        return {
          DetailsCompo: null,
          detailsType: null
        };
    }
  }, [channel.pendingStatus]);

  return DetailsCompo ? (
    <div className={styles.channelDetails}>
      <span>
        <T id="ln.pendingChannelDetails.type" m="Type" />
      </span>
      <span>{detailsType}</span>
      <span>
        <T id="ln.pendingChannelDetails.channelPoint" m="Channel Point" />
      </span>
      <ExternalLink href={channel.channelPointURL}>
        {channel.channelPoint}
      </ExternalLink>
      <span>
        <T id="ln.pendingChannelDetails.remotePubKey" m="Remote Pubkey" />
      </span>
      <span>
        <CopyableText id="copyable" className={styles.copyableText}>
          {channel.remotePubkey}
        </CopyableText>
      </span>
      <DetailsCompo channel={channel} />
    </div>
  ) : (
    <div>unknown channel status '{channel.pendingStatus}'</div>
  );
};

export default PendingChannelDetails;
