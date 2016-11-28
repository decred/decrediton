// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getBalance } from '../actions/client';

class History extends Component{
  static propTypes = {
    client: PropTypes.object.isRequired
  };
  
  render() {
    const { client } = this.props;
    
    const clientSet = (
      <div>
        <h1>History</h1>
        <h2>Balance:</h2>
        <h2>{getBalance(client)}</h2>
      </div>
    )

    console.log('history page:', this.props);

    return (
      clientSet
    );
  }
};

export default History;
