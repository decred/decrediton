// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SendPage from './containers/SendPage';
import ReceivePage from './containers/ReceivePage';
import HistoryPage from './containers/HistoryPage';
import StakePage from './containers/StakePage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/send" component={SendPage} />
    <Route path="/receive" component={ReceivePage} />
    <Route path="/stake" component={StakePage} />
  </Route>
);
