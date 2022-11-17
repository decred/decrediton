import { useState, useCallback } from "react";
import WalletSelectionForm from "./Form";
import { useDaemonStartup } from "hooks";

const WalletSelectionBody = ({
  submitChosenWallet,
  onSendCreateWallet,
  onShowOnboardingTutorial
}) => {
  const {
    isSPV,
    availableWallets,
    onRemoveWallet,
    getDaemonSynced,
    creatingWallet
  } = useDaemonStartup();
  const [editWallets, setEditWallets] = useState(false);
  const onToggleEditWallet = useCallback(() => {
    setEditWallets(!editWallets);
  }, [editWallets]);

  const showCreateWalletForm = useCallback(
    (isCreateNewWallet) => {
      onSendCreateWallet(isCreateNewWallet);
    },
    [onSendCreateWallet]
  );

  return (
    <WalletSelectionForm
      {...{
        submitChosenWallet,
        availableWallets,
        editWallets,
        getDaemonSynced,
        isSPV,
        onRemoveWallet,
        creatingWallet,
        onToggleEditWallet,
        showCreateWalletForm,
        onShowOnboardingTutorial
      }}
    />
  );
};

export default WalletSelectionBody;
