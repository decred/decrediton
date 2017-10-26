import React, { Component } from "react";
import PropTypes from "prop-types";
import Page from "./Page";
import { CheckWalletStateHeader, CheckWalletStateBody } from "./CheckWalletState";
import { OpenWalletHeader, OpenWalletBody } from "./OpenWallet";
import { StartRPCHeader, StartRPCBody } from "./StartRPC";
import { DiscoverAddressesHeader, DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersHeader, FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { FinalStartUpHeader, FinalStartUpBody } from "./FinalStartUp";
import { DaemonLoadingHeader, DaemonLoadingBody } from "./DaemonLoading";
import { walletStartup } from "connectors";
import { LoginRPCHeader, LoginFormBody } from "./RPCLoginForm";
import { injectIntl } from "react-intl";
import { autobind } from "core-decorators";
import { substruct } from "fp";

@autobind
class GetStartedPage extends Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isSubmitedRemoteForm: false,
      isSubmitedDiffAppdataForm: false,
      isSubmited: false,
      hasErrors: false,
      formToSend: 1,
      remoteFormHasErrors: false,
      diffAppdataFormHasErrors: false,
      rpcuserFilled: false,
      rpcpasswordFilled: false,
      rpccertFilled: false,
      rpcappdataFilled: false,
    };
  }

  componentWillMount() {
    this.props.showSidebar();
    this.props.hideSidebarMenu();
    this.props.determineNeededBlocks();
  }

  componentDidMount() {
    this.props.doStartDaemon();
  }

  componentWillUnmount() {
    if (!this.props.versionInvalid) {
      this.props.showSidebarMenu();
    }
  }

  render() {
    const {
      startStepIndex,
      isPrepared,
      isAdvancedDaemon,
    } = this.props;
    const { isSubmited, hasErrors, formToSend } = this.state;
    let Header, Body;
    if (isPrepared) {
      switch (startStepIndex || 0) {
      case 0:
      case 1:
        Header = CheckWalletStateHeader;
        Body = CheckWalletStateBody;
        break;
      case 2:
        Header = OpenWalletHeader;
        Body = OpenWalletBody;
        break;
      case 3:
      case 4:
        Header = StartRPCHeader;
        Body = StartRPCBody;
        break;
      case 5:
        Header = DiscoverAddressesHeader;
        Body = DiscoverAddressesBody;
        break;
      case 6:
        Header = FetchBlockHeadersHeader;
        Body = FetchBlockHeadersBody;
        break;
      default:
        Header = FinalStartUpHeader;
        Body = FinalStartUpBody;
      }
    } else {
      if (isAdvancedDaemon) {

        if(isSubmited && !hasErrors){
          Header = DaemonLoadingHeader;
          Body = DaemonLoadingBody;
        } else {
          Header = LoginRPCHeader;
          Body = LoginFormBody;
        }

      } else {
        Header = DaemonLoadingHeader;
        Body = DaemonLoadingBody;
      }
    }

    return (
      <div>
        <Page Header={Header} Body={Body}
          {...{
            ...this.props,
            ...this.state,
            ...substruct({
              changeForm: null,
              onSubmitRemoteForm: null,
              onSubmitDiffAppdataForm: null,
              onChangeRpcuser: null,
              onChangeRpcpass: null,
              onChangeRpccert: null,
              onChangeRpcappdata: null,
            }, this)
          }}
        />
      </div>
    );
  }

  changeForm(formType) {
    this.setState({ formToSend: formType })
  }

  getRemoteFormIsValid() {
    const { rpcuserFilled, rpcpasswordFilled, rpccertFilled } = this.state;

    if (!rpcuserFilled || !rpcpasswordFilled || !rpccertFilled ) {
      this.setState({
         remoteFormHasErrors: true,
         hasErrors: true,
      });
      return false;
    }
    this.setState({
       remoteFormHasErrors: false,
       hasErrors: false,
    });
    return true;
  }

  getDiffAppdataFormIsValid() {
    const { rpcappdataFilled } = this.state;
    
    if (!rpcappdataFilled) {
      this.setState({ 
        diffAppdataFormHasErrors: true,
        hasErrors: true,
      });
      return false;
    }
    
    this.setState({ 
      diffAppdataFormHasErrors: false,
      hasErrors: false 
    });
    return true;
  }

  onChangeRpcuser(rpcuser) {
    if (!rpcuser)
      return this.setState({ rpcuserFilled: false });
    this.setState({ rpcuserFilled: true });
  }

  onChangeRpcpass(rpcpass) {
    if (!rpcpass)
      return this.setState({ rpcpasswordFilled: false });
    this.setState({ rpcpasswordFilled: true });
  }

  onChangeRpccert(rpccert) {
    if (!rpccert)
      return this.setState({ rpccertFilled: false });
    this.setState({ rpccertFilled: true });
  }

  onChangeRpcappdata(rpcappdata) {
    if (!rpcappdata)
      return this.setState({ rpcappdataFilled: false });
    this.setState({ rpcappdataFilled: true });
  }

  onSubmitRemoteForm(args) {
    this.setState({
       isSubmitedRemoteForm: true,
       isSubmited: true,
    });
    if (this.getRemoteFormIsValid())
      this.props.doStartAdvancedDaemon(args, 1);
  }

  onSubmitDiffAppdataForm(args) {
    this.setState({
       isSubmitedDiffAppdataForm: true,
       isSubmited: true,
    });
    if (this.getDiffAppdataFormIsValid())
      this.props.doStartAdvancedDaemon(args, 2);
  }

}

GetStartedPage.propTypes = {
  showSidebar: PropTypes.func.isRequired,
  showSidebarMenu: PropTypes.func.isRequired,
  hideSidebarMenu: PropTypes.func.isRequired,
};

export default injectIntl(walletStartup(GetStartedPage));
