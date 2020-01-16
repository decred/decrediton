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

@autobind
class GetStarted extends React.Component {
  service;
  constructor(props) {
    super(props);
    const {
      onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, goToError, goToSettings, backToCredentials
    } = this.props;
    const { sendEvent, preStartDaemon } = this;
    this.machine = getStartedMachine({
      onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, sendEvent, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, preStartDaemon, goToError, goToSettings, backToCredentials
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
    this.service.send({ type: "START_SPV", isSPV, isAdvancedDaemon });
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
    const { onSendBack } = this;
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
        component = WalletSelection;
        break;
      case "startingWallet":
        text = <T id="loaderBar.startingWallet" m="Starting wallet..." />;
        break;
      case "syncingRPC":
        text = <T id="loaderBar.syncingRPC" m="Syncing RPC connection..." />;
        break;
      }
      const { service, submitChosenWallet, submitRemoteCredentials, submitAppdata, onShowSettings } = this;
      const { machine } = service;
      const error = this.getError();
      PageComponent = h(GetStartedMachinePage, {
        ...this.state, ...this.props, submitRemoteCredentials, submitAppdata, onShowSettings,
        submitChosenWallet, service, machine, error, text, StateComponent: component
      });
    }
    if (key === "settings") {
      PageComponent = h(Settings, { onSendBack });
    }
    if (key === "logs") {
      PageComponent = h(Logs, { onSendBack });
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

  onSendBack() {
    return this.service.send({ type: "BACK" });
  }

  getError() {
    const { error } = this.service.machine.context;
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
