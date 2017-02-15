import React, { Component, PropTypes } from 'react';       

const styles = {
  headerGetStarted: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#596d81',
    height: '214px',
  },
  headerTopGetStarted: {
    height: '106px',
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
}
class Header extends React.Component {
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
        </div>
      );
    }
  }
}

export default Header;