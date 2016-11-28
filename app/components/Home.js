// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import { getBalance } from '../actions/client';
import { Link } from 'react-router';
import { Col, Navbar, Nav, NavItem } from 'react-bootstrap';

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
      console.log("client undefined", this.props)
    }
    const clientSet = (
      <div>
        <h1>Client set!</h1>
        <h2>{getBalance(client)}</h2>
        <h3>Other pages:</h3>
        <Link to="/history">Transaction History</Link>
      </div>
    )
    const navbarInstance = (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Decrediton</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem href="x">Link</NavItem>
        </Nav>
      </Navbar>
    )
    const notLoggedInView = (
      <div>
        <Col sm={5} smPush={2}>
          <h1>Not logged in yet</h1>
          <h3>address: {address}</h3>
          <h3>port: {port}</h3>
          <h3>passphrase: {passphrase}</h3>
          <LoginForm />
        </Col>
      </div>);

    const loggedInView = (
      {navbarInstance},
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
