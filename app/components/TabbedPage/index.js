// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import Header from "./Header";

const propTypes = {
};

@autobind
class TabbedPage extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="page-view">
        <Header {...this.props} />
        <div className="page-content">
          {children}
        </div>
      </div>
    )
  }
}

TabbedPage.propTypes = propTypes;

export default TabbedPage;
