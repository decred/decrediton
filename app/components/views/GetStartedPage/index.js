import OpenWallet from "./OpenWallet";
import DaemonLoading from "./DaemonLoading";
import Logs from "./Logs";
import Settings from "./Settings";
import { WalletSelectionBody } from "./WalletSelection";
import { StartRPCBody } from "./StartRPC";
import { DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { AdvancedStartupBody, RemoteAppdataError } from "./AdvancedStartup";
import { RescanWalletBody } from "./RescanWallet/index";
import { walletStartup } from "connectors";
import { FormattedMessage as T } from "react-intl";

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
      startupError,
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
        text = startupError ? startupError :
          <T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />;
        break;
      case 2:
        return <OpenWallet {...props} />;
      default:
        text = <T id="getStarted.advanced.title" m="Advanced Daemon Set Up" />;
        if (isAdvancedDaemon && openForm && !remoteAppdataError) {
          Form = AdvancedStartupBody;
        } else if (remoteAppdataError) {
          Form = RemoteAppdataError;
        }
      }
    } else if (!getWalletReady) {
      text = <T id="getStarted.walletSelect.title" m="Select the Wallet to Load" />;
      Form = WalletSelectionBody;
    } else if (isPrepared) {
      switch (startStepIndex || 0) {
      case 3:
      case 4:
        text = <T id="getStarted.header.startrpc.meta" m="Establishing RPC connection" />;
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
        text = <T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />;
      }
    }

    return <DaemonLoading Form={Form} {...{
      ...props,
      ...state,
      text,
      startupError,
      showSettings,
      showLogs,
      onShowSettings,
      onHideSettings,
      onShowLogs,
      onHideLogs }} />;
  }
}

export default walletStartup(GetStartedPage);
