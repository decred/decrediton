import { useMountEffect } from "hooks";
import { useState, useCallback } from "react";

export const useDexCreateWallets = ({
  btcWalletName,
  dexAccount,
  onBTCCreateWalletDex,
  onCreateWalletDex,
  onCheckBTCConfig
}) => {
  const [walletName, setWalletName] = useState(btcWalletName);

  const resetState = useCallback(() => {
    setWalletName(btcWalletName);
  }, [btcWalletName]);

  useMountEffect(() => {
    onCheckBTCConfig();
  });

  const onCreateWallet = (passphrase, args) => {
    const { appPassphrase } = args;
    onCreateWalletDex(passphrase, appPassphrase, dexAccount);
    resetState();
  };

  const onBTCCreateWallet = (passphrase, args) => {
    const { appPassphrase } = args;
    onBTCCreateWalletDex(passphrase, appPassphrase, walletName);
    resetState();
  };

  return { walletName, setWalletName, onCreateWallet, onBTCCreateWallet };
};
