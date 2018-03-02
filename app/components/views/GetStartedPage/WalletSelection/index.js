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
  onChangeCreateWalletNetwork() {
    const { newWalletNetwork } = this.state;
    var updatedNetwork = newWalletNetwork;
    if (newWalletNetwork == "mainnet") {
      updatedNetwork = "testnet";
    } else if (newWalletNetwork == "testnet") {
      updatedNetwork = "mainnet";
    }
    this.setState({ newWalletNetwork: updatedNetwork });
  }
  createWallet() {
    const { newWalletName, newWalletNetwork } = this.state;
    if (newWalletName == "" || (newWalletNetwork !== "mainnet" && newWalletNetwork !== "testnet")) {
      return;
    }
    this.props.onCreateWallet({
      label: newWalletName + " (" + newWalletNetwork + ")",
      network: newWalletNetwork,
      value: { wallet: newWalletName, network: newWalletNetwork
      } });
  }
  startWallet() {
    this.props.onStartWallet(this.state.selectedWallet);
  }
  resetState() {
    this.setState(this.getInitialState());
  }

}

export { WalletSelectionBody };
