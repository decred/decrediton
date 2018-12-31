import OpenWallet from "./OpenWallet";
import CreateWallet from "./CreateWallet";
import DaemonLoading from "./DaemonLoading";
import Logs from "./Logs";
import Settings from "./Settings";
import ReleaseNotes from "./ReleaseNotes";
import WalletSelectionBody from "./WalletSelection";
import StartRPCBody from "./StartRPC";
import SpvSync from "./SpvSync";
import TrezorConfig from "./TrezorConfig";
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
      walletPrivatePassphrase: "", showTrezorConfig: false };
  }

  componentDidMount() {
    const { getWalletReady, getDaemonStarted, onGetAvailableWallets, onStartWallet, prepStartDaemon, isSPV } = this.props;
    if (!getWalletReady) {
      onGetAvailableWallets()
        .then(({ previousWallet }) => {
          previousWallet && onStartWallet(previousWallet);
        });
    }
    if (!getDaemonStarted && !isSPV) {
      setTimeout(()=>prepStartDaemon(), 1000);
    }
  }

  componentDidUpdate(prevProps) {
    const { startStepIndex, getDaemonSynced, onRetryStartRPC, isSPV, startSPVSync } = prevProps;
    if (!isSPV) {
      if (startStepIndex != this.props.startStepIndex || getDaemonSynced != this.props.getDaemonSynced ){
        if (this.props.startStepIndex == 3 && this.props.getDaemonSynced)
          onRetryStartRPC(false, this.state.walletPrivatePassphrase);
      }
    } else {
      if (startStepIndex != this.props.startStepIndex ){
        if (this.props.startStepIndex == 3)
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

  onShowTrezorConfig() {
    this.setState({ showTrezorConfig: true });
  }

  onHideTrezorConfig() {
    this.setState({ showTrezorConfig: false });
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
      openWalletInputRequest,
      syncFetchMissingCfiltersAttempt,
      syncFetchHeadersAttempt,
      syncDiscoverAddressesAttempt,
      syncRescanAttempt,
      ...props
    } = this.props;

    const {
      showSettings,
      showLogs,
      showReleaseNotes,
      showTrezorConfig,
      ...state
    } = this.state;

    const {
      onShowReleaseNotes,
      onHideReleaseNotes,
      onShowSettings,
      onHideSettings,
      onShowLogs,
      onHideLogs,
      onSetWalletPrivatePassphrase,
      onShowTrezorConfig,
      onHideTrezorConfig,
    } = this;

    const blockChainLoading = "blockchain-syncing";
    const daemonWaiting = "daemon-waiting";
    const discoveringAddresses = "discovering-addresses";
    const scanningBlocks = "scanning-blocks";
    const finalizingSetup = "finalizing-setup";
    const fetchingHeaders = "fetching-headers";
    const establishingRpc = "establishing-rpc";

    let text, Form, animationType;
    if (showSettings) {
      return <Settings {...{ onShowLogs, onHideSettings, appVersion, updateAvailable, getWalletReady, ...props }} />;
    } else if (showLogs) {
      return <Logs {...{ onShowSettings, onHideLogs, getWalletReady, appVersion, updateAvailable,  ...props }} />;
    } else if (showReleaseNotes) {
      return <ReleaseNotes {...{ onShowSettings, onShowLogs, appVersion, onHideReleaseNotes, getWalletReady, ...props }} />;
    } else if (showTrezorConfig) {
      return <TrezorConfig {...{ onHideTrezorConfig, ...props }} />;
    } else if (isAdvancedDaemon && openForm && !remoteAppdataError && !isPrepared && !getWalletReady && !isSPV) {
      Form = AdvancedStartupBody;
    } else if (remoteAppdataError && !isPrepared && !getWalletReady && !isSPV) {
      Form = RemoteAppdataError;
    } else if (!getWalletReady) {
      Form = WalletSelectionBody;
    } else if (isSPV && startStepIndex > 2) {
      animationType = blockChainLoading;
      text = <T id="getStarted.header.syncSpv.meta" m="Syncing SPV Wallet" />;
      if (syncFetchMissingCfiltersAttempt) {
        animationType = daemonWaiting;
        text = <T id="getStarted.header.fetchingMissing.meta" m="Fetching missing committed filters" />;
      } else if (syncFetchHeadersAttempt) {
        animationType = fetchingHeaders;
        text = <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />;
      } else if (syncDiscoverAddressesAttempt) {
        animationType = discoveringAddresses;
        text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
      } else if (syncRescanAttempt) {
        animationType = scanningBlocks;
        text = <T id="getStarted.header.rescanWallet.meta" m="Scanning blocks for transactions" />;
        Form = RescanWalletBody;
      }
      return <SpvSync
        {...{
          ...props,
          ...state,
          appVersion,
          isSPV,
          text,
          animationType,
          Form,
          syncFetchHeadersAttempt,
        }}/>;
    } else if (!isSPV && startStepIndex > 2) {
      animationType = blockChainLoading;
      text = <T id="getStarted.header.sync.meta" m="Syncing Wallet" />;
      if (syncFetchMissingCfiltersAttempt) {
        animationType = daemonWaiting;
        text = <T id="getStarted.header.fetchingMissing.meta" m="Fetching missing committed filters" />;
      } else if (syncFetchHeadersAttempt) {
        animationType = fetchingHeaders;
        text = <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />;
      } else if (syncDiscoverAddressesAttempt) {
        animationType = discoveringAddresses;
        text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
      } else if (syncRescanAttempt) {
        animationType = scanningBlocks;
        text = <T id="getStarted.header.rescanWallet.meta" m="Scanning blocks for transactions" />;
        Form = RescanWalletBody;
      }
    } else {
      switch (startStepIndex || 0) {
      case 0:
      case 1:
        animationType = discoveringAddresses;
        text = startupError ? startupError :
          <T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />;
        break;
      case 2:
        animationType = discoveringAddresses;
        text = <T id="getStarted.header.openingwallet.meta" m="Opening Wallet" />;
        if (hasExistingWallet) {
          Form = OpenWallet;
        } else {
          return <CreateWallet {...{ ...props, onSetWalletPrivatePassphrase }} />;
        }
        break;
      case 3:
        animationType = establishingRpc;
        text = <T id="getStarted.header.startrpc.meta" m="Establishing RPC connection" />;
        Form = StartRPCBody;
        break;
      case 7:
        text = <T id="getStarted.header.stakePools.meta" m="Import StakePools" />;
        Form = StakePoolsBody;
        break;
      default:
        animationType = finalizingSetup;
        text = <T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />;
      }
    }

    return <DaemonLoading Form={Form}
      {...{
        ...props,
        ...state,
        text,
        animationType,
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
        onShowTrezorConfig,
        onHideTrezorConfig,
        appVersion,
        updateAvailable,
        isSPV,
        openWalletInputRequest,
        syncFetchHeadersAttempt,
      }} />;
  }
}

export default walletStartup(GetStartedPage);
