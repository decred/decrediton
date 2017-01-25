// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Settings from '../components/Settings';
import * as ClientActions from '../actions/ClientActions';
import * as ControlActions from '../actions/ControlActions';

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
