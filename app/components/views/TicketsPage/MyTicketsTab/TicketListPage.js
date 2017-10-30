import React, {Component} from "react";
import { autobind } from "core-decorators";
import ticketsList from "connectors/ticketsList";
import TicketsCardList from "./TicketsCardList";
import TicketInfoCard from "./TicketInfoCard";
import { FormattedMessage as T } from "react-intl";
import Paginator from "Paginator";
import SlateGrayButton from "SlateGrayButton";
import "style/MyTickets.less";

@autobind
class TicketListPage extends Component{/*  */

  constructor(props) {
    super(props);
    const pagination = this.calcPagination(props.tickets);
    this.state = { currentPage: 0, expandedTicket: null, ...pagination };
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
      this.setState({expandedTicket: null});
    } else {
      this.setState({expandedTicket: ticket});
    }
  }

  onPageChanged(pageNumber) {
    this.setState({currentPage: pageNumber});
  }

  render() {
    const { currentPage, ticketsPerPage, totalPages, expandedTicket } = this.state;
    const { router } = this.props;

    const startIndex = currentPage * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;
    const visibleTickets = this.props.tickets.slice(startIndex, endIndex+1);
    const visibleCards = visibleTickets.map(ticket => {
      const key = ticket.hash;
      const expanded = ticket === expandedTicket;
      return <TicketInfoCard {...{key, ticket, expanded}} onClick={this.onInfoCardClick} />;
    });

    /*for (let i = 0; i < this.state.shownTo; i++) {
      const ticket = this.props.tickets[i];
      const key = ticket.status + "/" + i;
      const expanded = ticket === this.state.expandedTicket;
      visible.push((
        <TicketInfoCard {...{key, ticket, expanded}} onClick={this.onInfoCardClick} />
      ));
    }*/

    if (visibleTickets.length > 0) {
      // just to see what information a ticket has. Remove before going to production.
      console.log(visibleTickets[0]);
    }

    return (
      <Aux>
          {(visibleCards.length > 0
            ? <Aux>
                <TicketsCardList>{visibleCards}</TicketsCardList>
                <Paginator {...{totalPages, currentPage, onPageChanged: this.onPageChanged}} />
              </Aux>
            : <T id="myTickets.noTicketsWithStatus" m="No tickets found" />
          )}
          <SlateGrayButton key="back" className="ticket-list-back-btn" onClick={() => router.goBack()}>
            <T id="ticketList.backBtn" m="Back" />
          </SlateGrayButton>
      </Aux>
    );
  }
}

export default ticketsList(TicketListPage);
