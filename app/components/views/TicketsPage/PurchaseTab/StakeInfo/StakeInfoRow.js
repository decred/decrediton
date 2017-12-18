import { TicketsCogs } from "buttons";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const StakeInfoDisplay = ({
  isShowingDetails,
  ownMempoolTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  onShowStakeInfo,
  onHideStakeInfo
}) => (
  <div className="stakepool-stake-info-area-small">
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label"><T id="stake.ownMempoolTickets" m="Own Mempool Tickets" />:</div>
      <div className="stakepool-stake-info-value"><FormattedNumber value={ownMempoolTicketsCount} /></div>
    </div>
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label"><T id="stake.immatureTickets" m="Immature Tickets" />:</div>
      <div className="stakepool-stake-info-value"><FormattedNumber value={immatureTicketsCount} /></div>
    </div>
    <div className="stakepool-stake-info-row-small">
      <div className="stakepool-stake-info-label"><T id="stake.liveTickets" m="Live Tickets" />:</div>
      <div className="stakepool-stake-info-value"><FormattedNumber value={liveTicketsCount} /></div>
    </div>
    <div className="stakepool-stake-info-show-advanced-area">
      <TicketsCogs
        opened={!isShowingDetails}
        style={{paddingTop: "2px"}}
        onClick={isShowingDetails ? onHideStakeInfo : onShowStakeInfo}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
