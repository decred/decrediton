import { TabbedPage, TitleHeader, DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { default as PurchaseTab } from "./PurchaseTab/PurchaseTab";
import { default as StatisticsTab } from "./StatisticsTab/StatisticsTab";
import { default as MyTicketsTab } from "./MyTicketsTab/MyTicketsTab";
import { default as VSPTicketsStatusTab } from "./VSPTicketsStatusTab/MyVSPTickets";
import styles from "./TicketsPage.module.css";
import { TICKET_ICON } from "constants";
import { useTicketsPage } from "./hooks";

const PageHeader = () => (
  <TitleHeader
    iconType={TICKET_ICON}
    title={<T id="tickets.title" m="Staking" />}
  />
);

const TabHeader = () => {
  const { ticketPrice } = useTicketsPage();
  return (
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
                classNameWrapper={styles.smallBalance}
              />
            )
          }}
        />
      }
    />
  );
};

const tabs = [
  {
    path: "/tickets/purchase",
    content: PurchaseTab,
    header: TabHeader,
    label: <T id="tickets.tab.purchase" m="Purchase Tickets" />
  },
  {
    path: "/tickets/vspTicketsStatus",
    content: VSPTicketsStatusTab,
    header: TabHeader,
    label: <T id="tickets.tab.vsptickets" m="Ticket Status" />
  },
  {
    path: "/tickets/mytickets",
    content: MyTicketsTab,
    header: TabHeader,
    label: <T id="tickets.tab.mytickets" m="Ticket History" />
  },
  {
    path: "/tickets/statistics",
    content: StatisticsTab,
    header: TabHeader,
    label: <T id="tickets.tab.statistics" m="Statistics" />
  }
];

const TicketsPage = () => <TabbedPage header={<PageHeader />} tabs={tabs} />;

export default TicketsPage;
