import CopySeed from "./Page";
import { createWallet } from "connectors";

@autobind
class CreateWalletForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCopySeedConfirm: false
    };
  }

  handleCopySeed() {
    this.setState({ showCopySeedConfirm: true });
  }

  onSubmitCopySeedConfirm() {
    const { mnemonic } = this.props;
    this.setState({ showCopySeedConfirm: false });
    this.props.copySeedToClipboard(mnemonic);
  }

  onCancelCopySeedConfirm() {
    this.setState({ showCopySeedConfirm: false });
  }
  render() {
    const { sendContinue, mnemonic, sendBack } = this.props;
    const {
      handleCopySeed,
      onSubmitCopySeedConfirm,
      onCancelCopySeedConfirm
    } = this;
    const { showCopySeedConfirm } = this.state;

    return (
      <CopySeed
        {...{
          mnemonic,
          handleCopySeed,
          showCopySeedConfirm,
          onSubmitCopySeedConfirm,
          onCancelCopySeedConfirm,
          sendContinue,
          sendBack
        }}
      />
    );
  }
}

export default createWallet(CreateWalletForm);
