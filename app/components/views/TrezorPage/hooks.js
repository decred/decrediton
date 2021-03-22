import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as sel from "selectors";
import * as trza from "actions/TrezorActions";

export function useTrezorPage() {
  const isPerformingUpdate = useSelector(sel.isPerformingTrezorUpdate);
  const device = useSelector(sel.trezorDevice);
  const performingOperation = useSelector(sel.trezorPerformingOperation);

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
  const changeToDecredHomeScreen = useCallback(
    () => dispatch(trza.changeToDecredHomeScreen()),
    [dispatch]
  );
  const changeLabel = useCallback(
    (label) => dispatch(trza.changeLabel(label)),
    [dispatch]
  );
  const wipeDevice = useCallback(() => dispatch(trza.wipeDevice()), [dispatch]);
  const recoverDevice = useCallback(() => dispatch(trza.recoverDevice()), [
    dispatch
  ]);
  const initDevice = useCallback(() => dispatch(trza.initDevice()), [dispatch]);
  const backupDevice = useCallback(() => dispatch(trza.backupDevice()), [
    dispatch
  ]);
  const updateFirmware = useCallback(
    (path) => dispatch(trza.updateFirmware(path)),
    [dispatch]
  );
  const enableTrezor = useCallback(() => dispatch(trza.enableTrezor()), [
    dispatch
  ]);

  return {
    isPerformingUpdate,
    performingOperation,
    device,
    connect,
    togglePinProtection,
    togglePassPhraseProtection,
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
