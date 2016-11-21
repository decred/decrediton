// @flow
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Overview.css'
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';


const Overview = React.createClass({
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
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired,
    getClientBalance: PropTypes.func.isRequired,
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

    const { increment, incrementIfOdd, incrementAsync, decrement, counter, getClientBalance } = this.props;
    return (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
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
              <button className={styles.btn} onClick={getClientBalance}>
                Add
              </button>
              <button className={styles.btn} onClick={decrement}>
                Subtract
              </button>
              <button className={styles.btn} onClick={incrementIfOdd}>odd</button>
              <button className={styles.btn} onClick={() => incrementAsync()}>async</button>
            </div>
          </div>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
});

export default Overview;
