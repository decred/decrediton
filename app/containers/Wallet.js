import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { StaticSwitch } from "shared";
import HomePage from "components/views/HomePage";
import SettingsPage from "components/views/SettingsPage/SettingsPage";
import AccountsPage from "components/views/AccountsPage/AccountsPage";
import WalletError from "components/views/WalletError";
import ErrorScreen from "components/ErrorScreen";
import InvalidRPCVersion from "components/views/InvalidRPCVersion";
import HelpPage from "components/views/HelpPage";
import SecurityPage from "components/views/SecurityPage/SecurityPage";
import TransactionsPage from "components/views/TransactionsPage";
import TransactionPage from "components/views/TransactionPage/TransactionPage";
import TicketsPage from "components/views/TicketsPage/TicketsPage";
import TutorialsPage from "components/views/TutorialsPage";
import GovernancePage from "components/views/GovernancePage/GovernancePage";
import ProposalDetailsPage from "components/views/ProposalDetailsPage/ProposalDetailsPage";
import TrezorPage from "components/views/TrezorPage";
import LNPage from "components/views/LNPage";
import SideBar from "components/SideBar/SideBar";
import { BlurableContainer } from "layout";
import { walletContainer, theming } from "connectors";
import ReactTimeout from "react-timeout";

const pageAnimation = {
  atEnter: { opacity: 0 },
  atLeave: { opacity: 0 },
  atActive: { opacity: 1 }
};

@autobind
class Wallet extends React.Component {
  constructor(props) {
    super(props);
    const { compareInventory, politeiaEnabled } = props;
    // Compare politeias inventory and update proposal list if they are different
    // every 1 minute.
    this.fetchPoliteiaInventory = this.props.setInterval(() => {
      if (politeiaEnabled) {
        compareInventory();
      }
    }, 60000);
  }

  render() {
    const { expandSideBar } = this.props;
    const MainSwitch = this.props.uiAnimations ? AnimatedSwitch : StaticSwitch;

    return (
      <div className={"page-body"}>
        <SideBar />
        <BlurableContainer
          className={expandSideBar ? "page-view" : "page-view-reduced-bar"}>
          <MainSwitch {...pageAnimation}>
            <Route path="/home" component={HomePage} />
            <Route path="/accounts" component={AccountsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/walletError" component={WalletError} />
            <Route path="/error" component={ErrorScreen} />
            <Route path="/invalidRPCVersion" component={InvalidRPCVersion} />
            <Route path="/help" component={HelpPage} />
            <Route path="/security" component={SecurityPage} />
            <Route path="/transactions" component={TransactionsPage} />
            <Route path="/tickets" component={TicketsPage} />
            <Route path="/tutorial" component={TutorialsPage} />
            <Route path="/governance" component={GovernancePage} />
            <Route path="/trezor" component={TrezorPage} />
            <Route path="/ln" component={LNPage} />
          </MainSwitch>
          <Route
            path="/transaction/history/:txHash"
            component={TransactionPage}
          />
          <Route
            path="/proposal/details/:token"
            component={ProposalDetailsPage}
          />
        </BlurableContainer>
      </div>
    );
  }
}

export default ReactTimeout(walletContainer(theming(Wallet)));
