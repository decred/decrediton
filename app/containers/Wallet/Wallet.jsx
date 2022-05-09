import ReactTimeout from "react-timeout";
import { Route } from "react-router-dom";
import { StaticSwitch } from "shared";
import HomePage from "components/views/HomePage/";
import SettingsPage from "components/views/SettingsPage";
import AccountsPage from "components/views/AccountsPage";
import WalletError from "components/views/WalletError";
import ErrorScreen from "components/ErrorScreen";
import InvalidRPCVersion from "components/views/InvalidRPCVersion";
import PrivacyPage from "components/views/PrivacyPage";
import TransactionsPage from "components/views/TransactionsPage";
import TransactionPage from "components/views/TransactionPage";
import TicketsPage from "components/views/TicketsPage";
import TutorialsPage from "components/views/TutorialsPage/TutorialsPage";
import GovernancePage from "components/views/GovernancePage/GovernancePage";
import ProposalDetailsPage from "components/views/ProposalDetailsPage/ProposalDetailsPage";
import AgendaDetailsPage from "components/views/AgendaDetailsPage";
import ChannelDetailsPage from "components/views/LNPage/ChannelDetailsPage";
import TrezorPage from "components/views/TrezorPage";
import LNPage from "components/views/LNPage";
import DexPage from "components/views/DexPage";
import SideBar from "components/SideBar/SideBar";
import { BlurableContainer, PageBody } from "layout";
import { useWallet } from "../hooks";
import { useMountEffect } from "hooks";
import styles from "./Wallet.module.css";

const Wallet = ({ setInterval }) => {
  const { getPeerInfo, expandSideBar } = useWallet();

  // Notice that we return a cleanup logic function in useEffect/useMountEffect
  // which will run on unmount.
  useMountEffect(() => {
    // Fetch peers info every 10 seconds.
    const peerInfoInterval = setInterval(() => getPeerInfo(), 10000);

    // Cleanup interval on unmount.
    return () => {
      clearInterval(peerInfoInterval);
    };
  });

  return (
    <PageBody>
      <SideBar />
      <BlurableContainer
        className={expandSideBar ? styles.pageView : styles.reducedBar}>
        <StaticSwitch className={styles.staticSwitch}>
          <Route path="/home" component={HomePage} />
          <Route path="/accounts" component={AccountsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/walletError" component={WalletError} />
          <Route path="/error" component={ErrorScreen} />
          <Route path="/invalidRPCVersion" component={InvalidRPCVersion} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/transactions" component={TransactionsPage} />
          <Route path="/tickets" component={TicketsPage} />
          <Route path="/tutorial" component={TutorialsPage} />
          <Route path="/governance" component={GovernancePage} />
          <Route path="/trezor" component={TrezorPage} />
          <Route path="/ln" component={LNPage} />
          <Route path="/dex" component={DexPage} />
        </StaticSwitch>
        <Route
          path="/transactions/history/:txHash"
          component={TransactionPage}
        />
        <Route path="/tickets/mytickets/:txHash" component={TransactionPage} />
        <Route
          path="/tickets/vspTicketsStatus/:txHash"
          component={TransactionPage}
        />
        <Route path="/home/:txHash" component={TransactionPage} />
        <Route
          path="/proposal/details/:token"
          component={ProposalDetailsPage}
        />
        <Route path="/agenda/details/:name" component={AgendaDetailsPage} />
        <Route
          path="/ln/channel/:channelPoint"
          component={ChannelDetailsPage}
        />
      </BlurableContainer>
    </PageBody>
  );
};

export default ReactTimeout(Wallet);
