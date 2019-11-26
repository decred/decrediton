import { VerticalAccordion } from "shared";
import { FormattedNumber, FormattedMessage as T } from "react-intl";
import StakeInfoDetails from "./StakeInfoDetails";
import "style/StakePool.less";

export const Column = ({ label, value, className }) =>
  <div className={className}>
    <span>{label}{label ? ": " : ""}</span>
    <span>{value}</span>
  </div>;

const StakeInfoDisplay = ({
  isShowingDetails,
  ownMempoolTicketsCount,
  unspentTicketsCount,
  immatureTicketsCount,
  liveTicketsCount,
  onToggleStakeinfo,
  sidebarOnBottom,
  ticketPoolSize,
  votedTicketsCount,
  allMempoolTicketsCount,
  missedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  totalSubsidy,
  isSPV
}) => (
  <VerticalAccordion
    header = {
      <div className="stake-info-area">
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
    }
    show={isShowingDetails}
    onToggleAccordion={onToggleStakeinfo}
    className="stake-info-details-accordion"
  >
    <StakeInfoDetails {...{
      ticketPoolSize,
      votedTicketsCount,
      allMempoolTicketsCount,
      missedTicketsCount,
      revokedTicketsCount,
      expiredTicketsCount,
      totalSubsidy,
      isSPV
    }} />
  </VerticalAccordion>
);

export default StakeInfoDisplay;
