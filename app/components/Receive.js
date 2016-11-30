// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';

class Receive extends Component{
  static propTypes = {
    client: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired
  };
  
  render() {
    const { client, loggedIn } = this.props;

    const sideBarProps = {
      loggedIn: loggedIn,
      page: "RECEIVE",
    }
    const sidebar = <SidebarContent {...sideBarProps}/>;
    
    const contentHeader = (
      <span>
        <span> Decrediton - Receive</span>
      </span>);
    const sidebarProps = {
      sidebar: sidebar,
      docked: true,
      open: true,
      touch: false,
      shadow: false,
      pullRight: false,
      loggedIn: loggedIn,
      transitions: false,
      page: "RECEIVE",
    };

    var balance = {};

    getBalance(client, 0, 1, function(response) {
        balance = response;
    });

    /* View that will be seen when user has a set Client */
    const receiveView = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div>
            <Row>
              <Col sm={12} >
                <h1>Receive Page</h1>
                <h3>Current balance: {balance}</h3>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /* Check to see that client is not undefined */
    if (loggedIn) {
      if (client === undefined) {
        <p>Error occurred, should have client available</p>
      } else {
        return(receiveView);
      }
    } else {
        return(
          <div>
            <p>Error occurred, should be logged in</p>
          </div>
        );
    }
  }
};

export default Receive;
