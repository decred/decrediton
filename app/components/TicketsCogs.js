// @flow
import React from "react";
import "../style/MiscComponents.less";

class TicketsCogs extends React.Component {
  render() {
    return <a className={this.props.opened ? "ticket-cogs-opened" : "ticket-cogs-closed"} onClick={this.props.onClick} />;
  }
}

export default TicketsCogs;
