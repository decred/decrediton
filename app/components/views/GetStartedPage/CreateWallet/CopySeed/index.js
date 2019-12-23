import CopySeed from "./Page";
import { createWallet } from "connectors";

@autobind
class CreateWalletForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: "",
      seed: "",
      passPhrase: "",
      showCopySeedConfirm: false
    };
  }

  componentDidMount() {
    const { isCreatingWatchingOnly, masterPubKey } = this.props;
    if (isCreatingWatchingOnly && masterPubKey) {
      this.props.createWatchOnlyWalletRequest(masterPubKey);
      return;
    }
    this.generateSeed();
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
    } = this.props;
    const {
      handleCopySeed,
      onSubmitCopySeedConfirm,
      onCancelCopySeedConfirm
    } = this;
    const { mnemonic, showCopySeedConfirm } = this.state;
    const isValid = this.isValid();

    return <CopySeed {...{
        mnemonic,
        isValid,
        handleCopySeed,
        showCopySeedConfirm,
        onSubmitCopySeedConfirm,
        onCancelCopySeedConfirm,
        getCurrentBlockCount,
        getNeededBlocks,
        getEstimatedTimeLeft,
        getDaemonSynced
      }}
     />

  }

  generateSeed() {
    return this.props.generateSeed().then(response => this.setState({
      mnemonic: response.getSeedMnemonic(),
      seed: this.props.isTestNet ? response.getSeedBytes() : null // Allows verification skip in dev
    }));
  }

  setSeed(seed) {
    this.setState({ seed });
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
