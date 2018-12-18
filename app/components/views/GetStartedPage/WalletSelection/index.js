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
      isWatchingOnly: false,
      walletMasterPubKey: "",
      masterPubKeyError: false,
      walletNameError: null,
      isTrezor: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.selectedWallet && this.props.availableWallets.length === 0) {
      this.setState({ selectedWallet: null });
    } else if (prevProps.availableWallets.length !== this.props.availableWallets.length) {
      this.setState({ selectedWallet: this.props.availableWallets[0] });
    } else {
      for (var i = 0; i < prevProps.availableWallets.length; i++) {
        if (this.props.availableWallets[i].label !== prevProps.availableWallets[i].label) {
          this.setState({ selectedWallet: this.props.availableWallets[0] });
          break;
        }
      }
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
      toggleTrezor,
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
      isWatchingOnly,
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
          isWatchingOnly,
          onChangeCreateWalletMasterPubKey,
          walletMasterPubKey,
          masterPubKeyError,
          walletNameError,
          maxWalletCount,
          isSPV,
          toggleTrezor,
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
  hideCreateWalletForm() {
    if (this.state.isTrezor) {
      this.props.trezorDisable();
    }

    this.setState({ hasFailedAttemptName: false,
      hasFailedAttemptPubKey: false,
      createWalletForm: false,
      newWalletName: "",
      isWatchingOnly: false,
      isTrezor: false,
      walletMasterPubKey: "",
    });
  }
  onChangeAvailableWallets(selectedWallet) {
    this.setState({ selectedWallet });
  }
  onChangeCreateWalletName(newWalletName) {
    const { availableWallets } = this.props;
    this.setState({ hasFailedAttemptName: true });
    var nameAvailable = true;
    // replace all special path symbols
    newWalletName = newWalletName.replace(/[/\\.;:~]/g, "");
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
      isWatchingOnly, masterPubKeyError, walletMasterPubKey, walletNameError,
      isTrezor } = this.state;
    if (newWalletName == "" || walletNameError) {
      this.setState({ hasFailedAttemptName: true });
      return;
    }
    if (isWatchingOnly) {
      if (masterPubKeyError || !walletMasterPubKey) {
        this.setState({ hasFailedAttemptPubKey: true });
        return;
      }
    }
    if (isTrezor && !this.props.trezorDevice) {
      this.props.trezorAlertNoConnectedDevice();
      return;
    }
    if (isTrezor) {
      this.props.trezorGetWalletCreationMasterPubKey()
        .then(() => {
          this.props.onCreateWallet(
            createNewWallet,
            { label: newWalletName, value: { wallet: newWalletName,
              watchingOnly: true, isTrezor } } );
        });
    } else {
      this.props.onCreateWallet(
        createNewWallet,
        { label: newWalletName, value: { wallet: newWalletName,
          watchingOnly: isWatchingOnly, isTrezor } } );
    }
  }
  toggleWatchOnly() {
    const { isWatchingOnly } = this.state;
    this.setState({ isWatchingOnly : !isWatchingOnly, isTrezor: false });
  }
  toggleTrezor() {
    const isTrezor = !this.state.isTrezor;
    this.setState({ isTrezor, isWatchingOnly: false });
    if (isTrezor) {
      this.props.trezorEnable();
    } else {
      this.props.trezorDisable();
    }
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
