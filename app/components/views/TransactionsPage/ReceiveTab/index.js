// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";

const propTypes = {
};

@autobind
class ReceiveTab extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>receive tab</div>
    )
  }
}

ReceiveTab.propTypes = propTypes;

export default ReceiveTab;
