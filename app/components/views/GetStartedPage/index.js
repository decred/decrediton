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

class GetStartedPage extends Component {

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
      ...props
    } = this.props;
    let Header, Body;
    if (isPrepared) {
      switch(startStepIndex || 0) {
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
      Header = DaemonLoadingHeader;
      Body = DaemonLoadingBody;
    }

    return <Page Header={Header} Body={Body} {...props} />;
  }
}

GetStartedPage.propTypes = {
  showSidebar: PropTypes.func.isRequired,
  showSidebarMenu: PropTypes.func.isRequired,
  hideSidebarMenu: PropTypes.func.isRequired,
};

export default walletStartup(GetStartedPage);
