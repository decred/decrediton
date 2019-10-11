import { FormattedMessage as T } from "react-intl";
import { Balance, Documentation, ExternalLink } from "shared";

export const CloseChannelModalContent = ({ channel }) => (
  <>
    <p>
      { channel.active
        ? <T id="ln.closeChannelModal.descr" m="Attempt cooperative close of channel?" />
        : <T id="ln.closeChannelModa.descrForce" m="Attempt forced close of the channel?"/>
      }
    </p>

    { channel.active ? null : <Documentation name="LNForceCloseChannelWarning" /> }

    <div className="ln-closechannelmodal-chaninfo">
      <T id="ln.closeChannelModal.capacity" m="Capacity" />
      <div className="capacity"><Balance amount={channel.capacity} /></div>
      <T id="ln.closeChannelModal.localBalance" m="Local Balance" />
      <div className="local-balance"><Balance amount={channel.localBalance} /></div>
      <T id="ln.closeChannelModal.node" m="Counterparty" />
      <div className="node">{channel.remotePubkey}</div>
      <T id="ln.closeChannelModal.channelPoint" m="Channel Point" />
      <div className="channelpoint">{channel.channelPoint}</div>
    </div>
  </>
);

export const OpenChannelDetails = ({ channel }) => (
  <div className="ln-open-channel-details">
    <T id="ln.openChannelDetails.chanId" m="Channel ID" />
    <span>{channel.chanId}</span>
    <T id="ln.openChannelDetails.channelPoint" m="Channel Point"/>
    <ExternalLink href={channel.channelPointURL}>{channel.channelPoint}</ExternalLink>
    <T id="ln.openChannelDetails.commitFee" m="Commit Fee" />
    <Balance amount={channel.commitFee} />
    <span><T id="ln.openChannelDetails.csvDelay" m="CSV Delay" /></span>
    <span><T id="ln.openChannelDetails.csvDelayValue" m="{csvDelay} blocks" values={ { csvDelay: channel.csvDelay } } /></span>
    <span><T id="ln.openChannelDetails.remotePubKey" m="Remote PubKey" /></span>
    <span>{channel.remotePubkey}</span>
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

export default ({ channel }) => (
  <div className={ [ "ln-open-channel", "channel-" + (channel.active ? "active" : "inactive") ].join(" ") }>
    <div className="data-wrapper">
      <div className="capacity"><Balance amount={channel.capacity}/></div>
      <div className="peer-balances">
        <div className="local-balance">
          <T id="ln.channelsTab.openChannel.localBalance" m="Local"/>
          <Balance amount={channel.localBalance} />
        </div>
        <div className="remote-balance">
          <T id="ln.channelsTab.openChannel.remoteBalance" m="Remote"/>
          <Balance amount={channel.remoteBalance}/>
        </div>
      </div>
    </div>
    <div className="remote-pubkey">{channel.channelPoint}</div>
  </div>
);
