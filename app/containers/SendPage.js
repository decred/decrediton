// @flow
import { connect } from 'react-redux';
import Send from '../components/Send';

function mapStateToProps(state) {
  return {
    client: state.login.client,
  };
}

export default connect(mapStateToProps)(Send);
