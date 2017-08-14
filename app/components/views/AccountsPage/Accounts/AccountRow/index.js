// @flow
import React, { Component } from "react";
import { autobind } from "core-decorators";
import Row from "./Row";
import ReactTooltip from "react-tooltip";

@autobind
class AccountRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingRenameAccount: false,
      renameAccountName: null,
      renameAccountNameError: null,
      renameAccountNumber: this.props.account.accountNumber,
      hidden: this.props.account.hidden,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.hidden != this.state.hidden) {
      // The tooltips need to be rebuilt because either the Show or Hide button
      // is now being rendered.
      ReactTooltip.rebuild();
    }
  }

  updateRenameAccountName(accountName) {
    if (accountName !== "") {
      this.setState({renameAccountName: accountName, renameAccountNameError: null});
    }
  }

  renameAccount() {
    var checkErrors = false;
    if (this.state.renameAccountName == "") {
      this.setState({renameAccountNameError: "*You must enter an account name"});
      checkErrors = true;
    }
    if (checkErrors) {
      return;
    }
    this.props.renameAccount(this.state.renameAccountNumber, this.state.renameAccountName);
    this.setState({renameAccountName: null, isShowingRenameAccount: false});
  }

  showRenameAccount() {
    this.setState({isShowingRenameAccount: true});
  }

  hideRenameAccount() {
    this.setState({isShowingRenameAccount: false});
  }

  showAccount() {
    this.props.showAccount(this.props.account.accountNumber);
    this.setState({hidden: false});
  }

  hideAccount() {
    this.props.hideAccount(this.props.account.accountNumber);
    this.setState({hidden: true});
  }

  render() {
    const {
      updateRenameAccountName,
      renameAccount,
      showRenameAccount,
      hideRenameAccount,
      showAccount,
      hideAccount
    } = this;
    const {
      account,
      accountNumDetailsShown,
      hideAccountDetails,
      showAccountDetails
    } = this.props;
    const {
      isShowingRenameAccount,
      renameAccountName,
      renameAccountNameError,
      renameAccountNumber,
      hidden
    } = this.state;
    const isShowingAccountDetails = accountNumDetailsShown !== null && accountNumDetailsShown == account.accountNumber ;

    return (
      <Row
        {...{
          account,
          hideAccountDetails,
          showAccountDetails,
          isShowingAccountDetails,
          isShowingRenameAccount,
          renameAccountName,
          renameAccountNameError,
          renameAccountNumber,
          hidden,
          updateRenameAccountName,
          renameAccount,
          showRenameAccount,
          hideRenameAccount,
          showAccount,
          hideAccount
        }}
      />
    );
  }
}

export default AccountRow;
