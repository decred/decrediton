import { ipcRenderer } from "electron";
import fs from "fs";
import { useEffect, useState } from "react";
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

  const [confirmFileOverwrite, setConfirmFileOverwrite] = useState(null);

  useEffect(() => {
    setTimeout(() => updateWalletBalances(), 1000);
  }, [updateWalletBalances]);

  const onConfirmFileOverwrite = async () => {
    const filePath = confirmFileOverwrite;
    if (!filePath) {
      return;
    }
    setConfirmFileOverwrite(null);
    await exportBackup(filePath);
  };

  const onCancelFileOverwrite = () => {
    setConfirmFileOverwrite(null);
  };

  const onBackup = async () => {
    setConfirmFileOverwrite(null);
    const { filePath } = await ipcRenderer.invoke("show-save-dialog");
    if (!filePath) {
      return;
    }

    // If this file already exists, show the confirmation modal.
    if (fs.existsSync(filePath)) {
      setConfirmFileOverwrite(filePath);
      return;
    }

    await exportBackup(filePath);
  };

  const onVerifyBackup = async () => {
    const { filePaths } = await ipcRenderer.invoke("show-open-dialog");
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
    confirmFileOverwrite,
    onBackup,
    onVerifyBackup,
    onCancelFileOverwrite,
    onConfirmFileOverwrite
  };
}
