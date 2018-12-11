import TicketCard from "./TicketCard";
@autobind
class TicketsCardList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { expandedTicket: null };
  }

  onInfoCardClick(ticket) {
    if (ticket === this.state.expandedTicket) {
      this.setState({ expandedTicket: null });
    } else {
      this.setState({ expandedTicket: ticket });
    }
  }

  render() {
    const { tickets, tsDate } = this.props;
    const { expandedTicket } = this.state;
    const onClick = this.onInfoCardClick;

    const res = (<div className="tickets-list">
      {tickets.map(ticket => {
        const key = ticket.hash;
        const expanded = ticket === expandedTicket;
        return <TicketCard {...{ key, ticket, expanded, onClick, tsDate }}  />;
      })}
    </div>);
    return res;
  }
}

export default TicketsCardList;
