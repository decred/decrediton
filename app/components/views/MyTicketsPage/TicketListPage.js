import React, {Component} from "react";
import { autobind } from "core-decorators";
import Header from "Header";
import ticketList from "connectors/ticketList";
import TicketsCardList from "./TicketsCardList";
import TicketInfoCard from "./TicketInfoCard";
import { push as pushHistory } from "react-router-redux";
import { FormattedMessage as T } from "react-intl";
import "../../../style/MyTickets.less"

@autobind
class TicketListPage extends Component{/*  */

  constructor(props) {
    super(props);
    this.state = {
      shownTo: Math.min(6, props.tickets.length),
      expandedTicket: null
    }
  }

  onInfoCardClick(ticket) {
    if (ticket === this.state.expandedTicket) {
      this.setState({expandedTicket: null});
    } else {
      this.setState({expandedTicket: ticket});
    }
  }

  render() {
    const visible = Array();
    for (let i = 0; i < this.state.shownTo; i++) {
      const ticket = this.props.tickets[i];
      const key = ticket.status + "/" + i;
      const expanded = ticket === this.state.expandedTicket;
      visible.push((
        <TicketInfoCard {...{key, ticket, expanded}} onClick={this.onInfoCardClick} />
      ));
    }

    if (visible.length > 0) {
      console.log(visible[0].props.ticket);
    }

    return (
      <div className="page-view">
        <Header
          headerTitleOverview="NOT YET FINAL"
        />
        <div className="page-content">
          {(visible.length > 0
            ? <TicketsCardList>{visible}</TicketsCardList>
            : <T id="myTickets.noTicketsWithStatus" m="No tickets found" />
          )}

        </div>
      </div>
    );
  }
}

export default ticketList(TicketListPage);
