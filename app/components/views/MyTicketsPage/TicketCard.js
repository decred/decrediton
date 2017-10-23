import React, {Component} from "react";
import Header from "Header";

class TicketCard extends Component{
  render() {
    const { status, children, onClick } = this.props;
    const className = "ticket-card ticket-" + status +
      (this.props.className ? " " + this.props.className : "");

    return (
      <div {...{className, onClick}}>
        {children}
      </div>
    );
  }
}

export default TicketCard;
