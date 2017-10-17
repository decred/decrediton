import React, { Component } from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import Bar from "./Bar";
import rescan from "../../connectors/rescan";
import sideBarConnector from "../../connectors/sideBar";
import { tsToDate } from "../../helpers/dateFormat";
import ReactTimeout from "react-timeout";

@autobind
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingAccounts: false,
      ...this.getBlockDate(props.lastBlockTimestamp)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lastBlockTimestamp } = this.props;
    if (lastBlockTimestamp !== nextProps.lastBlockTimestamp) {
      this.setState(this.getBlockDate(nextProps.lastBlockTimestamp));
    }
  }

  getBlockDate(lastBlockTimestamp) {
    let lastBlockDate;
    let lastBlockIsRecent = false;
    let updateRecentTimer = this.state ? this.state.updateRecentTimer : null;

    if (lastBlockTimestamp) {
      if (updateRecentTimer) {
        this.props.clearTimeout(updateRecentTimer);
        updateRecentTimer = null;
      }

      const now = new Date();
      lastBlockDate = tsToDate(lastBlockTimestamp);
      const timeFromLastBlock = now.getTime() - lastBlockDate.getTime();
      lastBlockIsRecent = timeFromLastBlock < 60000;
      if (lastBlockIsRecent) {
        updateRecentTimer = this.props.setTimeout(this.updateRecentBlockTime, 60000 - timeFromLastBlock);
      }
    }
    return {lastBlockDate, lastBlockIsRecent, updateRecentTimer};
  }

  updateRecentBlockTime() {
    this.setState(this.getBlockDate(this.props.lastBlockTimestamp));
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
          lastBlockDate: this.state.lastBlockDate,
          lastBlockIsRecent: this.state.lastBlockIsRecent,
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

export default sideBarConnector(rescan(ReactTimeout(SideBar)));
