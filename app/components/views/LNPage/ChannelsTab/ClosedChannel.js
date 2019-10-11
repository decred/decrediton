import { FormattedMessage as T } from "react-intl";
import { Balance, ExternalLink } from "shared";
import * as lna from "actions/LNActions";

const closeTypes = {
  [lna.CLOSETYPE_COOPERATIVE_CLOSE]: <T id="ln.closeTypeCooperative" m="Cooperative" />,
  [lna.CLOSETYPE_LOCAL_FORCE_CLOSE]: <T id="ln.closeTypeLocalForce" m="Local Force-close" />,
  [lna.CLOSETYPE_REMOTE_FORCE_CLOSE]: <T id="ln.closeTypeRemoteForce" m="Remote Force-close" />,
  [lna.CLOSETYPE_BREACH_CLOSE]: <T id="ln.closeTypeBreach" m="Breach Force-close" />,
  [lna.CLOSETYPE_FUNDING_CANCELED]: <T id="ln.closeTypeFundingCanceled" m="Funding Canceled" />,
  [lna.CLOSETYPE_ABANDONED]: <T id="ln.closeTypeAbandoned" m="Abandoned" />
};

export const ClosedChannelDetails = ({ channel }) => (
  <div className="ln-closed-channel-details">
    <div><T id="ln.closedChannelDetails.chanId" m="Channel ID" /></div>
    <span>{channel.chanId}</span>
    <T id="ln.closedChannelDetails.closeType" m="Close Type" />
    <span>{ closeTypes[channel.closeType] }</span>
    <span><T id="ln.closedChannelDetails.channelPoint" m="Channel Point"/></span>
    <ExternalLink href={channel.channelPointURL}>{channel.channelPoint}</ExternalLink>
    <span><T id="ln.closedChannelDetails.closingTx" m="Closing Tx" /></span>
    <ExternalLink href={channel.closingTxidURL}>{channel.closingTxHash}</ExternalLink>
    <span><T id="ln.closedChannelDetails.remotePubKey" m="Remote PubKey" /></span>
    <span>{channel.remotePubkey}</span>
  </div>
);

export default ({ channel }) => (
  <div className="ln-open-channel channel-closed">
    <div className="data-wrapper">
      <div className="capacity"><Balance amount={channel.capacity}/></div>
      <div className="peer-balances">
        <div className="local-balance">
          <T id="ln.channelsTab.closedChannel.settledBalance" m="Settled"/>
          <Balance amount={channel.settledBalance} />
        </div>
        <div className="remote-balance">
          <T id="ln.channelsTab.closedChannel.timeLockedBalance" m="Timelocked"/>
          <Balance amount={channel.timeLockedBalance}/>
        </div>
      </div>
    </div>
    <div className="remote-pubkey">{channel.channelPoint}</div>
  </div>
);
