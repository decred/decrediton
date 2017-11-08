import React from "react";
import TicketCard from "./TicketCard";
import ExpandedInfo from "./ExpandedInfo";
import Balance from "Balance";
import { Tooltip } from "shared";
import { tsToDate } from "helpers/dateFormat";
import { FormattedMessage as T } from "react-intl";

const statusTxt = {
  "unknown": <T id="ticket.status.unknown" m="unknown" />,
  "unmined": <T id="ticket.status.unmined" m="unmined" />,
  "immature": <T id="ticket.status.immature" m="immature" />,
  "live": <T id="ticket.status.live" m="live" />,
  "voted": <T id="ticket.status.voted" m="voted" />,
  "missed": <T id="ticket.status.missed" m="missed" />,
  "expired": <T id="ticket.status.expired" m="expired" />,
  "revoked": <T id="ticket.status.revoked" m="revoked" />,
};

const TicketInfoCard = ({ ticket, onClick, expanded }) => {

  const className = "ticket-info-card" + (expanded ? " is-expanded" : "");
  let returnTipText;
  if (ticket.status === "voted") {
    returnTipText = <T id="ticket.rewardCalc"
      m={`Investment: {investment}
      Transaction Fee: {txFee}
      Pool Fee: {poolFee}
      Ticket Reward: {reward}
      ROI: {roi, number, precise-percent}`}
      values={{
        investment: <Balance amount={ticket.ticketInvestment || 0} />,
        txFee: <Balance amount={ticket.ticketTxFee || 0} />,
        poolFee: <Balance amount={ticket.ticketPoolFee || 0} />,
        reward: <Balance amount={ticket.ticketReward || 0} />,
        roi: ticket.ticketROI
      }} />;
  } else if (ticket.status === "revoked") {
    returnTipText = <T id="ticket.revokeCalc"
      m={`Investment: {investment}
      Transaction and Revocation Fees: {txFee}
      Revocation Relay Fee: {relayFee}
      Total Loss: {reward}
      ROI: {roi, number, precise-percent}`}
      values={{
        investment: <Balance amount={ticket.ticketInvestment || 0} />,
        txFee: <Balance amount={(ticket.ticketTxFee + ticket.spenderTxFee) || 0} />,
        relayFee: <Balance amount={ticket.revocationRelayFee || 0} />,
        reward: <Balance amount={ticket.ticketReward || 0} />,
        roi: ticket.ticketROI
      }} />;
  }

  let timeToLeaveTipText;
  if (ticket.leaveTimestamp) {
    const days = Math.ceil((ticket.leaveTimestamp - ticket.enterTimestamp) / (24 * 60 * 60));
    timeToLeaveTipText = <T id="ticket.daysToLeave"
      m="~ {days, plural, one {# day} other {# days}} from buying until {status}"
      values={{days, status: statusTxt[ticket.status]}} />;
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
          values={{timestamp: tsToDate(ticket.leaveTimestamp || ticket.enterTimestamp)}} />
      </Tooltip>
    </div>
    <ExpandedInfo {...{ticket}} />
  </TicketCard>);
};

export default TicketInfoCard;
