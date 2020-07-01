import { useState } from "react";
import WalletSelectionForm from "./Form";
import { daemonStartup } from "connectors"; // XXX: custom hook,

const WalletSelectionBody = ({
  maxWalletCount,
  isSPV,
  availableWallets,
  getDaemonSynced,
  submitChosenWallet,
  creatingWallet,
  onSendCreateWallet
}) => {
  const [editWallets, setEditWallets] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(availableWallets[0]);

  const onToggleEditWallet = () => {
    setEditWallets(!editWallets);
  };

  const showCreateWalletForm = (isCreateNewWallet) => {
    onSendCreateWallet(isCreateNewWallet);
  };

  const onChangeAvailableWallets = (selectedWallet) =>
    setSelectedWallet(selectedWallet);

  return (
    <WalletSelectionForm
      {...{
        selectedWallet,
        submitChosenWallet,
        availableWallets,
        editWallets,
        getDaemonSynced,
        maxWalletCount,
        isSPV,
        creatingWallet,
        onToggleEditWallet,
        showCreateWalletForm,
        onChangeAvailableWallets
      }}
    />
  );
};

export default daemonStartup(WalletSelectionBody);
