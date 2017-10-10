// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import send from "../../../../connectors/send";

const propTypes = {
};

@autobind
class SendTab extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>send tab</div>
    )
  }
}

SendTab.propTypes = propTypes;

export default send(SendTab);
