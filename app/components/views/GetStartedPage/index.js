import { daemonStartup } from "connectors";
import { interpret } from "xstate";
import { getStartedMachine } from "./GetStartedStateMachine";
import GetStartedPage from "./Page";
import { AdvancedStartupBody } from "./AdvancedStartup";
import { injectIntl } from "react-intl";
import WalletSelection from "./WalletSelection";

@autobind
class GetStarted extends React.Component {
  service;

  constructor(props) {
    super(props);
    const { prepStartDaemon, onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, onGetAvailableWallets } = this.props;
    const { sendEvent } = this;
    this.service = interpret(getStartedMachine({
      prepStartDaemon, onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, sendEvent, onGetAvailableWallets
    })).onTransition(current => {
      this.setState({ current });
    });
    this.state = {
      current: getStartedMachine().initialState,
      StateComponent: null,
    };
  }


  componentDidMount() {
    const { isSPV, isAdvancedDaemon } = this.props;
    this.service.start();
    this.service.send({ type: "START_SPV", isSPV, isAdvancedDaemon });
    this.service.send({ type: "START_ADVANCED_DAEMON", isSPV, isAdvancedDaemon });
    this.service.send({ type: "START_DAEMON", isSPV, isAdvancedDaemon });
  }

  componentWillUnmount() {
    this.service.stop();
  }

  componentDidUpdate(prevProps, prevState) {
    const { current } = prevState;
    if (current && current.value !== this.state.current.value) {
      const StateComponent = this.getStateComponent();
      this.setState({ StateComponent });
    }
  }

  getStateComponent() {
    const { current } = this.state;
    let component;

    switch(current.value) {
    case "startAdvancedDaemon":
      component = AdvancedStartupBody;
      break;
    case "connectingDaemon":
      break;
    case "checkingNetworkMatch":
      break;
    case "syncingDaemon":
      break;
    case "choosingWallet":
      component = WalletSelection;
      break;
    case "startingWallet":
      break;
    case "syncingRPC":
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

  render() {
    const { StateComponent } = this.state;
    const { service, submitChosenWallet, submitRemoteCredentials } = this;

    return (
      <GetStartedPage
        {...{ ...this.state, ...this.props, submitRemoteCredentials, submitChosenWallet, service }}
        StateComponent={StateComponent} />
    );
  }
}

export default injectIntl(daemonStartup(GetStarted));
