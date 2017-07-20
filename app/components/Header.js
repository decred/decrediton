// @flow
import React from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import WalletGray from './icons/wallet-gray.svg';
import TicketSmall from './icons/tickets-ticket.svg';
import PlusBig from './icons/plus-big.svg';
import MinusBig from './icons/minus-big.svg';
import Balance from './Balance';

function mapStateToProps(state) {
  return {
    newUnminedMessage: state.notifications.newUnminedMessage,
  };
}

const styles = {
  headerGetStarted: {
    paddingRight: '42px',
    paddingLeft: '80px',
    backgroundColor: '#596d81',
  },
  headerTopGetStarted: {
    height: '34px',
    paddingTop: '5px',
    textAlign: 'center',
  },
  headerTitleOverviewGetStarted: {
    height: '54px',
    paddingTop: '13px',
    color: '#fff',
    fontSize: '27px',
  },
  headerMetaOverviewGetStarted: {
    height: '54px',
    paddingTop: '5px',
    fontSize: '13px',
    color: '#c4cbd2',
    fontFamily: 'Inconsolata, monospace',
  },
  header: {
    paddingRight: '42px',
    paddingLeft: '80px',
    backgroundColor: '#fff',
  },
  headerTop: {
    height: '34px',
    paddingTop: '5px',
    textAlign: 'center',
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
    fontSize: '53px',
  },
  Snackbar: {
    fontFamily: 'inherit',
    position: 'absolute',
    left: '61%',
  },
  SnackbarContentSend: {
    height: '78px',
    padding: '0px 50px',
    backgroundColor: 'rgba(12, 30, 62, 0.5)',
    backgroundImage: `url(${MinusBig})`,
    backgroundPosition: '15px 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
  },
  SnackbarContentReceive: {
    height: '78px',
    padding: '0px 50px',
    backgroundColor: 'rgba(12, 30, 62, 0.5)',
    backgroundImage: `url(${PlusBig})`,
    backgroundPosition: '15px 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
  },
  SnackbarContentStake: {
    height: '78px',
    padding: '0px 50px',
    backgroundColor: 'rgba(12, 30, 62, 0.5)',
    backgroundImage: `url(${TicketSmall})`,
    backgroundPosition: '15px 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
  },
  SnackbarContentTransfer: {
    height: '78px',
    padding: '0px 50px',
    backgroundColor: 'rgba(12, 30, 62, 0.5)',
    backgroundImage: `url(${WalletGray})`,
    backgroundPosition: '15px 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
  },
  SnackbarInformation: {    
    fontFamily: 'Source Sans Pro, sans-serif',
    width: '100%',
  },
  SnackbarInformationRow: {
    width: '100%',
    float: 'left',
    height: '25px',
  },
  SnackbarInformationRowType: {
    width: '30%',
    float: 'left',
  },
  SnackbarInformationRowAmount: {
    width: '40%',
    float: 'left',
  },
  SnackbarInformationRowFee: {
    width: '30%',
    float: 'left',
    textAlign: 'right',
  },
  SnackbarInformationRowTx: {
    width: '100%',
    float: 'left',
    textAlign: 'center',
    fontFamily: 'Inconsolata, monospace',
  }
};
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.newUnminedMessage !== nextProps.newUnminedMessage) {
      this.setState({
        open: true,
      });
    }
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    if (this.props.getStarted) {
      return (
        <div style={styles.headerGetStarted}>
          <div style={styles.headerTopGetStarted}>{this.props.headerTop}</div>
          <div style={styles.headerTitleOverviewGetStarted}>{this.props.headerTitleOverview}</div>
          <div style={styles.headerMetaOverviewGetStarted}>
            {this.props.headerMetaOverview}
          </div>
          {this.props.children}
        </div>
      );
    } else {
      var snackbarContentStyle;
      if (this.props.newUnminedMessage !== null) { 
        if (this.props.newUnminedMessage.type == 'Ticket' || this.props.newUnminedMessage.type == 'Vote' || this.props.newUnminedMessage.type == 'Revoke') {
          snackbarContentStyle = styles.SnackbarContentStake
        } else if (this.props.newUnminedMessage.type == 'Receive') {
          snackbarContentStyle = styles.SnackbarContentReceive
        } else if (this.props.newUnminedMessage.type == 'Send') {
          snackbarContentStyle = styles.SnackbarContentSend
        } else if (this.props.newUnminedMessage.type == 'Transfer') {
          snackbarContentStyle = styles.SnackbarContentTransfer
        }
      }
      var newNtfns = '';
      if (this.props.newUnminedMessage !== null) {
        if (this.props.newUnminedMessage.type == 'Ticket' || this.props.newUnminedMessage.type == 'Send' || this.props.newUnminedMessage.type == 'Transfer' || this.props.newUnminedMessage.type == 'Receive') { 
          newNtfns = (<div style={styles.SnackbarInformation}>
                        <div style={styles.SnackbarInformationRow}>
                          <div style={styles.SnackbarInformationRowTx}>{this.props.newUnminedMessage.txHash}</div>
                        </div>
                        <div style={styles.SnackbarInformationRow}>
                          <div style={styles.SnackbarInformationRowType}>{this.props.newUnminedMessage.type}</div>
                          <div style={styles.SnackbarInformationRowAmount}>Amount  <Balance amount={this.props.newUnminedMessage.amount}/></div>
                          <div style={styles.SnackbarInformationRowFee}>Fee  <Balance amount={this.props.newUnminedMessage.fee}/></div>
                        </div> 
                      </div>);
        } else {
          newNtfns = (<div style={styles.SnackbarInformation}>
                        <div style={styles.SnackbarInformationRow}>
                          <div style={styles.SnackbarInformationRowTx}>{this.props.newUnminedMessage.txHash}</div>
                        </div> 
                        <div style={styles.SnackbarInformationRow}>
                          <div style={styles.SnackbarInformationRowType}>{this.props.newUnminedMessage.type}</div>
                        </div>
                      </div>);
        }
      }
      return (
        <div>
          <Snackbar
            style={styles.Snackbar}
            open={this.state.open}
            message={newNtfns}
            autoHideDuration={4000}
            bodyStyle={snackbarContentStyle}
            onRequestClose={(reason) => {
              if (reason != 'clickaway')
                this.handleRequestClose();
            }
            }
          />
          <div style={styles.header}>
            <div style={styles.headerTop}>{this.props.headerTop}</div>
            <div style={styles.headerTitleOverview}>{this.props.headerTitleOverview}</div>
            <div style={styles.headerMetaOverview}>
              {this.props.headerMetaOverview}
            </div>
            {this.props.children}
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(Header);