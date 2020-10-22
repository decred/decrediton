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
import { useState } from "react";
import { default as PurchaseTab } from "./PurchaseTab/PurchaseTab";
import { default as StatisticsTab } from "./StatisticsTab/StatisticsTab";
import { default as MyTicketsTab } from "./MyTicketsTab/MyTicketsTab";

const PageHeader = () => (
  <TitleHeader
    iconClassName="tickets"
    title={<T id="tickets.title" m="Tickets" />}
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

export default () => {
  const [isLegacy, toggleIsLegacy] = useState(false);
  return (
    <TabbedPage header={<PageHeader />}>
      <Switch>
        <Redirect from="/tickets" exact to="/tickets/purchase" />
      </Switch>
      <Tab
        path="/tickets/purchase"
        component={<PurchaseTab {...{ isLegacy, toggleIsLegacy }} />}
        header={TabHeader}
        link={<T id="tickets.tab.purchase" m="Purchase Tickets" />}
      />
      <Tab
        path="/tickets/mytickets"
        component={<MyTicketsTab {...{ isLegacy, toggleIsLegacy }} />}
        header={TabHeader}
        link={<T id="tickets.tab.mytickets" m="My Tickets" />}
      />
      <Tab
        path="/tickets/statistics"
        component={StatisticsTab}
        header={TabHeader}
        link={<T id="tickets.tab.statistics" m="Statistics" />}
      />
    </TabbedPage>
  );
};
