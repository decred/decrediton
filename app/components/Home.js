// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import LoaderForm from '../containers/LoaderForm';
import WalletExistForm from '../containers/WalletExistForm';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../containers/CreateWalletForm';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

const styles = {
  mainArea: {
    backgroundColor:'#2971ff'
  },
  sideBar: {
    backgroundColor:'#2ed8a3'
  },
  error: {
    color:'red'
  },
  buttons: {
    margin: 12
  }
};

class Home extends Component{
  constructor(props) {
    super(props);
  }

  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    client: PropTypes.object,

    getBalanceRequestAttempt: PropTypes.bool.isRequired,
    getStakeInfoRequestAttempt: PropTypes.bool.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getBalanceAttempt(0,1);
  }

  render() {
    const { isLoggedIn, client} = this.props;

    const { getBalanceRequestAttempt, getBalanceResponse } = this.props;
    const { getStakeInfoRequestAttempt, getStakeInfoResponse } = this.props;
  
    /* View that will be seen when user has a set Client */
    const homeView = (
      <div >
        <h1>Home Page</h1>
        <h3>Current balance: {getBalanceResponse === null ? 'Please refresh' : getBalanceResponse.total }</h3>
        <RaisedButton
          style={styles.buttons}
          disabled={getBalanceRequestAttempt}
          onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
          label={getBalanceRequestAttempt ? 'Getting Balance...' : 'Get Balance'}/>
        <h3>StakeInfo: {getStakeInfoResponse === null ? 'Please refresh' : getStakeInfoResponse.pool_size}</h3>
        <RaisedButton
          style={styles.buttons}
          disabled={getStakeInfoRequestAttempt}
          onClick={!getStakeInfoRequestAttempt? () => this.props.getStakeInfoAttempt() : null}
          label={getStakeInfoRequestAttempt ? 'Getting Stake Info...' : 'Get Stake Info'}/>
        <RaisedButton
          style={styles.buttons}
          onClick={() => this.props.loadActiveDataFiltersAttempt()}
          label='Load Active Data Filters'/>
      </div>);
    const errorView = (
      <div>
        <p>Something went wrong</p>
      </div>);

    if (isLoggedIn) {
      if (client === undefined) {
        return(errorView);
      } else {
        return(homeView);
      }
    } else {
      return(errorView);
    }
  }
}

export default Home;
