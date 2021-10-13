import { useMountEffect } from "hooks";
import { useState, useCallback } from "react";

export const useDexCreateWallets = ({
  btcWalletName,
  dexAccount,
  onBTCCreateWalletDex,
  onCreateWalletDex,
  onCheckBTCConfig,
  onNewBTCConfig
}) => {
  const [walletName, setWalletName] = useState(btcWalletName);
  const [bitcoinDirectory, setBitcoinDirectory] = useState("");

  const resetState = useCallback(() => {
    setWalletName(btcWalletName);
  }, [btcWalletName]);

  useMountEffect(() => {
    onCheckBTCConfig(bitcoinDirectory);
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

  const onNewBTCConfigDex = () => {
    onNewBTCConfig(bitcoinDirectory);
    resetState();
  };

  return { walletName, setWalletName, onCreateWallet, onBTCCreateWallet, onNewBTCConfigDex, setBitcoinDirectory };
};
