// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import SideBar from './SideBar';
import TxHistory from './TxHistory';
import Balance from './Balance';

const styles = {
  body: {
    height: '100%'
  },
  pageWrap: {
    minHeight: '100%',
    /* equal to footer height */
    marginBottom: '-142px',


    ':after': {
      content: '',
      display: 'block',
    },
  },
  header: {
    border:'1px solid #000',
    width:'100px',
    height:'20px',
    margin:'0 0 5px 0',
  },
  content: {
    position: 'absolute',
    top: '78px',
    left: '252px',
    bottom: '0px',
    right: '0px',
  },
  well: {
    width: 'auto',
    fontWeight: 'bold',
    //font-family: $inconsolata;
    fontSize: '1.2rem',
    backgroundColor:'#e9f8fe',
    padding: '5px 5px',
    margin: '20px 0 15px 0',
    border: '2px solid #cacfd6',
    borderRadius: '2px',
    textAlign: 'center',
    color: '#0c1e3e',
    boxShadow: 'none!important',
  },
};

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, mined, unmined, getBalanceResponse, getBalanceRequestAttempt } = this.props;

    const historyView = (
      <div style={styles.content}>
        <h3>Available Balance:</h3>
        <div style={styles.well}>
          {getBalanceResponse === null ? 'Please refresh' :
              <Balance onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
              amount={getBalanceResponse.getTotal()} /> }
        </div>
        <TxHistory mined={mined} unmined={unmined}/>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {historyView}
        </div>);
    }
  }
}

export default History;
