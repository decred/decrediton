import { Balance, ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";

const PendingOpenChannelDetails = ({ channel }) => (
  <>
    <T id="ln.pendingOpenDetails.commitFee" m="Commit Fee" />
    <Balance amount={channel.commitFee} />
    <T id="ln.pendingOpenDetails.confirmationHeight" m="Confirmation Height" />
    <span>{channel.confirmationHeight}</span>
  </>
);

const PendingCloseChannelDetails = () => (
  <></>
);

const PendingForceCloseChannelDetails = ({ channel }) => (
  <>
    <T id="ln.pendingForceCloseDetails.closingTx" m="Closing Tx" />
    <ExternalLink href={channel.closingTxidURL}>{channel.closingTxid}</ExternalLink>
    <T id="ln.pendingForceCloseDetails.limboBalance" m="Limbo Balance" />
    <Balance amount={channel.limboBalance} />
    <T id="ln.pendingForceCloseDetails.recoveredBalance" m="Recovered Balance" />
    <Balance amount={channel.recoveredBalance} />
    <T id="ln.pendingForceCloseDetails.maturityHeight" m="Maturity Height" />
    <span>{channel.maturityHeight}</span>
  </>
);

const PendingWaitCloseChannelDetails = ({ channel }) => (
  <>
    <T id="ln.waitCloseDetails.limboBalance" m="Limbo Balance" />
    <Balance amount={channel.limboBalance} />
  </>
);


export const PendingChannelDetails = ({ channel }) => {
  let DetailsCompo;
  let detailsType;

  switch (channel.pendingStatus) {
  case "open":
    DetailsCompo = PendingOpenChannelDetails;
    detailsType = <T id="ln.pendingChannelDetails.typeOpen" m="Open" />;
    break;

  case "close":
    DetailsCompo = PendingCloseChannelDetails;
    detailsType = <T id="ln.pendingChannelDetails.typeClose" m="Close" />;
    break;

  case "forceclose":
    DetailsCompo = PendingForceCloseChannelDetails;
    detailsType = <T id="ln.pendingChannelDetails.typeForceclose" m="Force Close" />;
    break;

  case "waitclose":
    DetailsCompo = PendingWaitCloseChannelDetails;
    detailsType = <T id="ln.pendingChannelDetails.typeWaitclose" m="Waiting Close" />;
    break;

  default:
    return <div>unknown channel status '{channel.pendingStatus}'</div>;
  }

  return (
    <div className="ln-pending-channel-details">
      <T id="ln.pendingChannelDetails.type" m="Type" />
      {detailsType}
      <T id="ln.pendingChannelDetials.channelPoint" m="Channel Point" />
      <ExternalLink href={channel.channelPointURL}>{channel.channelPoint}</ExternalLink>
      <T id="ln.pendingChannelDetails.remotePubKey" m="Remote Pubkey" />
      {channel.remotePubkey}
      <DetailsCompo channel={channel} />
    </div>
  );
};

export default ({ channel }) => (
  <div className={[ "ln-open-channel", "pending-"+channel.pendingStatus ].join(" ")}>
    <div className="data-wrapper">
      <div className="capacity"><Balance amount={channel.capacity}/></div>
      <div className="peer-balances">
        <div className="local-balance">
          <T id="ln.channelsTab.pendingChannel.localBalance" m="Local"/>
          <Balance amount={channel.localBalance} />
        </div>
        <div className="remote-balance">
          <T id="ln.channelsTab.pendingChannel.remoteBalance" m="Remote"/>
          <Balance amount={channel.remoteBalance}/>
        </div>
      </div>
    </div>
    <div className="remote-pubkey">{channel.channelPoint}</div>
  </div>
);
