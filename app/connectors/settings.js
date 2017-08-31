import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import {
  currencyDisplay,
  unitDivisor,
  tempSettings,
  changePassphraseError,
  changePassphraseSuccess,
  settingsChanged
} from "../selectors";
import { saveSettings, updateStateSettingsChanged } from "../actions/SettingsActions";
import {
  clearChangePassphraseError,
  clearChangePassphraseSuccess,
  changePassphraseAttempt
} from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  currencyDisplay,
  unitDivisor,
  tempSettings,
  changePassphraseError,
  changePassphraseSuccess,
  areSettingsDirty: settingsChanged
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onClearChangePassphraseError: clearChangePassphraseError,
  onClearChangePassphraseSuccess: clearChangePassphraseSuccess,
  onAttemptChangePassphrase: changePassphraseAttempt,
  onChangeTempSettings: updateStateSettingsChanged,
  onSaveSettings: saveSettings,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
