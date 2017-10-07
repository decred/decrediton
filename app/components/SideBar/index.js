import React, { Component } from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import Bar from "./Bar";
import rescan from "../../connectors/rescan";
import sideBarConnector from "../../connectors/sideBar";

@autobind
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = { isShowingAccounts: false };
  }

  render() {
    if (!this.props.showingSidebar) {
      return null;
    }

    return (
      <Bar
        {...{
          isTestNet: this.props.isTestNet,
          balances: this.props.balances,
          synced: this.props.synced,
          currentHeight: this.props.currentBlockHeight,
          lastBlockTimestamp: this.props.lastBlockTimestamp,
          totalBalance: this.props.totalBalance / 100000000,
          isShowingAccounts: this.state.isShowingAccounts,
          onShowAccounts: this.onShowAccounts,
          onHideAccounts: this.onHideAccounts,
          rescanRequest: this.props.rescanRequest,
          showingSidebarMenu: this.props.showingSidebarMenu,
        }}
      />
    );
  }

  onShowAccounts() {
    this.setState({ isShowingAccounts: true });
  }

  onHideAccounts() {
    this.setState({ isShowingAccounts: false });
  }
}

SideBar.propTypes = {
  showingSidebar: PropTypes.bool.isRequired,
  showingSidebarMenu: PropTypes.bool.isRequired,
};

export default sideBarConnector(rescan(SideBar));
