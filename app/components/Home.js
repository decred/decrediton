// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';
import { getBalance } from '../actions/client';

const styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
  content: {
    padding: '16px',
  },
};

const grpcClient = {}; 

const Home = React.createClass({
  getInitialState() {
    return {docked: false, open: false, isLoggedIn: false, grpcClient: null};
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

  logIn(logIn) {
    console.log("SADFASDF");
    this.setState({isLoggedIn: logIn});
  },

  setGrpcClient(client) {
    this.setState({grpcClient:client});
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

  render() {
    const loginProps = {
      isLoggedIn: this.state.isLoggedIn,
      logIn: this.logIn,
      setGrpcClient: this.setGrpcClient,
      grpcClient: this.state.grpcClient,
    };

    const sidebar = <SidebarContent {...loginProps}/>;

    const contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.toggleOpen} href="#" style={styles.contentHeaderMenuLink}>=</a>}
        <span> Decrediton - Home</span>
      </span>);

    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
    };

    var view = {};
    var balance = {};

    const notLoggedInView = (
      <div style={styles.content}>
        <h1>Not logged in yet</h1>
      </div>);

    const loggedInView = (
      <div style={styles.content}>
        <h1>Home Page</h1>
      </div>);

    var view = {};
    var balance = {};
    if (this.state.isLoggedIn) {
      view = loggedInView;
      getBalance(this.state.grpcClient);
    } else {
      view = notLoggedInView;
    }
    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div>
          {view}
          {balance}
          </div>
        </MaterialTitlePanel>
      </Sidebar>
    );
  },
});

export default Home;