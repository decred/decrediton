import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as trza from "../actions/TrezorActions";

const mapStateToProps = selectorMap({
  isTrezor: sel.isTrezor,
  waitingForPin: sel.trezorWaitingForPin,
  waitingForPassPhrase: sel.trezorWaitingForPassPhrase,
  waitingForWord: sel.trezorWaitingForWord,
  device: sel.trezorDevice,
  performingOperation: sel.trezorPerformingOperation,
  isGetStarted: sel.isGetStarted,
  deviceList: sel.trezorDeviceList,
  walletCreationMasterPubkeyAttempt: sel.trezorWalletCreationMasterPubkeyAttempt,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadDeviceList: trza.loadDeviceList,
  cancelCurrentOperation: trza.cancelCurrentOperation,
  submitPin: trza.submitPin,
  submitPassPhrase: trza.submitPassPhrase,
  submitWord: trza.submitWord,
  togglePinProtection: trza.togglePinProtection,
  togglePassPhraseProtection: trza.togglePassPhraseProtection,
  changeToDecredHomeScreen: trza.changeToDecredHomeScreen,
  changeLabel: trza.changeLabel,
  wipeDevice: trza.wipeDevice,
  recoverDevice: trza.recoverDevice,
  initDevice: trza.initDevice,
  updateFirmware: trza.updateFirmware,
  enableTrezor: trza.enableTrezor,
  reloadDeviceList: trza.reloadTrezorDeviceList,
  clearDeviceSession: trza.clearDeviceSession,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
