import { useCallback, useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sa from "actions/SettingsActions";
import * as ca from "actions/ControlActions";
import * as wla from "actions/WalletLoaderActions";
import * as vspa from "actions/VSPActions";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "constants";

const useSettings = () => {
  const dispatch = useDispatch();
  const currencies = useSelector(sel.currencies);
  const networks = useSelector(sel.networks);
  const locales = useSelector(sel.sortedLocales);
  const tempSettings = useSelector(sel.tempSettings);
  const areSettingsDirty = useSelector(sel.settingsChanged);
  const isChangePassPhraseDisabled = useSelector(
    sel.isChangePassPhraseDisabled
  );
  const changePassphraseRequestAttempt = useSelector(
    sel.changePassphraseRequestAttempt
  );
  const needNetworkReset = useSelector(sel.needNetworkReset);
  const walletName = useSelector(sel.getWalletName);
  const walletReady = useSelector(sel.getWalletReady);
  const isTrezor = useSelector(sel.isTrezor);

  const onAttemptChangePassphrase = useCallback(
    (oldPass, args) => {
      const { newPassphrase, priv } = args;
      dispatch(ca.changePassphraseAttempt(oldPass, newPassphrase, priv));
    },
    [dispatch]
  );

  const onChangeTempSettings = useCallback(
    (settings) => dispatch(sa.updateStateSettingsChanged(settings)),
    [dispatch]
  );

  const resetSettingsState = useCallback(
    () => dispatch(sa.resetSettingsState()),
    [dispatch]
  );

  const isVSPListingEnabled = useMemo(
    () =>
      tempSettings.allowedExternalRequests.includes(
        EXTERNALREQUEST_STAKEPOOL_LISTING
      ),
    [tempSettings.allowedExternalRequests]
  );

  const onSaveSettings = useCallback(
    (settings) => {
      if (isVSPListingEnabled) {
        dispatch(vspa.discoverAvailableVSPs());
      }
      return dispatch(sa.saveSettings(settings));
    },
    [dispatch, isVSPListingEnabled]
  );

  const onCloseWallet = useCallback(() => dispatch(wla.closeWalletRequest()), [
    dispatch
  ]);

  const onAddAllowedRequestType = useCallback(
    (requestType) => dispatch(sa.addAllowedExternalRequest(requestType)),
    [dispatch]
  );

  const toggleTheme = useCallback(() => dispatch(sa.toggleTheme()), [dispatch]);

  const discoverUsageAttempt = useSelector(sel.discoverUsageAttempt);
  const rescanRunning = useSelector(sel.rescanRequest);
  const settingGapLimit = useSelector(sel.gapLimit);
  const [gapLimit, setGapLimit] = useState(settingGapLimit);
  const [isValid, setIsValid] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [isDiscoverModalVisible, setIsDiscoverModalVisible] = useState(false);
  const showDiscoverModal = () => setIsDiscoverModalVisible(true);

  const resetDiscoverState = useCallback(() => {
    setGapLimit(settingGapLimit);
    setClicked(false);
  }, [setGapLimit, setClicked, settingGapLimit]);

  const hideDiscoverModal = useCallback(() => {
    resetDiscoverState();
    setIsDiscoverModalVisible(false);
  }, [resetDiscoverState, setIsDiscoverModalVisible]);

  const onDiscoverUsage = useCallback(() => {
    if (isValid) {
      dispatch(ca.discoverUsageAttempt(gapLimit));
      hideDiscoverModal();
    }
  }, [dispatch, hideDiscoverModal, isValid, gapLimit]);

  const checkIsValid = useCallback(() => {
    if (!gapLimit || (gapLimit && isNaN(gapLimit))) {
      return false;
    }
    return true;
  }, [gapLimit]);

  useEffect(() => {
    setIsValid(checkIsValid());
  }, [setIsValid, checkIsValid]);

  return {
    currencies,
    networks,
    locales,
    tempSettings,
    areSettingsDirty,
    isChangePassPhraseDisabled,
    changePassphraseRequestAttempt,
    needNetworkReset,
    walletName,
    walletReady,
    isTrezor,
    onAttemptChangePassphrase,
    onChangeTempSettings,
    onSaveSettings,
    onCloseWallet,
    onAddAllowedRequestType,
    toggleTheme,
    isVSPListingEnabled,
    onDiscoverUsage,
    gapLimit,
    setGapLimit,
    isValid,
    clicked,
    isDiscoverModalVisible,
    showDiscoverModal,
    hideDiscoverModal,
    discoverUsageAttempt,
    rescanRunning,
    resetSettingsState
  };
};

export default useSettings;
