import React, { Component } from "react";
import { autobind } from "core-decorators";
import SecurityPage from "./Page";

@autobind
class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingVerifyMessage: false,
    };
  }

  render() {
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

export default Security;
