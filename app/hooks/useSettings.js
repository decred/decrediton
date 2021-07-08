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

  const settingGapLimit = useSelector(sel.gapLimit);
  const [gapLimit, setGapLimit] = useState(settingGapLimit);

  const onDiscoverUsage = useCallback(
    () => {
      if (isValid) {
        dispatch(ca.discoverUsageAttempt(gapLimit));
        resetDiscoverState();
      }
    },
    [dispatch, gapLimit]
  );

  const [isDiscoverModalVisible, setIsDiscoverModalVisible] = useState(false);
  const showDiscoverModal = () => setIsDiscoverModalVisible(true);
  const hideDiscoverModal = () => {
    resetDiscoverState();
    setIsDiscoverModalVisible(false);
  };
  // we use this bool flag so the error does not show before trying.
  const [clicked, setClicked] = useState(false);
  const resetDiscoverState = () => {
    console.log("reset?");
    setGapLimit(settingGapLimit);
    setClicked(false);
  };
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    console.log("useEffect", gapLimit);
    setIsValid(checkIsValid(gapLimit));
  }, [gapLimit]);

  const checkIsValid = (gapLimit) => {
    let isValid = true;
    if (gapLimit) {
      if (isNaN(gapLimit) ) {
        console.log("checkIsValid?", isNaN(gapLimit), gapLimit);
        isValid = false;
      }
    } else {
      console.log("checkIsValid? null", gapLimit);
      isValid = false;
    }
    return isValid;
  };

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
    hideDiscoverModal
  };
};

export default useSettings;
