import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { interpret } from "xstate";
import { CreateWalletMachine } from "./CreateWalletStateMachine";
import Page from "./Page"
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";
import ConfirmSeed from "./ConfirmSeed";
import { createWallet } from "connectors";
import { createElement as h, cloneElement as k } from "react";

@autobind
class CreateWallet extends React.Component {
  service;
  constructor(props) {
    super(props);
    this.machine = CreateWalletMachine({});
    this.service = interpret(this.machine).onTransition(current => {
      this.setState({ current }, this.getStateComponent);
    });
    this.state = {
      current: CreateWalletMachine().initialState,
      StateComponent: null,
      mnemonic: "",
      seed: "",
      passPhrase: "",
      isNew: "",
    };
  }

  componentDidMount() {
    this.service.start();
    const { isNew } = this.props.match.params;
    const { isCreatingWatchingOnly, masterPubKey } = this.props;
    this.setState({ isNew });
    if (isCreatingWatchingOnly && masterPubKey) {
      this.props.createWatchOnlyWalletRequest(masterPubKey);
      return;
    }
    if (isNew) {
      this.props.generateSeed().then(response => this.setState({
        mnemonic: response.getSeedMnemonic(),
        seed: this.props.isTestNet ? response.getSeedBytes() : null // Allows verification skip in dev
      }, this.getStateComponent ));
    }
    this.service.send({ type: "CREATE_WALLET", isNew })
  }

  getStateComponent() {
    const { current } = this.state;
    const { sendBack, sendContinue, onCreateWallet, setPassPhrase, setSeed, isValid } = this;
    const { mnemonic } = this.state;
    const { decodeSeed } = this.props;
    let component, text;

    switch(current.value) {
    case "newWallet":
      component = h(CopySeed, { sendBack, sendContinue, mnemonic });
      break;
    case "confirmSeed":
      component = h(ConfirmSeed, { mnemonic, sendBack, decodeSeed, onCreateWallet, setPassPhrase, setSeed, isValid });
      break;
    case "finished":
      this.service.stop();
      this.props.goBackToWalletSelection();
    }

    return this.setState({ StateComponent: component, text });
  }

  sendEvent(data) {
    const { send } = this.service;
    const { type, payload } = data;
    send({ type, payload });
  }

  sendContinue() {
    this.sendEvent({ type: "CONTINUE" });
  }

  sendBack() {
    this.sendEvent({ type: "BACK" });
  }

  render() {
    const { decodeSeed, onReturnToWalletSelection, onSetWalletPrivatePassphrase,
      getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, isTestNet, intl
    } = this.props;

    const { StateComponent } = this.state;
    return <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
        <Page {...{ StateComponent }}/>
      </div>
  }

  onCreateWallet() {
    const {
      createWalletRequest,
      onSetWalletPrivatePassphrase
    } = this.props;
    const { seed, passPhrase, isNew } = this.state;
    const pubpass = ""; // Temporarily disabled?

    if (!(seed && passPhrase)) return;
    createWalletRequest(pubpass, passPhrase, seed, isNew);
    isNew && onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    this.sendContinue();
    this.props.backToCredentials();
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }

  setSeed(seed) {
    this.setState({ seed });
  }

  isValid() {
    const { seed, passPhrase } = this.state;
    return !!(seed && passPhrase);
  }
}

export default injectIntl(withRouter(createWallet(CreateWallet)));
