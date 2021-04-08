import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import * as sel from "selectors";
import * as da from "actions/DexActions";

export const useDex = () => {
  const dispatch = useDispatch();
  const dexEnabled = useSelector(sel.dexEnabled);
  const dexActive = useSelector(sel.dexActive);
  const dexInit = useSelector(sel.dexInit);
  const initDexAttempt = useSelector(sel.initDexAttempt);
  const registerDexAttempt = useSelector(sel.registerDexAttempt);
  const createWalletDexAttempt = useSelector(sel.createWalletDexAttempt);
  const loginDexAttempt = useSelector(sel.loginDexAttempt);
  const loggedIn = useSelector(sel.loggedInDex);
  const dexAddr = useSelector(sel.dexAddr);
  const dexConfig = useSelector(sel.dexConfig);
  const dexRegistered = useSelector(sel.dexRegistered);
  const dexConnected = useSelector(sel.dexConnected);
  const dexDCRWalletRunning = useSelector(sel.dexDCRWalletRunning);
  const dexBTCWalletRunning = useSelector(sel.dexBTCWalletRunning);
  const user = useSelector(sel.dexUser);
  const enableDexAttempt = useSelector(sel.enableDexAttempt);
  const dexAccount = useSelector(sel.dexAccount);
  const dexAccountAttempt = useSelector(sel.dexAccountAttempt);
  const defaultServerAddress = useSelector(sel.defaultDEXServer);
  const dexGetFeeError = useSelector(sel.dexGetFeeError);
  const dexRegisterError = useSelector(sel.dexRegisterError);
  const dexLoginError = useSelector(sel.dexLoginError);
  const dexLogoutError = useSelector(sel.dexLogoutError);
  const dexCreateWalletError = useSelector(sel.dexRegisterError);
  const userError = useSelector(sel.userError);
  const initError = useSelector(sel.initError);
  const dexAccountError = useSelector(sel.dexAccountError);
  const dexEnableError = useSelector(sel.dexEnableError);
  const btcConfig = useSelector(sel.btcConfig);
  const btcInstallNeeded = useSelector(sel.btcInstallNeeded);
  const btcConfigUpdateNeeded = useSelector(sel.btcConfigUpdateNeeded);
  const btcWalletName = useSelector(sel.btcWalletName);

  const onLaunchDexWindow = useCallback(() => dispatch(da.launchDexWindow()), [
    dispatch
  ]);

  const onInitDex = useCallback(
    (passphrase) => dispatch(da.initDex(passphrase)),
    [dispatch]
  );

  const onRegisterDex = useCallback(
    (passphrase) => dispatch(da.registerDex(passphrase)),
    [dispatch]
  );

  const onCreateWalletDex = useCallback(
    (passphrase, appPassphrase, account) =>
      dispatch(da.createWalletDex(passphrase, appPassphrase, account)),
    [dispatch]
  );

  const onBTCCreateWalletDex = useCallback(
    (passphrase, appPassphrase, walletname) =>
      dispatch(da.btcCreateWalletDex(passphrase, appPassphrase, walletname)),
    [dispatch]
  );

  const onLoginDex = useCallback(
    (passphrase) => dispatch(da.loginDex(passphrase)),
    [dispatch]
  );

  const onCreateDexAccount = useCallback(
    (passphrase, name) => dispatch(da.createDexAccount(passphrase, name)),
    [dispatch]
  );

  const onEnableDex = useCallback(() => dispatch(da.enableDex()), [dispatch]);

  const onGetConfig = useCallback(
    (address) => dispatch(da.getConfigDex(address)),
    [dispatch]
  );

  const onCheckBTCConfig = useCallback(() => dispatch(da.checkBTCConfig()), [
    dispatch
  ]);

  const onUpdateBTCConfig = useCallback(() => dispatch(da.updateBTCConfig()), [
    dispatch
  ]);

  return {
    dexEnabled,
    dexActive,
    dexInit,
    onInitDex,
    initDexAttempt,
    onRegisterDex,
    registerDexAttempt,
    onCreateWalletDex,
    createWalletDexAttempt,
    onLoginDex,
    loginDexAttempt,
    loggedIn,
    dexAddr,
    dexConfig,
    dexRegistered,
    dexConnected,
    dexDCRWalletRunning,
    dexBTCWalletRunning,
    onEnableDex,
    enableDexAttempt,
    onGetConfig,
    user,
    onLaunchDexWindow,
    onBTCCreateWalletDex,
    onCreateDexAccount,
    dexAccount,
    dexAccountAttempt,
    defaultServerAddress,
    dexGetFeeError,
    dexRegisterError,
    dexLoginError,
    dexLogoutError,
    dexCreateWalletError,
    userError,
    initError,
    dexAccountError,
    dexEnableError,
    btcConfig,
    onCheckBTCConfig,
    btcInstallNeeded,
    btcConfigUpdateNeeded,
    onUpdateBTCConfig,
    btcWalletName
  };
};
