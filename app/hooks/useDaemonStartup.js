import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";
import * as ctrla from "actions/ControlActions";
import * as trza from "actions/TrezorActions";

const useDaemonStartup = () => {
  const dispatch = useDispatch();
  // version selectors
  const appVersion = useSelector(sel.appVersion);
  const updateAvailable = useSelector(sel.updateAvailable);

  // Get posistion selectors when first starting decrediton
  const setLanguage = useSelector(sel.setLanguage);
  const showTutorial = useSelector(sel.showTutorial);
  const showSpvChoice = useSelector(sel.showSpvChoice);
  const showPrivacy = useSelector(sel.showPrivacy);

  // language page selectors
  const availableLanguages = useSelector(sel.sortedLocales);
  const defaultLocale = useSelector(sel.defaultLocaleName);

  // end of general selectors

  // start daemon selectors
  const sAdvancedDaemon = useSelector(sel.isAdvancedDaemon);
  const isSPV = useSelector(sel.isSPV);
  const isTestNet = useSelector(sel.isTestNet);
  const availableWallets = useSelector(sel.sortedAvailableWallets);
  const getDaemonSynced = useSelector(sel.getDaemonSynced);
  const getCurrentBlockCount = useSelector(sel.getCurrentBlockCount);
  const getNeededBlocks = useSelector(sel.getNeededBlocks);
  const getDaemonStarted = useSelector(sel.getDaemonStarted);
  const getEstimatedTimeLeft = useSelector(sel.getEstimatedTimeLeft);
  const trezorDevice = useSelector(sel.trezorDevice);
  const isTrezor = useSelector(sel.isTrezor);
  const maxWalletCount = useSelector(sel.maxWalletCount);
  // end of daemon selectors

  // sync dcrwallet spv or rpc selectors
  const peerCount = useSelector(sel.peerCount);
  const synced = useSelector(sel.synced);
  const syncFetchMissingCfiltersAttempt = useSelector(
    sel.syncFetchMissingCfiltersAttempt
  );
  const syncFetchMissingCfiltersStart = useSelector(
    sel.syncFetchMissingCfiltersStart
  );
  const syncFetchMissingCfiltersEnd = useSelector(
    sel.syncFetchMissingCfiltersEnd
  );
  const syncFetchHeadersAttempt = useSelector(sel.syncFetchHeadersAttempt);
  const syncFetchHeadersCount = useSelector(sel.syncFetchHeadersCount);
  const syncFetchHeadersLastHeaderTime = useSelector(
    sel.syncFetchHeadersLastHeaderTime
  );
  const syncDiscoverAddressesAttempt = useSelector(
    sel.syncDiscoverAddressesAttempt
  );
  const syncRescanAttempt = useSelector(sel.syncRescanAttempt);
  const syncFetchHeadersComplete = useSelector(sel.syncFetchHeadersComplete);
  const syncFetchTimeStart = useSelector(sel.syncFetchTimeStart);
  const selectedWalletSelector = useSelector(sel.getSelectedWallet);

  // general methods
  // Methods for showing positions when first starting decrediton
  const onShowTutorial = useCallback(() => dispatch(da.showTutorial()), [
    dispatch
  ]);
  const onShowSpvChoice = useCallback(() => dispatch(da.showSpvChoice()), [
    dispatch
  ]);
  const onShowPrivacy = useCallback(() => dispatch(da.showPrivacy()), [
    dispatch
  ]);
  const onShowLanguage = useCallback(() => dispatch(da.showLanguage()), [
    dispatch
  ]);
  const onShowGetStarted = useCallback(() => dispatch(da.showGetStarted()), [
    dispatch
  ]);
  // language page
  const onSelectLanguage = useCallback(() => dispatch(da.selectLanguage()), [
    dispatch
  ]);
  // spv page
  const toggleSpv = useCallback(() => dispatch(da.toggleSpv()), [dispatch]);
  // privacy page
  const setupStandardPrivacy = useCallback(
    () => dispatch(da.setupStandardPrivacy()),
    [dispatch]
  );
  const setupDisabledPrivacy = useCallback(
    () => dispatch(da.setupDisabledPrivacy()),
    [dispatch]
  );
  // tutorial page
  const finishTutorial = useCallback(() => dispatch(da.finishTutorial()), [
    dispatch
  ]);
  // end of general methods
  const finishPrivacy = useCallback(() => dispatch(da.finishPrivacy()), [
    dispatch
  ]);
  // start daemon and wallet methods
  const onRetryStartRPC = useCallback(
    () => dispatch(wla.startRpcRequestFunc()),
    [dispatch]
  );
  const startSPVSync = useCallback(() => dispatch(wla.spvSyncAttempt()), [
    dispatch
  ]);
  const setSelectedWallet = useCallback(
    () => dispatch(wla.setSelectedWallet()),
    [dispatch]
  );
  const getSelectedWallet = useCallback(
    () => dispatch(wla.getSelectedWallet()),
    [dispatch]
  );
  const onOpenWallet = useCallback(() => dispatch(wla.openWalletAttempt()), [
    dispatch
  ]);
  const onStartDaemon = useCallback(() => dispatch(da.startDaemon()), [
    dispatch
  ]);
  const onConnectDaemon = useCallback(() => dispatch(da.connectDaemon()), [
    dispatch
  ]);
  const checkNetworkMatch = useCallback(
    () => dispatch(da.checkNetworkMatch()),
    [dispatch]
  );
  const syncDaemon = useCallback(() => dispatch(da.syncDaemon()), [dispatch]);
  const onGetAvailableWallets = useCallback(
    () => dispatch(da.getAvailableWallets()),
    [dispatch]
  );
  const onStartWallet = useCallback(() => dispatch(da.startWallet()), [
    dispatch
  ]);
  const onRemoveWallet = useCallback(() => dispatch(da.removeWallet()), [
    dispatch
  ]);
  const goToErrorPage = useCallback(() => dispatch(ca.goToError()), [dispatch]);

  // create or restore wallet methods
  const onCreateWallet = useCallback(() => dispatch(da.createWallet()), [
    dispatch
  ]);
  const getDcrwalletLogs = useCallback(() => dispatch(da.getDcrwalletLogs()), [
    dispatch
  ]);
  const trezorLoadDeviceList = useCallback(
    () => dispatch(trza.loadDeviceList()),
    [dispatch]
  );
  const trezorEnable = useCallback(() => dispatch(trza.enableTrezor()), [
    dispatch
  ]);
  const trezorDisable = useCallback(() => dispatch(trza.disableTrezor()), [
    dispatch
  ]);
  const trezorAlertNoConnectedDevice = useCallback(
    () => dispatch(trza.alertNoConnectedDevice()),
    [dispatch]
  );
  const trezorGetWalletCreationMasterPubKey = useCallback(
    () => dispatch(trza.getWalletCreationMasterPubKey()),
    [dispatch]
  );
  const validateMasterPubKey = useCallback(
    () => dispatch(ctrla.validateMasterPubKey),
    [dispatch]
  );

  return {
    onShowTutorial,
    validateMasterPubKey,
    trezorGetWalletCreationMasterPubKey,
    trezorAlertNoConnectedDevice,
    trezorDisable,
    trezorEnable,
    trezorLoadDeviceList,
    getDcrwalletLogs,
    onCreateWallet,
    goToErrorPage,
    onRemoveWallet,
    onStartWallet,
    onGetAvailableWallets,
    syncDaemon,
    checkNetworkMatch,
    onConnectDaemon,
    onStartDaemon,
    onOpenWallet,
    getSelectedWallet,
    setSelectedWallet,
    startSPVSync,
    onRetryStartRPC,
    finishPrivacy,
    setupStandardPrivacy,
    setupDisabledPrivacy,
    toggleSpv,
    onSelectLanguage,
    onShowGetStarted,
    onShowLanguage,
    onShowPrivacy,
    onShowSpvChoice,
    finishTutorial,
    appVersion,
    updateAvailable,
    setLanguage,
    showTutorial,
    showSpvChoice,
    showPrivacy,
    availableLanguages,
    defaultLocale,
    sAdvancedDaemon,
    isSPV,
    isTestNet,
    availableWallets,
    getDaemonSynced,
    getCurrentBlockCount,
    getNeededBlocks,
    getDaemonStarted,
    getEstimatedTimeLeft,
    trezorDevice,
    isTrezor,
    maxWalletCount,
    peerCount,
    synced,
    syncFetchMissingCfiltersAttempt,
    syncFetchMissingCfiltersStart,
    syncFetchMissingCfiltersEnd,
    syncFetchHeadersAttempt,
    syncFetchHeadersCount,
    syncFetchHeadersLastHeaderTime,
    syncDiscoverAddressesAttempt,
    syncRescanAttempt,
    syncFetchHeadersComplete,
    syncFetchTimeStart,
    selectedWalletSelector
  };
};

export default useDaemonStartup;
