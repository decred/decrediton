// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import LoaderForm from '../containers/LoaderForm';
import WalletExistForm from '../containers/WalletExistForm';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../containers/CreateWalletForm';
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
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    passphrase: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    client: PropTypes.object,
    error: PropTypes.string,
    getBalanceRequestAttempt: PropTypes.bool.isRequired,
    getBalanceRequest: PropTypes.func.isRequired,
    isWalletCreated: PropTypes.bool.isRequired,    
    isWalletExist: PropTypes.bool.isRequired,
    isWalletOpen: PropTypes.bool.isRequired,
    loaderRequest: PropTypes.func.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getBalanceRequest(0,1);
  }

  render() {
    const { address, port } = this.props;
    const { isLoggedIn, isLoggingIn, client, error} = this.props;
    const { isGettingBalance, getBalanceRequestAttempt, grpcBalance, getBalanceResponse  } = this.props;
    const { loader, isLoaderReady, isGettingLoader, loaderRequest } = this.props; 
    const { isWalletCreatedRequest, isWalletCreated } = this.props
    const { isWalletExist, isWalletExistRequest, isWalletExistComplete, walletExistRequest } = this.props;
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
                <h3>Current balance: {getBalanceResponse === null ? 'Please refresh' : getBalanceResponse.total }</h3>
                <Button 
                  bsStyle="primary"
                  disabled={getBalanceRequestAttempt}
                  onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}>
                  {getBalanceRequestAttempt ? 'Getting Balance...' : 'Get Balance'}
                </Button>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    const getStartedCreateWallet = (      
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

    const getStartedWalletCreating = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col sm={12} >
                <p> Creating wallet </p>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);
    
    const getStartedWalletLoader = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
                <Row>
                  <p style={styles.error}>{error}</p>
                </Row>
                <Row>
                  <Button type="submit"
                    onClick={() => {loaderRequest(address, port)}}>
                    Get Started
                  </Button>
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    const getStartedGettingLoader = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
                <Row>
                  <p style={styles.error}>{error}</p>
                </Row>
                <Row>
                  <h3>Getting wallet loader service</h3>
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);
      
    const getStartedWalletExistRequest = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
                <Row>
                  <p style={styles.error}>{error}</p>
                </Row>
                <Row>
                  <h3>Checking if wallet exists...</h3>
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    const getStartedWalletExist = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
                <Row>
                  <p style={styles.error}>{error}</p>
                </Row>
                <Row>
                  <h3>Check if wallet exists</h3>
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
                  <h3>Opening wallet</h3>
                  <h5>Please enter the information below to connect to you dcrwallet</h5>
                  <WalletOpenForm />
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    const getStartedOpeningWallet = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.mainArea}>
            <Row>
              <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
                <Row>
                  <p style={styles.error}>{error}</p>
                </Row>
                <Row>
                  <h3>Trying to open wallet</h3>
                </Row>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    // Step 4 complete
    if (isLoggedIn) {
      if (client === undefined) {
        return(getStarted);
      } else {
        return(homeView);
      }
    }
    // Step 4 action
    if (isLoggingIn) {
      return (getStartedLoggingIn);
    }
    // Step 3 complete/ Step 4 start
    if (isWalletOpen) {
      return(getStarted);
    }
    // Step 3 action
    if (isWalletOpenRequest) {
      return (getStartedOpeningWallet);
    }
    // Step 2 complete/ Step 3 start
    if (isWalletExist) {
      return(getStartedWalletOpen);
    }
    // Step 2b creating wallet
    if (isWalletCreatedRequest) {
      return(getStartedWalletCreating)
    }
    // Step 2 wallet exist action complete, though
    // wallet does not exist
    if (isWalletExistComplete) {
      return(getStartedCreateWallet)
    }
    // Step 2 action
    if (isWalletExistRequest) {
      return(getStartedWalletExistRequest)
    }
    // Step 1 complete/ Step 2 start
    if (isLoaderReady) {
      return(getStartedWalletExist);
    }

    // Step 1 action
    if (isGettingLoader) {
      return (getStartedGettingLoader);
    }
    // Step 1 start
    return (getStartedWalletLoader);
  }
};

export default Home;
