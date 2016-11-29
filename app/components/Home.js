// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';
import { getBalance } from '../actions/client';
import { Link } from 'react-router';
import { Col, Row, Navbar, Nav, NavItem } from 'react-bootstrap';

const styles = {
  mainArea: {
    backgroundColor:"#2971ff"
  },
  sideBar: {
    backgroundColor:"#2ed8a3"
  }
}
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
    console.log("login!")
    getClient();

  }

  render() {
    const sidebar = <SidebarContent />;
    const contentHeader = (
      <span>
        <span> Decrediton - Home</span>
      </span>);
    const sidebarProps = {
      sidebar: sidebar,
      docked: true,
      open: true,
      touch: false,
      shadow: false,
      pullRight: false,
    };
    const { getClient, setClient, address, port, passphrase, loggedIn, client } = this.props;

    /*  View that will be seen on fresh starts */
    const getStarted = (
      <div>
        <Row>
          <Col sm={10}>
            <h3>Welcome to Decrediton</h3>
            <h5>Please enter the information below to connect to you dcrwallet</h5>
          </Col>
        </Row>
        <Row>
          <Col sm={10}>
            <LoginForm />
          </Col>
        </Row>
      </div>);

    /* View that will be seen when user has a set Client */
    const homeView = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col sm={12} >
                <h1>Home Page</h1>
                <h3>address: {address}</h3>
                <h3>port: {port}</h3>
                <h3>passphrase: {passphrase}</h3>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);
      
    /* Check to see that client is not undefined */
    var clientOK = false;
    if (client !== undefined) {
      clientOK = true;
    } else {
      console.log("client undefined", this.props)
      return (getStarted)
    }

    if (clientOK) {
        return(homeView);
    } else {
        return(getStarted);
    }
  }
};

export default Home;
