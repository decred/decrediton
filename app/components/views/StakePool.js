// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import Button from '../ButtonTanel';
import SideBar from '../SideBar';
import Header from '../Header';
import qr from 'qr-image';

const styles = {
  body: {
    position: 'fixed',
    left: '0px',
    top: '50%',
    right: '0px',
    display: 'block',
    overflow: 'hidden',
    width: '1178px',
    height: '770px',
    marginTop: '-385px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#FFF',
  },
  view: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  img: {
    width: '250px',
    paddingLeft: '244px',
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props) {
    super(props);

    this.state = {
      stakePoolHost: '',
      apiKey: '',
      account: 0,
    };
  }
  setStakePoolInfo() {
    if (this.state.stakePoolHost == '' || this.state.apiKey == '') {
      return;
    }
    setStakePoolInformation(this.state.stakePoolHost, this.props.apiKey, this.props.account);
  }
  updateApiKey(apiKey) {
    this.setState({apiKey: apiKey});
  }
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
  }
  updateStakePoolHost(poolHost) {
    this.setState({stakePoolHost: poolHost});
  }
  render() {
    const { walletService } = this.props;
    const { stakePoolInfoConfig } = this.props;
    const { setStakePoolInformation } = this.props;
    const { getAccountsResponse } = this.props;
    var selectStakePool = (
      <div style={styles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={styles.selectStakePool}
          >
          {stakePoolInfoConfig !== null ?
            stakePoolInfoConfig.map((stakePool) => {
              return (
                <option style={styles.selectStakePoolNFirst} key={stakePool.Host} value={stakePool.Host}>
                  {stakePool.Host}
                </option>
              );
             }):
            null
          }
        </select>
      </div>);
    var selectAccounts = (
      <div style={styles.selectAccountsSend}>
        <select
          defaultValue={0}
          style={styles.selectAccount}
          >
          {getAccountsResponse !== null ?
            getAccountsResponse.getAccountsList().map((account) => {
              if (account.getAccountName() !== 'imported') {
                return (
                  <option style={styles.selectAccountNFirst} key={account.getAccountNumber()} value={account.getAccountNumber()}>
                    {account.getAccountName()}
                  </option>
                );
              }
            }):
            null
          }
        </select>
      </div>);  
    const copayReceive = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Stake pool settings"
          headerMetaOverview={<div></div>}
        />
        <div style={styles.content}>
          <div style={styles.center}>
            {selectStakePool}
            {selectAccounts}
            <input
              type="text"
              style={styles.contentNestAddressAmountSum}
              placeholder="API Key"
              onBlur={(e) =>{this.updateApiKey(e.target.value);}}/>
          </div>
        </div>
			</div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {copayReceive}
        </div>);
    }
  }
}

export default StakePool;
