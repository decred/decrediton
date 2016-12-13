// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Row, Col, Table } from 'react-bootstrap';

class Receive extends Component{
  static propTypes = {
    client: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
  };
  
  render() {
    const { client, isLoggedIn } = this.props;
    const { getNextAddressResponse, getNextAddressAttempt, getNextAddressRequestAttempt } = this.props;

    /* View that will be seen when user has a set Client */
    const receiveView = (
      <div>
        <Row>
          <Col sm={12} >
            <h1>Receive Page</h1>
            <h3>Current address: {getNextAddressResponse === null ? 'Please refresh' : getNextAddressResponse.address }</h3>
            <Button 
              bsStyle="primary"
              disabled={getNextAddressRequestAttempt}
              onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}>
              {getNextAddressRequestAttempt ? 'Getting new address' : 'Get New Address'}
            </Button>
          </Col>
        </Row>
      </div>);

    /* Check to see that client is not undefined */
    if (isLoggedIn) {
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
