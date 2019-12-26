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
    const { backToCredentials, cancelCreateWallet } = props;
    this.machine = CreateWalletMachine({ backToCredentials, cancelCreateWallet });
    this.service = interpret(this.machine).onTransition(current => {
      this.setState({ current }, this.getStateComponent);
    });
    this.state = {
      current: this.machine.initialState,
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
    if (isNew === "true") {
      this.props.generateSeed().then(response => this.setState({
        mnemonic: response.getSeedMnemonic(),
        seed: this.props.isTestNet ? response.getSeedBytes() : null // Allows verification skip in dev
      }, this.getStateComponent ));
    }
    this.service.send({ type: "CREATE_WALLET", isNew });
    this.service.send({ type: "RESTORE_WALLET", isNew });
    this.setState({ isNew });
  }

  componentWillUnmount() {
    this.service.stop();
  }

  async getStateComponent() {
    const { current, isNew } = this.state;
    const { sendBack, sendContinue } = this;
    const { mnemonic } = this.state;
    const { decodeSeed, createWalletRequest, onSetWalletPrivatePassphrase } = this.props;
    let component, text;

    switch(current.value) {
    case "newWallet":
      component = h(CopySeed, { sendBack, sendContinue, mnemonic });
      break;
    case "confirmSeed":
      component = h(ConfirmSeed, {
        mnemonic, sendBack, decodeSeed, sendContinue, isNew, createWalletRequest, onSetWalletPrivatePassphrase
      });
      break;
    case "writeSeed":
      component = h(ExistingSeed, {
        mnemonic, sendBack, decodeSeed, sendContinue, isNew, createWalletRequest, onSetWalletPrivatePassphrase
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
