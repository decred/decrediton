// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { getBalance } from '../actions/client';
import { Link } from 'react-router';

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
    
  handleLoginClick = () => {
    const { login, address, port, passphrase } = this.props
    login(address, port, passphrase)
  }

  handleClientConnect = () => {
    const { getClient, address, port, passphrase } = this.props
    getClient()
  }
  
  render() {
    const { getClient, setClient, address, port, passphrase, loggedIn, client } = this.props;
    var view = {};
    var balance = {};
    var clientOK = false;
    if (client !== undefined) {
      clientOK = true;
    } else {
      console.log("client", this.props)
    }
    const clientSet = (
      <div>
        <h1>Client set!</h1>
        <h2>Balance:</h2>
        <h2>{getBalance(client)}</h2>
        <Link to="/history">History</Link>
      </div>
    )

    const notLoggedInView = (
      <div>
        <h1>Not logged in yet</h1>
        <h3>address: {address}</h3>
        <h3>port: {port}</h3>
        <h3>passphrase: {passphrase}</h3>
        <button onClick={this.handleLoginClick}>login</button>
      </div>);

    const loggedInView = (
      <div>
        <h1>Home Page</h1>
        <h3>address: {address}</h3>
        <h3>port: {port}</h3>
        <h3>passphrase: {passphrase}</h3>
        <button onClick={this.handleClientConnect}>client connect</button>
      </div>);

    var view = {};
    console.log('logged in:', this.props);
    if (loggedIn) {
      if (clientOK) {
        view = clientSet;
      } else {
        view = loggedInView;
      }
    } else {
      view = notLoggedInView;
    }

    return (
      view
    );
  }
};

export default Home;
