import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import HomePage from "components/views/HomePage";
import SettingsPage from "components/views/SettingsPage";
import AccountsPage from "components/views/AccountsPage";
import WalletError from "components/views/WalletError";
import ErrorScreen from "components/ErrorScreen";
import InvalidRPCVersion from "components/views/InvalidRPCVersion";
import ShutdownAppPage from "components/views/ShutdownAppPage";
import HelpPage from "components/views/HelpPage";
import SecurityPage from "components/views/SecurityPage";
import TransactionsPage from "components/views/TransactionsPage";
import TransactionPage from "components/views/TransactionPage";
import TicketsPage from "components/views/TicketsPage";
import SideBar from "components/SideBar";
import { BlurableContainer } from "layout";

const pageAnimation = { atEnter: { opacity: 0 }, atLeave: { opacity: 0 }, atActive: { opacity: 1 } };

export default () =>
  <BlurableContainer className="page-body">
    <SideBar />
    <AnimatedSwitch {...pageAnimation} className="page-view">
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
    </AnimatedSwitch>
  </BlurableContainer>;
