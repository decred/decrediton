// @flow
import { connect } from 'react-redux';
import History from '../components/History';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
  };
}

export default connect(mapStateToProps)(History);
