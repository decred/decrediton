import { daemonStartup } from "connectors";
import { interpret } from "xstate";
import { getStartedMachine } from "./GetStartedStateMachine";
import GetStartedPage from "./Page";
import { AdvancedStartupBody } from "./AdvancedStartup";
import { injectIntl } from "react-intl";
import WalletSelection from "./WalletSelection";
import { FormattedMessage as T } from "react-intl";

@autobind
class GetStarted extends React.Component {
  service;
  constructor(props) {
    super(props);
    const {
      onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, goToError,
    } = this.props;
    const { sendEvent, preStartDaemon } = this;
    this.machine = getStartedMachine({
      onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, sendEvent, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, preStartDaemon, goToError
    });
    this.service = interpret(this.machine).onTransition(current => {
      this.setState({ current });
    });
    this.state = {
      current: getStartedMachine().initialState,
      StateComponent: null,
      text: <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />,
      animationType: null,
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

  componentDidUpdate(prevProps, prevState) {
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

    const { current } = prevState;
    const { syncFetchMissingCfiltersAttempt, syncFetchHeadersAttempt, syncRescanAttempt, syncDiscoverAddressesAttempt } = this.props;
    if (current && current.value !== this.state.current.value) {
      const StateComponent = this.getStateComponent();
      this.setState({ StateComponent });
    }
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
    let component;

    switch(current.value) {
    case "startAdvancedDaemon":
      component = AdvancedStartupBody;
      this.setState({ text: <T id="loaderBar.WaitingDaemon" m="Waiting for daemon connection..." /> });
      break;
    case "connectingDaemon":
      this.setState({ text: <T id="loaderBar.WaitingConnection" m="connecting to daemon..." /> });
      break;
    case "checkingNetworkMatch":
      this.setState({ text: <T id="loaderBar.checkingNetwork" m="Checking if network matches..." /> });
      break;
    case "startingDaemon":
      this.setState({ text: <T id="loaderBar.StartingDaemon" m="Starting Daemon..." /> });
      break;
    case "syncingDaemon":
      this.setState({ text: <T id="loaderBar.syncingDaemon" m="syncing Daemon..." /> });
      break;
    case "choosingWallet":
      this.setState({ text: <T id="loaderBar.choosingWallet" m="Choose a wallet to open" /> });
      component = WalletSelection;
      break;
    case "startingWallet":
      this.setState({ text: <T id="loaderBar.startingWallet" m="Starting wallet..." /> });
      break;
    case "syncingRPC":
      this.setState({ text: <T id="loaderBar.syncingRPC" m="Syncing RPC connection..." /> });
      break;
    }

    return component;
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

  getError() {
    const { error } = this.service.machine.context;
    if (!error) return;
    if (typeof error  === "object") {
      return JSON.stringify(error);
    }
    return error;
  }

  render() {
    const { StateComponent, text } = this.state;
    const { service, submitChosenWallet, submitRemoteCredentials, submitAppdata } = this;
    const { machine } = service;
    const error = this.getError();

    return (
      <GetStartedPage
        {...{ ...this.state, ...this.props, submitRemoteCredentials, submitAppdata,
          submitChosenWallet, service, machine, error, text }}
        StateComponent={StateComponent} />
    );
  }
}

export default injectIntl(daemonStartup(GetStarted));
