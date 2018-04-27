import OpenWallet from "./OpenWallet";
import CreateWallet from "./CreateWallet";
import DaemonLoading from "./DaemonLoading";
import Logs from "./Logs";
import Settings from "./Settings";
import ReleaseNotes from "./ReleaseNotes";
import { WalletSelectionBody } from "./WalletSelection";
import StartRPCBody from "./StartRPC";
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
    this.state = { showSettings: false, showLogs: false, showReleaseNotes: false };
  }

  componentDidMount() {
    const { getWalletReady, getDaemonStarted, getNeededBlocks, onGetAvailableWallets, onStartWallet, prepStartDaemon, determineNeededBlocks } = this.props;
    if (!getWalletReady) {
      onGetAvailableWallets()
        .then(({ previousWallet }) => {
          previousWallet && onStartWallet(previousWallet);
        });
    }
    if (!getNeededBlocks) {
      determineNeededBlocks();
    }
    if (!getDaemonStarted) {
      setTimeout(()=>prepStartDaemon(), 1000);
    }
  }

  onShowReleaseNotes() {
    this.setState({ showSettings: false, showLogs: false, showReleaseNotes: true });
  }

  onHideReleaseNotes() {
    this.setState({ showReleaseNotes: false });
  }

  onShowSettings() {
    this.setState({ showSettings: true, showLogs: false, showReleaseNotes: false   });
  }

  onHideSettings() {
    this.setState({ showSettings: false });
  }

  onShowLogs() {
    this.setState({ showLogs: true, showSettings: false, showReleaseNotes: false  });
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
      hasExistingWallet,
      ...props
    } = this.props;

    const {
      showSettings,
      showLogs,
      showReleaseNotes,
      ...state
    } = this.state;

    const {
      onShowReleaseNotes,
      onHideReleaseNotes,
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
    } else if (showReleaseNotes) {
      return <ReleaseNotes {...{ onShowSettings, onShowLogs, onHideReleaseNotes, ...props }} />;
    } else if (isAdvancedDaemon && openForm && !remoteAppdataError && !isPrepared && getWalletReady) {
      Form = AdvancedStartupBody;
    } else if (remoteAppdataError && !isPrepared && getWalletReady) {
      Form = RemoteAppdataError;
    } else if (!getWalletReady) {
      Form = WalletSelectionBody;
    } else {
      switch (startStepIndex || 0) {
      case 1:
        text = startupError ? startupError :
          <T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />;
        break;
      case 2:
        if (hasExistingWallet) {
          Form = OpenWallet;
        } else {
          return <CreateWallet {...props} />;
        }
        break;
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

    return <DaemonLoading Form={Form}
      {...{
        ...props,
        ...state,
        text,
        getWalletReady,
        startupError,
        showSettings,
        showLogs,
        onShowReleaseNotes,
        onHideReleaseNotes,
        onShowSettings,
        onHideSettings,
        onShowLogs,
        onHideLogs
      }} />;
  }
}

export default walletStartup(GetStartedPage);
