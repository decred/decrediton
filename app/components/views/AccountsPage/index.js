import React, { Component, } from "react";
import { autobind } from "core-decorators";
import Page from "./Page";
import accountsPageConnector from "../../../connectors/accountsPage";

@autobind
class AccountsPage extends Component {
  constructor(props)  {
    super(props);
    this.state = {
      isShowingAddAccount: false
    };
  }

  componentWillMount() {
    this.props.onClearNewAccountSuccess();
    this.props.onClearNewAccountError();
    this.props.onClearRenameAccountSuccess();
    this.props.onClearRenameAccountError();
  }

  render() {
    return (
      <Page
        {...{
          walletService: this.props.walletService,
          isShowingAddAccount: this.state.isShowingAddAccount,
          onShowAddAccount: this.onShowAddAccount,
          onHideAddAccount: this.onHideAddAccount
        }}
      />
    );
  }

  onShowAddAccount() {
    this.setState({ isShowingAddAccount: true });
    this.props.onClearNewAccountSuccess();
    this.props.onClearNewAccountError();
    this.props.onClearRenameAccountSuccess();
    this.props.onClearRenameAccountError();
  }

  onHideAddAccount() {
    this.setState({ isShowingAddAccount: false });
    this.props.onClearNewAccountSuccess();
    this.props.onClearNewAccountError();
    this.props.onClearRenameAccountSuccess();
    this.props.onClearRenameAccountError();
  }
}

export default accountsPageConnector(AccountsPage);
