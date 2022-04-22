import {
  TabbedPage,
  TitleHeader,
  DescriptionHeader,
  StandalonePage,
  StandaloneHeader
} from "layout";
import { FormattedMessage as T } from "react-intl";
import { BalanceDisplay } from "shared";
import { default as PurchaseTab } from "./PurchaseTab/PurchaseTab";
import { default as StatisticsTab } from "./StatisticsTab/StatisticsTab";
import { default as MyTicketsTab } from "./MyTicketsTab/MyTicketsTab";
import { default as VSPTicketsStatusTab } from "./VSPTicketsStatusTab/MyVSPTickets";
import { TICKET_ICON } from "constants";
import { useTicketsPage } from "./hooks";
import StakingTabWarning from "./StakingTabWarning";

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
            ticketPrice: <BalanceDisplay amount={ticketPrice} />
          }}
        />
      }
    />
  );
};

const StakingTabWarningHeader = ({ ticketPrice }) => (
  <StandaloneHeader
    title={<T id="tickets.warning.title" m="Staking" />}
    description={
      <T
        id="tickets.warning.description"
        m="Current Price: {ticketPrice}"
        values={{
          ticketPrice: <BalanceDisplay amount={ticketPrice} />
        }}
      />
    }
    iconType={TICKET_ICON}
  />
);

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

const TicketsPage = () => {
  const {
    showStakingWarning,
    ticketPrice,
    onAcceptStakingWarning
  } = useTicketsPage();
  return showStakingWarning ? (
    <StandalonePage
      header={<StakingTabWarningHeader ticketPrice={ticketPrice} />}>
      <StakingTabWarning onAcceptCreationWarning={onAcceptStakingWarning} />
    </StandalonePage>
  ) : (
    <TabbedPage header={<PageHeader />} tabs={tabs} />
  );
};

export default TicketsPage;
