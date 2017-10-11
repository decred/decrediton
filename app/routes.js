// @flow
import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./containers/App";
import { withTransition } from "react-router-transitions";
import HomePage from "./components/views/HomePage";
import HistoryPage from "./components/views/HistoryPage";
import TransactionsPage from "./components/views/TransactionsPage";
import TransactionsSendTab from "./components/views/TransactionsPage/SendTab";
import TransactionsReceiveTab from "./components/views/TransactionsPage/ReceiveTab";
import TransactionPage from "./components/views/TransactionPage";
import SendPage from "./components/views/SendPage";
import ReceivePage from "./components/views/ReceivePage";
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

export default (
  <Route path="/" component={App}>
    <IndexRoute component={GetStartedPage} />
    <Route path="/home" component={HomePage} />
    <Route path="/history" component={HistoryPage} />

    <Route path="/transactions" component={withTransition(
      TransactionsPage, {
        onShow: (prevState, nextState, replace) => {
          console.log("onShow", prevState, nextState)
          const prevPosition = prevState.routes[prevState.routes.length-1].position;
          const nextPosition = nextState.routes[nextState.routes.length-1].position;

          const transition = {
            transitionName: "fromleft",
            transitionEnterTimeout: 500,
            transitionLeaveTimeout: 500, component: "div"
          }

          if (nextPosition > prevPosition) transition.transitionName = "fromright"
          else transition.transitionName = "fromleft";
          replace(transition);
        },
        defaultTransition: {
          transitionName: "fromleft",
          transitionEnterTimeout: 500,
          transitionLeaveTimeout: 500, component: "div"
        }
      })}>
      <Route path="send" component={TransactionsSendTab} position={1}/>
      <Route path="receive" component={TransactionsReceiveTab} position={2}/>
    </Route>

    <Route path="/transactions/history/:txHash" component={TransactionPage} />
    <Route path="/send" component={SendPage} />
    <Route path="/receive" component={ReceivePage} />
    <Route path="/security" component={SecurityPage}>
      <Route path="/security/sign" component={SignPage} />
      <Route path="/security/verify" component={VerifyPage} />
    </Route>
    <Route path="/settings" component={SettingsPage} />
    <Route path="/proofofstake" component={TicketsPage} />
    <Route path="/accounts" component={AccountsPage} />
    <Route path="/walletError" component={WalletError} />
    <Route path="/error" component={ErrorScreen} />
    <Route path="/help" component={Help} />
  </Route>
);
