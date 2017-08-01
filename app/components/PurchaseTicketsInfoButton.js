// @flow
import React from "react";
import Radium from "radium";
import { StakePoolStyles } from "./views/ViewStyles";

class PurchaseTicketsInfoButton extends React.Component {
  render() {
    return (
      <a style={StakePoolStyles.purchaseTicketInfoButton} onClick={this.props.onClick}></a>
    );

  }
}

export default Radium(PurchaseTicketsInfoButton);