import { WalletSelectionFormBody } from "./Form";
import { createWallet } from "connectors";

@autobind
class WalletSelectionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      editWallets: false,
      createNewWallet: true,
      createWalletForm: false,
      newWalletName: "",
      selectedWallet: this.props.availableWallets ? this.props.availableWallets[0] : null,
      hasFailedAttempt: false,
      isWatchOnly: false,
      walletMasterPubKey: "",
      masterPubKeyError: false,
      walletNameError: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.availableWallets && this.props.availableWallets.length !== nextProps.availableWallets.length) {
      this.setState({ selectedWallet: nextProps.availableWallets[0] });
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const {
      getDaemonSynced,
      maxWalletCount,
      isSPV
    } = this.props;
    const {
      onChangeAvailableWallets,
      startWallet,
      createWallet,
      onChangeCreateWalletName,
      showCreateWalletForm,
      hideCreateWalletForm,
      onEditWallets,
      onCloseEditWallets,
      toggleWatchOnly,
      onChangeCreateWalletMasterPubKey,
    } = this;
    const {
      selectedWallet,
      sideActive,
      newWalletName,
      newWalletNetwork,
      createWalletForm,
      createNewWallet,
      editWallets,
      hasFailedAttemptName,
      hasFailedAttemptPubKey,
      isWatchOnly,
      walletMasterPubKey,
      masterPubKeyError,
      walletNameError,
    } = this.state;
    return (
      <WalletSelectionFormBody
        {...{
          sideActive,
          onChangeAvailableWallets,
          onChangeCreateWalletName,
          startWallet,
          createWallet,
          createWalletForm,
          createNewWallet,
          showCreateWalletForm,
          hideCreateWalletForm,
          selectedWallet,
          newWalletName,
          hasFailedAttemptName,
          hasFailedAttemptPubKey,
          newWalletNetwork,
          onEditWallets,
          onCloseEditWallets,
          editWallets,
          networkSelected: newWalletNetwork == "mainnet",
          getDaemonSynced,
          toggleWatchOnly,
          isWatchOnly,
          onChangeCreateWalletMasterPubKey,
          walletMasterPubKey,
          masterPubKeyError,
          walletNameError,
          maxWalletCount,
          isSPV,
          ...this.props,
          ...this.state,
        }}
      />
    );
  }
  onEditWallets() {
    this.setState({ editWallets: true });
  }
  onCloseEditWallets() {
    this.setState({ editWallets: false });
  }
  showCreateWalletForm(createNewWallet) {
    this.setState({ createNewWallet, createWalletForm: true });
  }
  hideCreateWalletForm(createNewWallet) {
    this.setState({ hasFailedAttemptName: false, hasFailedAttemptPubKey: false, createNewWallet, createWalletForm: false });
  }
  onChangeAvailableWallets(selectedWallet) {
    this.setState({ selectedWallet });
  }
  onChangeCreateWalletName(newWalletName) {
    const { availableWallets } = this.props;
    this.setState({ hasFailedAttemptName: true });
    var nameAvailable = true;
    for (var i = 0; i < availableWallets.length; i++) {
      if (newWalletName == availableWallets[i].value.wallet) {
        nameAvailable = false;
        this.setState({ walletNameError: true });
      }
    }
    if (nameAvailable) {
      this.setState({ walletNameError: false });
    }
    this.setState({ newWalletName });
  }
  createWallet() {
    const { newWalletName, createNewWallet,
      isWatchOnly, masterPubKeyError, walletMasterPubKey, walletNameError } = this.state;
    if (newWalletName == "" || walletNameError) {
      this.setState({ hasFailedAttemptName: true });
      return;
    }
    if (isWatchOnly) {
      if (masterPubKeyError || !walletMasterPubKey) {
        this.setState({ hasFailedAttemptPubKey: true });
        return;
      }
    }
    this.props.onCreateWallet(
      createNewWallet,
      { label: newWalletName, value: { wallet: newWalletName } });
  }
  toggleWatchOnly() {
    const { isWatchOnly } = this.state;
    this.setState({ isWatchOnly : !isWatchOnly });
  }
  async onChangeCreateWalletMasterPubKey(walletMasterPubKey) {
    if (walletMasterPubKey === "") {
      this.setState({ hasFailedAttemptPubKey: true });
    }
    const { isValid } = await this.props.validateMasterPubKey(walletMasterPubKey);
    if (!isValid) {
      this.setState({ masterPubKeyError: true });
    } else {
      this.setState({ masterPubKeyError: false });
    }
    this.setState({ walletMasterPubKey });
  }
  startWallet() {
    this.props.onStartWallet(this.state.selectedWallet);
  }
  resetState() {
    this.setState(this.getInitialState());
  }

}

export default createWallet(WalletSelectionBody);
