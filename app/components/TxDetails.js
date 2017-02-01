import React, { Component } from 'react';
//import { reverseHash } from '../helpers/byteActions';
import Balance from './Balance';
import IndicatorPending from './icons/indicator-pending.svg';
import IndicatorConfirmed from './icons/indicator-confirmed.svg';
import PlusBig from './icons/plus-big.svg';
import MinusBig from './icons/minus-big.svg';
import dateFormat from 'dateformat';
import './fonts.css';

const styles = {
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
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },

  transition1: {
    transition: 'all 100ms cubic-bezier(.86, 0, .07, 1)',
  },
  headerTop: {
    height: '106px',
    paddingBottom: '20px',
  },
  headerTitleOverview: {
    height: '54px',
    paddingTop: '13px',
    color: '#596d81',
    fontSize: '27px',
  },
  headerMetaOverview: {
    height: '54px',
    paddingTop: '5px',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '53px',
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
  contentNest: {
    paddingTop: '1px',
  },
  indicatorPending: {
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
    borderColor: '#2971ff',
    backgroundImage: `url(${IndicatorPending})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    color: '#2971ff',
  },

  indicatorConfirmed: {
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
    borderColor: '#2ed8a3',
    backgroundImage: `url(${IndicatorConfirmed})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    color: '#2ed8a3',
  },
  headerTopTransactionDetails: {
    height: '106px',
    paddingTop: '43px',
    textAlign: 'center',
    marginRight: '-20px',
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
  },

  headerMetaTransactionDetailsIn: {
    paddingTop: '16px',
    paddingLeft: '50px',
    backgroundImage: `url(${PlusBig})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '30px',
    backgroundRepeat: 'no-repeat',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '35px',
    fontWeight: '700',
  },

  headerMetaTransactionDetailsCurrency: {
    fontSize: '19px',
    fontWeight: '400',
  },

  headerMetaTransactionDetailsTimeAndDate: {
    display: 'inline-block',
    paddingTop: '4px',
    float: 'right',
    fontFamily: 'Source Sans Pro, sans-serif',
    fontSize: '19px',
    fontWeight: '400',
  },

  headerMetaTransactionDetailsOut: {
    paddingTop: '16px',
    paddingLeft: '50px',
    backgroundImage: `url(${MinusBig})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '30px',
    backgroundRepeat: 'no-repeat',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '35px',
    fontWeight: '700',
  },

  headerTopTransactionDetails: {
    marginRight: '-20px',
  },

  transactionDetails: {
    paddingTop: '18px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e7eaed',
    fontSize: '13px',
  },

  transactionDetailsLeft: {
    width: '150px',
    float: 'left',
  },

  transactionDetailsRight: {
    width: '570px',
    float: 'right',
  },

  transactionDetailsName: {
    display: 'block',
    width: '160px',
    height: '28px',
    paddingTop: '4px',
    paddingRight: '20px',
    float: 'left',
    clear: 'left',
    fontSize: '13px',
    lineHeight: '19px',
    textAlign: 'right',
  },

  transactionDetailsValue: {
    display: 'inline-block',
    height: '28px',
    paddingTop: '9px',
    float: 'left',
    fontFamily: 'Inconsolata, monospace',
    lineHeight: '10px',
    fontWeight: '700',
    textAlign: 'left',
  },

  transactionDetailsValueText: {
    fontWeight: '400',
  },

  transactionDetailsTitle: {
    width: '140px',
    height: '28px',
    paddingTop: '4px',
    color: '#596d81',
    fontSize: '20px',
    textAlign: 'right',
  },

  transactionDetailsLast: {
    borderBottom: '0px none transparent',
  }
};

class TxDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tx } = this.props;
    const { clearTxDetails } = this.props;
    return(
      <div style={styles.view}>
        <div style={styles.header}>
          <div style={styles.headerTopTransactionDetails}>
            <a style={styles.viewButtonLightSlateGray} onClick={() => clearTxDetails()}>back</a>
          </div>
          <div style={styles.headerTitleOverview}>Primary account</div>
          <div style={styles.headerMetaTransactionDetailsIn}>
            <Balance amount={1343240000} />
            <div style={styles.headerMetaTransactionDetailsTimeAndDate}>20 Jan 2017 14:51</div>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentNest}>
            <div style={styles.transactionDetails}>
              <div style={styles.transactionDetailsName}>Transaction:</div>
              <div style={styles.transactionDetailsValue}>68c733bd42e80db76791429558c0b00c2e1ce8d89a2074d977638a252b8b4c1a</div>
              <div style={styles.transactionDetailsName}>
                <div style={styles.indicatorConfirmed}>confirmed</div>
              </div>
              <div style={styles.transactionDetailsValue}>11 <span style={styles.transactionDetailsValueText}>confirmations</span>
              </div>
              <div style={styles.transactionDetailsName}>To address:</div>
              <div style={styles.transactionDetailsValue}>Tsbg8igLhyeCTUx4WJEcTk8318AJfqYWf5g</div>
              <div style={styles.transactionDetailsName}>Transaction fee:</div>
              <div style={styles.transactionDetailsValue}>0.0001 <span style={styles.transactionDetailsValueText}>DCR</span>
              </div>
            </div>
            <div style={styles.transactionDetails}>
              <div style={styles.transactionDetailsTitle}>Properties</div>
              <div style={styles.transactionDetailsName}>Block:</div>
              <div style={styles.transactionDetailsValue}>000000000000be05fdd578ba392dc367640a243756ba4ecbf10cafc423b49331a7</div>
              <div style={styles.transactionDetailsName}>Height:</div>
              <div style={styles.transactionDetailsValue}>10.504</div>
            </div>
            <div style={styles.transactionDetails}>
              <div style={styles.transactionDetailsTitle}>Inputs</div>
              <div style={styles.transactionDetailsName}>College funds:</div>
              <div style={styles.transactionDetailsValue}>0.0001 <span style={styles.transactionDetailsValueText}>DCR</span>
              </div>
            </div>
            <div style={styles.transactionDetailsLast}>
              <div style={styles.transactionDetailsTitle}>Outputs</div>
              <div style={styles.transactionDetailsName}>Tsbg8igLh… :</div>
              <div style={styles.transactionDetailsValue}>5.00&nbsp;<span style={styles.transactionDetailsValueText}>DCR</span>
              </div>
              <div style={styles.transactionDetailsName}>Change:</div>
              <div style={styles.transactionDetailsValue}>4.9999 <span style={styles.transactionDetailsValueText}>DCR</span>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default TxDetails;
/*
        {Buffer.from(tx.getHash()).toString('hex')}
        <div onClick={() => clearTxDetails()}>
          back
        </div>
*/