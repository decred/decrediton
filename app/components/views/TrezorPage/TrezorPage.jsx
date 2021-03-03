import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import NoDevicePage from "./NoDevicePage";
import { StandalonePage } from "layout";
import ConfigSections from "./ConfigSections";
import Header from "./Header";
import * as sel from "selectors";
import * as trza from "actions/TrezorActions";

const TrezorPage = ({ device, connect }) => {
  const isPerformingUpdate = useSelector(sel.isPerformingTrezorUpdate);
  const _device = useSelector(sel.trezorDevice);

  const dispatch = useDispatch();

  const _connect = useCallback(() => dispatch(trza.connect()), [dispatch]);
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

  const changeLabel = useCallback(() => dispatch(trza.changeLabel()), [
    dispatch
  ]);
  const wipeDevice = useCallback(() => dispatch(trza.wipeDevice()), [dispatch]);
  const recoverDevice = useCallback(() => dispatch(trza.recoverDevice()), [
    dispatch
  ]);
  const initDevice = useCallback(() => dispatch(trza.initDevice()), [dispatch]);
  const backupDevice = useCallback(() => dispatch(trza.backupDevice()), [
    dispatch
  ]);
  const updateFirmware = useCallback(() => dispatch(trza.updateFirmware()), [
    dispatch
  ]);

  return !(device || _device) ? (
    <NoDevicePage onConnect={connect || _connect} />
  ) : (
    <StandalonePage header={<Header />}>
      <ConfigSections
        device={device || _device}
        togglePinProtection={togglePinProtection}
        togglePassPhraseProtection={togglePassPhraseProtection}
        changeToDecredHomeScreen={changeToDecredHomeScreen}
        changeLabel={changeLabel}
        wipeDevice={wipeDevice}
        recoverDevice={recoverDevice}
        updateFirmware={updateFirmware}
        initDevice={initDevice}
        backupDevice={backupDevice}
        isPerformingUpdate={isPerformingUpdate}
      />
    </StandalonePage>
  );
};

export default TrezorPage;
