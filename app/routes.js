// @flow
import { Route, IndexRoute, IndexRedirect } from "react-router";
import { TabbedPage } from "shared";
import App from "./containers/App";
import HomePage from "./components/views/HomePage";
import TransactionsSendTab from "./components/views/TransactionsPage/SendTab";
import TransactionsReceiveTab from "./components/views/TransactionsPage/ReceiveTab";
import HistoryTab from "./components/views/TransactionsPage/HistoryTab";
import TransactionPage from "./components/views/TransactionPage";
import SettingsPage from "./components/views/SettingsPage";
import SignPage from "./components/views/SecurityPage/SignMessage";
import VerifyPage from "./components/views/SecurityPage/VerifyMessage";
import TicketsPurchaseTab from "./components/views/TicketsPage/PurchaseTab";
import TicketsMyTicketsTab from "./components/views/TicketsPage/MyTicketsTab";
import TicketsGovernanceTab from "./components/views/TicketsPage/GovernanceTab";
import TicketsStatisticsTab from "./components/views/TicketsPage/StatisticsTab";
import GetStartedPage from "./components/views/GetStartedPage";
import AccountsPage from "./components/views/AccountsPage";
import WalletError from "./components/views/WalletError";
import Help from "./components/views/Help";
import ErrorScreen from "./components/ErrorScreen";
import InvalidRPCVersion from "./components/views/InvalidRPCVersion";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={GetStartedPage} />
    <Route path="home" component={HomePage} />
    <Route path="transaction/history/:txHash" component={TransactionPage} />
    <Route path="transactions" component={TabbedPage} testNet>
      <IndexRedirect to="send" />
      <Route path="send" component={TransactionsSendTab}/>
      <Route path="receive" component={TransactionsReceiveTab}/>
      <Route path="history" component={HistoryTab} />
    </Route>
    <Route path="security" component={TabbedPage}>
      <IndexRedirect to="sign"/>
      <Route path="sign" component={SignPage}/>
      <Route path="verify" component={VerifyPage}/>
    </Route>
    <Route path="settings" component={SettingsPage}/>
    <Route path="tickets" component={TabbedPage} noDesc>
      <IndexRedirect to="purchase" />
      <Route path="purchase" component={TicketsPurchaseTab}/>
      <Route path="mytickets" component={TicketsMyTicketsTab}/>
      <Route path="governance" component={TicketsGovernanceTab}/>
      <Route path="statistics" component={TicketsStatisticsTab}/>
    </Route>
    <Route path="accounts" component={AccountsPage} />
    <Route path="walletError" component={WalletError} />
    <Route path="error" component={ErrorScreen} />
    <Route path="help" component={Help} />
    <Route path="invalidRPCVersion" component={InvalidRPCVersion} />
  </Route>
);
