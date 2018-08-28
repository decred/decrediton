import OpenWallet from "./OpenWallet";
import CreateWallet from "./CreateWallet";
import DaemonLoading from "./DaemonLoading";
import Logs from "./Logs";
import Settings from "./Settings";
import ReleaseNotes from "./ReleaseNotes";
import WalletSelectionBody from "./WalletSelection";
import StartRPCBody from "./StartRPC";
import { SpvSyncBody } from "./SpvSync";
import { DiscoverAddressesBody } from "./DiscoverAddresses";
import { FetchBlockHeadersBody } from "./FetchBlockHeaders";
import { AdvancedStartupBody, RemoteAppdataError } from "./AdvancedStartup";
import { RescanWalletBody } from "./RescanWallet/index";
import StakePoolsBody from "./StakePools";
import { walletStartup } from "connectors";
import { FormattedMessage as T } from "react-intl";

@autobind
class GetStartedPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showSettings: false, showLogs: false, showReleaseNotes: false,
      walletPrivatePassphrase: "" };
  }

  componentDidMount() {
    const { getWalletReady, getDaemonStarted, getNeededBlocks, onGetAvailableWallets, onStartWallet, prepStartDaemon, determineNeededBlocks, isSPV } = this.props;
    if (!getWalletReady) {
      onGetAvailableWallets()
        .then(({ previousWallet }) => {
          previousWallet && onStartWallet(previousWallet);
        });
    }
    if (!getNeededBlocks && !isSPV) {
      determineNeededBlocks();
    }
    if (!getDaemonStarted && !isSPV) {
      setTimeout(()=>prepStartDaemon(), 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { startStepIndex, getDaemonSynced, onRetryStartRPC, isSPV, startSPVSync } = this.props;
    if (!isSPV) {
      if (startStepIndex != nextProps.startStepIndex || getDaemonSynced != nextProps.getDaemonSynced ){
        if (nextProps.startStepIndex == 3 && nextProps.getDaemonSynced)
          onRetryStartRPC();
      }
    } else {
      if (startStepIndex != nextProps.startStepIndex ){
        if (nextProps.startStepIndex == 3)
          startSPVSync(this.state.walletPrivatePassphrase);
      }
    }
  }

  componentWillUnmount() {
    this.setState({ walletPrivatePassphrase: "" });
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

  onSetWalletPrivatePassphrase(walletPrivatePassphrase) {
    this.setState({ walletPrivatePassphrase });
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
      appVersion,
      updateAvailable,
      isSPV,
      spvInput,
      isInputRequest,
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
      onHideLogs,
      onSetWalletPrivatePassphrase
    } = this;

    let text, Form;
    if (showSettings) {
      return <Settings {...{ onShowLogs, onHideSettings, appVersion, updateAvailable, ...props }} />;
    } else if (showLogs) {
      return <Logs {...{ onShowSettings, onHideLogs, getWalletReady, appVersion, updateAvailable,  ...props }} />;
    } else if (showReleaseNotes) {
      return <ReleaseNotes {...{ onShowSettings, onShowLogs, appVersion, onHideReleaseNotes, getWalletReady, ...props }} />;
    } else if (isAdvancedDaemon && openForm && !remoteAppdataError && !isPrepared && !getWalletReady && !isSPV) {
      Form = AdvancedStartupBody;
    } else if (remoteAppdataError && !isPrepared && !getWalletReady && !isSPV) {
      Form = RemoteAppdataError;
    } else if (!getWalletReady) {
      Form = WalletSelectionBody;
    } else if (isSPV && startStepIndex > 2) {
      text = <T id="getStarted.header.syncSpv.meta" m="Syncing SPV Wallet" />;
      if (spvInput) {
        Form = SpvSyncBody;
      } else {
        Form = FetchBlockHeadersBody;
      }
    } else {
      switch (startStepIndex || 0) {
      case 0:
      case 1:
        text = startupError ? startupError :
          <T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />;
        break;
      case 2:
        text = <T id="getStarted.header.openingwallet.meta" m="Opening Wallet" />;
        if (hasExistingWallet) {
          Form = OpenWallet;
        } else {
          return <CreateWallet {...{ ...props, onSetWalletPrivatePassphrase }} />;
        }
        break;
      case 3:
        text = <T id="getStarted.header.startrpc.meta" m="Establishing RPC connection" />;
        Form = StartRPCBody;
        break;
      case 4:
        text = <T id="getStarted.header.subcribe.meta" m="Subscribing to Block Notifications" />;
        break;
      case 4.5:
        text = <T id="getStarted.header.fetchingMissingCFilter.meta" m="Fetching Missing CFilters" />;
        Form = FetchBlockHeadersBody;
        break;
      case 5:
        text = <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />;
        Form = FetchBlockHeadersBody;
        break;
      case 6:
        text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
        if (isInputRequest) {
          Form = DiscoverAddressesBody;
        }
        break;
      case 7:
        text = <T id="getStarted.header.stakePools.meta" m="Import StakePools" />;
        Form = StakePoolsBody;
        break;
      case 8:
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
        onHideLogs,
        onSetWalletPrivatePassphrase,
        appVersion,
        updateAvailable,
        isSPV,
        spvInput,
        isInputRequest
      }} />;
  }
}

export default walletStartup(GetStartedPage);
