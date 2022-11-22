import { wallet } from "wallet-preload-shim";
import { useLNPage } from "../hooks";

export function useAdvancedTab() {
  const { exportBackup, verifyBackup, info, scbPath, scbUpdatedTime } =
    useLNPage();

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
    info,
    scbPath,
    scbUpdatedTime,
    onBackup,
    onVerifyBackup
  };
}
