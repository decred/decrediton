import { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sa from "actions/SettingsActions";
import * as ca from "actions/ControlActions";
import * as wla from "actions/WalletLoaderActions";
import * as vspa from "actions/VSPActions";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "main_dev/externalRequests";

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

  useEffect(() => {
    if (!walletName)
      dispatch(sa.resetGlobalSettings);
  }, [walletName, dispatch]);

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
    isVSPListingEnabled
  };
};

export default useSettings;
