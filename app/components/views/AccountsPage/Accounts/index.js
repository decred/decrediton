import React, { Component, } from "react";
import { autobind } from "core-decorators";
import AccountsList from "./List";
import accountsConnector from "../../../../connectors/accountsPageAccounts";

@autobind
class Accounts extends Component {
  constructor(props)  {
    super(props);
    this.state = {
      accountNumDetailsShown: null,
      isShowingBalanceOverviewInfoModal: false,
    };
  }

  render() {
    return (
      <AccountsList
        {...{
          accounts: this.props.accounts,
          isLoading: this.props.isLoading,
          isShowingBalanceOverviewInfoModal: this.state.isShowingBalanceOverviewInfoModal,
          onHideAccount: this.props.onHideAccount,
          onShowAccount: this.props.onShowAccount,
          onRenameAccount: this.props.onRenameAccount,
          accountNumDetailsShown: this.state.accountNumDetailsShown,
          onShowAccountDetails: this.onShowAccountDetails,
          onHideAccountDetails: this.onHideAccountDetails,
          onShowAddAccount: this.onShowAddAccount,
          onShowBalanceOverviewInfoModal: this.onShowBalanceOverviewInfoModal,
          onCloseBalanceOverviewInfoModal: this.onCloseBalanceOverviewInfoModal,
        }}
      />
    );
  }

  onShowAccountDetails(accountNumDetailsShown) {
    this.setState({ accountNumDetailsShown });
  }

  onShowBalanceOverviewInfoModal() {
    this.setState({ isShowingBalanceOverviewInfoModal: true });
  }

  onCloseBalanceOverviewInfoModal() {
    this.setState({ isShowingBalanceOverviewInfoModal: false });
  }

  onHideAccountDetails() {
    this.setState({ accountNumDetailsShown: null });
  }

  onShowAddAccount() {
    this.props.onShowAddAccount ? this.props.onShowAddAccount() : null;
  }
}

export default accountsConnector(Accounts);
