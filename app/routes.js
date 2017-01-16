// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import HistoryPage from './containers/HistoryPage';
import SendPage from './containers/SendPage';
import ReceivePage from './containers/ReceivePage';
import GetStartedPage from './containers/GetStartedPage';
import WalletError from './containers/WalletError';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={GetStartedPage} />
    <Route path="/home" component={HomePage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/send" component={SendPage} />
    <Route path="/receive" component={ReceivePage} />
    <Route path="/walletError" component={WalletError} />
  </Route>
);
