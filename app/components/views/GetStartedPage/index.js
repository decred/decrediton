import { daemonStartup } from "connectors";
import { interpret } from 'xstate';
import { getStartedMachine, submitRemoteCredentials } from "./GetStartedStateMachine";
import GetStartedPage from "./Page";
import { StartDecrediton } from "./context";
import { AdvancedStartupBody, RemoteAppdataError } from "./AdvancedStartup";
import WalletSelectionBody from "./WalletSelection";
import { injectIntl } from "react-intl";
import WalletSelection from "./WalletSelection";

@autobind
class GetStarted extends React.Component {
  state = {
    current: getStartedMachine.initialState,
    StateComponent: null,
  };

  service = interpret(getStartedMachine).onTransition(current =>
    this.setState({ current })
  );

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
    const { current } = this.state;
    if (prevState.current.value !== current.value) {
      const StateComponent = this.getStateComponent();
      this.setState({ StateComponent })
    }
  }

  getStateComponent() {
    const { current } = this.state;
    const { send, machine } = this.service;
    let component;
    
    switch(current.value) {
      case "prepStartDaemon": {
        this.props.prepStartDaemon();
      break;
      }
      case "startAdvancedDaemon": {
        component = AdvancedStartupBody;
      break;
      }
      case "connectingDaemon": {
        const { remoteCredentials } = current.event;
        this.props.onConnectDaemon(remoteCredentials)
          .then(connected => {
            console.log(connected)
             send({ type: "CHECK_NETWORK_MATCH", connected })
          })
          .catch(e => console.log(e))
      break;
      }
      case "checkingNetworkMatch": {
        this.props.checkNetworkMatch()
          .then(checked => send({ type: "SYNC_DAEMON", checked }))
      break;
      }
      case "syncingDaemon": {
        this.props.syncDaemon().then( synced => {
          this.props.onGetAvailableWallets().
            then(w => send({ type: "CHOOSE_WALLET", synced, w }));
        })
      break;
      }
      case "choosingWallet": {
        component = WalletSelection;
      break;
      }
      case "startingWallet": {
        this.props.onStartWallet(machine.context.selectedWallet).then(r => {
          console.log("aqui")
          console.log(r)
          send({ type: "SYNC_RPC", r })
        })
        break;
      }
      case "syncingRPC": {
        this.props.onRetryStartRPC(machine.context.credentials)
         
      break;
      }
    }

    return component;
  }

  submitChosenWallet(selectedWallet) {
    return this.service.send({ type: "SUBMIT_CHOOSE_WALLET", selectedWallet })
  }

  render() {
    const { current, StateComponent } = this.state;
    const { service, submitChosenWallet } = this;
    
    return (
      <StartDecrediton.Provider value={{ ...this.state, ...this.props, submitRemoteCredentials, submitChosenWallet, service }}>
        <GetStartedPage StateComponent = {StateComponent}/>
      </StartDecrediton.Provider>
    );
  }
}

export default injectIntl(daemonStartup(GetStarted));