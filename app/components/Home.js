// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { getBalance } from '../actions/client';

const grpcClient = {}; 

class Home extends Component{
  static propTypes = {
    login: PropTypes.func.isRequired,
    getClient: PropTypes.func.isRequired,
    setClient: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    passphrase: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    client: PropTypes.object
  };

  render() {
    const { login, getClient, setClient, address, port, passphrase, loggedIn } = this.props;
    var view = {};
    var balance = {};

    const notLoggedInView = (
      <div>
        <h1>Not logged in yet</h1>
        <h3>address: {address}</h3>
        <h3>port: {port}</h3>
        <h3>passphrase: {passphrase}</h3>
      </div>);

    const loggedInView = (
      <div>
        <h1>Home Page</h1>
      </div>);

    var view = {};
    console.log('logged in:', this.props);
    if (loggedIn) {
      view = loggedInView;
    } else {
      view = notLoggedInView;
    }

    return (
      view
    );
  }
};

export default Home;
