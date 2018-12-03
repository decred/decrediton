import { trezor } from "connectors";
import PinModal from "./PinModal";
import PassPhraseModal from "./PassPhraseModal";
import WalletCreationPassPhraseModal from "./WalletCreationPassPhraseModal";
import WordModal from "./WordModal";
import "style/Trezor.less";

@autobind
class TrezorModals extends React.Component {
  constructor(props) {
    super(props);
  }

  onCancelModal() {
    this.props.cancelCurrentOperation();
  }

  render() {
    let Component = null;

    if (this.props.waitingForPin) {
      Component = PinModal;
    } else if (this.props.waitingForPassPhrase) {
      if (this.props.walletCreationMasterPubkeyAttempt) {
        Component = WalletCreationPassPhraseModal;
      } else {
        Component = PassPhraseModal;
      }
    } else if (this.props.waitingForWord) {
      Component = WordModal;
    }

    if (!Component) return null;
    return (
      <Component
        {...this.props}
        onCancelModal={this.onCancelModal}
      />
    );
  }
}

const TrezorModalsOrNone = ({ isTrezor, ...props }) =>
  isTrezor ? <TrezorModals {...props} /> : null;

export default trezor(TrezorModalsOrNone);
