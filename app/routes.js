// @flow
import { Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./components/views/HomePage";
import SettingsPage from "./components/views/SettingsPage";
import GetStartedPage from "./components/views/GetStartedPage";
import AccountsPage from "./components/views/AccountsPage";
import WalletError from "./components/views/WalletError";
import ErrorScreen from "./components/ErrorScreen";
import InvalidRPCVersion from "./components/views/InvalidRPCVersion";
import ShutdownAppPage from "./components/views/ShutdownAppPage";
import HelpPage from "./components/views/HelpPage";
import SecurityPage from "./components/views/SecurityPage";
import TransactionsPage from "./components/views/TransactionsPage";
import TransactionPage from "./components/views/TransactionPage";
import TicketsPage from "./components/views/TicketsPage";

export default () => (
  <Switch>
    <Route path="/getStarted"                     component={GetStartedPage} />
    <Route path="/home"                           component={HomePage} />
    <Route path="/accounts"                       component={AccountsPage} />
    <Route path="/settings"                       component={SettingsPage} />
    <Route path="/walletError"                    component={WalletError} />
    <Route path="/error"                          component={ErrorScreen} />
    <Route path="/invalidRPCVersion"              component={InvalidRPCVersion} />
    <Route path="/shutdown"                       component={ShutdownAppPage} />
    <Route path="/help"                           component={HelpPage} />
    <Route path="/security"                       component={SecurityPage} />
    <Route path="/transactions/history/:txHash"   component={TransactionPage} />
    <Route path="/transactions"                   component={TransactionsPage} />
    <Route path="/tickets"                        component={TicketsPage} />

    <Redirect from="/"            exact to="/getStarted" />
  </Switch>
);

// export const oldRoute = (
//   <Route     path="/"                           component={App}>
//     <IndexRoute                                 component={GetStartedPage}/>
//     <Route   path="transactions/history/:txHash" component={TransactionPage}  desc/>
//     <Route   path="home"                        component={HomePage}    noHeader balance>
//       <IndexRedirect to="balance"/>
//       <Route path="balance"                     component={BalanceTab}       balance    testNet/>
//       <Route path="tickets"                     component={TicketsTab}/>
//       <Route path="transactions"                component={TransactionsTab}/>
//     </Route>
//     <Route   path="accounts"                    component={AccountsPage}      desc/>
//     <Route   path="transactions"                component={TabbedPage}        tabDesc>
//       <IndexRedirect to="send"/>
//       <Route path="send"                        component={SendTab}           testNet/>
//       <Route path="receive"                     component={ReceiveTab}/>
//       <Route path="history"                     component={HistoryTab}        balance/>
//     </Route>
//     <Route   path="tickets"                     component={TabbedPage}        desc ticketprice>
//       <IndexRedirect to="purchase"/>
//       <Route path="purchase"                    component={PurchaseTab}/>
//       <Route path="mytickets"                   component={MyTicketsTab}>
//         <IndexRoute                             component={MyTicketsOverview}/>
//         <Route path=":status"                   component={MyTicketsList}/>
//       </Route>
//       <Route path="governance"                  component={GovernanceTab}/>
//       <Route path="statistics"                  component={StatisticsTab}/>
//     </Route>
//     <Route   path="security"                    component={TabbedPage}        desc>
//       <IndexRedirect to="sign"/>
//       <Route path="sign"                        component={SignTab}/>
//       <Route path="verify"                      component={VerifyTab}/>
//       <Route path="validate"                    component={ValidateTab}/>
//     </Route>
//     <Route   path="settings"                    component={SettingsPage}      desc/>
//     <Route   path="help"                        component={TabbedPage}        tabDesc>
//       <IndexRedirect to="links"/>
//       <Route path="links"                       component={LinksTab}/>
//       <Route path="logs"                        component={LogsTab}/>
//     </Route>
//     <Route   path="walletError"                 component={WalletError}       noIcon/>
//     <Route   path="error"                       component={ErrorScreen}       noIcon/>
//     <Route   path="invalidRPCVersion"           component={InvalidRPCVersion} noIcon/>
//     <Route   path="shutdown"                    component={ShutdownAppPage}/>
//   </Route>
// );
