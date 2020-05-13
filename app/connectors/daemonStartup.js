import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";
import * as ctrla from "actions/ControlActions";
import * as trza from "actions/TrezorActions";

const mapStateToProps = selectorMap({
  // general selectors

  // version selectors
  appVersion: sel.appVersion,
  updateAvailable: sel.updateAvailable,

  // Get posistion selectors when first starting decrediton
  setLanguage: sel.setLanguage,
  showTutorial: sel.showTutorial,
  showSpvChoice: sel.showSpvChoice,
  showPrivacy: sel.showPrivacy,

  // language page selectors
  availableLanguages: sel.sortedLocales,
  defaultLocale: sel.defaultLocaleName,

  // end of general selectors

  // start daemon selectors
  isAdvancedDaemon: sel.isAdvancedDaemon,
  isSPV: sel.isSPV,
  isTestNet: sel.isTestNet,
  availableWallets: sel.sortedAvailableWallets,
  getDaemonSynced: sel.getDaemonSynced,
  getCurrentBlockCount: sel.getCurrentBlockCount,
  getNeededBlocks: sel.getNeededBlocks,
  getDaemonStarted: sel.getDaemonStarted,
  getEstimatedTimeLeft: sel.getEstimatedTimeLeft,
  trezorDevice: sel.trezorDevice,
  isTrezor: sel.isTrezor,
  maxWalletCount: sel.maxWalletCount,
  // end of daemon selectors

  // sync dcrwallet spv or rpc selectors
  peerCount: sel.peerCount,
  synced: sel.synced,
  syncFetchMissingCfiltersAttempt: sel.syncFetchMissingCfiltersAttempt,
  syncFetchMissingCfiltersStart: sel.syncFetchMissingCfiltersStart,
  syncFetchMissingCfiltersEnd: sel.syncFetchMissingCfiltersEnd,
  syncFetchHeadersAttempt: sel.syncFetchHeadersAttempt,
  syncFetchHeadersCount: sel.syncFetchHeadersCount,
  syncFetchHeadersLastHeaderTime: sel.syncFetchHeadersLastHeaderTime,
  syncDiscoverAddressesAttempt: sel.syncDiscoverAddressesAttempt,
  syncRescanAttempt: sel.syncRescanAttempt,
  syncFetchHeadersComplete: sel.syncFetchHeadersComplete,
  syncFetchTimeStart: sel.syncFetchTimeStart,
  selectedWalletSelector: sel.getSelectedWallet
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // general methods
      // Methods for showing positions when first starting decrediton
      onShowTutorial: da.showTutorial,
      onShowSpvChoice: da.showSpvChoice,
      onShowPrivacy: da.showPrivacy,
      onShowCreateWallet: da.showCreateWallet,
      onShowLanguage: da.showLanguage,
      onShowGetStarted: da.showGetStarted,

      // language page
      onSelectLanguage: da.selectLanguage,

      // privacy page
      setupStandardPrivacy: da.setupStandardPrivacy,
      setupDisabledPrivacy: da.setupDisabledPrivacy,

      // spv page
      toggleSpv: da.toggleSpv,

      // tutorial page
      finishTutorial: da.finishTutorial,
      // end of general methods

      // start daemon and wallet methods
      onRetryStartRPC: wla.startRpcRequestFunc,
      startSPVSync: wla.spvSyncAttempt,
      setSelectedWallet: wla.setSelectedWallet,
      getSelectedWallet: wla.getSelectedWallet,
      onOpenWallet: wla.openWalletAttempt,
      onStartDaemon: da.startDaemon,
      onConnectDaemon: da.connectDaemon,
      checkNetworkMatch: da.checkNetworkMatch,
      syncDaemon: da.syncDaemon,
      onGetAvailableWallets: da.getAvailableWallets,
      onStartWallet: da.startWallet,
      onRemoveWallet: da.removeWallet,
      goToErrorPage: ca.goToError,

      // create or restore wallet methods
      onCreateWallet: da.createWallet,
      getDcrwalletLogs: da.getDcrwalletLogs,
      trezorLoadDeviceList: trza.loadDeviceList,
      trezorEnable: trza.enableTrezor,
      trezorDisable: trza.disableTrezor,
      trezorAlertNoConnectedDevice: trza.alertNoConnectedDevice,
      trezorGetWalletCreationMasterPubKey: trza.getWalletCreationMasterPubKey,
      validateMasterPubKey: ctrla.validateMasterPubKey
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
