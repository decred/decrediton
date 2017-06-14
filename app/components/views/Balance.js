// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import Balance from '../Balance';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';
import CircularProgress from 'material-ui/CircularProgress';
import { AccountStyles, StakePoolStyles } from './ViewStyles.js';
import AccountRow from '../AccountRow';

class BalanceView extends Component{
  render() {
    const { getAccountsResponse, balances, walletService } = this.props;
    const accountsView = (
      <div style={AccountStyles.view}>
        <Header
          headerTitleOverview="Balance Overview"
        />
        <div style={StakePoolStyles.content}>
          <div style={StakePoolStyles.flexHeight}>
            <div style={StakePoolStyles.contentNestFromAddress}>
              <div style={StakePoolStyles.contentNestPrefixConfigured}>Current Balances:</div>
            </div>
          {balances !== null ?
            <div id="dynamicInput">
            {balances.map((balance) => {
              return (
                <div key={balance.accountName} style={StakePoolStyles.contentNestBalance}>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Account:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      {balance.accountName}
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Total Balance:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      <Balance amount={balance.total}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Spendable Balance:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      <Balance amount={balance.spendable}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Locked By Tickets:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      <Balance amount={balance.lockedByTickets}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Voting Authority:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      <Balance amount={balance.votingAuthority}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Immature Rewards:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      <Balance amount={balance.immatureReward}/>
                    </div>
                  </div>
                  <div style={StakePoolStyles.contentNestBalanceOverview}>
                    <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Immature Stake Generation:</div>
                    <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                      <Balance amount={balance.immatureStakeGeneration}/>
                    </div>
                  </div>
                </div>);
            })}
            </div> :
            <div></div>
            }
            </div>
        </div>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={AccountStyles.body}>
          <SideBar />
          {accountsView}
        </div>);
    }
  }
}

export default BalanceView;
