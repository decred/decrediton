import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as trza from "../actions/TrezorActions";

const mapStateToProps = selectorMap({
  isTrezor: sel.isTrezor,
  isPerformingUpdate: sel.isPerformingTrezorUpdate,
  waitingForPin: sel.trezorWaitingForPin,
  waitingForPassPhrase: sel.trezorWaitingForPassPhrase,
  waitingForWord: sel.trezorWaitingForWord,
  performingOperation: sel.trezorPerformingOperation,
  isGetStarted: sel.isGetStarted,
  device: sel.trezorDevice,
  walletCreationMasterPubkeyAttempt: sel.trezorWalletCreationMasterPubkeyAttempt
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      connect: trza.connect,
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
      backupDevice: trza.backupDevice,
      updateFirmware: trza.updateFirmware,
      enableTrezor: trza.enableTrezor
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
