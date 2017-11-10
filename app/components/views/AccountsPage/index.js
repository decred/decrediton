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
  }

  onHideAddAccount() {
    this.setState({ isShowingAddAccount: false });
  }
}

export default accountsPageConnector(AccountsPage);
