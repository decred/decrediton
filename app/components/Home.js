// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import LoaderForm from '../containers/LoaderForm';
//import CreateWalletForm from '../containers/CreateWalletForm';
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
  constructor(props) {
    super(props);
  }

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

    /*
    isCreatingWallet: PropTypes.bool.isRequired,
    isCreatedWallet: PropTypes.bool.isRequired,
    */
    isWalletExist: PropTypes.bool.isRequired,
    isWalletOpen: PropTypes.bool.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getBalanceRequest(0,1);
    this.props.grpcBalance();
  }

  render() {
    const { isLoggedIn, isLoggingIn, client, error} = this.props;
    const { isGettingBalance, getBalanceRequest, grpcBalance, balance  } = this.props;
    const { loader, isLoaderReady, isGettingLoader } = this.props; 
    const { isWalletExist, isWalletExistRequest } = this.props;
    const { isWalletOpen, isWalletOpenRequest } = this.props;
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
                <h3>Current balance: {balance === null ? 'Please refresh' : balance.total }</h3>
                <Button 
                  bsStyle="primary"
                  disabled={isGettingBalance}
                  onClick={!isGettingBalance ? () => this.handleBalanceClick() : null}>
                  {isGettingBalance ? 'Getting Balance...' : 'Get Balance'}
                </Button>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /* View that will be seen when user has a set Client 
    const homeViewCreateWallet = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col sm={12} >
                <h1>Home Page</h1>
                <h3>Try and createWallet</h3>
                <CreateWalletForm />
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);
    */

    const getStartedLoader = (      
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
                  <LoaderForm />
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    const getStartedWalletOpen = (      
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
                  <LoaderForm />
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);
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
      if (isWalletOpen) {
        return(getStarted);
      } else {
        if (isWalletExist) {
          return(getStartedWalletOpen);
        } else {
          return(getStartedLoader);
        }
      }
    }
  }


};

export default Home;
