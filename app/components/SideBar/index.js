import React, { Component } from "react";
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
    return (
      <Bar
        {...{
          gettingStarted: this.props.gettingStarted,
          errorPage: this.props.errorPage,
          isTestNet: this.props.isTestNet,
          balances: this.props.balances,
          synced: this.props.synced,
          currentHeight: this.props.currentBlockHeight,
          lastBlockTimestamp: this.props.lastBlockTimestamp,
          totalBalance: this.props.totalBalance / 100000000,
          isShowingAccounts: this.state.isShowingAccounts,
          onShowAccounts: this.onShowAccounts,
          onHideAccounts: this.onHideAccounts,
          rescanRequest: this.props.rescanRequest
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

export default sideBarConnector(rescan(SideBar));
