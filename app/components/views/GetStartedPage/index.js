import OpenWallet from "./OpenWallet";
import CreateWallet from "./CreateWallet";
import DaemonLoading from "./DaemonLoading";
import Logs from "./Logs";
import Settings from "./Settings";
import ReleaseNotes from "./ReleaseNotes";
import WalletSelectionBody from "./WalletSelection";
import StartRPCBody from "./StartRPC";
import SpvSync from "./SpvSync";
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
      isInputRequest,
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

    const blockChainLoading = "blockchain-syncing";
    const daemonWaiting = "daemon-waiting";
    const discoveringAddresses = "discovering-addresses";
    const scanningBlocks = "scanning-blocks";
    const finalizingSetup = "finalizing-setup";
    const fetchingHeaders = "fetching-headers";
    const establishingRpc = "establishing-rpc";

    let text, Form, animationType;
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
          isSPV,
          text,
          animationType,
          Form,
          syncFetchHeadersAttempt,
        }}/>;
    } else if (!isSPV && startStepIndex > 2) {
      text = <T id="getStarted.header.sync.meta" m="Syncing Wallet" />;
      if (syncFetchMissingCfiltersAttempt) {
        text = <T id="getStarted.header.fetchingMissing.meta" m="Fetching missing committed filters" />;
      } else if (syncFetchHeadersAttempt) {
        text = <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />;
      } else if (syncDiscoverAddressesAttempt) {
        text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
      } else if (syncRescanAttempt) {
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
        appVersion,
        updateAvailable,
        isSPV,
        isInputRequest
      }} />;
  }
}

export default walletStartup(GetStartedPage);
