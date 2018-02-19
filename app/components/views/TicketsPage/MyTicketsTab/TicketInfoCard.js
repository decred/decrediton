import TicketCard from "./TicketCard";
import ExpandedInfo from "./ExpandedInfo";
import { Balance, Tooltip } from "shared";
import { tsToDate } from "helpers/dateFormat";
import { FormattedMessage as T } from "react-intl";
import { statusTxt } from "./messages";

const TicketInfoCard = ({ ticket, onClick, expanded }) => {

  const className = "ticket-info-card" + (expanded ? " is-expanded" : "");
  let returnTipText;
  if ([ "voted", "revoked" ].indexOf(ticket.status) > -1 ) {
    const rewardLabel = ticket.ticketReward > 0
      ? <T id="ticket.rewardLabel" m="Ticket Reward" />
      : <T id="ticket.lossLabel" m="Ticket Loss" />;

    returnTipText = <T id="ticket.rewardCalc"
      m={`Investment: {investment}
      Transaction Fee: {txFee}
      Pool Fee: {poolFee}
      {rewardLabel}: {reward}
      ROI: {roi, number, precise-percent}`}
      values={{
        investment: <Balance amount={ticket.ticketInvestment || 0} />,
        txFee: <Balance amount={ticket.ticketTxFee || 0} />,
        poolFee: <Balance amount={ticket.ticketPoolFee || 0} />,
        rewardLabel: rewardLabel,
        reward: <Balance amount={ticket.ticketReward || 0} />,
        roi: ticket.ticketROI
      }} />;
  }

  let timeToLeaveTipText;
  if (ticket.leaveTimestamp) {
    const days = Math.ceil((ticket.leaveTimestamp - ticket.enterTimestamp) / (24 * 60 * 60));
    timeToLeaveTipText = <T id="ticket.daysToLeave"
      m="~ {days, plural, one {# day} other {# days}} from buying until {status}"
      values={{ days, status: statusTxt[ticket.status] }} />;
  }

  return (<TicketCard
    {...{ className, status: ticket.status }}
    onClick={() => onClick(ticket)}
  >
    <div className="ticket-info-expanded-indicator"></div>
    <div className="ticket-info-price"><Balance amount={ticket.ticketPrice} /></div>
    {returnTipText
      ? <Tooltip tipWidth={ 300 } text={returnTipText} className="tooltip-pre-line">
        <div className="ticket-reward"><Balance amount={ticket.ticketReward} noSmallAmount /></div>
      </Tooltip>
      : null }
    <div className="ticket-timestamp">
      <Tooltip tipWidth={200} text={timeToLeaveTipText} disabled={!timeToLeaveTipText}>
        <T
          id="ticket.timestamp"
          m="{timestamp, date, medium} {timestamp, time, medium}"
          values={{ timestamp: tsToDate(ticket.leaveTimestamp || ticket.enterTimestamp) }} />
      </Tooltip>
    </div>
    <ExpandedInfo {...{ ticket }} />
  </TicketCard>);
};

export default TicketInfoCard;
