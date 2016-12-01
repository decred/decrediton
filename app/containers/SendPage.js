// @flow
import { connect } from 'react-redux';
import Send from '../components/Send';

function mapStateToProps(state) {
  return {
    client: state.login.client,
    isLoggedIn: state.login.isLoggedIn,
  };
}

export default connect(mapStateToProps)(Send);
