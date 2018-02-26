import OpenWallet from "./OpenWallet";
import DaemonLoading from "./DaemonLoading";
import Logs from "./Logs";
import Settings from "./Settings";
import { WalletSelectionHeader, WalletSelectionBody } from "./WalletSelection";
import { CheckWalletStateBody } from "./CheckWalletState";
import { StartRPCBody } from "./StartRPC";
import { DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { AdvancedStartupBody, RemoteAppdataError } from "./AdvancedStartup";
import { RescanWalletBody } from "./RescanWallet/index";
import { walletStartup } from "connectors";

@autobind
class GetStartedPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showSettings: false, showLogs: false };
  }

  componentDidMount() {
    if (!this.props.getWalletReady && !this.props.previousWallet) {
      this.props.onGetAvailableWallets();
    } else if (this.props.previousWallet) {
      this.props.onStartWallet(this.props.previousWallet);
    }
  }

  onShowSettings() {
    this.setState({ showSettings: true, showLogs: false  });
  }

  onHideSettings() {
    this.setState({ showSettings: false });
  }

  onShowLogs() {
    this.setState({ showLogs: true, showSettings: false });
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

    let text, Form;
    if (showSettings) {
      return <Settings {...{ onShowLogs, onHideSettings, ...props }} />;
    } else if (showLogs) {
      return <Logs {...{ onShowSettings, onHideLogs, ...props }} />;
    } else if (getWalletReady && !isPrepared) {
      switch (startStepIndex || 0) {
      case 0:
      case 1:
        text = <T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />;
        Form = CheckWalletStateBody;
        break;
      case 2:
        return <OpenWallet {...props} />;
      default:
        if (isAdvancedDaemon && openForm && !remoteAppdataError) {
          text = <T id="getStarted.advanced.title" m="Advanced Start Up" />;
          Form = AdvancedStartupBody;
        } else if (remoteAppdataError) {
          text = <T id="getStarted.advanced.title" m="Advanced Start Up" />;
          Form = RemoteAppdataError;
        }
      }
    } else if (!getWalletReady) {
      text = WalletSelectionHeader;
      Form = WalletSelectionBody;
    } else if (isPrepared) {
      switch (startStepIndex || 0) {
      case 3:
      case 4:
        text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
        Form = StartRPCBody;
        break;
      case 5:
        text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
        Form = DiscoverAddressesBody;
        break;
      case 6:
        text = <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />;
        Form = FetchBlockHeadersBody;
        break;
      case 7:
        text = <T id="getStarted.header.rescanWallet.meta" m="Scanning blocks for transactions" />;
        Form = RescanWalletBody;
        break;
      default:
        Form = <T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />;
      }
    }

    return <DaemonLoading {...{
      ...props,
      ...state,
      text,
      Form,
      showSettings,
      showLogs,
      onShowSettings,
      onHideSettings,
      onShowLogs,
      onHideLogs }} />;
  }
}

export default walletStartup(GetStartedPage);
