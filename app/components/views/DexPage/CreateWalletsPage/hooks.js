export const useDexCreateWallets = ({ dexAccount, onCreateWalletDex }) => {
  const onCreateWallet = (passphrase, args) => {
    const { appPassphrase } = args;
    onCreateWalletDex(passphrase, appPassphrase, dexAccount);
  };

  return {
    onCreateWallet
  };
};
