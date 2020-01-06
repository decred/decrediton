import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { interpret } from "xstate";
import { CreateWalletMachine } from "./CreateWalletStateMachine";
import Page from "./Page"
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";
import ConfirmSeed from "./ConfirmSeed";
import ExistingSeed from "./ExistingSeed";
import { createWallet } from "connectors";
import { createElement as h, cloneElement as k } from "react";

@autobind
class CreateWallet extends React.Component {
  service;
  constructor(props) {
    super(props);
    const { sendEvent, checkIsValid } = this;
    const { backToCredentials, cancelCreateWallet, generateSeed } = props;
    this.machine = CreateWalletMachine({ generateSeed, backToCredentials, cancelCreateWallet, sendEvent, checkIsValid });
    this.service = interpret(this.machine).onTransition(current => {
      this.setState({ current }, this.getStateComponent);
    });
    this.state = {
      current: this.machine.initialState,
      StateComponent: null,
      isNew: "",
      isValid: false
    };
  }

  componentDidMount() {
    this.service.start();
    let isNew = this.props.match.params.isNew;
    isNew = isNew == "true" ? true : false
    this.setState({ isNew });
    const { isCreatingWatchingOnly, masterPubKey, isTestNet } = this.props;
    this.service.send({ type: "CREATE_WALLET", isNew });
    this.service.send({ type: "RESTORE_WALLET", isNew });
  }

  componentWillUnmount() {
    this.service.stop();
  }

  async getStateComponent() {
    const { current, isNew, isValid } = this.state;
    const { sendBack, sendContinue, onChangeSeedWord, setPassPhrase, setSeed, setError, onCreateWallet } = this;
    const { mnemonic } = this.machine.context;
    const { decodeSeed, createWalletRequest, onSetWalletPrivatePassphrase } = this.props;
    let component, text;

    switch(current.value) {
    case "newWallet":
      component = h(CopySeed, { sendBack, sendContinue, mnemonic });
      break;
    case "confirmSeed":
      component = h(ConfirmSeed, { mnemonic, sendBack, setPassPhrase, onCreateWallet, isValid, decodeSeed, setSeed, setError });
      break;
    case "writeSeed":
      component = h(ExistingSeed, {
        sendBack, decodeSeed, sendContinue, setSeed, setPassPhrase, onCreateWallet, isValid, setError
      });
      break;
    case "finished":
      break;
    case "walletCreated":
      break;
    }

    return this.setState({ StateComponent: component, text });
  }

  sendEvent(data) {
    const { type, payload } = data;
    this.service.send({ type, payload });
  }

  sendContinue() {
    this.service.send({ type: "CONTINUE" });
  }

  sendBack() {
    this.service.send({ type: "BACK" });
  }

  onCreateWallet() {
    const { createWalletRequest, onSetWalletPrivatePassphrase } = this.props;
    const { isNew } = this.state;
    const pubpass = ""; // Temporarily disabled?
    const { seed, passPhrase } = this.service._state.context;

    if (!(seed && passPhrase)) return;
    createWalletRequest(pubpass, passPhrase, seed, isNew);
    isNew && onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    this.sendContinue();
  }

  setError(error) {
    this.service.send({ type: "VALIDATE_DATA", error });
  }

  setSeed(seed) {
    const { passPhrase, error } = this.machine.context
    this.service.send({ type: "VALIDATE_DATA", seed, passPhrase, error });
  }

  setPassPhrase(passPhrase) {
    const { seed, error } = this.machine.context
    this.service.send({ type: "VALIDATE_DATA", passPhrase, seed, error });
  }

  checkIsValid() {
    const { seed, passPhrase } = this.service._state.context;

    // We validate our seed and passphrase at their specific components
    // So if they are set at the machine it means they have passed validation.
    if (!seed || !passPhrase) return this.setState({ isValid: false });
    if (seed.length === 0) return this.setState({ isValid: false });
    if (passPhrase.length === 0) return this.setState({ isValid: false });;

    return this.setState({ isValid: true });;
  }

  render() {
    const {
      getDaemonSynced, getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, isTestNet
    } = this.props;
    const { StateComponent, walletHeader } = this.state;
    return <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
      <Page {...{
        StateComponent, getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced, walletHeader
      }}/>
    </div>
  }
}

export default injectIntl(withRouter(createWallet(CreateWallet)));
