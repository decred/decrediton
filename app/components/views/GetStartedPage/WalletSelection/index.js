import {
  WalletSelectionFormBody
} from "./Form";

@autobind
class WalletSelectionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      createWalletForm: false,
      newWalletName: "",
      newWalletNetwork: "mainnet",
      selectedWallet: this.props.availableWallets ? this.props.availableWallets[0] : null
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
      onChangeAvailableWallets,
      startWallet,
      createWallet,
      onChangeCreateWalletName,
      onChangeCreateWalletNetwork,
      showCreateWalletForm,
      hideCreateWalletForm
    } = this;
    const {
      selectedWallet,
      sideActive,
      newWalletName,
      newWalletNetwork,
      createWalletForm,
    } = this.state;
    return (
      <WalletSelectionFormBody
        {...{
          sideActive,
          onChangeAvailableWallets,
          onChangeCreateWalletName,
          onChangeCreateWalletNetwork,
          startWallet,
          createWallet,
          createWalletForm,
          showCreateWalletForm,
          hideCreateWalletForm,
          selectedWallet,
          newWalletName,
          newWalletNetwork,
          networkSelected: newWalletNetwork == "mainnet",
          ...this.props,
          ...this.state,
        }}
      />
    );
  }

  showCreateWalletForm() {
    this.setState({ createWalletForm: true });
  }
  hideCreateWalletForm() {
    this.setState({ createWalletForm: false });
  }
  onChangeAvailableWallets(selectedWallet) {
    this.setState({ selectedWallet });
  }
  onChangeCreateWalletName(newWalletName) {
    this.setState({ newWalletName });
  }
  createWallet() {
    const { newWalletName } = this.state;
    if (newWalletName == "" ) {
      return;
    }
    this.props.onCreateWallet({
      label: newWalletName,
      value: { wallet: newWalletName } });
  }
  startWallet() {
    this.props.onStartWallet(this.state.selectedWallet);
  }
  resetState() {
    this.setState(this.getInitialState());
  }

}

export { WalletSelectionBody };
