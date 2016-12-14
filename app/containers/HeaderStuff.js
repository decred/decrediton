// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';

function mapStateToProps(state) {
  return {
    stepIndex: state.walletLoader.stepIndex,
  };
}

export default connect(mapStateToProps)(Header);
