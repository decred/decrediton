import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sa from "actions/SettingsActions";
import * as ca from "actions/ControlActions";
import * as wla from "actions/WalletLoaderActions";

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
  const isTicketAutoBuyerEnabled = useSelector(sel.isTicketAutoBuyerEnabled);
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

  const onSaveSettings = useCallback(
    (settings) => dispatch(sa.saveSettings(settings)),
    [dispatch]
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
    isTicketAutoBuyerEnabled,
    needNetworkReset,
    walletName,
    walletReady,
    onAttemptChangePassphrase,
    onChangeTempSettings,
    onSaveSettings,
    onCloseWallet,
    onAddAllowedRequestType,
    toggleTheme
  };
};

export default useSettings;
