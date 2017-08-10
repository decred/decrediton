// @flow
import React from "react";
import "../style/MiscComponents.less";

class PurchaseTicketsInfoButton extends React.Component {
  render() {
    return <a className="purchase-tickets-info-button" onClick={this.props.onClick} />;
  }
}

export default PurchaseTicketsInfoButton;
