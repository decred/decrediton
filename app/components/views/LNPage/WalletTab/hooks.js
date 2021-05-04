import * as wallet from "wallet";
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
    const { filePath } = await wallet.showSaveDialog();
    if (!filePath) {
      return;
    }

    await exportBackup(filePath);
  };

  const onVerifyBackup = async () => {
    const { filePaths } = await wallet.showOpenDialog();
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
