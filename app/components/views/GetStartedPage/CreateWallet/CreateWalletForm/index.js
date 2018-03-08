import ContinueWalletCreation from "./ContinueWalletCreation";
import CreateWallet from "./CreateWallet";
import { createWallet } from "connectors";

@autobind
class CreateWalletForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      mnemonic: "",
      seed: "",
      passPhrase: "",
      decode: null,
      showCopySeedConfirm: false,
    };
  }

  componentDidMount() {
    this.generateSeed();
  }

  componentWillUpdate(nextProps) {
    if (this.props.decodeSeedError !== nextProps.decodeSeedError) {
      this.setState({ seedError: nextProps.decodeSeedError });
    }
  }

  componentWillUnmount() {
    this.resetState();
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
      confirmNewSeed,
      createWalletExisting,
      createWalletConfirmNewSeed,
      onReturnToNewSeed,
      onReturnToExistingOrNewScreen,
      isCreatingWallet,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      getDaemonSynced,
    } = this.props;
    const {
      setSeed,
      setPassPhrase,
      onCreateWallet,
      handleCopySeed,
      onSubmitCopySeedConfirm,
      onCancelCopySeedConfirm,
    } = this;
    const { mnemonic, decode, showCopySeedConfirm } = this.state;
    const isValid = this.isValid();

    return (confirmNewSeed || createWalletExisting)
      ? (
        <ContinueWalletCreation
          {...{
            mnemonic: createWalletExisting ? null : mnemonic,
            setSeed,
            createWalletExisting,
            setPassPhrase,
            onCreateWallet,
            decode,
            isValid,
            onReturnToNewSeed,
            onReturnToExistingOrNewScreen,
            isCreatingWallet,
            getCurrentBlockCount,
            getNeededBlocks,
            getEstimatedTimeLeft,
            getDaemonSynced
          }}
        />
      ) : (
        <CreateWallet
          {...{
            mnemonic,
            isValid,
            createWalletConfirmNewSeed,
            handleCopySeed,
            showCopySeedConfirm,
            onSubmitCopySeedConfirm,
            onCancelCopySeedConfirm,
            onReturnToExistingOrNewScreen,
            getCurrentBlockCount,
            getNeededBlocks,
            getEstimatedTimeLeft,
            getDaemonSynced
          }}
        />
      );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  generateSeed() {
    return this.props.seedService.then(({ generate, decode }) =>
      generate().then(response => this.setState({
        decode,
        mnemonic: response.getSeedMnemonic(),
        seed: this.props.isTestNet ? response.getSeedBytes() : null // Allows verification skip in dev
      }))
    );
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
      createWalletRequest
    } = this.props;
    const { seed, passPhrase } = this.state;
    const pubpass = ""; // Temporarily disabled?

    if (!this.isValid()) return;
    createWalletRequest(pubpass, passPhrase, seed, !!createWalletExisting);
  }

  isValid() {
    const { seed, passPhrase } = this.state;
    return !!(seed && passPhrase);
  }
}

export default createWallet(CreateWalletForm);
