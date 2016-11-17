// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Overview from '../components/Overview';
import * as BalanceActions from '../actions/balance';

function mapStateToProps(state) {
    return {
        counter: state.counter
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(BalanceActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);