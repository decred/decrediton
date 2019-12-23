import CreateWalletForm from "./CreateWalletForm";
import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { interpret } from "xstate";
import { CreateWalletMachine } from "./CreateWalletStateMachine";

@autobind
class CreateWallet extends React.Component {
  service;
  constructor(props) {
    super(props);
    // const {
    //   onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, onGetAvailableWallets,
    //   onStartDaemon, setSelectedWallet, goToError
    // } = this.props;
    // const { sendEvent, preStartDaemon } = this;
    this.machine = CreateWalletMachine({
      // onConnectDaemon, checkNetworkMatch, syncDaemon, onStartWallet, onRetryStartRPC, sendEvent, onGetAvailableWallets,
      // onStartDaemon, setSelectedWallet, preStartDaemon, goToError
    });
    this.service = interpret(this.machine).onTransition(current => {
      this.setState({ current });
    });
    this.state = {
      current: CreateWalletMachine().initialState,
      StateComponent: null,
    };
  }

  componentDidMount() {
    this.service.start();
    // this.getStateComponent();
  }

  render() {
    const { onReturnToNewSeed, onReturnToWalletSelection, onSetWalletPrivatePassphrase,
      getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, isTestNet, intl
    } = this.props;
    return <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
      <CreateWalletForm {...{
        intl,
        onReturnToNewSeed,
        onReturnToWalletSelection,
        getCurrentBlockCount,
        getNeededBlocks,
        getEstimatedTimeLeft,
        onSetWalletPrivatePassphrase
      } }/>
    </div>
  }
}

export default injectIntl(CreateWallet);
