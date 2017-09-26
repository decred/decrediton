// @flow
import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./containers/App";
import HomePage from "./components/views/HomePage";
import HistoryPage from "./components/views/HistoryPage";
import TransactionPage from "./components/views/TransactionPage";
import SendPage from "./components/views/SendPage";
import ReceivePage from "./components/views/ReceivePage";
import SettingsPage from "./components/views/SettingsPage";
import TicketsPage from "./components/views/TicketsPage";
import GetStartedPage from "./components/views/GetStartedPage";
import AccountsPage from "./components/views/AccountsPage";
import WalletError from "./components/views/WalletError";
import Help from "./components/views/Help";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={GetStartedPage} />
    <Route path="/home" component={HomePage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/transactions/:txHash" component={TransactionPage} />
    <Route path="/send" component={SendPage} />
    <Route path="/receive" component={ReceivePage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/proofofstake" component={TicketsPage} />
    <Route path="/accounts" component={AccountsPage} />
    <Route path="/walletError" component={WalletError} />
    <Route path="/help" component={Help} />
  </Route>
);
