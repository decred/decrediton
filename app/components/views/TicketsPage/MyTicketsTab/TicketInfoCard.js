import TicketCard from "./TicketCard";
import ExpandedInfo from "./ExpandedInfo";
import { Balance, Tooltip } from "shared";
import { tsToDate } from "helpers/dateFormat";
import { FormattedMessage as T } from "react-intl";
import { statusTxt } from "./messages";
import VisibilitySensor from "react-visibility-sensor";

@autobind
class TicketInfoCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {hasMouse: false};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.ticket !== this.props.ticket) ||
           (nextProps.expanded !== this.props.expanded) ||
           (nextState.hasMouse !== this.state.hasMouse);
  }

  onMouseEnter() {
    const { ticket, decodeRawTicketTransactions } = this.props;
    if (!ticket.decodedTicketTx) {
      decodeRawTicketTransactions(ticket);
    }

    this.setState({hasMouse: true});
  }

  onMouseLeave() {
    console.log("mouse leave");
    this.setState({hasMouse: false});
  }

  render() {
    const { ticket, onClick, expanded, decodeRawTicketTransactions } = this.props;
    const { onMouseEnter, onMouseLeave } = this;
    const { hasMouse } = this.state;

    console.log("rendering ticketInfoCard", hasMouse);

    const className = "ticket-info-card" + (expanded ? " is-expanded" : "") +
      " ticket-card ticket-" + ticket.status;
    let returnTipText;
    if (hasMouse && ["voted", "revoked"].indexOf(ticket.status) > -1 ) {
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
        values={{days, status: statusTxt[ticket.status]}} />;
    }

    // will only listen for mouseMove if we need to decode the ticket to
    // show further info.
    // const onMouseEnter = !ticket.decodedTicketTx
    //   ? () => decodeRawTicketTransactions(ticket) : undefined;

    // return (
    //   <VisibilitySensor partialVisibility={true}>
    //     {({isVisible}) => <div className="ticket-card">{isVisible ? "haha" : "not visible"}</div>}
    //   </VisibilitySensor>);

    return (
      <VisibilitySensor partialVisibility={true} scrollCheck={true}>
        {({isVisible}) => {
          // console.log("visible", isVisible);
          if (!isVisible) return (<div className={className}></div>);

          return (
            <div className={className}
              onClick={() => onClick(ticket)}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="ticket-info-expanded-indicator"></div>
              <div className="ticket-info-price"><Balance amount={ticket.ticketPrice} /></div>
              { !hasMouse
                ? <div className="ticket-reward"><Balance amount={ticket.ticketReward} noSmallAmount /></div>
                : returnTipText
                  ? <Tooltip tipWidth={ 300 } text={returnTipText} className="tooltip-pre-line">
                      <div className="ticket-reward"><Balance amount={ticket.ticketReward} noSmallAmount /></div>
                    </Tooltip>
                  : null
              }
              {/* {returnTipText
                ? <Tooltip tipWidth={ 300 } text={returnTipText} className="tooltip-pre-line">
                    <div className="ticket-reward"><Balance amount={ticket.ticketReward} noSmallAmount /></div>
                  </Tooltip>
                : null} */}
              <div className="ticket-timestamp">
                <T
                  id="ticket.timestamp"
                  m="{timestamp, date, medium} {timestamp, time, medium}"
                  values={{timestamp: tsToDate(ticket.enterTimestamp)}} />
              </div>
            </div>
          );

          // return (
          //   <TicketCard
          //     {...{ className, status: ticket.status }}
          //     onClick={() => onClick(ticket)}
          //     onMouseEnter={onMouseEnter}
          //   >
          //     <div className="ticket-timestamp">
          //       <Tooltip tipWidth={200} text={timeToLeaveTipText} disabled={!timeToLeaveTipText}>
          //         <T
          //           id="ticket.timestamp"
          //           m="{timestamp, date, medium} {timestamp, time, medium}"
          //           values={{timestamp: tsToDate(ticket.enterTimestamp)}} />
          //       </Tooltip>
          //     </div>
          //     {expanded ? <ExpandedInfo {...{ticket}} /> : null}
          //   </TicketCard>
          // );
        }}
      </VisibilitySensor>
    );
  }
}

export default TicketInfoCard;
