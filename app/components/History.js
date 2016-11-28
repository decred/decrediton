// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getBalance } from '../actions/client';
import { Link } from 'react-router';

class History extends Component{
  static propTypes = {
    client: PropTypes.object
  };
  
  render() {
    const { client } = this.props;
    
    const clientSet = (
      <div>
        <h1>History</h1>
        <h2>Balance:</h2>
        <h2>{getBalance(client)}</h2>
        <Link to="/">Back Home</Link>
      </div>
    )
    
    return (
      clientSet
    );
  }
};

export default History;
