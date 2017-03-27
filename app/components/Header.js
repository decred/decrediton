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
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#596d81',
    height: '214px',
  },
  headerTopGetStarted: {
    height: '83px',
    paddingTop: '36px',
    textAlign: 'center',
  },
  headerTitleOverviewGetStarted: {
    height: '41px',
    color: '#fff',
    fontSize: '27px',
  },
  headerMetaOverviewGetStarted: {
    float: 'left',
    clear: 'left',
    height: '54px',
    width: '50%',
    fontSize: '13px',
    color: '#c4cbd2',
  },
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#fff',
  },
  headerTop: {
    height: '90px',
    paddingTop: '36px',
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
};
class Header extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
      };
    }
    componentWillReceiveProps() {
      if (this.props.newUnminedMessage !== null) {
        console.log("sdfsdF", this.props.newUnminedMessage );
        this.setState({
          open: true,
        });
      }
    }
    handleRequestClose() {
      this.setState({
        open: false,
      });
      this.props.clearNewUnminedMessage();
    };

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
        <div style={styles.header}>
          <div style={styles.headerTop}>{this.props.headerTop}</div>
          <div style={styles.headerTitleOverview}>{this.props.headerTitleOverview}</div>
          <div style={styles.headerMetaOverview}>
            {this.props.headerMetaOverview}
          </div>
          {this.props.children}
          <Snackbar
            open={this.state.open}
            message={this.props.newUnminedMessage !== null ? this.props.newUnminedMessage : ''}
            autoHideDuration={4000}
            onRequestClose={() => this.handleRequestClose()}
          />
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);