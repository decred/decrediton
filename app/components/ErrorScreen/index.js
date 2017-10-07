import React, { Component } from "react";
import PropTypes from "prop-types";
import ErrorScreenPage from "./Page";
import errorScreenConnector from "../../connectors/errorScreenConnector";

class ErrorScreen extends Component {
  componentWillMount() {
    this.props.hideSidebar();
    this.props.hideSidebarMenu();
  }

  render() {
    return (<ErrorScreenPage />);
  }
}

ErrorScreen.propTypes = {
  hideSidebar: PropTypes.func.isRequired,
  hideSidebarMenu: PropTypes.func.isRequired,
};

export default errorScreenConnector(ErrorScreen);
