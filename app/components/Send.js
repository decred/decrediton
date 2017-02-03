// @flow
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import ErrorScreen from './ErrorScreen';
import ConstructTxForm from '../containers/ConstructTxForm';
import SignTxForm from '../containers/SignTxForm';
import PublishTx from '../containers/PublishTx';
import ShowError from './ShowError';
import { reverseHash } from '../helpers/byteActions';
import SideBar from './SideBar';
import MinusBig from './icons/minus-big.svg';
import WalletGray from './icons/wallet-gray.svg';
import ArrowDownMidBlue from './icons/arrow-down-mid-blue.svg';
import ArrowDownKeyBlue from './icons/arrow-down-key-blue.svg';
import Add from './icons/add.svg';
import Delete from './icons/delete.svg';
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
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#fff',
  },

  viewNotificationError: {
    display: 'inlineBlock',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#fd714b',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
  },
  viewNotificationSuccess: {
    display: 'inlineBlock',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#41bf53',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  transition1: {
    transition: 'all 100ms ease-in-out',
  },
  headerTop: {
    height: '106px',
    paddingTop: '43px',
    textAlign: 'center',
  },
  headerTitleSend: {
    height: '54px',
    paddingTop: '13px',
    color: '#596d81',
    fontSize: '27px',
    textTransform: 'capitalize',
    paddingLeft: '50px',
    backgroundImage: `url(${MinusBig})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '30px',
    backgroundRepeat: 'no-repeat',
  },
  headerMetaSend: {
    height: '54px',
    width: '480px',
    paddingLeft: '50px',
    color: '#0c1e3e',
    fontSize: '13px',
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
  contentNestFromAddress: {
    width: '100%',
    height: '54px',
    paddingTop: '10px',
    float: 'left',
  },  
  contentNestFromAddressWalletIcon: {
    display: 'inlineBlock',
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
  contentNestAddressHash: {
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
    }
  },
  contentNestAddressHashTo: {
    width: '100%',
    color: '#2971ff',
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
    height: 'auto',
    minHeight: '44px',
  },  
  contentNestAddressWalletIcon: {
    width: '60px',
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
    display: 'inlineBlock',
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
    paddingTop: '7px',
    borderStyle: 'none',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '19px',
    fontWeight: '700',
    textAlign: 'right',
  },
  contentNestToAddressAmountSumNumberFormatSmall: {
    fontSize: '13px',
  },
  contentNestAddressDeleteIcon: {
    width: '60px',
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
  }
};

class Send extends Component{
  static propTypes = {
    walletService: PropTypes.object,

    constructTxResponse: PropTypes.object,
    constructTxRequestAttempt: PropTypes.bool.isRequired,

    publishTransactionResponse: PropTypes.object,
  };

  render() {
    const { walletService } = this.props;
    const { constructTxResponse, constructTxError } = this.props;
    const { publishTransactionResponse, publishTransactionError } = this.props;
    const { signTransactionError } = this.props;
    const { clearTransaction, signTransactionAttempt} = this.props;
    const constructTxView = (
      <div style={styles.content}>
        <ShowError error={constructTxError}/>
        <h1>Construct Tx</h1>
        <ConstructTxForm />
      </div>);

    const signTxView = (
      <div style={styles.content}>
        <ShowError error={signTransactionError}/>
        <h1>Sign Tx</h1>
        <p> raw tx <br/>
          {constructTxResponse !== null ? constructTxResponse.getUnsignedTransaction() : null}}
        </p>
      <p> total previous output amount (atoms) <br/>
          {constructTxResponse != null ? constructTxResponse.getTotalPreviousOutputAmount() : null}
        </p>
      <p> total output amount (atoms) <br/>
          {constructTxResponse !== null ? constructTxResponse.getTotalOutputAmount() : null}
        </p>
        <p> estimated signed size <br/>
          {constructTxResponse !== null ? constructTxResponse.getEstimatedSignedSize() : null}
        </p>
      <SignTxForm clearTransaction={clearTransaction} signTransactionAttempt={signTransactionAttempt} rawTx={constructTxResponse !== null ? constructTxResponse.getUnsignedTransaction() : null}/>
      </div>);

    var sendView;

    const publishTxView = (
      <div style={styles.content}>
        <ShowError error={publishTransactionError}/>
        <h1>Published Tx!</h1>
        <p>{publishTransactionResponse !== null ? reverseHash(publishTransactionResponse.toString('hex')) : null}</p>
	<PublishTx clearTransaction={clearTransaction}/>
      </div>);

    if (constructTxResponse === null) {
      sendView = constructTxView;
    } else {
      if (publishTransactionResponse === null) {
        sendView = signTxView;
      } else {
        sendView = publishTxView;
      }
    }
    var sendView = (
      <div style={styles.view}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.viewNotificationError}>Error notification</div>
            <div style={styles.viewNotificationSuccess}>Success notification</div>
          </div>
          <div style={styles.headerTitleSend}>Send Funds</div>
          <div style={styles.headerMetaSend}>Decred addresses always begin with letter D contain 26-35 alphanumeric characters e.g. <span style={styles.headerMetaSpanSend}>DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>.</div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentNestSend}>
            <div style={styles.contentNestFromAddress}>
              <div style={styles.contentNestPrefixSend}>From:</div>
              <div style={styles.selectAccountsSend}>
                <div style={styles.selectAccount}>
                  <div style={styles.selectAccountNFirst}>
                    <div style={styles.selectAccountNAmount}>(<span style={styles.selectAccountNAmountBold}>1,144</span>.33243300)</div>
                    <div style={styles.selectAccountNTextSend}>Primary account sssssssssssssssssssssssssssss</div>
                  </div>
                  <div style={styles.selectAccountNNestSend}>
                    <div style={styles.selectAccountN} key="1" data-name="primaryAccount" data-value="1,133.8883">
                      <div style={styles.selectAccountNText}>College funds</div>
                      <div style={styles.selectAccountNGradient}></div>
                    </div>
                    <div style={styles.selectAccountN} key="2"  data-name="primaryAccount" data-value="33.8883000">
                      <div style={styles.selectAccountNText}>College funds</div>
                      <div style={styles.selectAccountNGradient}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.contentNestFromAddressWalletIcon}></div>
            </div>
            <div style={styles.contentNestToAddress}>
              <div style={styles.contentNestPrefixSend}>To:</div>
              <div style={styles.contentNestAddressHashBlock}>
                <div style={styles.inputForm }>
                  <form style={styles.inputForm}>
                    <input style={styles.contentNestAddressHashTo} type="text" placeholder="Address"/>
                  </form>
                </div>
                <div style={styles.contentNestGradient}></div>
              </div>
              <div style={styles.contentNestAddressWalletIcon}></div>
              <div style={styles.contentNestAddressAmount}>
                <div style={styles.contentNestPrefixSend}>Amount:</div>
                <div style={styles.contentNestAddressAmountSumAndCurrency}>
                  <div style={styles.contentNestAddressAmountSumGradient}>dcr</div>
                  <div style={styles.inputForm }>
                    <form style={styles.inputForm}>
                      <input style={styles.contentNestAddressAmountSum} type="text" value="22.00"/>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.contentNestDeleteAddress} key="01">
              <div style={styles.contentNestAddressHashBlock}>
                <div style={styles.inputForm }>
                  <form style={styles.inputForm}>
                    <input style={styles.contentNestAddressHash} type="text" placeholder="Address"/>
                  </form>
                </div>
                <div style={styles.contentNestGradient}></div>
              </div>
              <div style={styles.contentNestAddressDeleteIcon}></div>
              <div style={styles.contentNestAddressAmount}>
                <div style={styles.contentNestAddressAmountSumAndCurrency}>
                  <div style={styles.contentNestAddressAmountSumGradient}>dcr</div>
                  <div style={styles.inputForm }>
                    <form style={styles.inputForm}>
                      <input style={styles.contentNestAddressAmountSum} type="text" value="22.00"/>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.contentSend}>
            <a style={styles.viewButtonKeyBlue} href="#">send</a>
            <div style={styles.contentSendSection}>
              <div style={styles.viewCheckbox} data-checkbox-value="0"></div>
              <div style={styles.contentSendSectionCheckboxText}>send</div>
              <div style={styles.contentSendSectionAmount}>0.00000000 <span style={styles.contentSendSectionAmountCurrency}>DCR</span>
              </div>
              <div style={styles.contentSendSectionDescription}>Estimated fee:</div>
            </div>
            <div style={styles.contentSendSection}>
              <div style={styles.viewCheckbox} data-checkbox-value="0"></div>
              <div style={styles.contentSendSectionCheckboxText}>Publish</div>
              <div style={styles.contentSendSectionAmount}>0.00000000 <span style={styles.contentSendSectionAmountCurrency}>DCR</span>
              </div>
              <div style={styles.contentSendSectionDescription}>Estimated remaining balance:</div>
            </div>
          </div>
        </div>
      </div>
    );
    /* Check to see that client is not undefined */
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {sendView}
        </div>);
    }
  }
}

export default Send;
