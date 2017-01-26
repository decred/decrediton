import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Balance from './Balance';
import MenuLogo from './icons/MenuLogo';
import ArrowUpLightBlue from './icons/ArrowUpLightBlue';
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
    height: '106px',
    backgroundColor: '#0c1e3e',
    backgroundPosition: '58px 50%',
    backgroundSize: 'auto 30px',
    backgroundRepeat: 'no-repeat',
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
  menuNavigationLink:{ 
    display: 'block',
    height: '54px',
    paddingTop: '17px',
    paddingLeft: '58px',
    //backgroundImage: 'url('../images/menu-link-left-color.png')',
    backgroundPosition: '0px 50%',
    backgroundSize: '0px',
    backgroundRepeat: 'repeat-y',
    color: '#c4cbd2',
    fontSize: '18px',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
  menuNaviationLinkActive:{
    backgroundColor: '#09182d',
    //background-image: 'url('../images/menu-link-left-color.png')',
    backgroundPosition: '0px 50%',
    backgroundSize: '5px',
    backgroundRepeat: 'repeat-y',
    cursor: 'default',
  },
  menuTotalBalanceExtended: {
    position: 'absolute',
    left: '0px',
    top: '106px',
    right: '0px',
    bottom: '122px',
    zIndex: '2',
    overflow: 'auto',
    backgroundColor: 'rgba(9, 24, 45, .8)',
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
    height: '68px',
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
    //background-image: 'url('../images/arrow-up-light-blue.svg')',
    backgroundPosition: '50% 0px',
    backgroundSize: '12px',
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
    height: '54px',
    paddingTop: '22px',
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
};

class SideBar extends Component {
  render() {
    const { getBalanceRequestAttempt, getBalanceResponse } = this.props;
    const { getAccountsResponse } = this.props;
    return (
      <div style={styles.menu}>
        <div style={styles.menuLogo}>
          <MenuLogo />
        </div>
        <div style={styles.menuNavigation}>
          <Link to="/home" style={styles.menuNavigationLink} activeStyle={styles.menuNavigationLinkActive}>Home</Link>
          <Link to="/send" style={styles.menuNavigationLink} activeStyle={styles.menuNavigationLinkActive}>Send</Link>
          <Link to="/receive" style={styles.menuNavigationLink} activeStyle={styles.menuNavigationLinkActive}>Receive</Link>
          <Link to="/history" style={styles.menuNavigationLink} activeStyle={styles.menuNavigationLinkActive}>History</Link>
        </div>
        <div style={styles.menuTotalBalanceExtended}>
          <div style={styles.menuTotalBalanceExtendedBottom}>
            <div style={styles.menuTotalBalanceExtendedBottomAccount}>
            <div style={styles.menuTotalBalanceExtendedBottomAccountName}>Primary account</div>
            <div style={styles.menuTotalBalanceExtendedBottomAccountNumber}>32.00000000</div>
          </div>
          <div style={styles.menuTotalBalanceExtendedBottom}>
            <div style={styles.menuTotalBalanceExtendedBottomAccountName}>Candy money</div>
            <div style={styles.menuTotalBalanceExtendedBottomAccountNumber}>32.00000000</div>
          </div>
          <div style={styles.menuTotalBalanceExtendedBottom}>
            <div style={styles.menuTotalBalanceExtendedBottomAccountName}>College funds</div>
            <div style={styles.menuTotalBalanceExtendedBottomAccountNumber}>32.00000000</div>
          </div>
        </div>
      </div>
      <div style={styles.menuBottom}>
        <div style={styles.menuBottomTotalBalanceShort}>
          <div style={styles.menuBottomTotalBalanceShortSeperator}>
            <ArrowUpLightBlue />
          </div>
          <div style={styles.menuBottomTotalBalanceShortName}>Total balance:</div>
          <div style={styles.menuBottomTotalBalanceShortValue}>1,199.675431 DCR</div>
        </div>
        <div style={styles.menuBottomLatestBlock} class="menu-bottom-latest-block w-clearfix">
          <a style={styles.menuBottomLastestBlockName} href="#">Latest block: '<span style={styles.menuBottomLastestBlockNumber}>12,580</span></a>
          <div style={styles.menuBottomLastestBlockTime}>1 min ago</div>
        </div>
      </div>
    </div>
    );
  }
}

export default connect(mapStateToProps)(SideBar);

