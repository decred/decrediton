import React, { Component, PropTypes } from 'react';       

const styles = {
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
    return (
      <div style={styles.header}>
        <div style={styles.headerTop}>{this.props.headerTop}</div>
        <div style={styles.headerTitleOverview}>{this.headerTitleOverview}</div>
        <div style={styles.headerMetaOverview}>
          {this.props.headerMetaOverview}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Header;