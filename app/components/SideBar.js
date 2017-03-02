import React, { Component } from 'react';
import { connect } from 'react-redux';
import arrowUpLightBlue from './icons/arrow-up-light-blue.svg';
import menulogo from './icons/menu-logo.svg';
import MenuLink from './MenuLink';
import HelpLink from './HelpLink';
import './fonts.css';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,

    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getStakeInfoRequestAttempt: state.grpc.getStakeInfoRequestAttempt,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
    getAccountsResponse: state.grpc.getAccountsResponse,
    transactionNtfnsResponse: state.notifications.transactionNtfnsResponse,
    timeSince: state.notifications.timeSince,
    currentHeight: state.notifications.currentHeight,
    timeBack:  state.notifications.timeBack,
  };
}

const styles = {
  menu:{
    position: 'relative',
    overflow: 'hidden',
    width: '298px',
    height: '100%',
    paddingBottom: '54px',
    float: 'left',
    backgroundColor: '#0c1e3e',
  },
  menuLogo:{
    position: 'relative',
    zIndex: '3',
    height: '60px',
    paddingTop: '20px',
    backgroundColor: '#0c1e3e',
    backgroundImage: `url(${menulogo})`,
    backgroundPosition: '58px 50%',
    backgroundSize: 'auto 30px',
    backgroundRepeat: 'no-repeat',
  },
  testnetText: {
    color: 'white',
    textAlign: 'center',
    fontSize: '18px',
    height: '46px',
    fontFamily: 'Inconsolata, monospace',
  },
  menuNavigation:{
    position: 'absolute',
    left: '0px',
    top: '106px',
    right: '0px',
    bottom: '122px',
    zIndex: '1',
    overflow: 'auto',
  },

  menuTotalBalanceExtended: {
    position: 'absolute',
    left: '0px',
    top: '106px',
    right: '0px',
    bottom: '157px',
    zIndex: '2',
    overflow: 'auto',
    backgroundColor: 'rgba(9, 24, 45, .8)',
    transition: 'all 100ms cubic-bezier(.86, 0, .07, 1)',
  },
  menuTotalBalanceExtendedHidden: {
    display: 'none',
    position: 'absolute',
    left: '0px',
    top: '106px',
    right: '0px',
    bottom: '157px',
    zIndex: '2',
    overflow: 'auto',
    backgroundColor: 'rgba(9, 24, 45, .8)',
    transition: 'all 100ms cubic-bezier(.86, 0, .07, 1)',
  },
  menuTotalBalanceExtendedBottom: {
    position: 'absolute',
    left: '0px',
    right: '0px',
    bottom: '0px',
    overflow: 'auto',
    maxHeight: '100%',
    paddingRight: '18px',
    paddingLeft: '18px',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  menuTotalBalanceExtendedBottomAccount: {
    display: 'block',
    height: '44px',
    paddingTop: '24px',
    alignSelf: 'stretch',
    flex: '0 0 auto',
  },
  menuTotalBalanceExtendedBottomAccountName: {
    float: 'left',
    color: '#69d5f7',
    fontSize: '13px',
    lineHeight: '10px',
    textAlign: 'left',
  },
  menuTotalBalanceExtendedBottomAccountNumber: {
    float: 'right',
    fontFamily: 'Inconsolata, monospace',
    color: '#2ed8a3',
    fontSize: '15px',
    lineHeight: '10px',
    textAlign: 'right',
  },
  menuBottom: {
    position: 'absolute',
    left: '0px',
    right: '0px',
    bottom: '0px',
    zIndex: '2',
  },
  menuBottomTotalBalanceShort: {
    position: 'relative',
    height: '56px',
    paddingTop: '14px',
    paddingRight: '18px',
    paddingLeft: '18px',
    backgroundColor: '#0c1e3e',
    cursor: 'pointer',
  },
  menuBottomTotalBalanceShortSeperator: {
    height: '7px',
    marginBottom: '15px',
    borderBottom: '1px solid #69d5f7',
    backgroundImage: `url(${arrowUpLightBlue})`,
    backgroundPosition: '50% 0px',
    backgroundRepeat: 'no-repeat',
  },
  menuBottomTotalBalanceShortName: {
    float: 'left',
    color: '#69d5f7',
    fontSize: '13px',
    lineHeight: '10px',
    textAlign: 'left',
    textDecoration: 'none',
  },
  menuBottomTotalBalanceShortValue: {
    float: 'right',
    fontFamily: 'Inconsolata, monospace',
    color: '#2ed8a3',
    fontSize: '13px',
    lineHeight: '10px',
    textAlign: 'right',
  },
  menuBottomLatestBlock: {
    position: 'relative',
    height: '89px',
    paddingTop: '14px',
    paddingRight: '18px',
    paddingLeft: '18px',
    backgroundColor: '#09182d',
  },
  menuBottomLatestBlockName: {
    float: 'left',
    color: '#69d5f7',
    fontSize: '13px',
    lineHeight: '10px',
    textAlign: 'left',
    textDecoration: 'none',
  },
  menuBottomLatestBlockNumber: {
    fontFamily: 'Inconsolata, monospace',
    color: '#2ed8a3',
  },
  menuBottomLatestBlockTime: {
    float: 'right',
    color: '#69d5f7',
    fontSize: '13px',
    lineHeight: '10px',
    textAlign: 'right',
    textDecoration: 'none',
  },
  sidebarHelp: {
    display: 'block',
    height: '215px',
    marginTop: '65px',
    paddingLeft: '18px',
    paddingRight: '18px',
  },
  sidebarHelpTitle: {
    borderTop: '1px solid #69d5f7',
    borderBottom: '1px solid #69d5f7',
    paddingLeft: '5px',
    display: 'block',
    height: '38px',
    paddingTop: '15px',
    color: '#c4cbd2',
    fontSize: '18px',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountsHidden: true,
      timeSince: null,
    };
    this.showAccounts = this.showAccounts.bind(this);
    this.hideAccounts = this.hideAccounts.bind(this);
    this.updateBlockTimeSince = this.updateBlockTimeSince.bind(this);
  }
  componentDidMount() {
    setTimeout(() =>{this.updateBlockTimeSince();}, 1000);
  }
  updateBlockTimeSince() {
    const { transactionNtfnsResponse } = this.props;
    if (transactionNtfnsResponse !== null && transactionNtfnsResponse.getAttachedBlocksList().length > 0) {
      const attachedBlocks = transactionNtfnsResponse.getAttachedBlocksList();
      var currentTime = new Date();
      var recentBlockTime = new Date(attachedBlocks[attachedBlocks.length-1].getTimestamp()*1000);
      var difference = (currentTime - recentBlockTime);
      var timeSince = Math.floor(difference / 60000);
      if (timeSince == 0) {
        this.setState({timeSince: '<1 min ago'});
      } else if (timeSince == 1) {
        this.setState({timeSince: '1 min ago'});
      } else if (timeSince > 1) {
        this.setState({timeSince: timeSince.toString() + ' mins ago'});
      }
    }
    setTimeout(() =>{this.updateBlockTimeSince();}, 10000);
  }
  showAccounts() {
    this.setState({accountsHidden: false});
  }

  hideAccounts() {
    this.setState({accountsHidden: true});
  }

  render() {
    const { gettingStarted, errorPage } = this.props;
    if ( gettingStarted || errorPage ) {
      return (
        <div style={styles.menu}>
          <div style={styles.menuLogo}></div>
        </div>);
    }
    const { getBalanceResponse } = this.props;
    const { getAccountsResponse } = this.props;
    const { getNetworkResponse } = this.props;
    const { timeBack, currentHeight } = this.props;
    const { timeSince, transactionNtfnsResponse } = this.props;

    var balance = 0;
    if (getBalanceResponse != null) {
      balance = getBalanceResponse.getTotal() / 100000000;
    }
    return (
      <div style={styles.menu}>
        <div style={styles.menuLogo}></div>
        <div style={styles.testnetText}>{getNetworkResponse !== null && getNetworkResponse.networkStr == 'testnet' ? 'Testnet' : ''}</div>
        <div style={styles.menuNavigation}>
          <MenuLink to="/home">Overview</MenuLink>
          <MenuLink to="/send">Send</MenuLink>
          <MenuLink to="/receive">Receive</MenuLink>
          <MenuLink to="/history">History</MenuLink>
          <MenuLink to="/settings">Settings</MenuLink>
          <div style={styles.sidebarHelp}>
            <div style={styles.sidebarHelpTitle}>Help links</div>
            <HelpLink href="https://forum.decred.org">Forum</HelpLink>
            <HelpLink href="https://decred.slack.com">Chat</HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues">Issues</HelpLink>
          </div>
        </div>
        <div style={!this.state.accountsHidden ? styles.menuTotalBalanceExtended : styles.menuTotalBalanceExtendedHidden }>
          <div style={styles.menuTotalBalanceExtendedBottom}>
            {getAccountsResponse != null ? getAccountsResponse.getAccountsList().map(function(account) {
              var accountBalance = 0;
              if (account.getTotalBalance() > 0) {
                accountBalance = account.getTotalBalance() / 100000000;
              }
              return(
                <div style={styles.menuTotalBalanceExtendedBottomAccount} key={account.getAccountName()}>
                  <div style={styles.menuTotalBalanceExtendedBottomAccountName}>{account.getAccountName()}</div>
                  <div style={styles.menuTotalBalanceExtendedBottomAccountNumber}>{accountBalance}</div>
                </div>
              );
            }) : <div></div>}
          </div>
        </div>
        <div style={styles.menuBottom}>
          <div style={styles.menuBottomTotalBalanceShort} onMouseEnter={() => {this.showAccounts();}} onMouseLeave={() => {this.hideAccounts();}}>
            <div style={styles.menuBottomTotalBalanceShortSeperator}></div>
            <div style={styles.menuBottomTotalBalanceShortName}>Total balance:</div>
            <div style={styles.menuBottomTotalBalanceShortValue}>{balance.toString()}</div>
          </div>
          {transactionNtfnsResponse !== null ?
            <div style={styles.menuBottomLatestBlock}>
              <a style={styles.menuBottomLatestBlockName}>Latest block: <span style={styles.menuBottomLatestBlockNumber}>{transactionNtfnsResponse.getAttachedBlockList()[0].getHeight()}</span></a>
              <div style={styles.menuBottomLatestBlockTime}>{timeSince}</div>
            </div>:
            <div style={styles.menuBottomLatestBlock}>
              <a style={styles.menuBottomLatestBlockName}>Synced to block: <span style={styles.menuBottomLatestBlockNumber}>{currentHeight}</span></a>
              <div style={styles.menuBottomLatestBlockTime}>{timeBack}</div>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SideBar);
