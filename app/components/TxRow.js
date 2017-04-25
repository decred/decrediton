import React, { Component } from 'react';
import Radium from 'radium';
import Balance from './Balance';
import IndicatorPending from './icons/indicator-pending.svg';
import IndicatorConfirmed from './icons/indicator-confirmed.svg';
import PlusSmall from './icons/plus-small.svg';
import MinusSmall from './icons/minus-small.svg';
import TicketSmall from './icons/tickets-ticket.svg';
import ArrowRightGray from './icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from './icons/arrow-right-key-blue.svg';
import './fonts.css';
import { TransactionDetails }  from '../middleware/walletrpc/api_pb';

const styles = {
  historyContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 'auto',
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

  transactionIn: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${PlusSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${PlusSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },

  transactionOut: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${MinusSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${MinusSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },

  ticketTx: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${TicketSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${TicketSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },
  voteTx: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${TicketSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${TicketSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },
  revokeTx: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${TicketSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${TicketSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },
  transactionAmount: {
    width: '44%',
    height: '35px',
    paddingTop: '17px',
    float: 'left',
  },

  transactionAccount: {
    width: '34%',
    height: '100%',
    float: 'left',
  },

  transactionTimeDate: {
    width: '22%',
    height: '36px',
    paddingTop: '16px',
    float: 'left',
    color: '#0c1e3e',
    fontSize: '13px',
    textAlign: 'right',
  },

  transactionAccountName: {
    width: '45%',
    height: '36px',
    paddingTop: '17px',
    paddingRight: '0px',
    float: 'left',
    fontSize: '11px',
    textAlign: 'right',
  },

  transactionAccountIndicator: {
    width: '50%',
    height: '35px',
    paddingTop: '17px',
    paddingLeft: '10px',
    float: 'left',
  },

  transactionAmountNumber: {
    fontFamily: 'Inconsolata, monospace',
    fontSize: '19px',
    lineHeight: '13px',
    fontWeight: '700',
  },

  transactionAmountHash: {
    fontFamily: 'Inconsolata, monospace',
    color: '#c4cbd2',
    fontSize: '11px',
    lineHeight: '11px',
  },

  transactionAmountNumberCurrency: {
    fontSize: '13px',
    fontWeight: '400',
  },

  transactionAmountNumberNumberFormatSmall: {
    fontSize: '13px',
  },
};

class TxRow extends Component {
  render() {
    const { showTxDetail } = this.props;
    const { txInfo } = this.props;
    const { direction } = this.props;
    const { txAmount } = this.props;
    const { txDescription } = this.props;
    const { pending } = this.props;
    const { date } = this.props;
    const { accountName } = this.props;
    const { type } = this.props;
    if (type == TransactionDetails.TransactionType.TICKET_PURCHASE) {
      return (
        <div style={styles.ticketTx} key={txInfo.tx.getHash()} onClick={showTxDetail !== undefined ? () => {showTxDetail(txInfo);}:null}>
          <div style={styles.transactionAmount}>
            Ticket
          </div>
          <div style={styles.transactionAccount}>
            <div style={styles.transactionAccountName}>{accountName}</div>
            <div style={styles.transactionAccountIndicator}>
              <div style={styles.indicatorConfirmed}>Confirmed</div>
            </div>
          </div>
          <div style={styles.transactionTimeDate}><span>{date}</span></div>
        </div>);
    }
    if (type == TransactionDetails.TransactionType.VOTE) {
      return (
        <div style={styles.voteTx} key={txInfo.tx.getHash()} onClick={showTxDetail !== undefined ? () => {showTxDetail(txInfo);}:null}>
          <div style={styles.transactionAmount}>
            Vote
          </div>
          <div style={styles.transactionAccount}>
            <div style={styles.transactionAccountName}>{accountName}</div>
            <div style={styles.transactionAccountIndicator}>
              <div style={styles.indicatorConfirmed}>Confirmed</div>
            </div>
          </div>
          <div style={styles.transactionTimeDate}><span>{date}</span></div>
        </div>);
    }
    if (type == TransactionDetails.TransactionType.REVOCATION) {
      return (
          <div style={styles.revokeTx} key={txInfo.tx != null ? txInfo.tx.getHash() : null} onClick={showTxDetail !== undefined ? () => {showTxDetail(txInfo);}:null}>
          <div style={styles.transactionAmount}>
            Revoke
          </div>
          <div style={styles.transactionAccount}>
            <div style={styles.transactionAccountName}>{accountName}</div>
            <div style={styles.transactionAccountIndicator}>
              <div style={styles.indicatorConfirmed}>Confirmed</div>
            </div>
          </div>
          <div style={styles.transactionTimeDate}><span>{date}</span></div>
        </div>);
    }
    if (pending) {
      if (direction == 'out') {
        return (
          <div style={styles.transactionOut} key={Buffer.from(txInfo.getHash()).toString('hex')}>
            <div style={styles.transactionAmount}>
              <div style={styles.transactionAmountNumber}>-<Balance amount={txAmount} /></div>
              <div style={styles.transactionAmountHash}>{txDescription.addressStr}</div>
            </div>
            <div style={styles.transactionAccount}>
              <div style={styles.transactionAccountName}>{accountName}</div>
                <div style={styles.transactionAccountIndicator}>
                  <div style={styles.indicatorPending}>Pending</div>
                </div>
              </div>
            </div>);
      } else if ( direction == 'in') {
        return (
          <div style={styles.transactionIn} key={Buffer.from(txInfo.getHash()).toString('hex')} onClick={showTxDetail !== undefined ? () => {showTxDetail(txInfo);}:null}>
            <div style={styles.transactionAmount}>
              <div style={styles.transactionAmountNumber}><Balance amount={txAmount} /></div>
              <div style={styles.transactionAmountHash}>{txDescription.addressStr}</div>
            </div>
            <div style={styles.transactionAccount}>
              <div style={styles.transactionAccountName}>{accountName}</div>
              <div style={styles.transactionAccountIndicator}>
                <div style={styles.indicatorPending}>Pending</div>
              </div>
            </div>
          </div>);
      }
    } else {
      if (direction == 'out') {
        return (
          <div style={styles.transactionOut} key={txInfo.tx.getHash()} onClick={showTxDetail !== undefined ? () => {showTxDetail(txInfo);}:null}>
            <div style={styles.transactionAmount}>
              <div style={styles.transactionAmountNumber}>-<Balance amount={txAmount} /></div>
              <div style={styles.transactionAmountHash}>{txDescription.addressStr}</div>
            </div>
            <div style={styles.transactionAccount}>
              <div style={styles.transactionAccountName}>{accountName}</div>
              <div style={styles.transactionAccountIndicator}>
                <div style={styles.indicatorConfirmed}>Confirmed</div>
              </div>
            </div>
            <div style={styles.transactionTimeDate}><span>{date}</span></div>
          </div>);
      } else if ( direction == 'in') {
        return (
          <div style={styles.transactionIn} key={txInfo.tx.getHash()} onClick={showTxDetail !== undefined ? () => {showTxDetail(txInfo);}:null}>
            <div style={styles.transactionAmount}>
              <div style={styles.transactionAmountNumber}><Balance amount={txAmount} /></div>
              <div style={styles.transactionAmountHash}>{txDescription.addressStr}</div>
            </div>
            <div style={styles.transactionAccount}>
              <div style={styles.transactionAccountName}>{accountName}</div>
              <div style={styles.transactionAccountIndicator}>
                <div style={styles.indicatorConfirmed}>Confirmed</div>
              </div>
            </div>
            <div style={styles.transactionTimeDate}><span>{date}</span></div>
          </div>);
      }
    }

  }
}

export default Radium(TxRow);
