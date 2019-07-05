import { TransitionMotionWrapper } from "shared";
import { VerticalExpand } from "buttons";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const wrapperComponent = props => <div { ...props } />;

export const Column = ({ label, value, className }) =>
  <div className={className}>
    <span>{label}{label ? ": " : ""}</span>
    <span>{value}</span>
  </div>;

const StakeInfoDisplay = ({
  getNullStyles,
  getStakeInfoDetailsComponent,
  isShowingDetails,
  ownMempoolTicketsCount,
  unspentTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  isSPV,
  onShowStakeInfo,
  onHideStakeInfo,
  sidebarOnBottom,
}) => (
  <div className="stake-info-area">
    <div className="is-row stake-info-row-area" onClick={isShowingDetails ? onHideStakeInfo : onShowStakeInfo}>
      <div className="is-row">
        <Column
          className={"stake-info"}
          label={<T id="stake.ownMempoolTickets" m="Own Mempool Tickets" />}
          value={<FormattedNumber value={ownMempoolTicketsCount} />} />
        {!sidebarOnBottom &&
          <Column
            className={"stake-info"}
            label={<T id="stake.immatureTickets" m="Immature Tickets" />}
            value={<FormattedNumber value={immatureTicketsCount} />} />
        }
        {isSPV ?
          <Column
            className={"stake-info"}
            label={<T id="stake.unspentTickets" m="Unspent Tickets" />}
            value={<FormattedNumber value={unspentTicketsCount} />} /> :
          <Column
            className={"stake-info"}
            label={<T id="stake.liveTickets" m="Live Tickets" />}
            value={<FormattedNumber value={liveTicketsCount} />} />
        }
      </div>
      <div className="stake-info-show-details">
        <VerticalExpand
          expanded={!!isShowingDetails}
        />
      </div>
    </div>
    <TransitionMotionWrapper {...{
      styles: !isShowingDetails ? getNullStyles() : getStakeInfoDetailsComponent(),
      wrapperComponent, }} />
  </div>);

export default StakeInfoDisplay;
