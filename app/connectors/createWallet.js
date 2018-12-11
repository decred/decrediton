import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as ca from "actions/ClientActions";
import * as trza from "actions/TrezorActions";

const mapStateToProps = selectorMap({
  createWalletExisting: sel.createWalletExisting,
  isCreatingWallet: sel.isCreatingWallet,
  confirmNewSeed: sel.confirmNewSeed,
  createNewWallet: sel.createNewWallet,
  isTestNet: sel.isTestNet,
  isCreatingWatchingOnly: sel.isWatchingOnly,
  masterPubKey: sel.masterPubKey,
  maxWalletCount: sel.maxWalletCount,
  trezorDeviceList: sel.trezorDeviceList,
  trezorDevice: sel.trezorDevice,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createWalletConfirmNewSeed: wla.createWalletConfirmNewSeed,
  createWalletGoBackNewSeed: wla.createWalletGoBackNewSeed,
  createWalletRequest: wla.createWalletRequest,
  copySeedToClipboard: ca.copySeedToClipboard,
  createWatchOnlyWalletRequest: wla.createWatchOnlyWalletRequest,
  generateSeed: wla.generateSeed,
  decodeSeed: wla.decodeSeed,
  trezorLoadDeviceList: trza.loadDeviceList,
  trezorEnable: trza.enableTrezor,
  trezorDisable: trza.disableTrezor,
  trezorAlertNoConnectedDevice: trza.alertNoConnectedDevice,
  trezorGetWalletCreationMasterPubKey: trza.getWalletCreationMasterPubKey
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
