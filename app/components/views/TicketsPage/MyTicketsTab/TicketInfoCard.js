import ExpandedInfo from "./ExpandedInfo";
import { Balance, Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { statusTxt } from "./messages";

@autobind
class TicketInfoCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasMouse: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.ticket !== this.props.ticket) ||
      (nextProps.expanded !== this.props.expanded) ||
      (nextState.hasMouse !== this.state.hasMouse);
  }

  onMouseEnter() {
    this.setState({ hasMouse: true });
  }

  onMouseLeave() {
    this.setState({ hasMouse: false });
  }

  // getTicketRewardDiv returns the component to show as ticket reward. May be:
  // tooltip+div if this card is a ticket with reward info and has mouse over it
  // div if this card is a ticket with reward info but no mouse over it
  // null if this is card is a ticket without reward info
  getTicketRewardDiv() {
    const { hasMouse } = this.state;
    const { ticket } = this.props;
    if ([ "voted", "revoked" ].indexOf(ticket.status) === -1) return null;

    const rewardDiv = (<div className="ticket-reward"><Balance amount={ticket.ticketReward} noSmallAmount /></div>);
    if (!hasMouse) return rewardDiv;

    const rewardLabel = ticket.ticketReward > 0
      ? <T id="ticket.rewardLabel" m="Ticket Reward" />
      : <T id="ticket.lossLabel" m="Ticket Loss" />;

    const tipBalance = amount =>
      <Balance
        classNameWrapper="ticket-info-card-return-balance"
        amount={amount || 0}
      />;

    const returnTipText = <T id="ticket.rewardCalc"
      m={`Investment: {investment}
      Transaction Fee: {txFee}
      Pool Fee: {poolFee}
      {rewardLabel}: {reward}
      Stake Rewards: {stakeRewards, number, precise-percent}`}
      values={{
        investment: tipBalance(ticket.ticketInvestment),
        txFee: tipBalance(ticket.ticketTxFee),
        poolFee: tipBalance(ticket.ticketPoolFee),
        rewardLabel: rewardLabel,
        reward: tipBalance(ticket.ticketReward),
        stakeRewards: ticket.ticketStakeRewards
      }} />;

    return (
      <Tooltip tipWidth={300} text={returnTipText} className="tooltip-pre-line">
        {rewardDiv}
      </Tooltip>
    );
  }

  // getTimestampDiv returns the div to be used on the timestamp slot
  getTimestampDiv() {
    const { ticket } = this.props;

    const timestamp = ticket.leaveTimestamp ? ticket.leaveTimestamp : ticket.enterTimestamp;
    return (
      <div className="ticket-timestamp">
        <T
          id="ticket.timestamp"
          m="{timestamp, date, medium} {timestamp, time, medium}"
          values={{ timestamp: this.props.tsDate(timestamp) }} />
      </div>
    );
  }

  // getDaysToVoteDiv returns the div to be used on the daysToVote slot.
  getDaysToVoteDiv() {
    const { ticket } = this.props;
    const { hasMouse } = this.state;

    if (!ticket.leaveTimestamp) return null;

    const days = Math.ceil((ticket.leaveTimestamp - ticket.enterTimestamp) / (24 * 60 * 60));

    const daysToVoteDiv = (
      <div className="ticket-days-to-vote">
        <T id="ticket.daysToVote" m="{days, plural, one {# day} other {# days}}"
          values={{ days: days }} />
      </div>
    );

    if (!hasMouse) return daysToVoteDiv;

    const timeToLeaveTipText = (
      <T id="ticket.daysToLeave"
        m="~ {days, plural, one {# day} other {# days}} from buying until {status}"
        values={{ days, status: statusTxt[ticket.status] }} />
    );

    return (
      <Tooltip tipWidth={200} text={timeToLeaveTipText}>
        {daysToVoteDiv}
      </Tooltip>
    );
  }

  render() {
    const { ticket, expanded } = this.props;
    const { onMouseEnter, onMouseLeave } = this;

    const rewardDiv = this.getTicketRewardDiv();
    const timestampDiv = this.getTimestampDiv();
    const daysToVoteDiv = this.getDaysToVoteDiv();

    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="ticket-info-expanded-indicator"></div>
        <div className="ticket-info-price"><Balance amount={ticket.ticketPrice} /></div>
        {rewardDiv}
        {timestampDiv}
        {daysToVoteDiv}
        {expanded ? <ExpandedInfo ticket={ticket} /> : null}
      </div>
    );
  }
}

export default TicketInfoCard;
