import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { StaticSwitch } from "shared";
import HomePage from "components/views/HomePage";
import SettingsPage from "components/views/SettingsPage";
import AccountsPage from "components/views/AccountsPage";
import WalletError from "components/views/WalletError";
import ErrorScreen from "components/ErrorScreen";
import InvalidRPCVersion from "components/views/InvalidRPCVersion";
import HelpPage from "components/views/HelpPage";
import SecurityPage from "components/views/SecurityPage";
import TransactionsPage from "components/views/TransactionsPage";
import TransactionPage from "components/views/TransactionPage";
import TicketsPage from "components/views/TicketsPage";
import TutorialsPage from "components/views/TutorialsPage";
import GovernancePage from "components/views/GovernancePage";
import TrezorPage from "components/views/TrezorPage";
import SideBar from "components/SideBar";
import { BlurableContainer } from "layout";
import { walletContainer, theming } from "connectors";
import cx from "classnames";

const pageAnimation = { atEnter: { opacity: 0 }, atLeave: { opacity: 0 }, atActive: { opacity: 1 } };

@autobind
class Wallet extends React.Component {
  render() {
    const { expandSideBar, sidebarOnBottom, location } = this.props;
    let isModal = location && location.modal;
    const MainSwitch = this.props.uiAnimations ? AnimatedSwitch : StaticSwitch;

    return (
      <div className={"page-body"}>
        <SideBar />
        <BlurableContainer className={cx(expandSideBar ? "page-view" : "page-view-reduced-bar", sidebarOnBottom && "sidebar-on-bottom")}>
          <MainSwitch {...pageAnimation}>
            <Route path="/home"                           component={HomePage} />
            <Route path="/accounts"                       component={AccountsPage} />
            <Route path="/settings"                       component={SettingsPage} />
            <Route path="/walletError"                    component={WalletError} />
            <Route path="/error"                          component={ErrorScreen} />
            <Route path="/invalidRPCVersion"              component={InvalidRPCVersion} />
            <Route path="/help"                           component={HelpPage} />
            <Route path="/security"                       component={SecurityPage} />
            {!isModal ? <Route path="/transactions/history/:txHash" component={TransactionPage} /> : null}
            <Route path="/transactions"                   component={TransactionsPage} />
            <Route path="/tickets"                        component={TicketsPage} />
            <Route path="/tutorial"                       component={TutorialsPage} />
            <Route path="/governance"                     component={GovernancePage} />
            <Route path="/trezor"                         component={TrezorPage} />
          </MainSwitch>
          {isModal ? <Route path="/transactions/history/:txHash" component={TransactionPage} /> : null }
        </BlurableContainer>
      </div>
    );
  }
}

export default walletContainer(theming(Wallet));
