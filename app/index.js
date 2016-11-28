// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';

var initialState = {
  login: {
    address: "127.0.0.1",
    port: "19112", 
    passphrase: "password",
    loggedIn: false}
}
const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);
console.log(store.getState());
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
