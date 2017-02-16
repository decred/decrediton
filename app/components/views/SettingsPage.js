// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Settings from './Settings';
import * as SettingsActions from '../../actions/SettingsActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    currentSettings: state.settings.currentSettings,
    settingsChanged: state.settings.settingsChanged,
    tempSettings: state.settings.tempSettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SettingsActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
