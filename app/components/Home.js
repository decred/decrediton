// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';
import { Button, Col, Row, Navbar, Nav, NavItem } from 'react-bootstrap';

const styles = {
  mainArea: {
    backgroundColor:"#2971ff"
  },
  sideBar: {
    backgroundColor:"#2ed8a3"
  },
  error: {
    color:"red"
  }
}
class Home extends Component{
  static propTypes = {
    login: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    passphrase: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    isGettingBalance: PropTypes.bool.isRequired,
    client: PropTypes.object,
    error: PropTypes.string,
    getBalanceRequest: PropTypes.func.isRequired,
    grpcBalance: PropTypes.func.isRequired,
  }

  render() {
    const { address, port, passphrase, isLoggedIn, isLoggingIn, client, error } = this.props;
    const { isGettingBalance, getBalanceRequest, grpcBalance  } = this.props;
    const sideBarProps = {
      loggedIn: isLoggedIn,
      page: "HOME",
    }
    const sidebar = <SidebarContent {...sideBarProps}/>;
    
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
      loggedIn: isLoggedIn,
      transitions: false,
      page: "HOME",
    };


    /*  View that will be seen on fresh starts */
    const getStarted = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
                <Row>
                  <p style={styles.error}>{error}</p>
                </Row>
                <Row>
                  <h3>Welcome to Decrediton</h3>
                  <h5>Please enter the information below to connect to you dcrwallet</h5>
                  <LoginForm />
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /*  View that will be when logging in is occuring */
    const getStartedLoggingIn = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col sm={12} >
                Logging in!
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /* View that will be shown when an error on logging in occured */
    const getStartedError = (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col sm={12} >
                Logging in!
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

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
                <Button 
                  bsStyle="primary"
                  disabled={isGettingBalance}
                  onClick={!isGettingBalance ? getBalanceRequest(0,1) : null}>
                  {isGettingBalance ? 'Getting Balance...' : 'Get Balance'}
                </Button>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /* Check to see that client is not undefined */
    if (isLoggingIn) {
      return (getStartedLoggingIn);
    }
    if (isLoggedIn) {
      if (client === undefined) {
        return(getStarted);
      } else {
        return(homeView);
      }
    } else {
        return(getStarted);
    }
  }
};

export default Home;
