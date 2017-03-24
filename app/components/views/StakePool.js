// @flow
import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import ArrowDownMidBlue from '../icons/arrow-down-mid-blue.svg';
import ArrowDownKeyBlue from '../icons/arrow-down-key-blue.svg';
import KeyBlueButton from '../KeyBlueButton';
import Delete from '../icons/delete.svg';

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
  viewNotificationError: {
    display: 'inline-block',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px 7px 7px',
    borderRadius: '5px',
    backgroundColor: '#fd714b',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
  },
  viewNotificationSuccess: {
    display: 'inline-block',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px 7px 7px',
    borderRadius: '5px',
    backgroundColor: '#41bf53',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  contentNestAddressDeleteIcon: {
    width: '26px',
    height: '19px',
    float: 'left',
    backgroundImage: `url(${Delete})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '8px',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    ':hover': {
      opacity: '0.85',
    }
  },
  transition1: {
    transition: 'all 100ms ease-in-out',
  },
  headerMetaSend: {
    height: '54px',
    width: '480px',
    paddingLeft: '50px',
    color: '#0c1e3e',
    fontSize: '14px',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  contentNestSend: {
    paddingTop: '1px',
    backgroundColor: '#fff',
  },
  contentNestDeleteAddress: {
    width: '625px',
    height: '54px',
    paddingTop: '10px',
    paddingLeft: '116px',
    float: 'left',
  },
  contentNestPrefixConfigured: {
    width: '200px',
    paddingRight: '15px',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  contentNestStakePool: {
    borderTop: '1px solid',
    height: '185px',
    position: 'relative',
    borderBottom: '1px solid',
    float: 'left',
  },
  contentNestStakePoolSettings: {
    width: '100%',
    height: '20px',
    marginTop: '20px',
    float: 'left',
  },
  contentNestPrefixStakePoolSettings: {
    width: '125px',
    paddingRight: '15px',
    float: 'left',
    height: '100%',
    fontSize: '19px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  contentNestStakePoolSettingsBottom: {
    width: '100%',
    height: '20px',
    marginTop: '30px',
    float: 'left',
  },
  contentNestContentStakePoolSettings: {
    position: 'relative',
    overflowY: 'hidden',
    overflowX: 'auto',
    width: '575px',
    height: '34px',
    float: 'left',
    fontSize: '13px',
    paddingTop: '2px',
  },
  contentNestPrefixSend: {
    width: '100px',
    paddingRight: '15px',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  contentNestPrefixConfirm: {
    width: '230px',
    paddingRight: '15px',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  contentNestFromAddress: {
    width: '100%',
    height: '54px',
    paddingTop: '10px',
    float: 'left',
  },
  contentNestToAddress: {
    width: '100%',
    height: '54px',
    paddingTop: '10px',
    float: 'left',
  },
  contentNestAddressHashTo: {
    width: '100%',
    height: '100%',
    paddingTop: '9px',
    paddingLeft: '10px',
    borderStyle: 'none',
    color: '#2971ff',
    fontSize: '13px',
    cursor: 'text',
    ':focus': {
      color: '#2971ff',
    },
  },
  contentNestAddressHashBlock: {
    position: 'relative',
    width: '600px',
    height: '34px',
    float: 'left',
    fontSize: '13px',
  },
  contentNestAddressHashBlockConfirm: {
    position: 'relative',
    overflow: 'hidden',
    width: '300px',
    height: '34px',
    paddingTop: '7px',
    float: 'left',
    fontSize: '17px',
  },
  contentNestGradient: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    width: '40px',
    height: '100%',
    backgroundImage: 'linear-gradient(90deg, transparent, #fff 80%)',
  },
  selectAccountsSend: {
    width: '300px',
    position: 'relative',
    zIndex: '3',
    overflow: 'visible',
    height: '34px',
    minWidth: '300px',
    float: 'left',
    borderBottom: '1px solid #2971ff',
    backgroundColor: '#fff',
    backgroundImage: `url(${ArrowDownMidBlue})`,
    backgroundPosition: '100% 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    ':hover': {
      backgroundImage: `url(${ArrowDownKeyBlue})`,
      backgroundSize: '10px',
    }
  },
  selectAccount: {
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    color: '#0c1e3e',
    fontSize: '19px',
    ':hover': {
      height: 'auto',
    }
  },
  selectAccountNFirst: {
    overflow: 'hidden',
    height: '34px',
    marginRight: '20px',
    paddingTop: '5px',
    paddingLeft: '10px',
    color: '#2971ff',
    fontSize: '19px',
  },
  selectAccountNTextSend: {
    width: '200%',
    paddingTop: '1px',
    fontSize: '13px',
  },
  selectAccountNAmount: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    marginRight: '20px',
    paddingTop: '7px',
    paddingLeft: '40px',
    backgroundImage: 'linear-gradient(90deg, transparent, #fff 28%)',
    fontFamily: 'Inconsolata, monospace',
    color: '#596d81',
    fontSize: '11px',
    fontWeight: '400',
    textAlign: 'right',
  },
  selectAccountNAmountBold: {
    fontFamily: 'Inconsolata, monospace',
    fontWeight: '700',
  },
  selectAccountNNestSend: {
    fontSize: '13px',
    overflow: 'auto',
    height: 'auto',
    maxHeight: '413px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #a9b4bf',
    backgroundColor: '#fff',
  },
  selectAccountNGradient: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    width: '40px',
    height: '100%',
    backgroundImage: 'linear-gradient(90deg, transparent, #fff 75%)',
  },
  selectAccountN: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    paddingTop: '18px',
    paddingBottom: '18px',
    paddingLeft: '10px',
    float: 'left',
    ':hover': {
      color: '#2971ff',
    }
  },
  selectAccountNText: {
    width: '200%',
  },
  inputForm: {
    position: 'relative',
    width: '100%',
    height: '25px',
  },
  contentNestAddressAmount: {
    display: 'block',
    height: '34px',
    float: 'right',
  },
  contentNestAddressAmountSumAndCurrency: {
    position: 'relative',
    overflow: 'hidden',
    width: '140px',
    height: '100%',
    marginRight: '20px',
    float: 'right',
    borderBottom: '1px solid #a9b4bf',
    color: '#0c1e3e',
    textAlign: 'right',
  },
  contentNestAddressAmountSumGradient: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    display: 'inline-block',
    width: '37px',
    height: '100%',
    paddingTop: '9px',
    paddingRight: '10px',
    backgroundColor: '#fff',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '13px',
    textTransform: 'uppercase',
  },
  contentNestAddressAmountSum: {
    display: 'block',
    width: '100%',
    height: '100%',
    fontSize: '19px',
    fontWeight: '700',
  },
  contentNestToAddressAmountSumNumberFormatSmall: {
    fontSize: '13px',
  },
  contentNestAddressAmountSumNumberFormatSmall: {
    fontSize: '13px',
  },
  contentSend: {
    marginTop: '20px',
  },
  contentSendSection: {
    display: 'block',
    width: '91%',
    height: '22px',
    paddingLeft: '30px',
    float: 'left',
    color: '#0c1e3e',
  },
  contentSendSectionCheckboxText: {
    height: '100%',
    paddingTop: '1px',
    paddingLeft: '5px',
    float: 'left',
    textTransform: 'capitalize',
  },
  ontentSendSectionAmount: {
    width: '160px',
    height: '100%',
    paddingTop: '1px',
    paddingRight: '30px',
    float: 'right',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '13px',
    textAlign: 'right',
  },
  contentSendSectionDescription: {
    height: '100%',
    paddingTop: '1px',
    paddingRight: '20px',
    float: 'right',
    color: '#596d81',
    fontSize: '13px',
  },
  contentSendSectionAmountCurrency: {
    paddingLeft: '5px',
  },
  viewButtonKeyBlue: {
    width: '9%',
    float: 'left',
    display: 'inline-block',
    padding: '17px 18px 18px',
    borderRadius: '5px',
    backgroundColor: '#2971ff',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
    transitionProperty: 'none',
    color: '#fff',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    ':hover': {
      backgroundColor: '#1b58ff',
    },
    ':active': {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, .2)',
    }
  },
  viewButtonLightSlateGray: {
    display: 'inline-block',
    padding: '17px 18px 18px',
    float: 'right',
    borderRadius: '5px',
    backgroundColor: '#8997a5',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    ':hover': {
      backgroundColor: '#596d81',
    },
    ':active': {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, .22)',
    }
  },
  flexHeight: {
    paddingTop: '1px',
    backgroundColor: '#fff',
    height:'372px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  loading: {
    marginTop: '110px',
    marginLeft: '268px',
  }
};

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props) {
    super(props);
    var initStakePoolHost = '';
    for (var i = 0; i < this.props.currentStakePoolConfig.length; i++) {
      if (!this.props.currentStakePoolConfig[i].ApiKey && this.props.currentStakePoolConfig[i].Network == this.props.network) {
        initStakePoolHost = this.props.currentStakePoolConfig[i].Host;
        break;
      }
    }
    this.state = {
      stakePoolHost: initStakePoolHost,
      apiKey: '',
      account: 0,
      addAnotherStakePool: false,
    };
  }
  componentWillMount() {
    this.props.clearStakePoolConfigError();
    this.props.clearStakePoolConfigSuccess();
  }
  addAnotherStakePool() {
    this.setState({addAnotherStakePool: true});
  }
  setStakePoolInfo() {
    if (this.state.stakePoolHost == '' || this.state.apiKey == '') {
      return;
    }
    //this.setState({addAnotherStakePool: false});
    //setStakePoolInformation(this.state.stakePoolHost, this.props.apiKey, this.props.account);
    this.props.setStakePoolInformation(this.state.stakePoolHost, this.state.apiKey, 0);
    setTimeout(this.setState({addAnotherStakePool: false}), 1000);
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
    const { currentStakePoolConfig, currentStakePoolConfigRequest, currentStakePoolConfigError, activeStakePoolConfig } = this.props;
    const { currentStakePoolConfigSuccessMessage } = this.props;
    const { network } = this.props;
    var unconfigedStakePools = 0;
    for (var i = 0; i < currentStakePoolConfig.length; i++) {
      if (!currentStakePoolConfig[i].ApiKey && currentStakePoolConfig[i].Network == network) {
        unconfigedStakePools++;
      }
    }
    var selectStakePool = (
      <div style={styles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={styles.selectStakePool}
          onChange={(e) =>{this.updateStakePoolHost(e.target.value);}}
          >
          {currentStakePoolConfig !== null  ?
            currentStakePoolConfig.map((stakePool) => {
              if (!stakePool.ApiKey && stakePool.Network == network) {
                return (
                  <option style={styles.selectStakePoolNFirst} key={stakePool.Host} value={stakePool.Host}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>
      </div>);

    var stakePoolConfigInput = (
      <div style={styles.content}>
        <div style={styles.flexHeight}>
            <div style={styles.contentNestFromAddress}>
              <div style={styles.contentNestPrefixSend}>Stake Pool:</div>
                {selectStakePool}
              <div style={styles.contentNestFromAddressWalletIcon}></div>
            </div>
            <div style={styles.contentNestToAddress}>
              <div style={styles.contentNestPrefixSend}>Api Key:</div>
              <div style={styles.contentNestAddressHashBlock}>
                <div style={styles.inputForm}>
                  <input
                    type="text"
                    style={styles.contentNestAddressAmountSum}
                    placeholder="API Key"
                    onBlur={(e) =>{this.updateApiKey(e.target.value);}}/>
                </div>
              </div>
            </div>
          </div>
          <KeyBlueButton style={styles.contentSend} onClick={() => this.setStakePoolInfo()}>
            Confirm
          </KeyBlueButton>
        </div>
    );
    var configuredStakePoolInformation = (
        <div style={styles.content}>
          <div style={styles.flexHeight}>
            <div style={styles.contentNestFromAddress}>
              <div style={styles.contentNestPrefixConfigured}>Configured stake pools:</div>
            </div>
            <div id="dynamicInput">
            {currentStakePoolConfig.map((stakePool) => {
              if (stakePool.ApiKey && stakePool.Network == network) {
                return(
                <div key={stakePool.Host} style={styles.contentNestStakePool}>
                  <div style={styles.contentNestStakePoolSettings}>
                    <div style={styles.contentNestPrefixStakePoolSettings}>URL:</div>
                    <div style={styles.contentNestContentStakePoolSettings}>
                      {stakePool.Host}
                    </div>
                  </div>
                  <div style={styles.contentNestStakePoolSettings}>
                    <div style={styles.contentNestPrefixStakePoolSettings}>Ticket Address:</div>
                    <div style={styles.contentNestContentStakePoolSettings}>
                      {stakePool.TicketAddress}
                    </div>
                  </div>
                  <div style={styles.contentNestStakePoolSettings}>
                    <div style={styles.contentNestPrefixStakePoolSettings}>Script:</div>
                    <textarea disabled value={stakePool.Script} style={styles.contentNestContentStakePoolSettings}/>
                  </div>
                  <div style={styles.contentNestStakePoolSettingsBottom}>
                    <div style={styles.contentNestPrefixStakePoolSettings}>Pool Fees:</div>
                    <div style={styles.contentNestContentStakePoolSettings}>
                      {stakePool.PoolFees}
                    </div>
                  </div>
                </div>);
              }
            })}
            </div>
          </div>
          {unconfigedStakePools > 0 ?
          <KeyBlueButton style={styles.contentSend} onClick={() => this.addAnotherStakePool()}>
            Add stakepool
          </KeyBlueButton> :
          <div></div>
          }
        </div>
    );
    const stakePool = (
      <div style={styles.view}>
        <Header
          headerTop={
          [
            currentStakePoolConfigError !== null ?
            <div key="updateStakePoolError" style={styles.viewNotificationError}><div style={styles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStakePoolConfigError()}/>{currentStakePoolConfigError}</div> :

            <div key="updateStakePoolError" ></div>,
            currentStakePoolConfigSuccessMessage !== undefined && currentStakePoolConfigSuccessMessage !== '' ?
            <div key="configSuccess"  style={styles.viewNotificationSuccess}><div style={styles.contentNestAddressDeleteIcon} onClick={() => this.props.clearStakePoolConfigSuccess()}/>{currentStakePoolConfigSuccessMessage}</div> :
            <div key="configSuccess" ></div>
          ]
          }
          headerTitleOverview="Stake pool settings"
          headerMetaOverview={<div></div>}
        />
        {(!activeStakePoolConfig || this.state.addAnotherStakePool) && !currentStakePoolConfigRequest ?
          stakePoolConfigInput :
          currentStakePoolConfigRequest ?
            <CircularProgress style={styles.loading} size={125} thickness={6}/> :
            configuredStakePoolInformation
        }
      </div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return (
        <div style={styles.body}>
          <SideBar />
          {stakePool}
        </div>);
    }
  }
}

export default StakePool;
