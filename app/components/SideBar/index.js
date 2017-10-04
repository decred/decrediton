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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(() => this.props.updateBlockTimeSince(), 10000);
  }

  onBottomSidebarClick() {
    const a = document.getElementById("sidebar-menu-total-balance-extended");
    a.style.display = (a.style.display === "block") ? "none" : "block";
  }

  render() {
    const { onBottomSidebarClick } = this;
    return (
      <Bar
        {...{
          gettingStarted: this.props.gettingStarted,
          errorPage: this.props.errorPage,
          isTestNet: this.props.isTestNet,
          balances: this.props.balances,
          synced: this.props.synced,
          currentHeight: this.props.currentBlockHeight,
          timeBackString: this.props.timeBackString,
          totalBalance: this.props.totalBalance / 100000000,
          isShowingAccounts: this.state.isShowingAccounts,
          onShowAccounts: this.onShowAccounts,
          onHideAccounts: this.onHideAccounts,
          rescanRequest: this.props.rescanRequest,
          onBottomSidebarClick: onBottomSidebarClick
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
