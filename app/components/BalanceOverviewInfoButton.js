// @flow
import React from "react";
import Radium from "radium";
import { StakePoolStyles } from "./views/ViewStyles";

class BalanceOverviewInfoButton extends React.Component {
  render() {
    return (
      <a style={StakePoolStyles.balanceOverviewInfoButton} onClick={this.props.onClick}></a>
    );

  }
}

export default Radium(BalanceOverviewInfoButton);