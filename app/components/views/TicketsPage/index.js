import { TabbedPage, TabbedPageTab as Tab, TitleHeader, DescriptionHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import { purchaseTickets } from "connectors";
import { Balance } from "shared";
import { default as PurchaseTab } from "./PurchaseTab";
import { default as GovernanceTab } from "./GovernanceTab";
import { default as StatisticsTab } from "./StatisticsTab";
import { default as MyTicketsTab } from "./MyTicketsTab";

const PageHeader = () =>
  <TitleHeader
    iconClassName="tickets"
    title={<T id="tickets.title" m="Tickets" />}
  />;

const TabHeader = purchaseTickets(({ ticketPrice }) =>
  <DescriptionHeader
    description={
      <T id="tickets.description" m="Current Price: {ticketPrice}"
        values={{ ticketPrice: <Balance amount={ticketPrice} classNameWrapper="header-small-balance"/> }} />
    }
  />
);

export default () => (
  <TabbedPage header={<PageHeader />} >
    <Switch><Redirect from="/tickets" exact to="/tickets/purchase" /></Switch>
    <Tab path="/tickets/purchase" component={PurchaseTab} header={TabHeader} link={<T id="tickets.tab.purchase" m="Purchase"/>}/>
    <Tab path="/tickets/mytickets" component={MyTicketsTab} header={TabHeader} link={<T id="tickets.tab.mytickets" m="My Tickets"/>}/>
    <Tab path="/tickets/governance" component={GovernanceTab} header={TabHeader} link={<T id="tickets.tab.governance" m="Governance"/>}/>
    <Tab path="/tickets/statistics" component={StatisticsTab} header={TabHeader} link={<T id="tickets.tab.statistics" m="Statistics"/>}/>
  </TabbedPage>
);
