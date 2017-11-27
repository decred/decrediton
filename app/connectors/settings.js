import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as sa from "../actions/SettingsActions";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  currencies: sel.currencies,
  networks: sel.networks,
  locales: sel.sortedLocales,
  tempSettings: sel.tempSettings,
  areSettingsDirty: sel.settingsChanged
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onAttemptChangePassphrase: ca.changePassphraseAttempt,
  onChangeTempSettings: sa.updateStateSettingsChanged,
  onSaveSettings: sa.saveSettings,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
