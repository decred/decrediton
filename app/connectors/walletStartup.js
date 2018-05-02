import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as wla from "../actions/WalletLoaderActions";
import * as da from "../actions/DaemonActions";

const mapStateToProps = selectorMap({
  appVersion: sel.appVersion,
  setLanguage: sel.setLanguage,
  showTutorial: sel.showTutorial,
  showPrivacy: sel.showPrivacy,
  startStepIndex: sel.startStepIndex,
  isInputRequest: sel.isInputRequest,
  startupError: sel.startupError,
  confirmNewSeed: sel.confirmNewSeed,
  existingOrNew: sel.existingOrNew,
  hasExistingWallet: sel.hasExistingWallet,
  getDaemonStarted: sel.getDaemonStarted,
  getDaemonSynced: sel.getDaemonSynced,
  getCurrentBlockCount: sel.getCurrentBlockCount,
  getNeededBlocks: sel.getNeededBlocks,
  getWalletReady: sel.getWalletReady,
  getEstimatedTimeLeft: sel.getEstimatedTimeLeft,
  isPrepared: sel.isPrepared,
  isTestNet: sel.isTestNet,
  network: sel.network,
  isAdvancedDaemon: sel.isAdvancedDaemon,
  openForm: sel.openForm,
  isOpeningWallet: sel.isOpeningWallet,
  remoteAppdataError: sel.getRemoteAppdataError,
  rescanEndBlock: sel.rescanEndBlock,
  rescanStartBlock: sel.rescanStartBlock,
  rescanCurrentBlock: sel.rescanCurrentBlock,
  availableWallets: sel.availableWalletsSelect,
  walletName: sel.getWalletName,
  previousWallet: sel.previousWallet,
  availableLanguages: sel.sortedLocales,
  locale: sel.currentLocaleName,
  defaultLocale: sel.defaultLocaleName,
  updateAvailable: sel.updateAvailable
});

const mapDispatchToProps = dispatch => bindActionCreators({
  determineNeededBlocks: wla.determineNeededBlocks,
  prepStartDaemon: da.prepStartDaemon,
  onShowTutorial: da.showTutorial,
  onShowPrivacy: da.showPrivacy,
  onShowLanguage: da.showLanguage,
  onShowGetStarted: da.showGetStarted,
  onSelectLanguage: da.selectLanguage,
  finishTutorial: da.finishTutorial,
  finishPrivacy: da.finishPrivacy,
  setupStandardPrivacy: da.setupStandardPrivacy,
  setupDisabledPrivacy: da.setupDisabledPrivacy,
  onReturnToNewSeed: wla.createWalletGoBackNewSeed,
  onReturnToWalletSelection: wla.createWalletGoBackWalletSelection,
  onReturnToExistingOrNewScreen: wla.createWalletGoBackExistingOrNew,
  onSetCreateWalletFromExisting: wla.createWalletExistingToggle,
  onDiscoverAddresses: wla.discoverAddressAttempt,
  onOpenWallet: wla.openWalletAttempt,
  onRetryStartRPC: wla.startRpcRequestFunc,
  doVersionCheck: wla.versionCheckAction,
  onStartDaemon: da.startDaemon,
  onStartWallet: da.startWallet,
  onCreateWallet: da.createWallet,
  onRemoveWallet: da.removeWallet,
  setCredentialsAppdataError: da.setCredentialsAppdataError,
  onGetAvailableWallets: da.getAvailableWallets
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
