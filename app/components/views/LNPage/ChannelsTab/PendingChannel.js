import { Balance, ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";

const PendingOpenChannelDetails = ({ channel }) => (
  <>
    <span><T id="ln.pendingOpenDetails.commitFee" m="Commit Fee" /></span>
    <Balance amount={channel.commitFee} />
    {/*     <span><T id="ln.pendingOpenDetails.confirmationHeight" m="Confirmation Height" /></span>
    <span>{channel.confirmationHeight}</span>
    */}
  </>
);

const PendingCloseChannelDetails = () => (
  <></>
);

const PendingForceCloseChannelDetails = ({ channel }) => (
  <>
    <span><T id="ln.pendingForceCloseDetails.closingTx" m="Closing Tx" /></span>
    <ExternalLink href={channel.closingTxidURL}>{channel.closingTxid}</ExternalLink>
    <span><T id="ln.pendingForceCloseDetails.limboBalance" m="Limbo Balance" /></span>
    <Balance amount={channel.limboBalance} />
    <span><T id="ln.pendingForceCloseDetails.recoveredBalance" m="Recovered Balance" /></span>
    <Balance amount={channel.recoveredBalance} />
    {/*    <span><T id="ln.pendingForceCloseDetails.maturityHeight" m="Maturity Height" /></span>
    <span>{channel.maturityHeight}</span>
    */}
  </>
);

const PendingWaitCloseChannelDetails = ({ channel }) => (
  <>
    <span><T id="ln.waitCloseDetails.limboBalance" m="Limbo Balance" /></span>
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
      <span><T id="ln.pendingChannelDetails.type" m="Type" /></span>
      <span>{detailsType}</span>
      <span><T id="ln.pendingChannelDetails.channelPoint" m="Channel Point" /></span>
      <ExternalLink href={channel.channelPointURL}>{channel.channelPoint}</ExternalLink>
      <span><T id="ln.pendingChannelDetails.remotePubKey" m="Remote Pubkey" /></span>
      <span>{channel.remotePubkey}</span>
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
