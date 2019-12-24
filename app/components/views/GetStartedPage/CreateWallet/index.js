import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { interpret } from "xstate";
import { CreateWalletMachine } from "./CreateWalletStateMachine";
import Page from "./Page"
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";
import ContinueWalletCreation from "./ContinueWalletCreation";
import { createWallet } from "connectors";

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
    };
  }

  componentDidMount() {
    this.service.start();
    const { isNew } = this.props.match.params;
    const { isCreatingWatchingOnly, masterPubKey } = this.props;
    if (isCreatingWatchingOnly && masterPubKey) {
      this.props.createWatchOnlyWalletRequest(masterPubKey);
      return;
    }
    if (isNew) {
      this.generateSeed();
    }
    this.service.send({ type: "CREATE_WALLET", isNew })
  }

  getStateComponent() {
    const { current } = this.state;
    let component, text;

    switch(current.value) {
    case "newWallet":
      component = CopySeed;
      break;
    case "confirmSeed":
      component = ContinueWalletCreation;
      break;
    }

    return this.setState({ StateComponent: component, text });
  }

  sendEvent(data) {
    const { send } = this.service;
    const { type, payload } = data;
    send({ type, payload });
  }

  sendContinue() {
    this.sendEvent({ type: "CONTINUE" })
  }

  generateSeed() {
    return this.props.generateSeed().then(response => this.setState({
      mnemonic: response.getSeedMnemonic(),
      seed: this.props.isTestNet ? response.getSeedBytes() : null // Allows verification skip in dev
    }));
  }

  onCreateWallet() {
    const {
      createWalletExisting,
      createWalletRequest,
      onSetWalletPrivatePassphrase
    } = this.props;
    const { seed, passPhrase } = this.state;
    const pubpass = ""; // Temporarily disabled?

    if (!this.isValid()) return;
    createWalletRequest(pubpass, passPhrase, seed, !!createWalletExisting);
    !!createWalletExisting && onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
  }

  isValid() {
    const { seed, passPhrase } = this.state;
    return !!(seed && passPhrase);
  }

  render() {
    const { onReturnToNewSeed, onReturnToWalletSelection, onSetWalletPrivatePassphrase,
      getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, isTestNet, intl
    } = this.props;

    const { sendEvent, sendContinue } = this;
    const { StateComponent, mnemonic, showCopySeedConfirm } = this.state;
    return <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
      <Page {...{ StateComponent, sendEvent, mnemonic, showCopySeedConfirm, sendContinue
      }}/>
    </div>
  }
}

export default injectIntl(withRouter(createWallet(CreateWallet)));
