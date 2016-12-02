// @flow
import { connect } from 'react-redux';
import Receive from '../components/Receive';

function mapStateToProps(state) {
  return {
    client: state.login.client,
    isLoggedIn: state.login.isLoggedIn,
  };
}

export default connect(mapStateToProps)(Receive);
