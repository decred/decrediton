import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { ConnectPage } from "./ConnectPage";
import { AdvancedTab, AdvancedTabHeader } from "./AdvancedTab";
import { ChannelsTab, ChannelsTabHeader } from "./ChannelsTab";
import { ReceiveTab, ReceiveTabHeader } from "./ReceiveTab";
import { SendTab, SendTabHeader } from "./SendTab";
import { OverviewTab, OverviewTabHeader } from "./OverviewTab";
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
      <Redirect from="/ln" exact to="/ln/overview" />
    </Switch>
    <Tab
      path="/ln/overview"
      component={OverviewTab}
      header={OverviewTabHeader}
      link={<T id="ln.tab.overview" m="Overview" />}
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
      path="/ln/advanced"
      component={AdvancedTab}
      header={AdvancedTabHeader}
      link={<T id="ln.tab.advanced" m="Advanced" />}
    />
  </TabbedPage>
);

const LNPage = () => {
  const { lnActive } = useLNPage();

  return lnActive ? <LNActivePage /> : <ConnectPage />;
};

export default LNPage;
