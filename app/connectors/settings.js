import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as sa from "../actions/SettingsActions";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  currencyDisplay: sel.currencyDisplay,
  unitDivisor: sel.unitDivisor,
  tempSettings: sel.tempSettings,
  locales: sel.sortedLocales,
  changePassphraseError: sel.changePassphraseError,
  changePassphraseSuccess: sel.changePassphraseSuccess,
  areSettingsDirty: sel.settingsChanged
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onAttemptChangePassphrase: ca.changePassphraseAttempt,
  onChangeTempSettings: sa.updateStateSettingsChanged,
  onSaveSettings: sa.saveSettings,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
