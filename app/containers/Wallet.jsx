import ReactTimeout from "react-timeout";
import { useEffect } from "react";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { StaticSwitch } from "shared";
import HomePage from "components/views/HomePage/HomePage";
import SettingsPage from "components/views/SettingsPage/SettingsPage";
import AccountsPage from "components/views/AccountsPage/AccountsPage";
import WalletError from "components/views/WalletError";
import ErrorScreen from "components/ErrorScreen";
import InvalidRPCVersion from "components/views/InvalidRPCVersion";
import HelpPage from "components/views/HelpPage/HelpPage";
import PrivacyPage from "components/views/PrivacyPage/PrivacyPage";
import TransactionsPage from "components/views/TransactionsPage/TransactionsPage";
import TransactionPage from "components/views/TransactionPage/TransactionPage";
import TicketsPage from "components/views/TicketsPage/TicketsPage";
import TutorialsPage from "components/views/TutorialsPage/TutorialsPage";
import GovernancePage from "components/views/GovernancePage/GovernancePage";
import ProposalDetailsPage from "components/views/ProposalDetailsPage/ProposalDetailsPage";
import TrezorPage from "components/views/TrezorPage";
import LNPage from "components/views/LNPage";
import SideBar from "components/SideBar/SideBar";
import { BlurableContainer } from "layout";
import { useWallet } from "./hooks";
import { useTheming, useMountEffect } from "hooks";

const pageAnimation = {
  atEnter: { opacity: 0 },
  atLeave: { opacity: 0 },
  atActive: { opacity: 1 }
};

const Wallet = ({ setInterval }) => {
  const {
    getPeerInfo,
    expandSideBar,
    politeiaEnabled,
    compareInventory
  } = useWallet();

  const { uiAnimations } = useTheming();

  useMountEffect(() => {
    console.log("grrrrr");
    // Compare politeias inventory and update proposal list if they are different
    // every 1 minute.
    const piInvInterval = setInterval(() => {
      if (politeiaEnabled) {
        console.log(11111);
        compareInventory();
      }
    }, 60000);

    // Get peer info every 10 seconds, so we can no if there are no available
    // peers.
    const peerInfoInterval = setInterval(() => {
      if (politeiaEnabled) {
        console.log(222222);
        getPeerInfo();
      }
    }, 10000);

    // Cleanup intervals on unmount
    return () => {
      console.log("brrrrrr");
      clearInterval(piInvInterval);
      clearInterval(peerInfoInterval);
    };
  });

  const MainSwitch = uiAnimations ? AnimatedSwitch : StaticSwitch;

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
          <Route path="/privacy" component={PrivacyPage} />
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
};

export default ReactTimeout(Wallet);
