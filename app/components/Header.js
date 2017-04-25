import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Snackbar from 'material-ui/Snackbar';
import * as NotificationActions from '../actions/NotificationActions';

function mapStateToProps(state) {
  return {
    newUnminedMessage: state.notifications.newUnminedMessage,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, NotificationActions), dispatch);
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
    fontFamily: 'Inconsolata, monospace',
    fontSize: '53px',
  },
  Snackbar: {
    width: '100%',
    backgroundColor: 'rgb(12, 30, 62)',
    transform: '',
    bottom: '697px',
    left: '298px',
  },
  SnackbarContent: {
    backgroundColor: 'rgb(12, 30, 62)',
    maxWidth: '100%',
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
      console.log(nextProps.newUnminedMessage);
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
      return (
        <div>
          <Snackbar
            style={styles.Snackbar}
            open={this.state.open}
            message={this.props.newUnminedMessage !== null ? this.props.newUnminedMessage : ''}
            autoHideDuration={4000}
            bodyStyle={styles.SnackbarContent}
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);