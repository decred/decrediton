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
import { LoginRPCHeader, LoginRPCBody } from "./LoginForm";
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
      isSubmited: false,
      hasErrors: false,
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

    const { isSubmited, hasErrors } = this.state;
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
          Body = LoginRPCBody;
        }
        
      } else {
        Header = DaemonLoadingHeader;
        Body = DaemonLoadingBody;
      }
    }

    return <Page Header={Header} Body={Body}
      {...{
        ...this.props,
        ...this.state,
        ...substruct({
          onSubmit: null,
          onChangeRpcuser: null,
          onChangeRpcpass: null,
          onChangeRpccert: null,
          onChangeRpcappdata: null,
        }, this)
      }}
    />;
  }

  getIsValid() {
    const { rpcuserFilled, rpcpasswordFilled, rpccertFilled, rpcappdataFilled } = this.state;

    if (!rpcuserFilled || !rpcpasswordFilled || !rpccertFilled || !rpcappdataFilled) {
      this.setState({ hasErrors: true });
      return false;
    }
    this.setState({ hasErrors: false });
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

  onSubmit(args) {
    this.setState({ isSubmited: true });
    if (this.getIsValid())
      this.props.doStartAdvancedDaemon(args);
  }
}

GetStartedPage.propTypes = {
  showSidebar: PropTypes.func.isRequired,
  showSidebarMenu: PropTypes.func.isRequired,
  hideSidebarMenu: PropTypes.func.isRequired,
};

export default injectIntl(walletStartup(GetStartedPage));
