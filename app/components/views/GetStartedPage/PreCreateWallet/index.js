import CreateWalletForm from "./CreateWalletForm";
import { substruct } from "fp";
import { daemonStartup } from "connectors";
import { injectIntl } from "react-intl";

@autobind
class PreCreateWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      maxWalletCount,
      isSPV,
      availableWallets,
      getDaemonSynced,
      onShowTrezorConfig,
      isCreateNewWallet,
      creatingWallet
    } = this.props;
    const {
      newWalletName,
      editWallets,
      hasFailedAttemptName,
      hasFailedAttemptPubKey,
      isWatchingOnly,
      walletMasterPubKey,
      masterPubKeyError,
      walletNameError
    } = this.state;
    return (
      <CreateWalletForm
        {...{
          selectedWallet: availableWallets[0],
          availableWallets,
          isCreateNewWallet,
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
          onShowTrezorConfig,
          creatingWallet,
          ...this.props,
          ...this.state,
          ...substruct(
            {
              onChangeAvailableWallets: null,
              createWallet: null,
              onChangeCreateWalletName: null,
              showCreateWalletForm: null,
              hideCreateWalletForm: null,
              toggleWatchOnly: null,
              onChangeCreateWalletMasterPubKey: null,
              toggleTrezor: null
            },
            this
          )
        }}
      />
    );
  }

  hideCreateWalletForm() {
    if (this.state.isTrezor) {
      this.props.trezorDisable();
    }
    this.props.onSendBack();
  }

  onChangeCreateWalletName(newWalletName) {
    const { availableWallets } = this.props;
    this.setState({ hasFailedAttemptName: true });
    let nameAvailable = true;
    // replace all special path symbols
    newWalletName = newWalletName.replace(/[/\\.;:~]/g, "");
    for (let i = 0; i < availableWallets.length; i++) {
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
    const {
      newWalletName,
      isWatchingOnly,
      masterPubKeyError,
      walletMasterPubKey,
      walletNameError,
      isTrezor
    } = this.state;
    const { isTestNet, onSendContinue, isCreateNewWallet } = this.props;

    const walletSelected = {
      label: newWalletName,
      value: {
        wallet: newWalletName,
        isWatchingOnly,
        isTrezor,
        isNew: isCreateNewWallet,
        network: isTestNet ? "testnet" : "mainnet"
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
    // onSendContinue action so getStartedStateMachine can go to
    // creatingWallet state.
    onSendContinue();
    if (isTrezor) {
      walletSelected.watchingOnly = true;
      return this.props
        .trezorGetWalletCreationMasterPubKey()
        .then(() =>
          this.props
            .onCreateWallet(walletSelected)
            .then(() => this.props.onShowCreateWallet(isCreateNewWallet))
        );
    }

    return this.props
      .onCreateWallet(walletSelected)
      .then(() => this.props.onShowCreateWallet(isCreateNewWallet))
      .catch((error) => this.props.onSendError(error));
  }

  toggleWatchOnly() {
    const { isWatchingOnly } = this.state;
    this.setState({ isWatchingOnly: !isWatchingOnly, isTrezor: false });
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
    const { isValid } = await this.props.validateMasterPubKey(
      walletMasterPubKey
    );
    if (!isValid) {
      this.setState({ masterPubKeyError: true });
    } else {
      this.setState({ masterPubKeyError: false });
    }
    this.setState({ walletMasterPubKey });
  }
}

export default injectIntl(daemonStartup(PreCreateWallet));
