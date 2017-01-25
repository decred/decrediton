// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Settings from '../components/Settings';
import * as ClientActions from '../actions/ClientActions';
import * as ControlActions from '../actions/ControlActions';
import * as SettingsActions from '../actions/SettingsActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    currencyDisplay: state.settings.currencyDisplay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
