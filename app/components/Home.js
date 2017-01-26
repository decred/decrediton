// @flow
import React, { Component, PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import ErrorScreen from './ErrorScreen';
import RescanForm from '../containers/RescanForm';
import Balance from './Balance';
import SideBar from './SideBar';
import Search from './icons/search.svg';
import IndicatorPending from './icons/indicator-pending.svg';
import IndicatorConfirmed from './icons/indicator-confirmed.svg';
import PlusSmall from './icons/plus-small.svg';
import MinusSmall from './icons/minus-small.svg';
import ArrowRightGray from './icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from './icons/arrow-right-key-blue.svg';

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
  headerTitle: {
    height: '54px',
  },
  headerMeta: {
    height: '54px',
  },
  headerTitleOverview: {
    paddingTop: '13px',
    color: '#596d81',
    fontSize: '27px',
  },
  headerMetaOverview: {
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
  },
  indicator: {
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },

  indicatorPending: {
    borderColor: '#2971ff',
    backgroundImage: `url(${IndicatorPending})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'noRepeat',
    color: '#2971ff',
  },

  indicatorConfirmed: {
    borderColor: '#2ed8a3',
    backgroundImage: `url(${IndicatorConfirmed})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'noRepeat',
    color: '#2ed8a3',
  },

  contentNest: {
    paddingTop: '1px',
  },

  transaction: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
    }
  },

  transactionIn: {
    backgroundImage: `url(${ArrowRightGray}),url(${PlusSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'noRepeat, noRepeat',
    ':hover': {
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${PlusSmall})`,
      backgroundSize: '5px, 16px',
    }
  },

  transactionOut: {
    backgroundImage: `url(${ArrowRightGray},url(${MinusSmall}`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'noRepeat, noRepeat',
    ':hover': {
      backgroundImage: `url(${ArrowRightKeyBlue},url(${MinusSmall}`,
      backgroundSize: '5px, 16px',
    }
  },

  transactionAmount: {
    width: '44%',
    height: '100%',
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
    height: '100%',
    paddingTop: '16px',
    float: 'left',
    color: '#0c1e3e',
    fontSize: '13px',
    textAlign: 'right',
  },

  transactionAccountName: {
    width: '50%',
    height: '100%',
    paddingTop: '16px',
    paddingRight: '10px',
    float: 'left',
    fontSize: '13px',
    textAlign: 'right',
  },

  transactionAccountIndicator: {
    width: '50%',
    height: '100%',
    paddingTop: '15px',
    paddingLeft: '10px',
    float: 'left',
  },

  transactionAmountNumber: {
    fontFamily: 'Inconsolata, monospace',
    fontSize: '19px',
    lineHeight: '15px',
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

  contentTitleText: {
    display: 'inline-block',
    overflow: 'hidden',
    width: '653px',
    height: '100%',
    paddingTop: '13px',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'left',
  },

  contentTitleButtonSearch: {
    width: '20px',
    height: '100%',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'right',
    backgroundImage: `url(${Search})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'noRepeat',
    ':hover': {
      opacity: '0.8',
    }
  },

  contentTitleButtonSearchTransition1: {
    width: '60px',
    height: '100%',
    cursor: 'pointer',
  },

  contentTitleTextActive: {
    color: '#2971ff',
  },

  contentTitleActive: {
    borderBottom: '1px solid #2971ff',
  },

  headerMetaCurrency: {
    fontSize: '23px',
  },
};

class Home extends Component{
  constructor(props) {
    super(props);
  }

  static propTypes = {
    walletService: PropTypes.object,

    getBalanceRequestAttempt: PropTypes.bool.isRequired,
    getStakeInfoRequestAttempt: PropTypes.bool.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getBalanceAttempt(0,1);
  }

  render() {
    const { walletService } = this.props;

    const { getBalanceRequestAttempt, getBalanceResponse } = this.props;
    const { rescanRequest, rescanResponse } = this.props;
    const { getAccountsResponse } = this.props;

    var rescanPercFisnished;
    if (rescanResponse !== null && getAccountsResponse !== null && rescanRequest != null) {
      var totalBlocks = getAccountsResponse.getCurrentBlockHeight() - rescanRequest.getBeginHeight();
      var blocksFinished = rescanResponse.getRescannedThrough() - rescanRequest.getBeginHeight();
      rescanPercFisnished = (blocksFinished / totalBlocks) * 100;
      rescanPercFisnished = rescanPercFisnished.toFixed(2);
    }
    var rescanView;
    if (rescanResponse === null) {
      rescanView = <RescanForm />;
    } else {
      rescanView = (
        <div>
          <LinearProgress mode="determinate"
            min={rescanRequest !== null ? rescanRequest.getBeginHeight(): 0}
            max={getAccountsResponse !== null ? getAccountsResponse.getCurrentBlockHeight(): 100}
            value={rescanResponse !== null ? rescanResponse.getRescannedThrough() : 0} />
          <p>{rescanPercFisnished}%</p>
        </div>
      );
    }

    const homeView = (
      <div style={styles.view}>
        <div style={styles.header}>
          <div style={styles.headerTop}></div>
          <div style={styles.headerTitleOverview}>Available Balance</div>
          <div style={styles.headerMeta}><Balance amount={3,120.8477094298} />
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}>Recent Transactions</div>
            <div style={styles.contentTitleButtonSearch}></div>
          </div>
          <div style={styles.contentNest}>
            <div style={styles.transactionIn}>
              <div style={styles.transactionAmount}>
                <div style={styles.transactionAmountNumber}>-<Balance amount={13.43240000} /></div>
                <div style={styles.transactionAmountHash}>Tsbg8igLhyeCTUx4WJEcTk8318AJfqYWf5g</div>
              </div>
              <div style={styles.transactionAccount}>
                <div style={styles.transactionAccountName}>Primary account</div>
                <div style={styles.transactionAccountIndicator}>
                  <div style={styles.indicatorPending}>Pending</div>
                </div>
              </div>
              <div style={styles.transactionTimeDate}>20 Jan 2017 14:51</div>
            </div>
          </div>
          <div style={styles.transactionOut}>
            <div style={styles.transactionAmount}>
              <div style={styles.transactionAmountNumber}>-<Balance amount={13.43240000} /></div>
              <div style={styles.transactionAmountHash}>Tsbg8igLhyeCTUx4WJEcTk8318AJfqYWf5g</div>
            </div>
            <div style={styles.transactionAccount}>
              <div style={styles.transactionAccountName}>Primary account</div>
              <div style={styles.transactionAccountIndicator}>
                <div style={styles.indicatorConfirmed}>confirmed</div>
              </div>
            </div>
            <div style={styles.transactionTimeDate}>20 Jan 2017 14:51</div>
          </div>
        </div>
      </div>);

    if (walletService === null) {
      return(<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {homeView}
        </div>);
    }
  }
}

export default Home;
