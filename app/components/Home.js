// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { getBalance } from '../actions/client';

const grpcClient = {}; 

class Home extends Component{
  static propTypes = {
    getClient: PropTypes.func.isRequired,
    setClient: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    client: PropTypes.object,
    address: PropTypes.string,
    port: PropTypes.string,
    passphrase: PropTypes.string,
    loggedIn: PropTypes.bool
  };

  render() {
    const { setClient, getClient, login, client, address, port, passphrase, loggedIn } = this.props;
    var view = {};
    var balance = {};

    const notLoggedInView = (
      <div>
        <h1>Not logged in yet</h1>
      </div>);

    const loggedInView = (
      <div>
        <h1>Home Page</h1>
        <h3>{address}</h3>
        <h3>{port}</h3>
        <h3>{passphrase}</h3>
      </div>);

    var view = {};
    console.log({loggedIn});
    if ({loggedIn}) {
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
