import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Balance from './Balance';
import MenuLogo from './icons/MenuLogo';

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
  menu:{},
  menuLogo:{},
  menuNavigation:{},
  menuNavigationLink:{},
  menuNaviationLinkActive:{},
  menuTotalBalanceExtended: {},
  menuTotalBalanceExtendedBottom: {},
  menuTotalBalanceExtendedBottomAccount: {},
  menuTotalBalanceExtendedBottomAccountName: {},
  menuTotalBalanceExtendedBottomAccountNumber: {},
  menuBottom: {},
  menuBottomTotalBalanceShort: {},
  menuBottomTotalBalanceShortSeperator: {},
  menuBottomTotalBalanceShortName: {},
  menuBottomTotalBalanceShortValue: {},
  menuBottomLatestBlock: {},
  menuBottomLatestBlockName: {},
  menuBottomLatestBlockNumber: {},
  menuBottomLatestBlockTime: {},
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
          <div style={styles.menuBottomTotalBalanceShortSeperator}></div>
          <div style={styles.menuBottomTotalBalanceShortName}>Total balance:</div>
          <div style={styles.menuBottomTotalBalanceShortValue}>1,199.675431 DCR</div>
        </div>
        <div style={styles.menuBottomLatestBlock} class="menu-bottom-latest-block w-clearfix">
          <a style={styles.menuBottomLastestBlockName} href="#">Latest block: <span style={styles.menuBottomLastestBlockNumber}>12,580</span></a>
          <div style={styles.menuBottomLastestBlockTime}>1 min ago</div>
        </div>
      </div>
    </div>
    );
  }
}

export default connect(mapStateToProps)(SideBar);

