import { useState, useCallback } from "react";
import WalletSelectionForm from "./Form";
import { useDaemonStartup } from "hooks";

const WalletSelectionBody = ({ submitChosenWallet, onSendCreateWallet }) => {
  const {
    maxWalletCount,
    isSPV,
    availableWallets,
    getDaemonSynced,
    creatingWallet
  } = useDaemonStartup();
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

export default WalletSelectionBody;
