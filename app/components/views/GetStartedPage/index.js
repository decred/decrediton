import { daemonStartup } from "connectors";
import { interpret } from "xstate";
import { getStartedMachine } from "stateMachines/GetStartedStateMachine";
import GetStartedPage from "./Page";
import { AdvancedStartupBody } from "./AdvancedStartup";
import { injectIntl } from "react-intl";
import WalletSelection from "./WalletSelection";
import Settings from "./Settings";
import Logs from "./Logs";
import { FormattedMessage as T } from "react-intl";
import { createElement as h } from "react";
import GetStartedMachinePage from "./GetStartedMachinePage";
import TrezorConfig from "./TrezorConfig";
import CreateWalletForm from "./PreCreateWallet";
import RescanWalletBody from "./RescanWallet";
import WalletPubpassInput from "./OpenWallet";
import ReleaseNotes from "./ReleaseNotes";
import { ipcRenderer } from "electron";

// css animation classes:
const blockChainLoading = "blockchain-syncing";
const daemonWaiting = "daemon-waiting";
const discoveringAddresses = "discovering-addresses";
const scanningBlocks = "scanning-blocks";
const finalizingSetup = "finalizing-setup";
const fetchingHeaders = "fetching-headers";
const establishingRpc = "establishing-rpc";

@autobind
class GetStarted extends React.Component {
  service;
  constructor(props) {
    super(props);
    const {
      onConnectDaemon,
      checkNetworkMatch,
      syncDaemon,
      onStartWallet,
      onRetryStartRPC,
      onGetAvailableWallets,
      onStartDaemon,
      setSelectedWallet,
      goToErrorPage,
      goToSettings,
      backToCredentials,
      startSPVSync
    } = this.props;
    const { sendEvent, preStartDaemon } = this;
    this.machine = getStartedMachine({
      onConnectDaemon,
      checkNetworkMatch,
      syncDaemon,
      onStartWallet,
      onRetryStartRPC,
      sendEvent,
      onGetAvailableWallets,
      onStartDaemon,
      setSelectedWallet,
      preStartDaemon,
      goToErrorPage,
      goToSettings,
      backToCredentials,
      startSPVSync
    });
    this.service = interpret(this.machine).onTransition((current) =>
      this.setState({ current }, this.getStateComponent)
    );
    this.state = {
      current: this.machine.initialState,
      PageComponent: null,
      text: null,
      animationType: null
    };
  }

