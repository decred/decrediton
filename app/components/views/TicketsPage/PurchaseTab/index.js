import React, { Component } from "react";
import { autobind } from "core-decorators";
import { substruct, compose, eq, get } from "fp";
import { service, ticketsPage } from "connectors";
import ErrorScreen from "components/ErrorScreen";
import PurchasePage from "./Page";
import { FormattedMessage as T } from "react-intl";
import ReactToolTip from "react-tooltip";

@autobind
class Purchase extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      account: this.props.defaultSpendingAccount,
      stakePool: this.props.defaultStakePool,
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null,
      isShowingTicketsInfo: false,
      isShowingStakePools: !this.props.defaultStakePool,
      isShowingVotingPrefs: false,
      isShowingImportScript: false,
      isRequestingPassphrase: false
    };
  }

  componentWillMount() {
    this.props.onClearStakePoolConfigError();
    this.props.onClearStakePoolConfigSuccess();
    this.props.onClearPurchaseTicketsSuccess();
    this.props.onClearPurchaseTicketsError();
    this.props.onClearRevokeTicketsSuccess();
    this.props.onClearRevokeTicketsError();
    this.props.onClearImportScriptSuccess();
    this.props.onClearImportScriptError();
    this.props.onClearStartAutoBuyerSuccess();
    this.props.onClearStartAutoBuyerError();
    this.props.onClearStopAutoBuyerSuccess();
    this.props.onClearStopAutoBuyerError();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.stakePool && nextProps.defaultStakePool) {
      // Added first stake pool
      this.setState({
        stakePool: nextProps.defaultStakePool,
        isShowingStakePools: false
      });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState != this.state) {
      ReactToolTip.rebuild();
    }
  }

  render() {
    return (!this.props.walletService || !this.props.ticketBuyerService) ? <ErrorScreen /> : (
      <PurchasePage
        {...{
          ...this.props,
          ...this.state,
          stakePool: this.getStakePool(),
          account: this.getAccount(),
          ...substruct({
            onShowTicketsInfo: null,
            onHideTicketsInfo: null,
            onChangeStakePool: null,
            onChangeAccount: null,
            onShowImportScript: null,
            onShowRevokeTicket: null,
            onRequestPassphrase: null,
            onCancelPassphraseRequest: null,
            onCancelImportScript: null,
            onShowStakePoolConfig: null,
            onHideStakePoolConfig: null,
            onImportScript: null
          }, this)
        }}
      />
    );
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool ? this.props.stakePool : this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  getAccount() {
    const account = this.props.onChangeAccount ? this.props.account : this.state.account;
    return this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
  }

  onChangeStakePool(stakePool) {
    const { onChangeStakePool } = this.props;
    this.setState({ stakePool });
    onChangeStakePool && onChangeStakePool(stakePool);
  }

  onChangeAccount(account) {
    const { onChangeAccount } = this.props;
    this.setState({ account });
    onChangeAccount && onChangeAccount(account);
  }

  onImportScript(privpass, script) {
    const { onImportScript } = this.props;
    onImportScript && onImportScript(privpass, script, true, 0, null);
    this.setState({ isShowingImportScript: false });
  }

  onRevokeTickets(privpass) {
    const { onRevokeTickets } = this.props;
    onRevokeTickets && onRevokeTickets(privpass);
    this.onCancelPassphraseRequest();
  }

  onCancelPassphraseRequest() {
    this.setState({
      isRequestingPassphrase: false,
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null
    });
  }

  onShowTicketsInfo() {
    this.setState({ isShowingTicketsInfo: true });
  }

  onHideTicketsInfo() {
    this.setState({ isShowingTicketsInfo: false });
  }

  onShowStakePoolConfig() {
    this.setState({ isShowingStakePools: true });
  }

  onHideStakePoolConfig() {
    this.setState({ isShowingStakePools: false });
  }

  onRequestPassphrase(passphraseHeading, passphraseDescription, passphraseCallback) {
    this.setState({
      passphraseHeading,
      passphraseDescription,
      passphraseCallback,
      isRequestingPassphrase: true
    });
  }

  onShowImportScript() {
    this.setState({ isShowingImportScript: true });
  }

  onShowRevokeTicket() {
    this.onRequestPassphrase(
      <T id="stake.revokeTicketsPassphrase" m="Enter Passphrase to Revoke Tickets" />,
      null, this.onRevokeTickets);
  }

  onCancelImportScript() {
    this.setState({ isShowingImportScript: false });
  }
}

export default service(ticketsPage(Purchase));
