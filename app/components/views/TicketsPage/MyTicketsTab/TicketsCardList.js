import TicketInfoCard from "./TicketInfoCard";

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
    return (<div className="tickets-list">
      {tickets.map(ticket => {
        const key = ticket.hash;
        const expanded = ticket === expandedTicket;
        return <TicketInfoCard {...{ key, ticket, expanded, onClick, decodeRawTicketTransactions }}  />;
      })}
    </div>);
  }
}

export default TicketsCardList;

//onClick={this.onInfoCardClick}
