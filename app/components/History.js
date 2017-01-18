// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import SideBar from './SideBar';
import Header from './Header';
import TxHistory from './TxHistory';

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
    left: '202px',
    bottom: '0px',
    right: '0px',
  },
};

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, transactions } = this.props;

    const historyView = (
      <div style={styles.content}>
        <TxHistory transactions={transactions}/>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <Header />
          <SideBar />
          {historyView}
        </div>);
    }
  }
}

export default History;
