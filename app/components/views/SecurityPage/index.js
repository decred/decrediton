import React, { Component } from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import SecurityPage from "./Page";
import securityPageConnector from "../../../connectors/securityPage";

@autobind
class Security extends Component {
  constructor(props) {
    super(props);
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
    if (side === "right") {
      return this.context.router.push("/security/verify");
    }
    this.context.router.push("/security/sign");
  }
}

Security.contextTypes = {
  router: PropTypes.object.isRequired,
};


export default securityPageConnector(Security);
