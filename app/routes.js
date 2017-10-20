// @flow
import React from "react";
import { Route, IndexRoute, IndexRedirect } from "react-router";
import { withTransition } from "react-router-transitions";
import App from "./containers/App";
import HomePage from "./components/views/HomePage";
import HistoryPage from "./components/views/HistoryPage";
import TransactionsPage from "./components/views/TransactionsPage";
import TransactionsSendTab from "./components/views/TransactionsPage/SendTab";
import TransactionsReceiveTab from "./components/views/TransactionsPage/ReceiveTab";
import TransactionPage from "./components/views/TransactionPage";
import SettingsPage from "./components/views/SettingsPage";
import SecurityPage from "./components/views/SecurityPage";
import SignPage from "./components/SignMessage";
import VerifyPage from "./components/VerifyMessage";
import TicketsPage from "./components/views/TicketsPage";
import GetStartedPage from "./components/views/GetStartedPage";
import AccountsPage from "./components/views/AccountsPage";
import WalletError from "./components/views/WalletError";
import Help from "./components/views/Help";
import ErrorScreen from "./components/ErrorScreen";
import InvalidRPCVersion from "./components/views/InvalidRPCVersion";

export default (
  <Route path="/" component={withTransition(App)}>
    <IndexRoute component={GetStartedPage} />
    <Route path="/home" component={HomePage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/transactions" component={TransactionsPage}>
      <IndexRedirect to="/transactions/send" />
      <Route path="send" component={TransactionsSendTab} position={0}/>
      <Route path="receive" component={TransactionsReceiveTab} position={1}/>
    </Route>
    <Route path="/transactions/history/:txHash" component={TransactionPage} />
    <Route path="/security" component={SecurityPage}>
      <IndexRedirect to="/security/sign"/>
      <Route path="/security/sign" component={SignPage} />
      <Route path="/security/verify" component={VerifyPage} />
    </Route>
    <Route path="/settings" component={SettingsPage} />
    <Route path="/proofofstake" component={TicketsPage} />
    <Route path="/accounts" component={AccountsPage} />
    <Route path="/walletError" component={WalletError} />
    <Route path="/error" component={ErrorScreen} />
    <Route path="/help" component={Help} />
    <Route path="/invalidRPCVersion" component={InvalidRPCVersion} />
  </Route>
);
