// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Settings from './Settings';
import { saveSettings, updateStateSettingsChanged } from '../../actions/SettingsActions';
import { clearChangePassphraseError, clearChangePassphraseSuccess, changePassphraseAttempt } from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    currentSettings: state.settings.currentSettings,
    settingsChanged: state.settings.settingsChanged,
    tempSettings: state.settings.tempSettings,
    changePassphraseError: state.control.changePassphraseError,
    changePassphraseRequestAttempt: state.control.changePassphraseRequestAttempt,
    changePassphraseSuccess: state.control.changePassphraseSuccess,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearChangePassphraseError, clearChangePassphraseSuccess, changePassphraseAttempt, saveSettings, updateStateSettingsChanged }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
