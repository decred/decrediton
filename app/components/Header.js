import React, { Component, PropTypes } from 'react';       

const styles = {
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#596d81',
    height: '214px',
  },
  headerTop: {
    height: '106px',
  },
  headerTitleOverview: {
    height: '41px',
    color: '#fff',
    fontSize: '27px',
  },
  headerMetaOverview: {
    float: 'left',
    clear: 'left',
    height: '54px',
    width: '50%',
    fontSize: '13px',
    color: '#c4cbd2',
  },
}
class Header extends React.Component {
  render() {
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

export default Header;