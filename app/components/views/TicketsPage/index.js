import { TabbedPage, TabbedPageTab as Tab, TitleHeader, DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { default as PurchaseTab } from "./PurchaseTab";
import { default as GovernanceTab } from "./GovernanceTab";
import { default as StatisticsTab } from "./StatisticsTab";
import { default as MyTicketsTab } from "./MyTicketsTab";

const PageHeader = () =>
  <TitleHeader
    iconClassName="tickets"
    title={<T id="tickets.title" m="Tickets" />}
  />;

const TabHeader = () =>
  <DescriptionHeader
    description={<T id="security.description" m="Various tools that help in different aspects of crypto currency security will be located here." />}
  />;

export default () => (
  <TabbedPage header={<PageHeader />} >
    <Tab path="/tickets/purchase" component={PurchaseTab} header={TabHeader} link={<T id="tickets.tab.purchase" m="Purchase"/>}/>
    <Tab path="/tickets/mytickets" component={MyTicketsTab} header={TabHeader} link={<T id="tickets.tab.mytickets" m="My Tickets"/>}/>
    <Tab path="/tickets/governance" component={GovernanceTab} header={TabHeader} link={<T id="tickets.tab.governance" m="Governance"/>}/>
    <Tab path="/tickets/statistics" component={StatisticsTab} header={TabHeader} link={<T id="tickets.tab.statistics" m="Statistics"/>}/>
  </TabbedPage>
);
