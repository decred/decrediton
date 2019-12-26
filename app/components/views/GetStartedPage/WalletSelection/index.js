import { WalletSelectionFormBody } from "./Form";
import { walletStartup } from "connectors";

@autobind
class WalletSelectionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editWallets: false,
      isCreateNewWallet: false,
      isCreatingOrRestoring: false,
      newWalletName: "",
      hasFailedAttempt: false,
      isWatchingOnly: false,
      walletMasterPubKey: "",
      masterPubKeyError: false,
      walletNameError: null,
      isTrezor: false
    };
  }

  render() {
    const {
      maxWalletCount, isSPV, availableWallets, getDaemonSynced, submitChosenWallet
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
      toggleTrezor
    } = this;
    const {
      newWalletName,
      isCreateNewWallet,
      isCreatingOrRestoring,
      editWallets,
      hasFailedAttemptName,
      hasFailedAttemptPubKey,
      isWatchingOnly,
      walletMasterPubKey,
      masterPubKeyError,
      walletNameError
    } = this.state;
    return (
      <WalletSelectionFormBody
        {...{
          onChangeAvailableWallets,
          onChangeCreateWalletName,
          selectedWallet: availableWallets[0],
          submitChosenWallet,
          availableWallets,
          startWallet,
          createWallet,
          isCreateNewWallet,
          isCreatingOrRestoring,
          showCreateWalletForm,
          hideCreateWalletForm,
          newWalletName,
          hasFailedAttemptName,
          hasFailedAttemptPubKey,
          onEditWallets,
          onCloseEditWallets,
          editWallets,
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
          ...this.state
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
  showCreateWalletForm(isCreateNewWallet) {
    this.setState({ isCreatingOrRestoring: true, isCreateNewWallet });
  }
  hideCreateWalletForm() {
    if (this.state.isTrezor) {
      this.props.trezorDisable();
    }
    this.setState({ hasFailedAttemptName: false,
      hasFailedAttemptPubKey: false,
      isCreateNewWallet: false,
      isCreatingOrRestoring: false,
      newWalletName: "",
      isWatchingOnly: false,
      isTrezor: false,
      walletMasterPubKey: ""
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
    const { newWalletName, isWatchingOnly, masterPubKeyError, walletMasterPubKey,
      walletNameError, isTrezor, isCreateNewWallet } = this.state;
    const { isTestNet } = this.props;

    const walletSelected = {
      label: newWalletName,
      value: { wallet: newWalletName, isWatchingOnly, isTrezor, network: isTestNet ? "testnet" : "mainnet" }
    };

    if (newWalletName === "" || walletNameError) {
      this.setState({ hasFailedAttemptName: true });
      return;
    }
    if (isWatchingOnly && (masterPubKeyError || !walletMasterPubKey)) {
      this.setState({ hasFailedAttemptPubKey: true });
      return;
    }
    if (isTrezor && !this.props.trezorDevice) {
      this.props.trezorAlertNoConnectedDevice();
      return;
    }
    if (isTrezor) {
      walletSelected.watchingOnly = true;
      return this.props.trezorGetWalletCreationMasterPubKey().then(() =>
        this.props.onCreateWallet(walletSelected));
    }

    if (!isCreateNewWallet) {
      this.props.isCreateNewWallet(true);
    }

    return this.props.onCreateWallet(walletSelected)
      .then(() => this.props.onShowCreateWallet(isCreateNewWallet));
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
    this.props.onStartWallet(this.props.selectedWallet);
  }
  resetState() {
    this.setState(this.getInitialState());
  }
}

export default walletStartup(WalletSelectionBody);
