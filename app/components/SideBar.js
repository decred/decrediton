import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Balance from './Balance';
import DecredLogo from './icons/DecredLogo';

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
    top:'0px',
    bottom:'0px',
    left:'0px',
    width:'250px',
    background:'#132f4b',
    borderRight: '1px solid black'
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 30px',
    color: '#757575',
    textDecoration: 'none',
  },
  sidebarTitle: {
    display: 'block',
    padding: '0px',
    color: '#757575',
    textDecoration: 'none',
    fontSize: '0.8em',
    borderBottom: '1px solid black',
    textAlign: 'left',
    marginTop: '0.1em'
  },
  sidebarBlocks: {
    textAlign: 'right',
    marginTop: '0px',
    marginBottom: '0px',
  },
  sideBarBalance: {
    textAlign: 'right',
    marginTop: '0px',
    marginBottom: '0px',
  },
  active: {
    color: 'white',
    textDecoration: 'none',
    borderLeft: '5px solid #2ed8a3',
    backgroundColor: '#0d2034',
  },
  wellBalance: {
    width: 'auto',
    fontWeight: 'bold',
    //font-family: $inconsolata;
    fontSize: '1.2rem',
    backgroundColor:'#e9f8fe',
    padding: '5px 5px',
    margin: '20px 0 0 0',
    border: '2px solid #cacfd6',
    textAlign: 'center',
    color: '#0c1e3e',
    boxShadow: 'none!important',
  },
  wellBlocks: {
    width: 'auto',
    fontWeight: 'bold',
    //font-family: $inconsolata;
    fontSize: '1.2rem',
    backgroundColor:'#e9f8fe',
    padding: '5px 5px',
    marginTop: '0px',
    border: '2px solid #cacfd6',
    borderTop: '0px',
    textAlign: 'center',
    color: '#0c1e3e',
    boxShadow: 'none!important',
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
      <div style={styles.logoArea}>
        <DecredLogo />
      </div>
      <div style={styles.linkArea}>
        <Link to="/home" style={styles.sidebarLink} activeStyle={styles.active}>Home</Link>
        <Link to="/history" style={styles.sidebarLink} activeStyle={styles.active}>History</Link>
        <Link to="/send" style={styles.sidebarLink} activeStyle={styles.active}>Send Decred</Link>
        <Link to="/receive" style={styles.sidebarLink} activeStyle={styles.active}>Receive Decred</Link>
      </div>
      <div style={styles.pushToBottom}>
        <div style={styles.wellBalance}>
          <p style={styles.sidebarTitle}>Balance:</p>
          <p style={styles.sidebarBalance}>
            {getBalanceResponse === null ? 'Please refresh' :
              <Balance onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
              amount={getBalanceResponse.getTotal()} /> }
          </p>
        </div>
        <div style={styles.wellBlocks}>
          <p style={styles.sidebarTitle}>Block Height:</p>
          <p style={styles.sidebarBlocks}>{getAccountsResponse === null ? '""' : getAccountsResponse.getCurrentBlockHeight() }</p>
        </div>
      </div>
    </div>
    );
  }
}

export default connect(mapStateToProps)(SideBar);

