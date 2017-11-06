// @flow
import { Route, IndexRoute, IndexRedirect } from "react-router";
import { TabbedPage } from "shared";
import App from "./containers/App";
import HomePage from "./components/views/HomePage";
import SendTab from "./components/views/TransactionsPage/SendTab";
import ReceiveTab from "./components/views/TransactionsPage/ReceiveTab";
import HistoryTab from "./components/views/TransactionsPage/HistoryTab";
import TransactionPage from "./components/views/TransactionPage";
import SettingsPage from "./components/views/SettingsPage";
import SignTab from "./components/views/SecurityPage/SignMessage";
import VerifyTab from "./components/views/SecurityPage/VerifyMessage";
import PurchaseTab from "./components/views/TicketsPage/PurchaseTab";
import MyTicketsTab from "./components/views/TicketsPage/MyTicketsTab";
import GovernanceTab from "./components/views/TicketsPage/GovernanceTab";
import StatisticsTab from "./components/views/TicketsPage/StatisticsTab";
import GetStartedPage from "./components/views/GetStartedPage";
import AccountsPage from "./components/views/AccountsPage";
import WalletError from "./components/views/WalletError";
import Help from "./components/views/Help";
import ErrorScreen from "./components/ErrorScreen";
import InvalidRPCVersion from "./components/views/InvalidRPCVersion";

export default (
  <Route     path="/"                           component={App}>
    <IndexRoute                                 component={GetStartedPage}/>
    <Route   path="transaction/history/:txHash" component={TransactionPage}/>
    <Route   path="home"                        component={HomePage}          noDesc noIcon/>
    <Route   path="accounts"                    component={AccountsPage}/>
    <Route   path="transactions"                component={TabbedPage}        tabDesc>
      <IndexRedirect to="send"/>
      <Route path="send"                        component={SendTab}           testNet/>
      <Route path="receive"                     component={ReceiveTab}/>
      <Route path="history"                     component={HistoryTab}        balance/>
    </Route>
    <Route   path="tickets"                     component={TabbedPage}        noDesc>
      <IndexRedirect to="purchase"/>
      <Route path="purchase"                    component={PurchaseTab}/>
      <Route path="mytickets"                   component={MyTicketsTab}/>
      <Route path="governance"                  component={GovernanceTab}/>
      <Route path="statistics"                  component={StatisticsTab}/>
    </Route>
    <Route   path="security"                    component={TabbedPage}>
      <IndexRedirect to="sign"/>
      <Route path="sign"                        component={SignTab}/>
      <Route path="verify"                      component={VerifyTab}/>
    </Route>
    <Route   path="settings"                    component={SettingsPage}      noDesc/>
    <Route   path="help"                        component={Help}/>
    <Route   path="walletError"                 component={WalletError}       noDesc noIcon/>
    <Route   path="error"                       component={ErrorScreen}       noDesc noIcon/>
    <Route   path="invalidRPCVersion"           component={InvalidRPCVersion} noDesc noIcon/>
  </Route>
);
