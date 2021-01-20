import {
  TabbedPage,
  TabbedPageTab as Tab,
  TitleHeader,
  DescriptionHeader
} from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import { purchaseTickets } from "connectors";
import { Balance } from "shared";
import { default as PurchaseTab } from "./PurchaseTab/PurchaseTab";
import { default as StatisticsTab } from "./StatisticsTab/StatisticsTab";
import { default as MyTicketsTab } from "./MyTicketsTab/MyTicketsTab";
import { default as VSPTicketsStatusTab } from "./VSPTicketsStatusTab/MyVSPTickets";

const PageHeader = () => (
  <TitleHeader
    iconClassName="tickets"
    title={<T id="tickets.title" m="Staking" />}
  />
);

const TabHeader = purchaseTickets(({ ticketPrice }) => (
  <DescriptionHeader
    description={
      <T
        id="tickets.description"
        m="Current Price: {ticketPrice}"
        values={{
          ticketPrice: (
            <Balance
              flat
              amount={ticketPrice}
              classNameWrapper="header-small-balance"
            />
          )
        }}
      />
    }
  />
));

export default () => (
  <TabbedPage header={<PageHeader />}>
    <Switch>
      <Redirect from="/tickets" exact to="/tickets/purchase" />
    </Switch>
    <Tab
      path="/tickets/purchase"
      component={PurchaseTab}
      header={TabHeader}
      link={<T id="tickets.tab.purchase" m="Purchase Tickets" />}
    />
    <Tab
      path="/tickets/vspTicketsStatus"
      component={VSPTicketsStatusTab}
      header={TabHeader}
      link={<T id="tickets.tab.vsptickets" m="Tickets Status" />}
    />
    <Tab
      path="/tickets/mytickets"
      component={MyTicketsTab}
      header={TabHeader}
      link={<T id="tickets.tab.mytickets" m="History Tickets" />}
    />
    <Tab
      path="/tickets/statistics"
      component={StatisticsTab}
      header={TabHeader}
      link={<T id="tickets.tab.statistics" m="Statistics" />}
    />
  </TabbedPage>
);
