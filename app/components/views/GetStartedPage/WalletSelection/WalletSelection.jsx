import { useState, useCallback } from "react";
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

  const onToggleEditWallet = useCallback(() => {
    setEditWallets(!editWallets);
  }, [editWallets]);

  const showCreateWalletForm = useCallback(
    (isCreateNewWallet) => {
      onSendCreateWallet(isCreateNewWallet);
    },
    [onSendCreateWallet]
  );

  const onChangeAvailableWallets = useCallback(
    (selectedWallet) => setSelectedWallet(selectedWallet),
    [setSelectedWallet]
  );

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
