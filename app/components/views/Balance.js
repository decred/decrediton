// @flow
import React, { Component } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import Balance from '../Balance';
import { AccountStyles, StakePoolStyles } from './ViewStyles.js';
import BalanceOverviewInfoModal from '../BalanceOverviewInfoModal';
import BalanceOverviewInfoButton from '../BalanceOverviewInfoButton';

class BalanceView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      balanceOverviewInfoModal: false
    };
  }
  showBalanceOverviewInfoModal() {
    this.setState({balanceOverviewInfoModal: true});
  }
  closeBalanceOverviewInfoModal() {
    this.setState({balanceOverviewInfoModal: false});
  }
  render() {
    var balanceOverviewInfoModal = (
        <BalanceOverviewInfoModal closeModal={()=>this.closeBalanceOverviewInfoModal()}/>
    );
    const { balances, walletService } = this.props;
    const accountsView = (
        <div style={StakePoolStyles.contentPurchaseTicketView}>
          <div style={StakePoolStyles.flexHeightBalanceOverview}>
            <div style={StakePoolStyles.contentNestBalanceOverview}>
              <div style={StakePoolStyles.contentNestPrefixBalanceOverview}>Current Balances:</div>
              <div style={StakePoolStyles.contentNestContentBalanceOverview}>
                <BalanceOverviewInfoButton onClick={() => this.showBalanceOverviewInfoModal()}/>
              </div>
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
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={AccountStyles.body}>
          <SideBar />
          <div style={AccountStyles.view}>
            <Header
              headerTitleOverview="Balance Overview"
            />
            {this.state.balanceOverviewInfoModal ? balanceOverviewInfoModal : accountsView}
          </div>
        </div>);
    }
  }
}

export default BalanceView;
