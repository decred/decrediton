// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { getBalance } from '../actions/client';

const grpcClient = {}; 

class Home extends Component{
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired
  };

  render() {
    const { loggedIn } = this.props;
    var view = {};
    var balance = {};

    const notLoggedInView = (
      <div>
        <h1>Not logged in yet</h1>
      </div>);

    const loggedInView = (
      <div>
        <h1>Home Page</h1>
      </div>);

    var view = {};
    console.log('logged in:', this.props);
    if ({loggedIn}) {
      view = loggedInView;
    } else {
      view = notLoggedInView;
    }

    return (
      view
    );
  }
};

export default Home;
