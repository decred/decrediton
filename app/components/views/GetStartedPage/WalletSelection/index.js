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
      getDaemonSynced
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
      hasFailedAttempt,
      isWatchOnly,
      walletMasterPubKey,
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
          hasFailedAttempt,
          newWalletNetwork,
          onEditWallets,
          onCloseEditWallets,
          editWallets,
          networkSelected: newWalletNetwork == "mainnet",
          getDaemonSynced,
          toggleWatchOnly,
          isWatchOnly,
          onChangeCreateWalletMasterPubKey,
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
    this.setState({ hasFailedAttempt: false, createNewWallet, createWalletForm: false });
  }
  onChangeAvailableWallets(selectedWallet) {
    this.setState({ selectedWallet });
  }
  onChangeCreateWalletName(newWalletName) {
    if (newWalletName == "") {
      this.setState({ hasFailedAttempt: true });
    }
    this.setState({ newWalletName });
  }
  createWallet() {
    const { newWalletName, createNewWallet } = this.state;
    if (newWalletName == "" ) {
      this.setState({ hasFailedAttempt: true });
      return;
    }
    this.props.onCreateWallet(
      createNewWallet,
      { label: newWalletName, value: { wallet: newWalletName } });
  }
  toggleWatchOnly() {
    const { isWatchOnly } = this.state
    this.setState({ isWatchOnly : !isWatchOnly })
  }
  async onChangeCreateWalletMasterPubKey(walletMasterPubKey) {
    if (walletMasterPubKey === "") {
      this.setState({ hasFailedAttempt: true });
    }
    const valid = await this.props.validateMasterPubKey(walletMasterPubKey)
    this.setState({ walletMasterPubKey })
  }
  startWallet() {
    this.props.onStartWallet(this.state.selectedWallet);
  }
  resetState() {
    this.setState(this.getInitialState());
  }

}

export default createWallet(WalletSelectionBody);
