import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import * as sel from "selectors";
import * as trza from "actions/TrezorActions";

const useTrezor = () => {
  const isTrezor = useSelector(sel.isTrezor);
  const waitingForPin = useSelector(sel.trezorWaitingForPin);
  const waitingForPassPhrase = useSelector(sel.trezorWaitingForPassPhrase);
  const waitingForWord = useSelector(sel.trezorWaitingForWord);
  const confirmingTogglePassphrase = useSelector(
    sel.trezorConfirmingTogglePassphrase
  );
  const enablePassphraseProtection = useSelector(
    sel.trezorEnablePassphraseProtection
  );
  const performingOperation = useSelector(sel.trezorPerformingOperation);
  const isGetStarted = useSelector(sel.isGetStarted);
  const device = useSelector(sel.trezorDevice);
  const deviceLabel = useSelector(sel.trezorLabel);
  const walletCreationMasterPubkeyAttempt = useSelector(
    sel.trezorWalletCreationMasterPubkeyAttempt
  );
  const performingRecoverDevice = useSelector(
    sel.trezorPerformingRecoverDevice
  );

  const dispatch = useDispatch();

  const togglePassphraseConfirmCallback = useCallback(
    () => dispatch({ type: trza.TRZ_TOGGLEPASSPHRASEPROTECTION_CONFIRMED }),
    [dispatch]
  );

  const onConnect = useCallback(() => dispatch(trza.connect()), [dispatch]);
  const onCancelCurrentOperation = useCallback(
    () => dispatch(trza.cancelCurrentOperation()),
    [dispatch]
  );
  const onSubmitPin = useCallback(
    (pin) => dispatch(trza.submitPin(pin)),
    [dispatch]
  );
  const onSubmitPassPhrase = useCallback(
    (passPhrase) => dispatch(trza.submitPassPhrase(passPhrase)),
    [dispatch]
  );
  const onSubmitWord = useCallback(
    (word) => dispatch(trza.submitWord(word)),
    [dispatch]
  );
  const onTogglePinProtection = useCallback(
    () => dispatch(trza.togglePinProtection()),
    [dispatch]
  );
  const onTogglePassPhraseProtection = useCallback(
    () => dispatch(trza.togglePassPhraseProtection()),
    [dispatch]
  );
  const onChangeToDecredHomeScreen = useCallback(
    () => dispatch(trza.changeToDecredHomeScreen()),
    [dispatch]
  );
  const onChangeLabel = useCallback(
    (label) => dispatch(trza.changeLabel(label)),
    [dispatch]
  );
  const onWipeDevice = useCallback(
    () => dispatch(trza.wipeDevice()),
    [dispatch]
  );
  const onRecoverDevice = useCallback(
    () => dispatch(trza.recoverDevice()),
    [dispatch]
  );
  const onInitDevice = useCallback(
    () => dispatch(trza.initDevice()),
    [dispatch]
  );
  const onBackupDevice = useCallback(
    () => dispatch(trza.backupDevice()),
    [dispatch]
  );
  const onUpdateFirmware = useCallback(
    (path) => dispatch(trza.updateFirmware(path)),
    [dispatch]
  );
  const onEnableTrezor = useCallback(
    () => dispatch(trza.enableTrezor()),
    [dispatch]
  );

  return {
    isTrezor,
    waitingForPin,
    waitingForPassPhrase,
    waitingForWord,
    performingOperation,
    isGetStarted,
    device,
    deviceLabel,
    walletCreationMasterPubkeyAttempt,
    enablePassphraseProtection,
    confirmingTogglePassphrase,
    togglePassphraseConfirmCallback,
    performingRecoverDevice,
    onConnect,
    onCancelCurrentOperation,
    onSubmitPin,
    onSubmitPassPhrase,
    onSubmitWord,
    onTogglePinProtection,
    onTogglePassPhraseProtection,
    onChangeToDecredHomeScreen,
    onChangeLabel,
    onWipeDevice,
    onRecoverDevice,
    onInitDevice,
    onBackupDevice,
    onUpdateFirmware,
    onEnableTrezor
  };
};

export default useTrezor;
