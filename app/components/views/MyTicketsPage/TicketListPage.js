import React, {Component} from "react";
import { autobind } from "core-decorators";
import Header from "Header";
import ticketList from "connectors/ticketList";
import TicketsCardList from "./TicketsCardList";
import TicketInfoCard from "./TicketInfoCard";
import { push as pushHistory } from "react-router-redux";
import { FormattedMessage as T } from "react-intl";
import Paginator from "Paginator";
import "../../../style/MyTickets.less"

@autobind
class TicketListPage extends Component{/*  */

  constructor(props) {
    super(props);
    const pagination = this.calcPagination(props.tickets);
    this.state = { currentPage: 0, expandedTicket: null, ...pagination };
  }

  calcPagination(tickets) {
    const ticketsPerPage = 6;
    const totalPages = tickets.length > 0 ? Math.ceil(tickets.length / ticketsPerPage) : 0;

    return { ticketsPerPage, totalPages }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.calcPagination());
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
    const visible = Array();
    const { currentPage, ticketsPerPage, totalPages, expandedTicket } = this.state;

    const startIndex = currentPage * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;
    const visibleTickets = this.props.tickets.slice(startIndex, endIndex+1);
    const visibleCards = visibleTickets.map(ticket => {
      const key = ticket.hash;
      const expanded = ticket === expandedTicket;
      return <TicketInfoCard {...{key, ticket, expanded}} onClick={this.onInfoCardClick} />
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
      <div className="page-view">
        <Header
          headerTitleOverview="NOT YET FINAL"
        />
        <div className="page-content">
          {(visibleCards.length > 0
            ? <div>
                <TicketsCardList>{visibleCards}</TicketsCardList>
                <Paginator {...{totalPages, currentPage, onPageChanged: this.onPageChanged}} />
              </div>
            : <T id="myTickets.noTicketsWithStatus" m="No tickets found" />
          )}
        </div>
      </div>
    );
  }
}

export default ticketList(TicketListPage);
