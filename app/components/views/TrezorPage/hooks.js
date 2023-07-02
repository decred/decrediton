import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import * as sel from "selectors";
import * as trza from "actions/TrezorActions";
import { useIntl } from "react-intl";

export function useTrezorPage() {
  const isPerformingUpdate = useSelector(sel.isPerformingTrezorUpdate);
  const device = useSelector(sel.trezorDevice);
  const performingOperation = useSelector(sel.trezorPerformingOperation);
  const performingTogglePinProtection = useSelector(
    sel.trezorPerformingTogglePinProtection
  );
  const performingTogglePassphraseProtection = useSelector(
    sel.trezorPerformingTogglePassphraseProtection
  );
  const performingTogglePassphraseOnDeviceProtection = useSelector(
    sel.trezorPerformingTogglePassphraseOnDeviceProtection
  );
  const pinProtection = useSelector(sel.trezorPinProtection);
  const passphraseProtection = useSelector(sel.trezorPassphraseProtection);
  const passphraseOnDeviceProtection = useSelector(
    sel.trezorPassphraseOnDeviceProtection
  );
  const performingRecoverDevice = useSelector(
    sel.trezorPerformingRecoverDevice
  );
  const deviceLabel = useSelector(sel.trezorLabel);
  const intl = useIntl();

  const dispatch = useDispatch();

  const connect = useCallback(() => dispatch(trza.connect()), [dispatch]);
  const togglePinProtection = useCallback(
    () => dispatch(trza.togglePinProtection()),
    [dispatch]
  );
  const togglePassPhraseProtection = useCallback(
    () => dispatch(trza.togglePassPhraseProtection()),
    [dispatch]
  );
  const togglePassphraseOnDevice = useCallback(
    () => dispatch(trza.togglePassphraseOnDevice()),
    [dispatch]
  );
  const changeToDecredHomeScreen = useCallback(
    () => dispatch(trza.changeToDecredHomeScreen()),
    [dispatch]
  );
  const changeLabel = useCallback(
    (label) => dispatch(trza.changeLabel(label)),
    [dispatch]
  );
  const wipeDevice = useCallback(() => dispatch(trza.wipeDevice()), [dispatch]);
  const recoverDevice = useCallback(
    () => dispatch(trza.recoverDevice()),
    [dispatch]
  );
  const initDevice = useCallback(() => dispatch(trza.initDevice()), [dispatch]);
  const backupDevice = useCallback(
    () => dispatch(trza.backupDevice()),
    [dispatch]
  );
  const updateFirmware = useCallback(
    (path) => dispatch(trza.updateFirmware(path)),
    [dispatch]
  );
  const enableTrezor = useCallback(
    () => dispatch(trza.enableTrezor()),
    [dispatch]
  );

  const getFeatures = useCallback(
    () => dispatch(trza.getFeatures()),
    [dispatch]
  );

  useEffect(() => {
    if (device) {
      getFeatures();
    }
  }, [device, getFeatures]);

  return {
    isPerformingUpdate,
    performingOperation,
    performingRecoverDevice,
    device,
    performingTogglePinProtection,
    performingTogglePassphraseProtection,
    performingTogglePassphraseOnDeviceProtection,
    pinProtection,
    passphraseProtection,
    passphraseOnDeviceProtection,
    deviceLabel,
    intl,
    connect,
    togglePinProtection,
    togglePassPhraseProtection,
    togglePassphraseOnDevice,
    changeToDecredHomeScreen,
    changeLabel,
    wipeDevice,
    recoverDevice,
    initDevice,
    backupDevice,
    updateFirmware,
    enableTrezor
  };
}
