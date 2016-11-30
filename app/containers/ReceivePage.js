// @flow
import { connect } from 'react-redux';
import Receive from '../components/Receive';

function mapStateToProps(state) {
  return {
    client: state.login.client,
    loggedIn: state.login.loggedIn,
  };
}

export default connect(mapStateToProps)(Receive);
