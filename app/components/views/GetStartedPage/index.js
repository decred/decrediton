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

  // } else {
  //   switch (startStepIndex || 0) {
  //   case 0:
  //   case 1:
  //     animationType = discoveringAddresses;
  //     text = startupError ? startupError :
  //       <T id="getStarted.header.checkingWalletState.meta" m="Checking wallet state" />;
  //     break;
  //   case 2:
  //     animationType = discoveringAddresses;
  //     text = <T id="getStarted.header.openingwallet.meta" m="Opening Wallet" />;
  //     if (hasExistingWallet) {
  //       Form = OpenWallet;
  //     } else {
  //       return <CreateWallet {...{ ...props, onSetWalletPrivatePassphrase }} />;
  //     }
  //     break;
  //   case 3:
  //     animationType = establishingRpc;
  //     text = <T id="getStarted.header.startrpc.meta" m="Establishing RPC connection" />;
  //     Form = StartRPCBody;
  //     break;
  //   case 7:
  //     text = <T id="getStarted.header.stakePools.meta" m="Import StakePools" />;
  //     Form = StakePoolsBody;
  //     break;
  //   default:
  //     animationType = finalizingSetup;
  //     text = <T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />;
  constructor(props) {
    super(props);
    const {
      prepStartDaemon, onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, getSelectedWallet,
    } = this.props;
    const { sendEvent } = this;
    this.service = interpret(getStartedMachine({
      prepStartDaemon, onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, sendEvent, onGetAvailableWallets,
      onStartDaemon, setSelectedWallet, getSelectedWallet
    })).onTransition(current => {
      this.setState({ current });
    });
    this.state = {
      current: getStartedMachine().initialState,
      StateComponent: null,
      text: <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />,
      animationType: null,
    };
  }


  componentDidMount() {
    const { isSPV, isAdvancedDaemon, openForm } = this.props;
    this.service.start();
    if (!openForm) {
      return this.service.send({ type: "START_SELECTED_WALLET" });
    }
    this.service.send({ type: "START_SPV", isSPV, isAdvancedDaemon });
    this.service.send({ type: "START_ADVANCED_DAEMON", isSPV, isAdvancedDaemon });
    this.service.send({ type: "START_DAEMON", isSPV, isAdvancedDaemon });
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
  // else if (!isSPV && startStepIndex > 2) {
  //   animationType = blockChainLoading;
  //   text = <T id="getStarted.header.sync.meta" m="Syncing Wallet" />;
  //   if (syncFetchMissingCfiltersAttempt) {
  //     animationType = daemonWaiting;
  //     text = <T id="getStarted.header.fetchingMissing.meta" m="Fetching missing committed filters" />;
  //   } else if (syncFetchHeadersAttempt) {
  //     animationType = fetchingHeaders;
  //     text = <T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />;
  //   } else if (syncDiscoverAddressesAttempt) {
  //     animationType = discoveringAddresses;
  //     text = <T id="getStarted.header.discoveringAddresses.meta" m="Discovering addresses" />;
  //   } else if (syncRescanAttempt) {
  //     animationType = scanningBlocks;
  //     text = <T id="getStarted.header.rescanWallet.meta" m="Scanning blocks for transactions" />;
  //     Form = RescanWalletBody;
  //   }
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

  render() {
    const { StateComponent, text } = this.state;
    const { service, submitChosenWallet, submitRemoteCredentials, submitAppdata } = this;
    const { machine } = service;
    const { error } = machine.context;

    return (
      <GetStartedPage
        {...{ ...this.state, ...this.props, submitRemoteCredentials, submitAppdata,
          submitChosenWallet, service, machine, error, text }}
        StateComponent={StateComponent} />
    );
  }
}

export default injectIntl(daemonStartup(GetStarted));
