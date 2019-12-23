import CreateWalletForm from "./CreateWalletForm";
import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { interpret } from "xstate";
import { CreateWalletMachine } from "./CreateWalletStateMachine";
import Page from "./Page"
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";

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
      showCopySeedConfirm: false,
    };
  }

  componentDidMount() {
    this.service.start();
    const { isNew } = this.props.match.params;
    this.service.send({ type: "CREATE_WALLET", isNew })
    this.getStateComponent();
  }

  getStateComponent() {
    const { current } = this.state;
    let component, text;

    switch(current.value) {
    case "newWallet":
      component = CopySeed;
      break;
    }

    return this.setState({ StateComponent: component, text });
  }

  sendEvent(data) {
    const { send } = this.service;
    const { type, payload } = data;
    send({ type, payload });
  }

  render() {
    const { onReturnToNewSeed, onReturnToWalletSelection, onSetWalletPrivatePassphrase,
      getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, isTestNet, intl
    } = this.props;

    const { sendEvent } = this;
    const { StateComponent, mnemonic, showCopySeedConfirm } = this.state;
    return <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
      <Page {...{ StateComponent, sendEvent, mnemonic, showCopySeedConfirm
      }}/>
    </div>
  }
}

export default injectIntl(withRouter(CreateWallet));
