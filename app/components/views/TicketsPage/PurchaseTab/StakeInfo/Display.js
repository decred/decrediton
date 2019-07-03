import { TransitionMotionWrapper } from "shared";
import { VerticalExpand } from "buttons";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const wrapperComponent = props => <div { ...props } />;

export const Column = ({ label, value }) =>
  <div className="stakepool-stake-info-column">
    <span className="stakepool-stake-info-label">{label}{label ? ":" : ""}</span>
    <span className="stakepool-stake-info-value">{value}</span>
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
  onHideStakeInfo
}) => (
  <>
    <div className="is-row stakepool-stake-info-area" onClick={isShowingDetails ? onHideStakeInfo : onShowStakeInfo}>
      <div className="stakepool-stake-info-row">
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
      </div>
      <div className="stake-info-show-details">
        <VerticalExpand
          expanded={!!isShowingDetails}
        />
      </div>
    </div>
    <TransitionMotionWrapper
      {
      ...{
        styles: !isShowingDetails ? getNullStyles() : getStakeInfoDetailsComponent(),
        wrapperComponent,
      }}
    />
  </>);

export default StakeInfoDisplay;