  // preStartDaemon gets data from cli to connect with remote dcrd if rpc
  // connection data is inputed and sends the first interaction with the state
  // machine, so it can start. Only one of the choises is chosen.
  preStartDaemon() {
    const {
      isSPV,
      isAdvancedDaemon,
      getDaemonSynced,
      getSelectedWallet
    } = this.props;
    const cliOptions = ipcRenderer.sendSync("get-cli-options");
    let rpcCliRemote;
    if (cliOptions.rpcPresent) {
      rpcCliRemote = {
        rpc_user: cliOptions.rpcUser,
        rpc_pass: cliOptions.rpcPass,
        rpc_cert: cliOptions.rpcCert,
        rpc_host: cliOptions.rpcHost,
        rpc_port: cliOptions.rpcPort
      };
      this.service.send({
        type: "START_CLI_REMOTE_DAEMON",
        remoteCredentials: rpcCliRemote
      });
    }
    // If daemon is synced or isSPV mode we check for a selectedWallet.
    // If it is selected, it probably means a wallet was just pre created or
    // a refresh (common when in dev mode).
    if (getDaemonSynced || isSPV) {
      const selectedWallet = getSelectedWallet();
      return this.service.send({
        type: "CHOOSE_WALLET",
        selectedWallet,
        isSPV,
        isAdvancedDaemon
      });
    }
    this.service.send({ type: "START_SPV", isSPV });
    this.service.send({
      type: "START_ADVANCED_DAEMON",
      isSPV,
      isAdvancedDaemon
    });
    this.service.send({
      type: "START_REGULAR_DAEMON",
      isSPV,
      isAdvancedDaemon
    });
  }

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  componentDidUpdate(prevProps) {
    // This is responsable for updating the text and animation of the loader bar
    // when syncing rpc. This is done this way to avoid removing syncConsumer method
    // from the reducer.
    // After Each update we need to call getStateComponent or the PageComponent will not
    // update itself.
    let text, animationType, component;
    const {
      syncFetchMissingCfiltersAttempt,
      syncFetchHeadersAttempt,
      syncRescanAttempt,
      syncDiscoverAddressesAttempt,
      synced
    } = this.props;
    if (
      prevProps.syncFetchMissingCfiltersAttempt !==
        syncFetchMissingCfiltersAttempt &&
      syncFetchMissingCfiltersAttempt
    ) {
      animationType = daemonWaiting;
      text = (
        <T
          id="getStarted.header.fetchingMissing.meta"
          m="Fetching missing committed filters"
        />
      );
      this.getStateComponent(text, animationType, component);
    } else if (
      prevProps.syncFetchHeadersAttempt !== syncFetchHeadersAttempt &&
      syncFetchHeadersAttempt
    ) {
      animationType = fetchingHeaders;
      text = (
        <T
          id="getStarted.header.fetchingBlockHeaders.meta"
          m="Fetching block headers"
        />
      );
    } else if (
      syncDiscoverAddressesAttempt !== prevProps.syncDiscoverAddressesAttempt &&
      syncDiscoverAddressesAttempt
    ) {
      animationType = discoveringAddresses;
      text = (
        <T
          id="getStarted.header.discoveringAddresses.meta"
          m="Discovering addresses"
        />
      );
      this.getStateComponent(text, animationType, component);
    } else if (
      prevProps.syncRescanAttempt !== syncRescanAttempt &&
      syncRescanAttempt
    ) {
      animationType = scanningBlocks;
      text = (
        <T
          id="getStarted.header.rescanWallet.meta"
          m="Scanning blocks for transactions"
        />
      );
      component = RescanWalletBody;
      this.getStateComponent(text, animationType, component);
    } else if (prevProps.synced !== synced && synced) {
      animationType = finalizingSetup;
      text = (
        <T
          id="getStarted.header.finishingStart.meta"
          m="Finishing to load wallet"
        />
      );
      this.getStateComponent(text, animationType, component);
    }
  }

