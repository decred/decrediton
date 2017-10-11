// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TabContent from "../../../TabbedPage/TabContent";

const propTypes = {
};

@autobind
class ReceiveTab extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TabContent>receive tab</TabContent>
    )
  }
}

ReceiveTab.propTypes = propTypes;

export default ReceiveTab;
