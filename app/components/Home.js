// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';
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
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    passphrase: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    client: PropTypes.object
  };
  
  render() {
    const { address, port, passphrase, isLoggedIn, isLoggingIn, client } = this.props;

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
              <Col sm={12} >
                <h3>Welcome to Decrediton</h3>
                <h5>Please enter the information below to connect to you dcrwallet</h5>
                <LoginForm />
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
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /* Check to see that client is not undefined */
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
