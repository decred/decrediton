import { WalletSelectionFormBody } from "./Form";
import { substruct } from "fp";
import { daemonStartup } from "connectors";

@autobind
class WalletSelectionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editWallets: false
    };
  }

  render() {
    const {
      maxWalletCount,
      isSPV,
      availableWallets,
      getDaemonSynced,
      submitChosenWallet,
      creatingWallet
    } = this.props;
    const { editWallets } = this.state;
    return (
      <WalletSelectionFormBody
        {...{
          selectedWallet: availableWallets[0],
          submitChosenWallet,
          availableWallets,
          editWallets,
          getDaemonSynced,
          maxWalletCount,
          isSPV,
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
              toggleTrezor: null,
              onToggleEditWallet: null
            },
            this
          )
        }}
      />
    );
  }
  onToggleEditWallet() {
    this.setState({ editWallets: !this.state.editWallets });
  }

  showCreateWalletForm(isCreateNewWallet) {
    this.props.onSendCreateWallet(isCreateNewWallet);
  }

  onChangeAvailableWallets(selectedWallet) {
    this.setState({ selectedWallet });
  }
}

export default daemonStartup(WalletSelectionBody);
