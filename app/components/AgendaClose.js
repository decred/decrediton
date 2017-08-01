// @flow
import React from "react";
import Radium from "radium";
import { StakePoolStyles } from "./views/ViewStyles";

class AgendaClose extends React.Component {
  render() {
    return (
      <a style={StakePoolStyles.agendaOverviewTitleClose} onClick={this.props.onClick}></a>
    );

  }
}

export default Radium(AgendaClose);