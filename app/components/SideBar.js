import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Balance from './Balance';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,

    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getStakeInfoRequestAttempt: state.grpc.getStakeInfoRequestAttempt,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,
    getAccountsResponse: state.grpc.getAccountsResponse,
  };
}

const styles = {
  sideBar: {
    position: 'absolute',
    top:'70px',
    bottom:'0px', 
    left:'0px',
    width:'200px',
    background:'white',
    borderRight: '1px solid black'
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  active: {
    color: 'black',
    textDecoration: 'none',
  },
  pushToBottom: {
    position: 'relative',
    marginBottom: '-200px',
  }
};

class SideBar extends Component {
  render() {
    const { getBalanceRequestAttempt, getBalanceResponse } = this.props;
    const { getAccountsResponse } = this.props;
    return (
    <div style={styles.sideBar}>
      <Link to="/home" style={styles.sidebarLink} activeStyle={styles.active}>Home</Link>
      <Link to="/history" style={styles.sidebarLink} activeStyle={styles.active}>History</Link>
      <Link to="/send" style={styles.sidebarLink} activeStyle={styles.active}>Send Decred</Link>
      <Link to="/receive" style={styles.sidebarLink} activeStyle={styles.active}>Receive Decred</Link>
      <div style={styles.pushToBottom}>
        {getBalanceResponse === null ? 'Please refresh' :
          <Balance onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
          amount={getBalanceResponse.getTotal()} /> }<span style={styles.small}> DCR</span>
        <p>{getAccountsResponse === null ? '""' : getAccountsResponse.getCurrentBlockHeight() }</p>
      </div>
    </div>
    );
  }
}

export default connect(mapStateToProps)(SideBar);