  getStateComponent(updatedText, updatedAnimationType, updatedComponent) {
    const { current } = this.state;
    const {
      service,
      submitChosenWallet,
      submitRemoteCredentials,
      submitAppdata,
      onShowTrezorConfig,
      onSendBack,
      onSendCreateWallet,
      onSendError,
      onSendContinue,
      onShowReleaseNotes
    } = this;
    const { machine } = service;
    const { isCreateNewWallet, isSPV } = this.service._state.context;
    const error = this.getError();
    let component, text, animationType, PageComponent;

    const key = Object.keys(current.value)[0];
    if (key === "startMachine") {
      switch (current.value[key]) {
        case "startAdvancedDaemon":
          component = AdvancedStartupBody;
          text = (
            <T
              id="loaderBar.WaitingDaemon"
              m="Waiting for daemon connection..."
            />
          );
          break;
        case "connectingDaemon":
          text = (
            <T id="loaderBar.WaitingConnection" m="connecting to daemon..." />
          );
          break;
        case "checkingNetworkMatch":
          text = (
            <T
              id="loaderBar.checkingNetwork"
              m="Checking if network matches..."
            />
          );
          break;
        case "startingDaemon":
          animationType = daemonWaiting;
          text = <T id="loaderBar.StartingDaemon" m="Starting Daemon..." />;
          break;
        case "syncingDaemon":
          animationType = blockChainLoading;
          text = <T id="loaderBar.syncingDaemon" m="Syncing Daemon..." />;
          break;
        case "choosingWallet":
          text = isSPV ? (
            <T
              id="loaderBar.choosingWalletSPV"
              m="Choose a wallet to open in SPV mode"
            />
          ) : (
            <T id="loaderBar.choosingWallet" m="Choose a wallet to open" />
          );
          component = h(WalletSelection, {
            onSendCreateWallet,
            submitChosenWallet,
            isSPV
          });
          break;
        case "preCreateWallet":
          text = isCreateNewWallet ? (
            <T id="loaderBar.preCreateWalletCreate" m="Create a wallet..." />
          ) : (
            <T id="loaderBar.preCreateWalletRestore" m="Restore a Wallet..." />
          );
          component = h(CreateWalletForm, {
            onSendCreateWallet,
            onSendContinue,
            onSendBack,
            onSendError,
            onShowTrezorConfig,
            isCreateNewWallet,
            error
          });
          break;
        case "creatingWallet":
          text = isCreateNewWallet ? (
            <T id="loaderBar.creatingWallet" m="Creating Wallet..." />
          ) : (
            <T id="loaderBar.restoringWallet" m="Restoring Wallet..." />
          );
          break;
        case "walletPubpassInput":
          text = <T id="loaderBar.walletPubPass" m="Insert your pubkey" />;
          component = h(WalletPubpassInput, {
            onSendContinue,
            onSendError,
            error,
            ...this.props
          });
          break;
        case "startingWallet":
          text = <T id="loaderBar.startingWallet" m="Starting wallet..." />;
          break;
        case "syncingRPC":
          animationType = establishingRpc;
          text = <T id="loaderBar.syncingRPC" m="Syncing RPC connection..." />;
          break;
      }
      PageComponent = h(GetStartedMachinePage, {
        ...this.state,
        ...this.props,
        submitRemoteCredentials,
        submitAppdata,
        service,
        machine,
        error,
        isSPV,
        onShowReleaseNotes,
        // if updated* is set, we use it, as it means it is called by the componentDidUpdate.
        text: updatedText ? updatedText : text,
        animationType: updatedAnimationType
          ? updatedAnimationType
          : animationType,
        StateComponent: updatedComponent ? updatedComponent : component
      });
    }
    if (key === "settings") {
      PageComponent = h(Settings, { onSendBack });
    }
    if (key === "logs") {
      PageComponent = h(Logs, { onSendBack });
    }
    if (key === "trezorConfig") {
      PageComponent = h(TrezorConfig, { onSendBack });
    }
    if (key === "releaseNotes") {
      PageComponent = h(ReleaseNotes, { onSendBack });
    }

    return this.setState({ PageComponent });
  }

  sendEvent(data) {
    const { send } = this.service;
    const { type, payload } = data;
    send({ type, ...payload });
  }

  submitChosenWallet(selectedWallet) {
    return this.service.send({ type: "SUBMIT_CHOOSE_WALLET", selectedWallet });
  }

  submitRemoteCredentials(remoteCredentials) {
    return this.service.send({ type: "SUBMIT_REMOTE", remoteCredentials });
  }

  submitAppdata(appdata) {
    return this.service.send({ type: "SUBMIT_APPDATA", appdata });
  }

  onShowReleaseNotes() {
    return this.service.send({ type: "SHOW_RELEASE_NOTES" });
  }

  onShowSettings() {
    return this.service.send({ type: "SHOW_SETTINGS" });
  }

  onShowLogs() {
    return this.service.send({ type: "SHOW_LOGS" });
  }

  onShowTrezorConfig() {
    return this.service.send({ type: "SHOW_TREZOR_CONFIG" });
  }

  onSendCreateWallet(isNew) {
    return this.service.send({ type: "CREATE_WALLET", isNew });
  }

  onSendContinue() {
    return this.service.send({ type: "CONTINUE" });
  }

  onSendBack() {
    return this.service.send({ type: "BACK" });
  }

  onSendError(error) {
    return this.service.send({ type: "ERROR", error });
  }

  getError() {
    const { error } = this.service._state.context;
    if (!error) return;
    // We can return errors in the form of react component, which are objects.
    // So we handle them first.
    if (React.isValidElement(error)) {
      return error;
    }
    // If the errors is an object but not a react component, we strigfy it so we can
    // render.
    if (typeof error === "object") {
      return JSON.stringify(error);
    }
    return error;
  }

  render() {
    const { PageComponent } = this.state;
    const { onShowLogs, onShowSettings } = this;
    const { updateAvailable } = this.props;

    return (
      <GetStartedPage
        PageComponent={PageComponent}
        {...{ onShowLogs, onShowSettings, updateAvailable }}
      />
    );
  }
}

export default injectIntl(daemonStartup(GetStarted));
