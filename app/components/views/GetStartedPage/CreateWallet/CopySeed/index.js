import CopySeed from "./Page";
import { createWallet } from "connectors";

@autobind
class CreateWalletForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCopySeedConfirm: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.decodeSeedError !== this.props.decodeSeedError) {
      this.setState({ seedError: this.props.decodeSeedError });
    }
  }

  handleCopySeed() {
    this.setState({ showCopySeedConfirm: true });
  }

  onSubmitCopySeedConfirm() {
    const { mnemonic } = this.state;
    this.setState({ showCopySeedConfirm: false });
    this.props.copySeedToClipboard(mnemonic);
  }

  onCancelCopySeedConfirm() {
    this.setState({ showCopySeedConfirm: false });
  }
  render() {
    const {
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      getDaemonSynced,
      sendContinue,
      mnemonic,
    } = this.props;
    const {
      handleCopySeed,
      onSubmitCopySeedConfirm,
      onCancelCopySeedConfirm
    } = this;
    const { showCopySeedConfirm } = this.state;

//   onReturnToWalletSelection,

    return <CopySeed {...{
        mnemonic,
        handleCopySeed,
        showCopySeedConfirm,
        onSubmitCopySeedConfirm,
        onCancelCopySeedConfirm,
        getCurrentBlockCount,
        getNeededBlocks,
        getEstimatedTimeLeft,
        getDaemonSynced,
        sendContinue
      }}
     />

  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
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
}

export default createWallet(CreateWalletForm);
