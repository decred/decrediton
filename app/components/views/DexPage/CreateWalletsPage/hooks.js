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
  const [hasNonDefault, setHasNonDefault] = useState(false);
  const [walletName, setWalletName] = useState(btcWalletName);
  const [bitcoinDirectory, setBitcoinDirectory] = useState("");

  const toggleHasNonDefault = useCallback(() => {
    setHasNonDefault(!hasNonDefault);
  }, [hasNonDefault]);

  const resetState = useCallback(() => {
    setWalletName(btcWalletName);
  }, [btcWalletName]);

  useMountEffect(() => {});

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

  const onCheckBTCConfigDex = () => {
    onCheckBTCConfig(bitcoinDirectory);
  };
  const onNewBTCConfigDex = () => {
    onNewBTCConfig(bitcoinDirectory);
    resetState();
  };

  return {
    walletName,
    setWalletName,
    onCreateWallet,
    onBTCCreateWallet,
    onCheckBTCConfigDex,
    onNewBTCConfigDex,
    bitcoinDirectory,
    setBitcoinDirectory,
    hasNonDefault,
    toggleHasNonDefault
  };
};
