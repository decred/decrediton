// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';

class History extends Component{
  static propTypes = {
    client: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };
  
  render() {
    const { client, isLoggedIn } = this.props;

    /* View that will be seen when user has a set Client */
    const historyView = (      
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
      </div>);

    /* Check to see that client is not undefined */
    if (isLoggedIn) {
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
