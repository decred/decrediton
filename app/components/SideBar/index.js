// @flow
import React, { Component } from "react";
import { updateBlockTimeSince } from "../../actions/ClientActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import Bar from "./Bar";

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

  render() {
    const { gettingStarted, errorPage } = this.props;
    const { isShowingAccounts } = this.state;
    const { onShowAccounts, onHideAccounts } = this;
    const isTestNet = this.isTestNet();
    const balances = this.props.balances || [];
    const synced = this.props.synced && this.props.getAccountsResponse;
    const totalBalance = this.getTotalBalance();
    const currentHeight = synced
      ? this.props.getAccountsResponse.getCurrentBlockHeight()
      : this.props.currentHeight;
    const timeBackString = synced ? this.props.timeSinceString : this.props.timeBackString;

    return (
      <Bar
        {...{
          gettingStarted,
          errorPage,
          isTestNet,
          balances,
          synced,
          currentHeight,
          timeBackString,
          totalBalance,
          isShowingAccounts,
          onShowAccounts,
          onHideAccounts
        }}
      />
    );
  }

  isTestNet() {
    return this.props.network === "testnet";
  }

  getTotalBalance() {
    const atoms = (this.props.balances || []).reduce((atoms, { total }) => atoms + total, 0);
    return atoms / 100000000;
  }

  onShowAccounts() {
    this.setState({ isShowingAccounts: true });
  }

  onHideAccounts() {
    this.setState({ isShowingAccounts: false });
  }
}

const mapStateToProps = ({
  grpc: {
    walletService,
    getBalanceRequestAttempt,
    balances,
    getStakeInfoRequestAttempt,
    getStakeInfoResponse,
    network,
    getAccountsResponse,
    timeSinceString
  },
  notifications: {
    transactionNtfnsResponse,
    currentHeight,
    timeBackString,
    synced
  }
}) => ({
  walletService,
  getBalanceRequestAttempt,
  balances,
  getStakeInfoRequestAttempt,
  getStakeInfoResponse,
  network,
  getAccountsResponse,
  timeSinceString,
  transactionNtfnsResponse,
  currentHeight,
  timeBackString,
  synced
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateBlockTimeSince }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
