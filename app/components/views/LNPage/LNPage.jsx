import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { ConnectPage } from "./ConnectPage";
import WalletTab, { WalletTabHeader } from "./WalletTab/WalletTab";
import ChannelsTab, { ChannelsTabHeader } from "./ChannelsTab/ChannelsTab";
import { ReceiveTab, ReceiveTabHeader } from "./ReceiveTab";
import { SendTab, SendTabHeader } from "./SendTab";
import WatchtowersTab, {
  WatchtowersTabHeader
} from "./WatchtowersTab/WatchtowersTab";
import NetworkTab, { NetworkTabHeader } from "./NetworkTab/NetworkTab";
import { LN_ICON } from "constants";
import { useLNPage } from "./hooks";

const LNPageHeader = () => (
  <TitleHeader
    iconType={LN_ICON}
    title={<T id="ln.title" m="Lightning Network" />}
  />
);

const LNActivePage = () => (
  <TabbedPage header={<LNPageHeader />}>
    <Switch>
      <Redirect from="/ln" exact to="/ln/wallet" />
    </Switch>
    <Tab
      path="/ln/wallet"
      component={WalletTab}
      header={WalletTabHeader}
      link={<T id="ln.tab.wallet" m="Wallet" />}
    />
    <Tab
      path="/ln/channels"
      component={ChannelsTab}
      header={ChannelsTabHeader}
      link={<T id="ln.tab.channels" m="Channels" />}
    />
    <Tab
      path="/ln/payments"
      component={SendTab}
      header={SendTabHeader}
      link={<T id="ln.tab.send" m="Send" />}
    />
    <Tab
      path="/ln/invoices"
      component={ReceiveTab}
      header={ReceiveTabHeader}
      link={<T id="ln.tab.receive" m="Receive" />}
    />
    <Tab
      path="/ln/network"
      component={NetworkTab}
      header={NetworkTabHeader}
      link={<T id="ln.tab.network" m="Network" />}
    />
    <Tab
      path="/ln/watchtowers"
      component={WatchtowersTab}
      header={WatchtowersTabHeader}
      link={<T id="ln.tab.watchtowers" m="Watchtowers" />}
    />
  </TabbedPage>
);

const LNPage = () => {
  const { lnActive } = useLNPage();

  return lnActive ? <LNActivePage /> : <ConnectPage />;
};

export default LNPage;
