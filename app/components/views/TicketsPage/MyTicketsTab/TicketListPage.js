import { ticketsList } from "connectors";
import TicketsCardList from "./TicketsCardList";
import TicketInfoCard from "./TicketInfoCard";
import { FormattedMessage as T } from "react-intl";
import Paginator from "Paginator";
import { SlateGrayButton } from "buttons";
import "style/MyTickets.less";

@autobind
class TicketListPage extends React.Component{

  constructor(props) {
    super(props);
    const pagination = this.calcPagination(props.tickets);
    this.state = { currentPage: 0, expandedTicket: null, ...pagination };
    this.requestTicketsRawTx();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.calcPagination(nextProps.tickets));
  }

  calcPagination(tickets) {
    const ticketsPerPage = 6;
    const totalPages = tickets.length > 0 ? Math.ceil(tickets.length / ticketsPerPage) : 0;

    return { ticketsPerPage, totalPages };
  }

  onInfoCardClick(ticket) {
    if (ticket === this.state.expandedTicket) {
      this.setState({ expandedTicket: null });
    } else {
      this.setState({ expandedTicket: ticket });
    }
  }

  onPageChanged(pageNumber) {
    this.setState({ currentPage: pageNumber }, this.requestTicketsRawTx);
  }

  getVisibleTickets() {
    const { currentPage, ticketsPerPage } = this.state;
    const startIndex = currentPage * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;
    return this.props.tickets.slice(startIndex, endIndex);
  }

  requestTicketsRawTx() {
    const visibleTickets = this.getVisibleTickets();
    const toDecode = visibleTickets.reduce((a, t) => {
      if (!t.decodedTicketTx) {
        a.push(t.ticketRawTx);
        if (t.spenderHash) {
          a.push(t.spenderRawTx);
        }
      }
      return a;
    }, []);
    this.props.decodeRawTransactions(toDecode);
  }

  goBack() {
    this.props.goBackHistory();
  }

  render() {
    const { currentPage, totalPages, expandedTicket } = this.state;

    const visibleTickets = this.getVisibleTickets();
    const visibleCards = visibleTickets.map(ticket => {
      const key = ticket.hash;
      const expanded = expandedTicket && ticket.hash === expandedTicket.hash;
      return <TicketInfoCard {...{ key, ticket, expanded }} onClick={this.onInfoCardClick} />;
    });

    return (
      <Aux>
        {(visibleCards.length > 0
          ? <Aux>
            <TicketsCardList>{visibleCards}</TicketsCardList>
            <Paginator {...{ totalPages, currentPage, onPageChanged: this.onPageChanged }} />
          </Aux>
          : <T id="myTickets.noTicketsWithStatus" m="No tickets found" />
        )}
        <SlateGrayButton key="back" className="ticket-list-back-btn" onClick={this.goBack}>
          <T id="ticketList.backBtn" m="Back" />
        </SlateGrayButton>
      </Aux>
    );
  }
}

export default ticketsList(TicketListPage);
