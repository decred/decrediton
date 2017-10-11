// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TabContent from "../../../TabbedPage/TabContent";
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
      <TabContent>
        <div className="tab-content-card">
        send tab<br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br /><br />
        <br />
        <br />
        sdifjaosdf bla :)
        </div></TabContent>
    )
  }
}

SendTab.propTypes = propTypes;

export default send(SendTab);
