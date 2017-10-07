import React, { Component } from "react";
import PropTypes from "prop-types";
import walletErrorConnector from "../../../connectors/walletError";
import WalletErrorPage from "./Page";

class WalletError extends Component {
  componentWillMount() {
    this.props.hideSidebarMenu();
    this.props.hideSidebar();
  }

  render() {
    return <WalletErrorPage />;
  }
}

WalletError.propTypes = {
  hideSidebar: PropTypes.func.isRequired,
  hideSidebarMenu: PropTypes.func.isRequired,
};

export default walletErrorConnector(WalletError);
