// @flow
import React, { Component, } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  renameAccountAttempt,
  clearNewAccountSuccess,
  clearNewAccountError,
  clearRenameAccountSuccess,
  clearRenameAccountError
} from "../../../../actions/ControlActions";
import { hideAccount, showAccount } from "../../../../actions/ClientActions";
import AccountsList from "./List";

@autobind
class Accounts extends Component {
  constructor(props)  {
    super(props);
    this.state = {
      accountNumDetailsShown: null
    };
  }

  render() {
    const {
      getNextAccountError,
      getNextAccountSuccess,
      getNextAccountRequestAttempt,
      renameAccountError,
      renameAccountSuccess,
      renameAccountRequestAttempt,
      clearNewAccountError: onClearNewAccountError,
      clearNewAccountSuccess: onClearNewAccountSuccess,
      clearRenameAccountSuccess: onClearRenameAccountSuccess,
      clearRenameAccountError: onClearRenameAccountError,
      hideAccount: onHideAccount,
      showAccount: onShowAccount,
      renameAccountAttempt: onRenameAccount
    } = this.props;
    const { accountNumDetailsShown } = this.state;
    const isLoading = !!(getNextAccountRequestAttempt || renameAccountRequestAttempt);
    const {
      onShowAccountDetails,
      onHideAccountDetails,
      onShowAddAccount
    } = this;
    const accounts = this.props.balances.slice().sort((a, b) => a.accountNumber - b.accountNumber);

    return (
      <AccountsList
        {...{
          accounts,
          isLoading,
          getNextAccountError,
          getNextAccountSuccess,
          renameAccountError,
          renameAccountSuccess,
          onClearNewAccountError,
          onClearNewAccountSuccess,
          onClearRenameAccountSuccess,
          onClearRenameAccountError,
          onHideAccount,
          onShowAccount,
          onRenameAccount,
          accountNumDetailsShown,
          onShowAccountDetails,
          onHideAccountDetails,
          onShowAddAccount
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

const mapStateToProps = ({
  grpc: { balances, hiddenAccounts },
  control: {
    getNextAccountSuccess,
    getNextAccountError,
    getNextAccountRequestAttempt,
    renameAccountError,
    renameAccountSuccess,
    renameAccountRequestAttempt
  }
}) => ({
  balances,
  hiddenAccounts,
  getNextAccountSuccess,
  getNextAccountError,
  getNextAccountRequestAttempt,
  renameAccountError,
  renameAccountSuccess,
  renameAccountRequestAttempt
});

const mapDispatchToProps = dispatch => bindActionCreators({
  renameAccountAttempt,
  clearNewAccountSuccess,
  clearNewAccountError,
  clearRenameAccountSuccess,
  clearRenameAccountError,
  hideAccount,
  showAccount
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
