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
      onChangeCreateWalletNetwork
    } = this;
    const {
      selectedWallet,
      sideActive,
      newWalletName,
      newWalletNetwork,
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
          selectedWallet,
          newWalletName,
          newWalletNetwork,
          ...this.props,
          ...this.state,
        }}
      />
    );
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
