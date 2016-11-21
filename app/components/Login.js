// @flow
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Login.css'

const Login = React.createClass({
  getInitialState() {
    return {docked: false, open: false};
  },

  componentWillMount() {
    const mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  },

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  onSetOpen(open) {
    this.setState({open: open});
  },

  mediaQueryChanged() {
    this.setState({docked: this.state.mql.matches});
  },

  toggleOpen(ev) {
    this.setState({open: !this.state.open});

    if (ev) {
      ev.preventDefault();
    }
  },
  propTypes: {
    updateWalletPassphrase: PropTypes.func.isRequired,
    updateWalletPort: PropType.func.isRequired,
  },

  render() {
    const sidebar = <SidebarContent />;

    const contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.toggleOpen} href="#" style={styles.contentHeaderMenuLink}>=</a>}
        <span> Decrediton - Overview</span>
      </span>);

    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
    };

    const { updateWalletInfo, updateWalletPassphrase, updateWalletPort } = this.props;
    return (      
    <div style={styles.content}>
        <h1>Overview Page</h1>
        <div className={styles.backButton}>
            <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
            Back home
            </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {counter}
        </div>
        <div className={styles.btnGroup}>
            <button className={styles.btn} onClick={updateWalletInfo}>
            Connect to wallet
            </button>
        </div>
    </div>
    );
  }
});

export default Login;
