import Page from "./Page";
import { CheckWalletStateHeader, CheckWalletStateBody } from "./CheckWalletState";
import { OpenWalletHeader, OpenWalletBody } from "./OpenWallet";
import { StartRPCHeader, StartRPCBody } from "./StartRPC";
import { DiscoverAddressesHeader, DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersHeader, FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { FinalStartUpHeader, FinalStartUpBody } from "./FinalStartUp";
import { DaemonLoadingHeader, DaemonLoadingBody } from "./DaemonLoading";
import { AdvancedStartupHeader, AdvancedStartupBody, RemoteAppdataError } from "./AdvancedStartup";
import { SettingsBody, SettingsHeader } from "./Settings";
import { LogsBody, LogsHeader } from "./Logs";
import { RescanWalletHeader, RescanWalletBody } from "./RescanWallet/index";
import { walletStartup } from "connectors";

@autobind
class GetStartedPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showSettings: false, showLogs: false };
    props.determineNeededBlocks();
  }

  componentDidMount() {
    if (!this.props.getWalletReady) {
      this.props.onStartWallet();
      return;
    }
  }

  onShowSettings() {
    this.setState({ showSettings: true });
  }

  onHideSettings() {
    this.setState({ showSettings: false });
  }

  onShowLogs() {
    this.setState({ showLogs: true });
  }

  onHideLogs() {
    this.setState({ showLogs: false });
  }

  render() {
    const {
      startStepIndex,
      isPrepared,
      isAdvancedDaemon,
      openForm,
      getWalletReady,
      remoteAppdataError,
      ...props
    } = this.props;

    const {
      showSettings,
      showLogs,
      ...state
    } = this.state;

    const {
      onShowSettings,
      onHideSettings,
      onShowLogs,
      onHideLogs
    } = this;

    let Header, Body;

    if (showSettings) {
      Header = SettingsHeader;
      Body = SettingsBody;
    } else if (showLogs) {
      Header = LogsHeader;
      Body = LogsBody;
    } else if (getWalletReady) {
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
      }
    } else if (isPrepared) {
      switch (startStepIndex || 0) {
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
      case 7:
        Header = RescanWalletHeader;
        Body = RescanWalletBody;
        break;
      default:
        Header = FinalStartUpHeader;
        Body = FinalStartUpBody;
      }
    } else {
      if (isAdvancedDaemon && openForm && !remoteAppdataError) {
        Header = AdvancedStartupHeader;
        Body = AdvancedStartupBody;
      } else if (remoteAppdataError) {
        Header = AdvancedStartupHeader;
        Body = RemoteAppdataError;
      } else {
        Header = DaemonLoadingHeader;
        Body = DaemonLoadingBody;
      }
    }

    return <Page Header={Header} Body={Body}
      {...{
        ...props,
        ...state,
        showSettings,
        showLogs,
        onShowSettings,
        onHideSettings,
        onShowLogs,
        onHideLogs}} />;
  }
}

export default walletStartup(GetStartedPage);
