// @flow
import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorScreen from '../ErrorScreen';
import Balance from '../Balance';
import SideBar from '../SideBar';
import Header from '../Header';
import NewExistingSeedToggle from '../NewExistingSeedToggle';
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
    paddingTop: '4px',
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
  selectPurchaseTickets: {
    display: 'block',
    overflow: 'hidden',
    height: '100%',
    paddingTop: '3px',
    color: '#0c1e3e',
    ':hover': {
      height: 'auto',
    }
  },
  selectPurchaseTicketsNFirst: {
    overflow: 'hidden',
    height: '34px',
    marginRight: '20px',
    paddingTop: '5px',
    paddingLeft: '10px',
    color: '#2971ff',
    fontSize: '19px',
  },
  selectPurchaseTicketsNTextSend: {
    width: '200%',
    paddingTop: '1px',
    fontSize: '13px',
  },
  selectPurchaseTicketsNAmount: {
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
  selectPurchaseTicketsNAmountBold: {
    fontFamily: 'Inconsolata, monospace',
    fontWeight: '700',
  },
  selectPurchaseTicketsNNestSend: {
    fontSize: '13px',
    overflow: 'auto',
    height: 'auto',
    maxHeight: '413px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #a9b4bf',
    backgroundColor: '#fff',
  },
  selectPurchaseTicketsNGradient: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    width: '40px',
    height: '100%',
    backgroundImage: 'linear-gradient(90deg, transparent, #fff 75%)',
  },
  selectPurchaseTicketsN: {
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
  selectPurchaseTicketsNText: {
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
  purchaseTicketRow: {
    width: '100%',
    height: '45px',
    paddingTop: '6px',
    float: 'left',
    borderBottom: '1px black solid',
  },
  purchaseTicketLabel: {
    width: '25%',
    paddingRight: '15px',
    paddingLeft: '5px',
    float: 'left',
    height: '100%',
    paddingTop: '8px',
    fontSize: '19px',
    textAlign: 'left',
  },
  purchaseTicketInput: {
    width: '50%',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
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
  },
  selectAccountsPurchase: {
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
  toggle: {
    float: 'right',
  },
  contentTitle: {
    display: 'block',
    height: '44px',
    marginRight: 'auto',
    marginBottom: '10px',
    marginLeft: 'auto',
    borderBottom: '1px solid transparent',
    color: '#596d81',
    fontSize: '27px',
    transition: 'all 250ms cubic-bezier(.86, 0, .07, 1)',
  },
  contentTitleText: {
    display: 'inline-block',
    overflow: 'hidden',
    width: '500px',
    height: '100%',
    paddingTop: '13px',
    paddingRight: '20px',
    paddingLeft: '20px',
  },
  stakeInfoArea: {
    fontSize: '13px',
    fontWeight: 'bold',
    float: 'right',
    marginTop: '-33px',
    height:'80px',
    width: '312px',
  },
  stakeInfoAreaLeft: {
    height: '100%',
    width: '170px',
    float: 'left',
  },
  stakeInfoAreaRight: {
    height: '100%',
    width: '142px',
    float: 'right',
  },
  stakeInfoRows: {
    width: '100%',
    height: '20px'
  },
  stakeInfoRowsRightName: {
    width: '96px',
    float: 'left',
    textAlign: 'left',
  },
  stakeInfoRowsRightValue: {
    width: '46px',
    float: 'right',
    textAlign: 'right',
  },
  stakeInfoRowsLeftName: {
    width: '124px',
    float: 'left',
    textAlign: 'left',
  },
  stakeInfoRowsLeftValue: {
    width: '34px',
    float: 'right',
    textAlign: 'right',
    paddingRight: '8px',
  }
};

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props) {
    super(props);
    var initStakePoolHost = '';
    var initStakePool = null;
    // Look for any available uninitialized stakepool config
    // This will be set for the first in the dropdown for
    // setting apikey/purchase information of the stakepool.
    if (this.props.currentStakePoolConfig != null) {
      for (var i = 0; i < this.props.currentStakePoolConfig.length; i++) {
        if (!this.props.currentStakePoolConfig[i].ApiKey && this.props.currentStakePoolConfig[i].Network == this.props.network) {
          initStakePoolHost = this.props.currentStakePoolConfig[i].Host;
          break;
        }
      }
      // Look for any available initialized stakepool config
      // This will be set for the first in the dropdown for
      // ticket purchase stake pool selection.
      for (var j = 0; j < this.props.currentStakePoolConfig.length; j++) {
        if (this.props.currentStakePoolConfig[j].ApiKey && this.props.currentStakePoolConfig[j].Network == this.props.network) {
          initStakePool = this.props.currentStakePoolConfig[j];
          break;
        }
      }
    }
    this.state = {
      stakePoolHost: initStakePoolHost,
      apiKey: '',
      account: 0,
      addAnotherStakePool: false,
      purchaseTickets: true,
      spendLimit: this.props.getBalanceResponse != null ? this.props.getBalanceResponse.getSpendable() : 0,
      conf: 0,
      numTickets: 0,
      expiry: 0,
      txFee: 0.01, // DCR/kB
      ticketFee: 0.01, // DCR/kB
      selectedStakePoolForPurchase: initStakePool,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentStakePoolConfig != nextProps.currentStakePoolConfig) {
      for (var j = 0; j < nextProps.currentStakePoolConfig.length; j++) {
        if (nextProps.currentStakePoolConfig[j].ApiKey && nextProps.currentStakePoolConfig[j].Network == this.props.network) {
          this.setState({selectedStakePoolForPurchase: nextProps.currentStakePoolConfig[j]});
          break;
        }
      }
    }
  }
  componentWillMount() {
    this.props.clearStakePoolConfigError();
    this.props.clearStakePoolConfigSuccess();
    this.props.clearPurchaseTicketsSuccess();
    this.props.clearPurchaseTicketsError();
  }
  submitPurchase() {
    if (this.state.privpass == null || this.state.selectedStakePoolForPurchase == null ||
       this.state.numTickets <= 0 ) {
      return;
    }
    this.props.purchaseTicketsAttempt(
      this.state.privpass,
      this.state.account,
      this.state.spendLimit,
      this.state.conf,
      this.state.numTickets,
      this.state.expiry,
      this.state.ticketFee,
      this.state.selectedStakePoolForPurchase
    );
  }
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
  }
  updateNumTickets(numTickets) {
    this.setState({numTickets: numTickets});
  }
  updateTicketFee(ticketFee) {
    this.setState({ticketFee: ticketFee});
  }
  addAnotherStakePool() {
    this.setState({addAnotherStakePool: true});
  }
  setStakePoolInfo() {
    if (this.state.stakePoolHost == '' || this.state.apiKey == '') {
      return;
    }
    this.props.setStakePoolInformation(this.state.stakePoolHost, this.state.apiKey, 0);
    setTimeout(this.setState({addAnotherStakePool: false}), 1000);
  }
  updateApiKey(apiKey) {
    this.setState({apiKey: apiKey});
  }
  updateStakePoolHost(poolHost) {
    this.setState({stakePoolHost: poolHost});
  }
  toggleTicketStakePool(side) {
    if (side == 'right') {
      this.setState({purchaseTickets: false});
    } else if (side == 'left') {
      this.setState({purchaseTickets: true});
    }
  }
  render() {
    const { walletService } = this.props;
    const { currentStakePoolConfig, currentStakePoolConfigRequest, currentStakePoolConfigError, activeStakePoolConfig } = this.props;
    const { currentStakePoolConfigSuccessMessage, getAccountsResponse, purchaseTicketsRequestAttempt } = this.props;
    const { purchaseTicketsError, purchaseTicketsSuccess } = this.props;
    const { network } = this.props;
    const { getTicketPriceResponse } = this.props;
    const { getStakeInfoResponse } = this.props;

    var unconfigedStakePools = 0;
    if (currentStakePoolConfig != null) {
      for (var i = 0; i < currentStakePoolConfig.length; i++) {
        if (!currentStakePoolConfig[i].ApiKey && currentStakePoolConfig[i].Network == network) {
          unconfigedStakePools++;
        }
      }
    }
    var selectAccounts = (
      <div style={styles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={styles.selectPurchaseTickets}
          onChange={(e) =>{this.updateAccountNumber(e.target.value);}}
          >
          {getAccountsResponse !== null ?
            getAccountsResponse.getAccountsList().map((account) => {
              if (account.getAccountName() !== 'imported') {
                return (
                  <option style={styles.selectPurchaseTicketsN} key={account.getAccountNumber()} value={account.getAccountNumber()}>
                    {account.getAccountName()}
                  </option>
                );
              }
            }):
            null
          }
        </select>
      </div>);
    var selectStakePoolApiKey = (
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
                  <option style={styles.selectStakePoolN} key={stakePool.Host} value={stakePool.Host}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>
      </div>);
    var selectStakePoolPurchaseTickets = (
      <div style={styles.selectStakePoolArea}>
        <select
          defaultValue={this.state.selectedStakePoolForPurchase}
          style={styles.selectPurchaseTickets}
          onChange={(e) =>{this.updateStakePoolPurchaseTickets(e.target.value);}}
          >
          {currentStakePoolConfig !== null  ?
            currentStakePoolConfig.map((stakePool) => {
              if (stakePool.ApiKey && stakePool.Network == network) {
                return (
                  <option style={styles.selectPurchaseTicketsN} key={stakePool.Host} value={stakePool}>
                    {stakePool.Host}
                  </option>
                );
              }
            }) :
            null
          }
        </select>
      </div>);
    var selectNumTickets = (
      <div style={styles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={styles.selectPurchaseTickets}
          onChange={(e) =>{this.updateNumTickets(e.target.value);}}
          >
          <option style={styles.selectPurchaseTicketsN} value={0} label={0}/>
          <option style={styles.selectPurchaseTicketsN} value={1} label={1}/>
          <option style={styles.selectPurchaseTicketsN} value={2} label={2}/>
          <option style={styles.selectPurchaseTicketsN} value={3} label={3}/>
          <option style={styles.selectPurchaseTicketsN} value={4} label={4}/>
          <option style={styles.selectPurchaseTicketsN} value={5} label={5}/>
          <option style={styles.selectPurchaseTicketsN} value={6} label={6}/>
          <option style={styles.selectPurchaseTicketsN} value={7} label={7}/>
          <option style={styles.selectPurchaseTicketsN} value={8} label={8}/>
          <option style={styles.selectPurchaseTicketsN} value={9} label={9}/>
          <option style={styles.selectPurchaseTicketsN} value={10} label={10}/>
          <option style={styles.selectPurchaseTicketsN} value={11} label={11}/>
          <option style={styles.selectPurchaseTicketsN} value={12} label={12}/>
          <option style={styles.selectPurchaseTicketsN} value={13} label={13}/>
          <option style={styles.selectPurchaseTicketsN} value={14} label={14}/>
          <option style={styles.selectPurchaseTicketsN} value={15} label={15}/>
          <option style={styles.selectPurchaseTicketsN} value={16} label={16}/>
          <option style={styles.selectPurchaseTicketsN} value={17} label={17}/>
          <option style={styles.selectPurchaseTicketsN} value={18} label={18}/>
          <option style={styles.selectPurchaseTicketsN} value={19} label={19}/>
          <option style={styles.selectPurchaseTicketsN} value={20} label={20}/>
        </select>
      </div>);

    var stakePoolConfigInput = (
      <div style={styles.content}>
        <div style={styles.flexHeight}>
            <div style={styles.contentNestFromAddress}>
              <div style={styles.contentNestPrefixSend}>Stake Pool:</div>
                {selectStakePoolApiKey}
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
    var purchaseTicketsView = (
        <div style={styles.content}>
          <div style={styles.flexHeight}>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Stake Pool:</div>
              <div style={styles.purchaseTicketInput}>
                {selectStakePoolPurchaseTickets}
              </div>
            </div>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Account:</div>
              <div style={styles.purchaseTicketInput}>
                {selectAccounts}
              </div>
            </div>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Number of Tickets:</div>
              <div style={styles.purchaseTicketInput}>
                {selectNumTickets}
              </div>
            </div>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Ticket Fee (DCR/kB):</div>
              <div style={styles.purchaseTicketInput}>
                <div style={styles.inputForm}>
                  <input
                    type="text"
                    style={styles.contentNestAddressHashTo}
                    placeholder="Ticket Fee"
                    defaultValue={0.01}
                    onBlur={(e) =>{this.updateTicketFee(e.target.value);}}/>
                </div>
              </div>
            </div>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Pool Address:</div>
              <div style={styles.purchaseTicketInput}>
                <div style={styles.inputForm}>
                  <input
                    disabled
                    type="text"
                    style={styles.contentNestAddressHashTo}
                    value={this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.PoolAddress : null}/>
                </div>
              </div>
            </div>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Ticket Address:</div>
              <div style={styles.purchaseTicketInput}>
                <div style={styles.inputForm}>
                  <input
                    type="text"
                    disabled
                    style={styles.contentNestAddressHashTo}
                    value={this.state.selectedStakePoolForPurchase != null ? this.state.selectedStakePoolForPurchase.TicketAddress : null}/>
                </div>
              </div>
            </div>
            <div style={styles.purchaseTicketRow}>
              <div style={styles.purchaseTicketLabel}>Private Passhrase:</div>
              <div style={styles.purchaseTicketInput}>
                <div style={styles.inputForm}>
                  <input
                    id="privpass"
                    style={styles.contentNestAddressHashTo}
                    type="password"
                    placeholder="Private Passphrase"
                    onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
                </div>
              </div>
            </div>
          </div>
          <KeyBlueButton style={styles.contentSend} onClick={() => this.submitPurchase()}>
            Purchase
          </KeyBlueButton>
        </div>);
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
            <div key="configSuccess" ></div>,
            purchaseTicketsError !== null ?
            <div key="purchaseTicketsError" style={styles.viewNotificationError}><div style={styles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsError()}/>{purchaseTicketsError}</div> :
            <div key="purchaseTicketsError" ></div>,
            purchaseTicketsSuccess !== undefined && purchaseTicketsSuccess !== '' ?
            <div key="purchaseTicketsSuccess" style={styles.viewNotificationSuccess}><div style={styles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsSuccess()}/>{purchaseTicketsSuccess}</div> :
            <div key="purchaseTicketsSuccess" ></div>,
          ]
          }
          headerTitleOverview={
            <div style={{height: '100%'}}>
              <div style={{float: 'left'}}>{this.state.purchaseTickets ? 'Ticket price:' :'Stake pool settings'}</div>
                {getStakeInfoResponse !== null ?
                <div style={styles.stakeInfoArea}>
                  <div style={styles.stakeInfoAreaLeft}>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsLeftName}>Poolsize:</span><span style={styles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getPoolSize()}</span></div>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsLeftName}>All Mempool Tickets:</span><span style={styles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getAllMempoolTix()}</span></div>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsLeftName}>Own Mempool Tickets:</span><span style={styles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getOwnMempoolTix()}</span></div>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsLeftName}>Live Tickets:</span><span style={styles.stakeInfoRowsLeftValue}>{getStakeInfoResponse.getLive()}</span></div>
                  </div>
                  <div style={styles.stakeInfoAreaRight}>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsRightName}>Voted Tickets:</span><span style={styles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getVoted()}</span></div>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsRightName}>Missed Tickets:</span><span style={styles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getMissed()}</span></div>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsRightName}>Revoked Tickets:</span><span style={styles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getRevoked()}</span></div>
                    <div style={styles.stakeInfoRows}><span style={styles.stakeInfoRowsRightName}>Expired Tickets:</span><span style={styles.stakeInfoRowsRightValue}>{getStakeInfoResponse.getExpired()}</span></div>
                  </div>
                </div>:
                <div>
                </div>
                }

            </div>
          }
          headerMetaOverview={
            activeStakePoolConfig && !this.state.addAnotherStakePool && getTicketPriceResponse !== null ?
            <div>
             <Balance amount={getTicketPriceResponse.getTicketPrice()}/>
              <div style={styles.toggle}>
                <NewExistingSeedToggle
                  activeButton={'left'}
                  leftText={'Purchase Tickets'}
                  rightText={'Configure stakepools'}
                  toggleAction={(e)=>{this.toggleTicketStakePool(e);}}/>
              </div></div>:
            <div></div>

          }
        />
        {(!activeStakePoolConfig || this.state.addAnotherStakePool) && !currentStakePoolConfigRequest ?
          stakePoolConfigInput :
          currentStakePoolConfigRequest || purchaseTicketsRequestAttempt ?
            <CircularProgress style={styles.loading} size={125} thickness={6}/> :
              this.state.purchaseTickets ?
              purchaseTicketsView :
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
