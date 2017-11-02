import Page from "./Page";
import { CheckWalletStateHeader, CheckWalletStateBody } from "./CheckWalletState";
import { OpenWalletHeader, OpenWalletBody } from "./OpenWallet";
import { StartRPCHeader, StartRPCBody } from "./StartRPC";
import { DiscoverAddressesHeader, DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersHeader, FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { FinalStartUpHeader, FinalStartUpBody } from "./FinalStartUp";
import { DaemonLoadingHeader, DaemonLoadingBody } from "./DaemonLoading";
import { AdvancedStartupHeader, AdvancedStartupBody } from "./AdvancedStartup";
import { walletStartup } from "connectors";

@autobind
class GetStartedPage extends React.Component {

  componentWillMount() {
    this.props.showSidebar();
    this.props.hideSidebarMenu();
    this.props.determineNeededBlocks();
  }

  componentDidMount() {
    if (!this.props.isAdvancedDaemon) {
      this.props.onStartDaemon();
    }
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
      ...props
    } = this.props;
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
        Header = AdvancedStartupHeader;
        Body = AdvancedStartupBody;
      } else {
        Header = DaemonLoadingHeader;
        Body = DaemonLoadingBody;
      }
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
