import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as sa from "../actions/SettingsActions";
import * as ca from "../actions/ControlActions";
import * as wla from "../actions/WalletLoaderActions";

// custom hook already used in some places src/hooks/useSettings
// TODO: delete when fully migrated

const mapStateToProps = selectorMap({
  currencies: sel.currencies,
  networks: sel.networks,
  locales: sel.sortedLocales,
  tempSettings: sel.tempSettings,
  areSettingsDirty: sel.settingsChanged,
  isChangePassPhraseDisabled: sel.isChangePassPhraseDisabled,
  changePassphraseRequestAttempt: sel.changePassphraseRequestAttempt,
  isTicketAutoBuyerEnabled: sel.isTicketAutoBuyerEnabled,
  needNetworkReset: sel.needNetworkReset,
  walletName: sel.getWalletName,
  walletReady: sel.getWalletReady
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onAttemptChangePassphrase: ca.changePassphraseAttempt,
      onChangeTempSettings: sa.updateStateSettingsChanged,
      onSaveSettings: sa.saveSettings,
      onCloseWallet: wla.closeWalletRequest,
      onAddAllowedRequestType: sa.addAllowedExternalRequest,
      toggleTheme: sa.toggleTheme
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
