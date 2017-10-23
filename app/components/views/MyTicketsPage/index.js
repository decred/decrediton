import React, {Component} from "react";
import Header from "Header";
import myTickets from "connectors/myTickets";
import TicketsOverview from "./TicketsOverview";
import { push as pushHistory } from "react-router-redux";
import "../../../style/MyTickets.less"

class MyTickets extends Component{/*  */

  render() {
    const { ticketsPerStatus, showTicketList } = this.props;
    return (
      <div className="page-view">
        <Header
          headerTitleOverview="NOT YET FINAL"
        />
        <div className="page-content">
          <TicketsOverview {...{ticketsPerStatus, onClickTicketOverview: showTicketList}} />
        </div>
      </div>
    );
  }
}

export default myTickets(MyTickets);
