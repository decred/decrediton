import { trezor } from "connectors";
import PinModal from "./PinModal";
import PassPhraseModal from "./PassPhraseModal";
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
    if (this.props.waitingForPin) {
      return <PinModal
        {...this.props}
        onCancelModal={this.onCancelModal}
      />;
    } else if (this.props.waitingForPassPhrase) {
      return <PassPhraseModal
        {...this.props}
        onCancelModal={this.onCancelModal}
      />;
    } else if (this.props.waitingForWord) {
      return <WordModal
        {...this.props}
        onCancelModal={this.onCancelModal}
      />;
    } else {
      return null;
    }
  }
}

const TrezorModalsOrNone = ({ isTrezor, ...props }) =>
  isTrezor ? <TrezorModals {...props} /> : null;

export default trezor(TrezorModalsOrNone);
