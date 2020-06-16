import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sa from "actions/SettingsActions";
import * as ca from "actions/ControlActions";
import * as wla from "actions/WalletLoaderActions";

export const useSettings = () => {
  const dispatch = useDispatch();
  const currencies = useSelector(sel.currencies);
  const networks = useSelector(sel.networks);
  const locales = useSelector(sel.locales);
  const tempSettings = useSelector(sel.tempSettings);
  const areSettingsDirty = useSelector(sel.areSettingsDirty);
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
    () => dispatch(ca.changePassphraseAttempt()),
    [dispatch]
  );

  const onChangeTempSettings = useCallback(
    () => dispatch(sa.updateStateSettingsChanged()),
    [dispatch]
  );

  const onSaveSettings = useCallback(() => dispatch(sa.saveSettings()), [
    dispatch
  ]);

  const onCloseWallet = useCallback(() => dispatch(wla.closeWalletRequest()), [
    dispatch
  ]);

  const onAddAllowedRequestType = useCallback(
    () => dispatch(sa.addAllowedExternalRequest()),
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

export const useService = () => {
  const walletService = useSelector(sel.walletService);
  const ticketBuyerService = useSelector(sel.ticketBuyerService);
  const isMainNet = useSelector(sel.isMainNet);
  const isTestNet = useSelector(sel.isTestNet);
  return { walletService, ticketBuyerService, isMainNet, isTestNet };
};
