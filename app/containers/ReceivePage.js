// @flow
import { connect } from 'react-redux';
import Receive from '../components/Receive';

function mapStateToProps(state) {
  return {
    client: state.login.client,
  };
}

export default connect(mapStateToProps)(Receive);
