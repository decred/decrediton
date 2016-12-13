// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';

class Send extends Component{
  static propTypes = {
    client: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired
  };
  
  render() {
    const { client, isLoggedIn } = this.props;

    /* View that will be seen when user has a set Client */
    const sendView = (      
      <div>
        <Row>
          <Col sm={12} >
            <h1>Send Page</h1>
          </Col>
        </Row>
      </div>);

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
