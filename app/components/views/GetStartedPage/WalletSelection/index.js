import { WalletSelectionFormBody } from "./Form";
import { substruct } from "fp";

@autobind
class WalletSelectionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editWallets: false,
      isCreateNewWallet: false,
      isCreatingOrRestoring: false,
      newWalletName: "",
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
      newWalletName, isCreateNewWallet, isCreatingOrRestoring, editWallets, hasFailedAttemptName,
      hasFailedAttemptPubKey, isWatchingOnly, walletMasterPubKey, masterPubKeyError, walletNameError
    } = this.state;
    return (
      <WalletSelectionFormBody
        {...{
          selectedWallet: availableWallets[0],
          submitChosenWallet,
          availableWallets,
          isCreateNewWallet,
          isCreatingOrRestoring,
          newWalletName,
          hasFailedAttemptName,
          hasFailedAttemptPubKey,
          editWallets,
          getDaemonSynced,
          isWatchingOnly,
          walletMasterPubKey,
          masterPubKeyError,
          walletNameError,
          maxWalletCount,
          isSPV,
          ...this.props,
          ...this.state,
          ...substruct({
            onChangeAvailableWallets: null,
            createWallet: null,
            onChangeCreateWalletName: null,
            showCreateWalletForm: null,
            hideCreateWalletForm: null,
            toggleWatchOnly: null,
            onChangeCreateWalletMasterPubKey: null,
            toggleTrezor: null,
            onToggleEditWallet: null
          }, this)
        }}
      />
    );
  }
  onToggleEditWallet() {
    this.setState({ editWallets: !this.state.editWallets })
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
      value: {
        wallet: newWalletName, isWatchingOnly, isTrezor, isNew: isCreateNewWallet,
        walletMasterPubKey, network: isTestNet ? "testnet" : "mainnet"
      }
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
}

export default WalletSelectionBody;
