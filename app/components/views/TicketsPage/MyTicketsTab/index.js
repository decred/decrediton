import React, {Component} from "react";
import myTickets from "connectors/myTickets";
import TicketsOverview from "./TicketsOverview";
import "style/MyTickets.less";

class MyTickets extends Component{/*  */

  render() {
    const { ticketsPerStatus, showTicketList } = this.props;
    return (
      <div className="tab-card">
        <div className="page-content">
          <TicketsOverview {...{ticketsPerStatus, onClickTicketOverview: showTicketList}} />
        </div>
      </div>
    );
  }
}

export default myTickets(MyTickets);
