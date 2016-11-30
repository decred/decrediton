// @flow
import { connect } from 'react-redux';
import Send from '../components/Send';

function mapStateToProps(state) {
  return {
    client: state.login.client,
    loggedIn: state.login.loggedIn,
  };
}

export default connect(mapStateToProps)(Send);
