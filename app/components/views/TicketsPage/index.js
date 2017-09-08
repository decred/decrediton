import React, { Component } from "react";
import { autobind } from "core-decorators";
import { substruct, compose, eq, get } from "../../../fp";
import service from "../../../connectors/service";
import ticketsPage from "../../../connectors/ticketsPage";
import ErrorScreen from "../../ErrorScreen";
import TicketsPage from "./Page";

@autobind
class Tickets extends Component {
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

  render() {
    return (!this.props.walletService || !this.props.ticketBuyerService) ? <ErrorScreen /> : (
      <TicketsPage
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
            onToggleTicketStakePool: null,
            onShowStakePoolConfig: null,
            onHideStakePoolConfig: null
          }, this)
        }}
      />
    );
  }

  onToggleTicketStakePool(side) {
    this.setState({
      isShowingVotingPrefs: (side === "right") ? true : false,
      purchaseTicketsStakePoolConfig: false
    });
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool ? this.props.stakePool : this.state.stakePool;
    return this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")));
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
    this.onRequestPassphrase("Enter Passphrase to Revoke Tickets", null, this.onRevokeTickets);
  }

  onCancelImportScript() {
    this.setState({ isShowingImportScript: false });
  }
}

export default service(ticketsPage(Tickets));
