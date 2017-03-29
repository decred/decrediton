// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import MinusBig from '../icons/minus-big.svg';
import WalletGray from '../icons/wallet-gray.svg';
import ArrowDownMidBlue from '../icons/arrow-down-mid-blue.svg';
import ArrowDownKeyBlue from '../icons/arrow-down-key-blue.svg';
import Add from '../icons/add.svg';
import Delete from '../icons/delete.svg';
import Header from '../Header';

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
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#41bf53',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  transition1: {
    transition: 'all 100ms ease-in-out',
  },
  headerTitlePurchase: {
    height: '54px',
    lineHeight: '49px',
    color: '#596d81',
    fontSize: '27px',
    textTransform: 'capitalize',
    paddingLeft: '50px',
    backgroundImage: `url(${MinusBig})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '30px',
    backgroundRepeat: 'no-repeat',
  },
  headerMetaPurchase: {
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
  contentNestPurchase: {
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
  contentNestPrefixPurchase: {
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
  contentNestFromAddressWalletIcon: {
    display: 'inline-block',
    width: '60px',
    height: '34px',
    float: 'left',
    backgroundImage: `url(${WalletGray})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
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
    overflow: 'hidden',
    width: '300px',
    height: '34px',
    float: 'left',
    borderBottom: '1px solid #a9b4bf',
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
  selectAccountNTextPurchase: {
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
  selectAccountNNestPurchase: {
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
    height: 'auto',
    minHeight: '44px',
  },
  contentNestAddressWalletIcon: {
    width: '50px',
    height: '34px',
    float: 'left',
    backgroundImage: `url(${Add})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '19px',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    ':hover': {
      opacity: '0.85',
    }
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
    width: '100px',
    height: '100%',
    borderStyle: 'none',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '19px',
    fontWeight: '700',
  },
  contentNestToAddressAmountSumNumberFormatSmall: {
    fontSize: '13px',
  },
  contentNestAddressDeleteIcon: {
    width: '50px',
    height: '34px',
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
  contentNestAddressAmountSumNumberFormatSmall: {
    fontSize: '13px',
  },
  contentPurchase: {
    marginTop: '20px',
  },
  contentPurchaseSection: {
    display: 'block',
    width: '91%',
    height: '22px',
    paddingLeft: '30px',
    float: 'left',
    color: '#0c1e3e',
  },
  contentPurchaseSectionCheckboxText: {
    height: '100%',
    paddingTop: '1px',
    paddingLeft: '5px',
    float: 'left',
    textTransform: 'capitalize',
  },
  ontentPurchaseSectionAmount: {
    width: '160px',
    height: '100%',
    paddingTop: '1px',
    paddingRight: '30px',
    float: 'right',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '13px',
    textAlign: 'right',
  },
  contentPurchaseSectionDescription: {
    height: '100%',
    paddingTop: '1px',
    paddingRight: '20px',
    float: 'right',
    color: '#596d81',
    fontSize: '13px',
  },
  contentPurchaseSectionAmountCurrency: {
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
  }
};

class Purchase extends Component{
  static propTypes = {
    walletService: PropTypes.object,

  }
  constructor(props) {
    super(props);

    this.state = {
      privpass: null,
      account: 0,
      spendLimit: 0,
      conf: 0,
      ticketAddress: '',
      numTickets: 0,
      poolAddress: '',
      poolFee: 0,
      expiry: 16,
      txFee: 0.01, // DCR/kB
      ticketFee: 0.01 // DCR/kB
    };
  }
  componentWillMount() {
    this.props.clearPurchaseTicketsSuccess();
    this.props.clearPurchaseTicketsError();
  }
  submitPurchase() {
    if (this.state.privpass == null || this.state.ticketAddress == '' ||
       this.state.numTickets == '' ) {
      return;
    }
    this.props.purchaseTicketsAttempt(
      this.state.privpass,
      this.state.account,
      this.state.spendLimit,
      this.state.conf,
      this.state.ticketAddress,
      this.state.numTickets,
      this.state.poolAddress,
      this.state.poolFee,
      this.state.expiry,
      this.state.txFee,
      this.state.ticketFee
    );
  }
  updateAccountNumber(outputKey, accountNum) {
    this.setState({account: accountNum});
  }
  updateTicketAddress(ticketAddress) {
    this.setState({ticketAddress: ticketAddress});
  }
  updateNumTickets(numTickets) {
    this.setState({numTickets: numTickets});
  }
  updatePoolAddress(poolAddress) {
    this.setState({poolAddress: poolAddress});
  }
  updatePoolFee(poolFee) {
    this.setState({poolFee: poolFee});
  }
  updateExpiry(expiry) {
    this.setState({expiry: expiry});
  }
  updateTxFee(txFee) {
    this.setState({txFee: txFee});
  }
  updateTicketFee(ticketFee) {
    this.setState({ticketFee: ticketFee});
  }
  updateOutputAmount(outputKey, amount, unitLabel) {
    // Default to DCR.
    var units = 100000000;
    if (unitLabel === 'DCR') {
      units = 100000000;
    }
    if (unitLabel === 'atoms') {
      units = 1;
    }
    var updateOutputs = this.state.outputs;
    updateOutputs[outputKey].amount = amount * units;
    this.setState({ outputs: updateOutputs });
  }
  render() {
    const { walletService } = this.props;
    const { getAccountsResponse } = this.props;
    const { activeStakePoolConfig } = this.props;
    const { purchaseTicketsError, purchaseTicketsSuccess } = this.props;
    const { purchaseTicketsRequestAttempt } = this.props;

    var warningTextDiv = (<div style={styles.headerMetaPurchase}>The safest way
                          to ensure that your vote succeeds is use a stake pool.
                         </div>);
    var noPoolView = (<div style={styles.view}>
                      <Header
                      headerTitleOverview={<div style={styles.headerTitlePurchase}>Purchase Tickets</div>}
                      ></Header>
                      <div style={styles.headerMetaPurchase}>You must setup a
		      stake pool preference before you can
		      purchase tickets!</div>
                      </div>);
    var selectAccounts = (
      <div style={styles.selectAccountsPurchase}>
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

    var purchaseView = (
      <div style={styles.view}>
	<Header
        headerTitleOverview={<div style={styles.headerTitlePurchase}>Purchase Tickets</div>}
      headerTop={[purchaseTicketsError !== null ?
            <div key="purchaseError" style={styles.viewNotificationError}><div style={styles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsError()}></div>{purchaseTicketsError}</div> :
                  <div key="purchaseError" ></div>,
        purchaseTicketsSuccess !== null ?
      <div key="purchaseSuccess" style={styles.viewNotificationSuccess}><div style={styles.contentNestAddressDeleteIcon} onClick={() => this.props.clearPurchaseTicketsSuccess()}></div>{purchaseTicketsSuccess}</div> :
                  <div key="purchaseSuccess" ></div>,
      ]}
      headerMetaOverview={warningTextDiv}>
	</Header>
        <div style={styles.content}>

      {purchaseTicketsRequestAttempt ? <div></div>
	: purchaseTicketsRequestAttempt !== null ?
	<div>test</div> : <div></div>}

	<div style={styles.flexHeight}>

	<div style={styles.contentNestFromAddress}>
              <div style={styles.contentNestPrefixPurchase}>From:</div>
              {selectAccounts}
              <div style={styles.contentNestFromAddressWalletIcon}></div>
        </div>

	<div style={styles.contentNestPrefixSend}>Number of Tickets:</div>
          <div style={styles.inputForm}>
	<input
                type="text"
                style={styles.contentNestAddressHashTo}
                placeholder="Number of Tickets"
                onBlur={(e) =>{this.updateNumTickets(e.target.value);}}/>
	</div>

        <div style={styles.contentNestPrefixSend}>Ticket Fee (DCR/kB):</div>
          <div style={styles.inputForm}>
	<input
                type="text"
                style={styles.contentNestAddressHashTo}
                placeholder="Ticket Fee"
                onBlur={(e) =>{this.updateTicketFee(e.target.value);}}/>
	</div>

        <div style={styles.contentNestPrefixSend}>Split Fee (DCR/kB):</div>
          <div style={styles.inputForm}>
	<input
                type="text"
                style={styles.contentNestAddressHashTo}
                placeholder="Split Fee"
                onBlur={(e) =>{this.updateTxFee(e.target.value);}}/>
	</div>

	<div style={styles.contentNestPrefixSend}>Expiry:</div>
          <div style={styles.inputForm}>
	<input
                type="text"
                style={styles.contentNestAddressHashTo}
                placeholder="Expiry"
                onBlur={(e) =>{this.updateExpiry(e.target.value);}}/>
	</div>

	<div style={styles.contentNestPrefixSend}>Pool Address:</div>
          <div style={styles.inputForm}>
	<input
                type="text"
                style={styles.contentNestAddressHashTo}
                placeholder="Pool Address"
                onBlur={(e) =>{this.updatePoolAddress(e.target.value);}}/>
	</div>

	<div style={styles.contentNestPrefixSend}>Ticket Address:</div>
          <div style={styles.inputForm}>
                  <input
                    type="text"
                    style={styles.contentNestAddressHashTo}
                    placeholder="Ticket Address"
                    onBlur={(e) =>{this.updateTicketAddress(e.target.value);}}/>
          </div>

        <div style={styles.contentNestPrefixSend}>Private Passhrase:</div>
	<div style={styles.inputForm}>
	<input
                id="privpass"
                style={styles.contentNestAddressHashTo}
                type="password"
                placeholder="Private Password"
                onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
	</div>

	<div style={styles.contentPurchase} onClick={() => this.submitPurchase()}>
            <div style={styles.viewButtonKeyBlue}>Purchase</div>
	</div>
      </div>

      </div>

      </div>);

    if (walletService === null) {
      return (<ErrorScreen />);
    } else if (activeStakePoolConfig !== true) {
      return(
        <div style={styles.body}>
          <SideBar />
          {noPoolView}
        </div>);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {purchaseView}
        </div>);
    }
  }
}

export default Purchase;
