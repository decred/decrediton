import { daemonStartup } from "connectors";
import { interpret } from "xstate";
import { getStartedMachine } from "./GetStartedStateMachine";
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

@autobind
class GetStarted extends React.Component {
  service;
  constructor(props) {
    super(props);
    const {
      onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, goToErrorPage, goToSettings, backToCredentials, startSPVSync
    } = this.props;
    const { sendEvent, preStartDaemon } = this;
    this.machine = getStartedMachine({
      onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, sendEvent, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, preStartDaemon, goToErrorPage, goToSettings, backToCredentials, startSPVSync
    });
    this.service = interpret(this.machine).onTransition(current => this.setState({ current }, this.getStateComponent));
    this.state = {
      current: this.machine.initialState,
      PageComponent: null,
      text: <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />,
      animationType: null
    };
  }

  preStartDaemon () {
    const { isSPV, isAdvancedDaemon, getDaemonSynced, getSelectedWallet } = this.props;
    this.props.decreditonInit();
    if (getDaemonSynced) {
      const selectedWallet = getSelectedWallet();
      return this.service.send({ type: "CHOOSE_WALLET", selectedWallet });
    }
    this.service.send({ type: "START_SPV", isSPV });
    this.service.send({ type: "START_ADVANCED_DAEMON", isSPV, isAdvancedDaemon });
    this.service.send({ type: "START_REGULAR_DAEMON", isSPV, isAdvancedDaemon });
  }

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  componentDidUpdate(prevProps) {
    // const blockChainLoading = "blockchain-syncing";
    const daemonWaiting = "daemon-waiting";
    const discoveringAddresses = "discovering-addresses";
    const scanningBlocks = "scanning-blocks";
    // const finalizingSetup = "finalizing-setup";
    const fetchingHeaders = "fetching-headers";
    // const establishingRpc = "establishing-rpc";
    //     text = <T id="getStarted.header.stakePools.meta" m="Import StakePools" />;
    //     text = <T id="getStarted.header.startrpc.meta" m="Establishing RPC connection" />;
    //     animationType = establishingRpc;

    const { syncFetchMissingCfiltersAttempt, syncFetchHeadersAttempt, syncRescanAttempt, syncDiscoverAddressesAttempt } = this.props;
    if (prevProps.syncFetchMissingCfiltersAttempt !== syncFetchMissingCfiltersAttempt && syncFetchMissingCfiltersAttempt) {
      this.setState({ animationType: daemonWaiting });
      this.setState({ text: <T id="getStarted.header.fetchingMissing.meta" m="Fetching missing committed filters" /> });
    } else if (prevProps.syncFetchHeadersAttempt !== syncFetchHeadersAttempt && syncFetchHeadersAttempt) {
      this.setState({ animationType: fetchingHeaders });
      this.setState({ text: <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" /> });
    } else if (syncDiscoverAddressesAttempt !== prevProps.syncDiscoverAddressesAttempt && syncDiscoverAddressesAttempt) {
      this.setState({ animationType: discoveringAddresses });
      this.setState({ text: <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" /> });
    } else if (prevProps.syncRescanAttempt !== syncRescanAttempt && syncRescanAttempt) {
      this.setState({ animationType: scanningBlocks });
      this.setState({ text:<T id="getStarted.header.rescanWallet.meta" m="Scanning blocks for transactions" /> });
      // Form = RescanWalletBody;
    }
  }

  getStateComponent() {
    const { current } = this.state;
    const {
      service, submitChosenWallet, submitRemoteCredentials, submitAppdata,
      onShowSettings, onShowTrezorConfig, onSendBack, onSendCreateWallet,
      onSendError, onSendContinue
    } = this;
    const { machine } = service;
    const { isCreateNewWallet } = this.service._state.context;
    const error = this.getError();
    let component, text, PageComponent;

    const key = Object.keys(current.value)[0];
    if (key === "startMachine") {
      switch(current.value[key]) {
      case "startAdvancedDaemon":
        component = AdvancedStartupBody;
        text = <T id="loaderBar.WaitingDaemon" m="Waiting for daemon connection..." />;
        break;
      case "connectingDaemon":
        text = <T id="loaderBar.WaitingConnection" m="connecting to daemon..." /> ;
        break;
      case "checkingNetworkMatch":
        text = <T id="loaderBar.checkingNetwork" m="Checking if network matches..." />;
        break;
      case "startingDaemon":
        text = <T id="loaderBar.StartingDaemon" m="Starting Daemon..." />;
        break;
      case "syncingDaemon":
        text = <T id="loaderBar.syncingDaemon" m="syncing Daemon..." />;
        break;
      case "choosingWallet":
        text = <T id="loaderBar.choosingWallet" m="Choose a wallet to open" />;
        component = h(WalletSelection, { onSendCreateWallet, submitChosenWallet });
        break;
      case "preCreateWallet":
        text = isCreateNewWallet ?
          <T id="loaderBar.preCreateWalletCreate" m="Create a wallet..." /> :
          <T id="loaderBar.preCreateWalletRestore" m="Restore a Wallet..." />;
        component = h(CreateWalletForm, {
          onSendCreateWallet, onSendContinue, onSendBack, onSendError,
          onShowTrezorConfig, isCreateNewWallet, error
        });
        break;
      case "creatingWallet":
        text = isCreateNewWallet ?
          <T id="loaderBar.creatingWallet" m="Creating Wallet..." /> :
          <T id="loaderBar.restoringWallet" m="Restoring Wallet..." />;
        break;
      case "startingWallet":
        text = <T id="loaderBar.startingWallet" m="Starting wallet..." />;
        break;
      case "syncingRPC":
        text = <T id="loaderBar.syncingRPC" m="Syncing RPC connection..." />;
        break;
      }
      PageComponent = h(GetStartedMachinePage, {
        ...this.state, ...this.props, submitRemoteCredentials, submitAppdata, onShowSettings,
        service, machine, error, text, StateComponent: component
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

    return this.setState({ PageComponent, text });
  }

  sendEvent(data) {
    const { send } = this.service;
    const { type, payload } = data;
    send({ type, payload });
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
    if (typeof error  === "object") {
      return JSON.stringify(error);
    }
    return error;
  }

  render() {
    const { PageComponent } = this.state;
    const { onShowLogs, onShowSettings } = this;
    const { updateAvailable, appVersion } = this.props;

    return <GetStartedPage PageComponent={PageComponent} {...{ onShowLogs, onShowSettings, updateAvailable, appVersion }} />;
  }
}

export default injectIntl(daemonStartup(GetStarted));
