import TicketInfoCard from "./TicketInfoCard";
import VisibilitySensor from "react-visibility-sensor";
@autobind
class TicketsCardList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { expandedTicket: null };
    //this.requestTicketsRawTx();
  }

  // componentWillReceiveProps(nextProps) {
  //   //this.setState(this.calcPagination(nextProps.tickets));
  // }
  onInfoCardClick(ticket) {
    if (ticket === this.state.expandedTicket) {
      this.setState({ expandedTicket: null });
    } else {
      this.setState({ expandedTicket: ticket });
    }
  }

  render() {
    const { tickets, decodeRawTicketTransactions } = this.props;
    const { expandedTicket } = this.state;
    const onClick = this.onInfoCardClick;

    console.log("Re-rendering ticket card list");
    const res = (<div className="tickets-list">
      {tickets.map(ticket => {
        const key = ticket.hash;
        const expanded = ticket === expandedTicket;
        return <TicketInfoCard {...{ key, ticket, expanded, onClick, decodeRawTicketTransactions }}  />;
        // return (
        //   <VisibilitySensor partialVisibility={true} key={key} scrollCheck={true}>
        //     {({isVisible}) => !isVisible ? <div className="ticket-card">not visible</div>
        //       : <TicketInfoCard {...{ ticket, expanded, onClick, decodeRawTicketTransactions }}  />}
        //   </VisibilitySensor>);
      })}
    </div>);
    console.log("Finished re-rendering ticket card list");
    return res;
  }
}

export default TicketsCardList;

//onClick={this.onInfoCardClick}
