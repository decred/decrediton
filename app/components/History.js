// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';
import Sidebar from './SideBar';
import MaterialTitlePanel from './MaterialTitlePanel';
import SidebarContent from '../content/SideBarContent';

class History extends Component{
  static propTypes = {
    client: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired
  };
  
  render() {
    const { client, loggedIn } = this.props;

    const sideBarProps = {
      loggedIn: loggedIn,
      page: "HISTORY",
    }
    const sidebar = <SidebarContent {...sideBarProps}/>;
    
    const contentHeader = (
      <span>
        <span> Decrediton - History</span>
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
      page: "HISTORY",
    };

    /* View that will be seen when user has a set Client */
    const historyView = (      
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div>
            <Row>
              <Col sm={12} >
                <h1>History Page</h1>
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>TXID</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>20:20:20 November 28th 2016</td>
                      <td>txid</td>
                      <td>200</td>
                    </tr>
                    <tr>
                      <td>20:20:20 November 28th 2016</td>
                      <td>txid</td>
                      <td>200</td>
                    </tr>
                    <tr>
                      <td>20:20:20 November 28th 2016</td>
                      <td>txid</td>
                      <td>200</td>
                    </tr>
                  </tbody>
                </Table>
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
        return(historyView);
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

export default History;
