import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { interpret } from "xstate";
import { CreateWalletMachine } from "stateMachines/CreateWalletStateMachine";
import Page from "./Page";
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";
import ConfirmSeed from "./ConfirmSeed";
import ExistingSeed from "./ExistingSeed";
import { createWallet } from "connectors";
import { createElement as h } from "react";
import { DecredLoading } from "indicators";

@autobind
class CreateWallet extends React.Component {
  service;
  constructor(props) {
    super(props);
    const { sendEvent, sendContinue, checkIsValid, onCreateWatchOnly } = this;
    const { backToCredentials, cancelCreateWallet, generateSeed } = props;
    this.machine = CreateWalletMachine({
      generateSeed,
      backToCredentials,
      cancelCreateWallet,
      sendEvent,
      sendContinue,
      checkIsValid,
      onCreateWatchOnly
    });
    this.service = interpret(this.machine).onTransition((current) =>
      this.setState({ current }, this.getStateComponent)
    );
    this.state = {
      current: this.machine.initialState,
      StateComponent: null,
      isValid: false
    };
  }

  componentDidMount() {
    this.service.start();
    const isNew = !this.props.createWalletExisting;
    const isWatchingOnly = this.props.isCreatingWatchingOnly;
    // TODO Add watching only state and tezos
    const { isTrezor, isTestNet } = this.props;
    this.service.send({ type: "CREATE_WALLET", isNew, isTestNet });
    this.service.send({ type: "RESTORE_WATCHING_ONLY_WALLET", isWatchingOnly });
    this.service.send({ type: "RESTORE_TREZOR_WALLET", isTrezor });
    this.service.send({
      type: "RESTORE_WALLET",
      isRestore: !isNew,
      isWatchingOnly
    });
  }

  componentWillUnmount() {
    this.service.stop();
  }

  getStateComponent() {
    const { current, isValid } = this.state;
    const {
      sendBack,
      sendContinue,
      setPassPhrase,
      setSeed,
      setError,
      onCreateWallet
    } = this;
    const { mnemonic, error } = this.service._state.context;
    const { decodeSeed } = this.props;
    let component, text;

    switch (current.value) {
      case "newWallet":
        component = h(CopySeed, { sendBack, sendContinue, mnemonic });
        break;
      case "confirmSeed":
        component = h(ConfirmSeed, {
          mnemonic,
          sendBack,
          setPassPhrase,
          onCreateWallet,
          isValid,
          decodeSeed,
          setSeed,
          setError
        });
        break;
      case "writeSeed":
        component = h(ExistingSeed, {
          sendBack,
          decodeSeed,
          sendContinue,
          setSeed,
          setPassPhrase,
          onCreateWallet,
          isValid,
          setError,
          error
        });
        break;
      case "creatingWallet": {
        // If we already have rendered a component, get the last StateComponent
        // and re-render it with all its props and isCreatingWallet props as true.
        // Render DecredLoading, otherwise.
        const c = this.state.StateComponent
          ? this.state.StateComponent.type
          : DecredLoading;
        const props = this.state.StateComponent
          ? { ...this.state.StateComponent.props }
          : {};
        component = h(c, { ...props, isCreatingWallet: true });
        break;
      }
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
    const { createWalletRequest } = this.props;
    const { isNew } = this.state;
    const pubpass = ""; // Temporarily disabled?
    const { seed, passPhrase } = this.service._state.context;

    if (!(seed && passPhrase)) return;
    createWalletRequest(pubpass, passPhrase, seed, isNew)
      .then(() => this.sendContinue())
      .catch((error) => this.sendEvent({ type: "ERROR", error }));
    // we send a continue so we go to creatingWallet state
    this.sendContinue();
  }

  onCreateWatchOnly() {
    const { createWatchOnlyWalletRequest, walletMasterPubKey } = this.props;
    createWatchOnlyWalletRequest(walletMasterPubKey)
      .then(() => this.sendContinue())
      .catch((error) => this.sendEvent({ type: "ERROR", error }));
    // we send a continue so we go to creatingWallet state
    this.sendContinue();
  }

  setError(error) {
    this.service.send({ type: "VALIDATE_DATA", error });
  }

  setSeed(seed) {
    const { passPhrase, error } = this.machine.context;
    this.service.send({ type: "VALIDATE_DATA", seed, passPhrase, error });
  }

  setPassPhrase(passPhrase) {
    const { seed, error } = this.machine.context;
    this.service.send({ type: "VALIDATE_DATA", passPhrase, seed, error });
  }

  checkIsValid() {
    const { seed, passPhrase } = this.service._state.context;
    // We validate our seed and passphrase at their specific components
    // So if they are set at the machine it means they have passed validation.
    if (!seed || !passPhrase) return this.setState({ isValid: false });
    if (seed.length === 0) return this.setState({ isValid: false });
    if (passPhrase.length === 0) return this.setState({ isValid: false });

    return this.setState({ isValid: true });
  }

  render() {
    const {
      getDaemonSynced,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      isTestNet
    } = this.props;
    const { StateComponent, walletHeader } = this.state;
    return (
      <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
        <Page
          {...{
            StateComponent,
            getCurrentBlockCount,
            getNeededBlocks,
            getEstimatedTimeLeft,
            getDaemonSynced,
            walletHeader
          }}
        />
      </div>
    );
  }
}

export default injectIntl(withRouter(createWallet(CreateWallet)));
