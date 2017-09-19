import React, { Component, } from "react";
import { autobind } from "core-decorators";
import AccountsList from "./List";
import accountsConnector from "../../../../connectors/accountsPageAccounts";

@autobind
class Accounts extends Component {
  constructor(props)  {
    super(props);
    this.state = {
      accountNumDetailsShown: null
    };
  }

  render() {
    return (
      <AccountsList
        {...{
          accounts: this.props.accounts,
          isLoading: this.props.isLoading,
          getNextAccountError: this.props.getNextAccountError,
          getNextAccountSuccess: this.props.getNextAccountSuccess,
          renameAccountError: this.props.renameAccountError,
          renameAccountSuccess: this.props.renameAccountSuccess,
          onClearNewAccountError: this.props.onClearNewAccountError,
          onClearNewAccountSuccess: this.props.onClearNewAccountSuccess,
          onClearRenameAccountSuccess: this.props.onClearRenameAccountSuccess,
          onClearRenameAccountError: this.props.onClearRenameAccountError,
          onHideAccount: this.props.onHideAccount,
          onShowAccount: this.props.onShowAccount,
          onRenameAccount: this.props.onRenameAccount,
          accountNumDetailsShown: this.state.accountNumDetailsShown,
          onShowAccountDetails: this.onShowAccountDetails,
          onHideAccountDetails: this.onHideAccountDetails,
          onShowAddAccount: this.onShowAddAccount
        }}
      />
    );
  }

  onShowAccountDetails(accountNumDetailsShown) {
    this.setState({ accountNumDetailsShown });
  }

  onHideAccountDetails() {
    this.setState({ accountNumDetailsShown: null });
  }

  onShowAddAccount() {
    this.props.onShowAddAccount ? this.props.onShowAddAccount() : null;
  }
}

export default accountsConnector(Accounts);
