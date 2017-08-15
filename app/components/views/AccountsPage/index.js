// @flow
import React, { Component, } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  clearNewAccountSuccess,
  clearNewAccountError,
  clearRenameAccountSuccess,
  clearRenameAccountError
} from "../../../actions/ControlActions";
import Page from "./Page";

@autobind
class AccountsPage extends Component {
  constructor(props)  {
    super(props);
    this.state = {
      isShowingAddAccount: false
    };
  }

  componentWillMount() {
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }

  render() {
    const { walletService } = this.props;
    const { isShowingAddAccount } = this.state;
    const { onShowAddAccount, onHideAddAccount} = this;
    return (
      <Page
        {...{
          walletService,
          isShowingAddAccount,
          onShowAddAccount,
          onHideAddAccount
        }}
      />
    );
  }

  onShowAddAccount() {
    this.setState({ isShowingAddAccount: true });
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }

  onHideAddAccount() {
    this.setState({ isShowingAddAccount: false });
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
}

const mapStateToProps = ({ grpc: { walletService }}) => ({ walletService });
const mapDispatchToProps = dispatch => bindActionCreators({
  clearNewAccountSuccess,
  clearNewAccountError,
  clearRenameAccountSuccess,
  clearRenameAccountError,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage);
