import { useState, useCallback } from "react";
import CreateWalletForm from "./CreateWalletForm";
import { useDaemonStartup } from "hooks";
import { injectIntl } from "react-intl";

const PreCreateWallet = ({
  intl,
  onSendContinue,
  onSendBack,
  onSendError,
  onShowTrezorConfig,
  isCreateNewWallet,
  onShowCreateWallet,
  creatingWallet
}) => {
  const {
    isSPV,
    availableWallets,
    getDaemonSynced,
    trezorDisable,
    isTestNet,
    trezorDevice,
    trezorAlertNoConnectedDevice,
    trezorGetWalletCreationMasterPubKey,
    onCreateWallet,
    trezorEnable,
    validateMasterPubKey
  } = useDaemonStartup();
  const [newWalletName, setNewWalletName] = useState("");
  const [isWatchingOnly, setIsWatchingOnly] = useState(false);
  const [walletMasterPubKey, setWalletMasterPubKey] = useState("");
  const [walletNameError, setWalletNameError] = useState(false);
  const [masterPubKeyError, setMasterPubKeyError] = useState(false);
  const [isTrezor, setIsTrezor] = useState(false);
  const [hasFailedAttemptName, setHasFailedAttemptName] = useState(false);
  const [hasFailedAttemptPubKey, setHasFailedAttemptPubKey] = useState(false);
  const [disableCoinTypeUpgrades, setDisableCoinTypeUpgrades] = useState(false);
  const [gapLimit, setGapLimit] = useState(null);

  const hideCreateWalletForm = useCallback(() => {
    if (isTrezor) {
      trezorDisable();
    }
    onSendBack();
  }, [isTrezor, trezorDisable, onSendBack]);

  const onChangeCreateWalletName = useCallback(
    (newWalletName) => {
      setHasFailedAttemptName(true);
      let nameAvailable = true;
      // Users should be able to (at least in principle) use any wallet name
      // they so choose. However, certain special chars need to be explicitly
      // filtered due to us directly using the wallet name as part of the path
      // to the wallet's files. The list of chars that need to be filtered out
      // are:
      //
      // Filesystem related chars: /\.:
      // Escaped when stored in dcrwallet.conf ini files: ;#[]
      // Specially handled by dcrwallet: $%~
      const replaceNameChars = /[/\\.:;#[\]$%~]/;
      newWalletName = newWalletName.replace(replaceNameChars, "");
      // Remove leading spaces.
      if (newWalletName.length > 0 && newWalletName[0] === " ")
        newWalletName = newWalletName.slice(1);
      for (let i = 0; i < availableWallets.length; i++) {
        if (newWalletName == availableWallets[i].value.wallet) {
          nameAvailable = false;
          setWalletNameError(true);
        }
      }
      if (nameAvailable) {
        setWalletNameError(false);
      }
      setNewWalletName(newWalletName);
    },
    [availableWallets]
  );

  const toggleWatchOnly = useCallback(() => {
    setIsWatchingOnly(!isWatchingOnly);
    setIsTrezor(false);
  }, [isWatchingOnly]);

  const toggleTrezor = useCallback(() => {
    if (!isTrezor) {
      trezorEnable();
    } else {
      trezorDisable();
    }
    setIsTrezor(!isTrezor);
    setIsWatchingOnly(false);
  }, [isTrezor, trezorEnable, trezorDisable]);

  const toggleDisableCoinTypeUpgrades = () =>
    setDisableCoinTypeUpgrades((value) => !value);

  const createWallet = useCallback(() => {
    const isNew = isCreateNewWallet;
    const walletSelected = {
      label: newWalletName,
      value: {
        wallet: newWalletName,
        isWatchingOnly,
        isTrezor,
        isNew,
        network: isTestNet ? "testnet" : "mainnet",
        gapLimit,
        disableCoinTypeUpgrades
      }
    };

    if (newWalletName === "" || walletNameError) {
      setHasFailedAttemptName(true);
      return;
    }
    if (isWatchingOnly && (masterPubKeyError || !walletMasterPubKey)) {
      setHasFailedAttemptPubKey(true);
      return;
    }
    if (isTrezor && !trezorDevice) {
      trezorAlertNoConnectedDevice();
      return;
    }
    // onSendContinue action so getStartedStateMachine can go to
    // creatingWallet state.
    onSendContinue();
    if (isTrezor) {
      walletSelected.watchingOnly = true;
      return trezorGetWalletCreationMasterPubKey().then((walletMasterPubKey) =>
        onCreateWallet(walletSelected).then(() =>
          onShowCreateWallet({
            isNew,
            walletMasterPubKey,
            isTrezor: true
          })
        )
      );
    }

    return onCreateWallet(walletSelected)
      .then(() => onShowCreateWallet({ isNew, walletMasterPubKey }))
      .catch((error) => onSendError(error));
  }, [
    isCreateNewWallet,
    isTestNet,
    isTrezor,
    isWatchingOnly,
    masterPubKeyError,
    newWalletName,
    onCreateWallet,
    onSendContinue,
    onShowCreateWallet,
    onSendError,
    trezorAlertNoConnectedDevice,
    trezorDevice,
    trezorGetWalletCreationMasterPubKey,
    walletMasterPubKey,
    walletNameError,
    gapLimit,
    disableCoinTypeUpgrades
  ]);

  const onChangeCreateWalletMasterPubKey = useCallback(
    async (walletMasterPubKey) => {
      if (walletMasterPubKey === "") {
        setHasFailedAttemptPubKey(true);
      }
      const { isValid } = await validateMasterPubKey(walletMasterPubKey);
      if (!isValid) {
        setMasterPubKeyError(true);
      } else {
        setMasterPubKeyError(false);
      }
      setWalletMasterPubKey(walletMasterPubKey);
    },
    [validateMasterPubKey]
  );

  return (
    <CreateWalletForm
      {...{
        selectedWallet: availableWallets[0],
        availableWallets,
        isCreateNewWallet,
        newWalletName,
        hasFailedAttemptName,
        hasFailedAttemptPubKey,
        getDaemonSynced,
        isWatchingOnly,
        isTrezor,
        walletMasterPubKey,
        masterPubKeyError,
        walletNameError,
        isSPV,
        onShowTrezorConfig,
        creatingWallet,
        hideCreateWalletForm,
        onChangeCreateWalletName,
        createWallet,
        toggleWatchOnly,
        toggleTrezor,
        onChangeCreateWalletMasterPubKey,
        intl,
        disableCoinTypeUpgrades,
        toggleDisableCoinTypeUpgrades,
        gapLimit,
        setGapLimit
      }}
    />
  );
};

export default injectIntl(PreCreateWallet);
