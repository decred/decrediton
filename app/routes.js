// @flow
import { Route, IndexRoute, IndexRedirect } from "react-router";
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
import ShutdownAppPage from "./components/views/ShutdownAppPage";
import MyTicketsPage from "./components/views/MyTicketsPage";
import TicketListPage from "./components/views/MyTicketsPage/TicketListPage";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={GetStartedPage} />
    <Route path="/home" component={HomePage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/transactions" component={TransactionsPage}>
      <IndexRedirect to="send" />
      <Route path="send" component={TransactionsSendTab}/>
      <Route path="receive" component={TransactionsReceiveTab}/>
    </Route>
    <Route path="/transactions/history/:txHash" component={TransactionPage} />
    <Route path="/security" component={SecurityPage}>
      <IndexRedirect to="sign"/>
      <Route path="sign" component={SignPage} />
      <Route path="verify" component={VerifyPage} />
    </Route>
    <Route path="/settings" component={SettingsPage} />
    <Route path="/tickets" component={TicketsPage}>
      <IndexRedirect to="purchase" />
      <Route path="purchase" component={TicketsPurchaseTab}/>
      <Route path="mytickets" component={TicketsMyTicketsTab}/>
      <Route path="governance" component={TicketsGovernanceTab}/>
      <Route path="statistics" component={TicketsStatisticsTab}/>
    </Route>
    <Route path="/accounts" component={AccountsPage} />
    <Route path="/walletError" component={WalletError} />
    <Route path="/error" component={ErrorScreen} />
    <Route path="/help" component={Help} />
    <Route path="/invalidRPCVersion" component={InvalidRPCVersion} />
    <Route path="/shutdown" component={ShutdownAppPage} />
    <Route path="/tickets" component={MyTicketsPage} />
    <Route path="/tickets/:status" component={TicketListPage} />
  </Route>
);
