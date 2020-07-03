import { useState, useCallback, useEffect } from "react";
import WalletSelectionForm from "./Form";
import { useDaemonStartup } from "hooks";

const WalletSelectionBody = ({ submitChosenWallet, onSendCreateWallet }) => {
  const {
    maxWalletCount,
    isSPV,
    availableWallets,
    onRemoveWallet,
    getDaemonSynced,
    creatingWallet
  } = useDaemonStartup();
  const [editWallets, setEditWallets] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    setSelectedWallet(availableWallets[0]);
  }, [availableWallets]);

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
        onRemoveWallet,
        creatingWallet,
        onToggleEditWallet,
        showCreateWalletForm,
        onChangeAvailableWallets
      }}
    />
  );
};

export default WalletSelectionBody;
