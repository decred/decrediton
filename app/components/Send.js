// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';

class Send extends Component{
  static propTypes = {
    client: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired
  };
  
  render() {
    const { client, isLoggedIn } = this.props;

    const sideBarProps = {
      loggedIn: isLoggedIn,
      page: "SEND",
    }
    const sidebar = <SidebarContent {...sideBarProps}/>;
    
    const contentHeader = (
      <span>
        <span> Decrediton - Send</span>
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
      page: "SEND",
    };

    /* View that will be seen when user has a set Client */
    const sendView = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div>
            <Row>
              <Col sm={12} >
                <h1>Send Page</h1>
              </Col>
            </Row>
          </div>
        </MaterialTitlePanel>
      </Sidebar>);

    /* Check to see that client is not undefined */
    if (isLoggedIn) {
      if (client === undefined) {
        <p>Error occurred, should have client available</p>
      } else {
        return(sendView);
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

export default Send;
