import { showOpenDialog, showSaveDialog } from "wallet";
import { useEffect } from "react";
import { useLNPage } from "../hooks";

export function useWalletTab() {
  const {
    updateWalletBalances,
    exportBackup,
    verifyBackup,
    walletBalances,
    info,
    scbPath,
    scbUpdatedTime
  } = useLNPage();

  useEffect(() => {
    setTimeout(() => updateWalletBalances(), 1000);
  }, [updateWalletBalances]);

  const onBackup = async () => {
    const { filePath } = await showSaveDialog();
    if (!filePath) {
      return;
    }

    await exportBackup(filePath);
  };

  const onVerifyBackup = async () => {
    const { filePaths } = await showOpenDialog();
    const filePath = filePaths[0];
    if (!filePath) {
      return;
    }

    await verifyBackup(filePath);
  };

  return {
    walletBalances,
    info,
    scbPath,
    scbUpdatedTime,
    onBackup,
    onVerifyBackup
  };
}
