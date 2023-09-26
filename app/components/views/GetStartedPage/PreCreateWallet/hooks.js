import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useDaemonStartup } from "hooks";
import * as trza from "actions/TrezorActions";
import * as ldgr from "actions/LedgerActions";

export const usePreCreateWallet = ({
  onSendContinue,
  onSendBack,
  onSendError,
  isCreateNewWallet,
  onShowCreateWallet,
  isTrezor,
  isLedger
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
    validateMasterPubKey,
    ledgerDevice,
    ledgerEnable,
    ledgerDisable,
    ledgerAlertNoConnectedDevice,
    ledgerGetWalletCreationMasterPubKey
  } = useDaemonStartup();
  const [newWalletName, setNewWalletName] = useState("");
  const [isWatchingOnly, setIsWatchingOnly] = useState(false);
  const [walletMasterPubKey, setWalletMasterPubKey] = useState("");
  const [walletNameError, setWalletNameError] = useState(false);
  const [masterPubKeyError, setMasterPubKeyError] = useState(false);
  const [hasFailedAttemptName, setHasFailedAttemptName] = useState(false);
  const [hasFailedAttemptPubKey, setHasFailedAttemptPubKey] = useState(false);
  const [disableCoinTypeUpgrades, setDisableCoinTypeUpgrades] = useState(false);
  const [gapLimit, setGapLimit] = useState(null);

  const hideCreateWalletForm = useCallback(() => {
    if (isTrezor) {
      trezorDisable();
    }
    if (isLedger) {
      ledgerDisable();
    }
    onSendBack();
  }, [isTrezor, trezorDisable, onSendBack, isLedger, ledgerDisable]);

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
  }, [isWatchingOnly]);

  useEffect(() => {
    if (isTrezor) {
      trezorEnable();
    } else {
      trezorDisable();
    }
    if (isLedger) {
      return ledgerEnable();
    }
    return ledgerDisable();
  }, [
    isTrezor,
    trezorEnable,
    trezorDisable,
    isLedger,
    ledgerEnable,
    ledgerDisable
  ]);

  const toggleDisableCoinTypeUpgrades = () =>
    setDisableCoinTypeUpgrades((value) => !value);

  const createWallet = useCallback(() => {
    const isNew = isCreateNewWallet;
    const walletSelected = {
      label: newWalletName,
      value: {
        wallet: newWalletName,
        isWatchingOnly,
        isTrezor: !!isTrezor,
        isLedger: !!isLedger,
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
      return trezorAlertNoConnectedDevice();
    }
    if (isLedger && !ledgerDevice) {
      return ledgerAlertNoConnectedDevice();
    }
    // onSendContinue action so getStartedStateMachine can go to
    // creatingWallet state.
    onSendContinue();
    if (isTrezor) {
      walletSelected.isWatchingOnly = true;
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
    if (isLedger) {
      walletSelected.isWatchingOnly = true;
      return ledgerGetWalletCreationMasterPubKey().then((walletMasterPubKey) =>
        onCreateWallet(walletSelected).then(() =>
          onShowCreateWallet({
            isNew,
            walletMasterPubKey,
            isLedger: true
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
    isLedger,
    isWatchingOnly,
    masterPubKeyError,
    newWalletName,
    onCreateWallet,
    onShowCreateWallet,
    onSendError,
    trezorAlertNoConnectedDevice,
    trezorDevice,
    trezorGetWalletCreationMasterPubKey,
    ledgerAlertNoConnectedDevice,
    ledgerDevice,
    ledgerGetWalletCreationMasterPubKey,
    walletMasterPubKey,
    walletNameError,
    gapLimit,
    disableCoinTypeUpgrades,
    onSendContinue
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

  const dispatch = useDispatch();
  const connectTrezor = useCallback(() => dispatch(trza.connect()), [dispatch]);
  const connectLedger = useCallback(() => dispatch(ldgr.connect()), [dispatch]);

  return {
    availableWallets,
    newWalletName,
    hasFailedAttemptName,
    hasFailedAttemptPubKey,
    getDaemonSynced,
    isWatchingOnly,
    walletMasterPubKey,
    masterPubKeyError,
    walletNameError,
    isSPV,
    trezorDevice,
    hideCreateWalletForm,
    onChangeCreateWalletName,
    createWallet,
    toggleWatchOnly,
    onChangeCreateWalletMasterPubKey,
    disableCoinTypeUpgrades,
    toggleDisableCoinTypeUpgrades,
    gapLimit,
    setGapLimit,
    ledgerDevice,
    connectTrezor,
    connectLedger
  };
};
