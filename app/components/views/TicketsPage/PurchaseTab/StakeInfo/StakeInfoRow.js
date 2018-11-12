import { VerticalExpand } from "buttons";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import { Row, Column } from "./helpers";
import "style/StakePool.less";

const StakeInfoDisplay = ({
  isShowingDetails,
  ownMempoolTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  unspentTicketsCount,
  onShowStakeInfo,
  onHideStakeInfo,
  isSPV,
}) => (
  <div className="stakepool-stake-info-area" onClick={isShowingDetails ? onHideStakeInfo : onShowStakeInfo}>
    <div className="stakepool-stake-info-show-advanced-area">
      <VerticalExpand
        expanded={!!isShowingDetails}
      />
    </div>
    <Row>
      <Column
        label={<T id="stake.ownMempoolTickets" m="Own Mempool Tickets" />}
        value={<FormattedNumber value={ownMempoolTicketsCount} />} />
      <Column
        label={<T id="stake.immatureTickets" m="Immature Tickets" />}
        value={<FormattedNumber value={immatureTicketsCount} />} />
      {isSPV ?
        <Column
          label={<T id="stake.unspentTickets" m="Unspent Tickets" />}
          value={<FormattedNumber value={unspentTicketsCount} />} /> :
        <Column
          label={<T id="stake.liveTickets" m="Live Tickets" />}
          value={<FormattedNumber value={liveTicketsCount} />} />
      }
    </Row>
  </div>
);

export default StakeInfoDisplay;
