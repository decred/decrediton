import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { FormattedMessage as T } from "react-intl";
import * as sel from "selectors";
import * as da from "actions/DexActions";
import * as dm from "actions/DaemonActions";
import { DexView, DexViewHeader } from "./DexView";
import {
  CreateWalletsPage,
  CreateWalletsPageHeader
} from "./CreateWalletsPage";
import { EnablePage, EnablePageHeader } from "./EnablePage";
import { InitPage, InitPageHeader } from "./InitPage";
import { LoginPage, LoginPageHeader } from "./LoginPage";
import { ConfirmDexSeed, ConfirmDexSeedHeader } from "./ConfirmDexSeed";
import {
  CreateDexAcctPage,
  CreateDexAcctPageHeader
} from "./CreateDexAcctPage";
import ErrorHeader from "./ErrorHeader";
import { useIntl } from "react-intl";

export const useDex = () => {
  const dispatch = useDispatch();
  const dexEnabled = useSelector(sel.dexEnabled);
  const dexActive = useSelector(sel.dexActive);
  const dexInit = useSelector(sel.dexInit);
  const initDexAttempt = useSelector(sel.initDexAttempt);
  const createWalletDexAttempt = useSelector(sel.createWalletDexAttempt);
  const loginDexAttempt = useSelector(sel.loginDexAttempt);
  const loggedIn = useSelector(sel.loggedInDex);
  const dexConnected = useSelector(sel.dexConnected);
  const dexDCRWalletRunning = useSelector(sel.dexDCRWalletRunning);
  const dexReady = useSelector(sel.dexReady);
  const user = useSelector(sel.dexUser);
  const enableDexAttempt = useSelector(sel.enableDexAttempt);
  const dexAccount = useSelector(sel.dexAccount);
  const dexAccountAttempt = useSelector(sel.dexAccountAttempt);
  const dexSelectAccountAttempt = useSelector(sel.dexSelectAccountAttempt);
  const dexGetFeeError = useSelector(sel.dexGetFeeError);
  const dexLoginError = useSelector(sel.dexLoginError);
  const dexLogoutError = useSelector(sel.dexLogoutError);
  const userError = useSelector(sel.userError);
  const initError = useSelector(sel.initError);
  const dexAccountError = useSelector(sel.dexAccountError);
  const dexEnableError = useSelector(sel.dexEnableError);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const intl = useIntl();
  const confirmDexSeed = useSelector(sel.confirmDexSeed);
  const dexSeed = useSelector(sel.dexSeed);

  const onGetDexLogs = () => dispatch(dm.getDexLogs());
  const onLaunchDexWindow = useCallback(
    () => dispatch(da.launchDexWindow()),
    [dispatch]
  );

  const onInitDex = useCallback(
    (passphrase) => dispatch(da.initDex(passphrase)),
    [dispatch]
  );

  const onInitDexWithSeed = useCallback(
    (passphrase, seed) => dispatch(da.initDex(passphrase, seed)),
    [dispatch]
  );

  const onCreateWalletDex = useCallback(
    (passphrase, appPassphrase, account) =>
      dispatch(da.createWalletDex(passphrase, appPassphrase, account)),
    [dispatch]
  );

  const onLoginDex = useCallback(
    (passphrase) => dispatch(da.loginDex(passphrase)),
    [dispatch]
  );

  const onConfirmDexSeed = useCallback(
    () => dispatch(da.confirmDexSeed()),
    [dispatch]
  );

  const onCreateDexAccount = useCallback(
    (passphrase, name) => dispatch(da.createDexAccount(passphrase, name)),
    [dispatch]
  );
  const onSelectDexAccount = useCallback(
    (name) => dispatch(da.selectDexAccount(name)),
    [dispatch]
  );

  const onEnableDex = useCallback(() => dispatch(da.enableDex()), [dispatch]);

  const { Page, Header } = useMemo(() => {
    let page, header;
    if (!dexEnabled) {
      page = <EnablePage />;
      header = <EnablePageHeader />;
    } else if (dexActive) {
      if (dexInit) {
        if (dexReady) {
          page = <DexView />;
          header = <DexViewHeader />;
        } else if (!loggedIn) {
          page = <LoginPage />;
          header = <LoginPageHeader />;
        } else if (!confirmDexSeed) {
          page = <ConfirmDexSeed />;
          header = <ConfirmDexSeedHeader />;
        } else if (dexDCRWalletRunning) {
          page = <DexView />;
          header = <DexViewHeader />;
        } else if (!dexAccount) {
          page = <CreateDexAcctPage />;
          header = <CreateDexAcctPageHeader />;
        } else if (!dexDCRWalletRunning) {
          page = <CreateWalletsPage />;
          header = <CreateWalletsPageHeader />;
        }
      } else {
        page = <InitPage />;
        header = <InitPageHeader />;
      }
    } else {
      page = (
        <div>
          <T
            id="dex.error.page"
            m="Critical Error! DEX is not running.  Please restart and check logs if problem persists."
          />
        </div>
      );
      header = <ErrorHeader />;
    }
    return { Page: page, Header: header };
  }, [
    dexReady,
    dexEnabled,
    dexActive,
    dexInit,
    loggedIn,
    dexDCRWalletRunning,
    dexAccount,
    confirmDexSeed
  ]);
  return {
    dexEnabled,
    dexActive,
    dexInit,
    onInitDex,
    onInitDexWithSeed,
    initDexAttempt,
    onGetDexLogs,
    onCreateWalletDex,
    createWalletDexAttempt,
    onLoginDex,
    loginDexAttempt,
    loggedIn,
    dexConnected,
    dexDCRWalletRunning,
    onEnableDex,
    enableDexAttempt,
    user,
    onLaunchDexWindow,
    onCreateDexAccount,
    onSelectDexAccount,
    dexAccount,
    dexAccountAttempt,
    dexSelectAccountAttempt,
    dexGetFeeError,
    dexLoginError,
    dexLogoutError,
    userError,
    initError,
    dexAccountError,
    dexEnableError,
    Page,
    Header,
    mixedAccount,
    intl,
    confirmDexSeed,
    onConfirmDexSeed,
    dexSeed
  };
};
