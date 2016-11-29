// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getBalance } from '../actions/client';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';

class History extends Component{
  static propTypes = {
    client: PropTypes.object
  };
  
  render() {
    const { client } = this.props;
    
    const clientSet = (
      <div>
        <Row>
          <Col sm={2}>
            <Link to="/">Back Home</Link>
          </Col>
          <Col sm={3}>
            <h5>Transaction History</h5>
          </Col>
          <Col sm={7}>
            <h5>Balance: {getBalance(client)}</h5>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
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
    )
    
    return (
      clientSet
    );
  }
};

export default History;
