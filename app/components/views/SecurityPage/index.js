import React, { Component } from "react";
import { autobind } from "core-decorators";
import SecurityPage from "./Page";
import ErrorScreen from "../../ErrorScreen";
import securityPageConnector from "../../../connectors/securityPage";

@autobind
class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingVerifyMessage: false,
    };
  }

  render() {
    if (!this.props.walletService) {
      return <ErrorScreen />;
    }

    return (
      <SecurityPage {
        ...{
          ...this.props,
          ...this.state,
          onToggleSecurityMessage: this.onToggleSecurityMessage,
        }}
      />
    );
  }

  onToggleSecurityMessage(side) {
    this.setState({
      isShowingVerifyMessage: side === "right",
    });
  }
}

export default securityPageConnector(Security);
