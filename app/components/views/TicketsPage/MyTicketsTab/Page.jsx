import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import InfiniteScroll from "react-infinite-scroller";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle } from "shared";
import { EyeFilterMenu } from "buttons";
import styles from "./MyTicketsTab.module.css";

const subtitleMenu = ({
  sortTypes,
  ticketTypes,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  onChangeSelectedType,
  onChangeSortType
}) => (
  <div className={styles.ticketsButtons}>
    <Tooltip
      contentClassName={styles.sortByTooltip}
      content={<T id="tickets.sortby.tooltip" m="Sort By" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="value"
        options={sortTypes}
        selected={selectedSortOrderKey}
        onChange={onChangeSortType}
        type="sortBy"
      />
    </Tooltip>
    <Tooltip
      contentClassName={styles.ticketStatusTooltip}
      content={<T id="tickets.tickettypes.tooltip" m="Ticket Status" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="key"
        options={ticketTypes}
        selected={selectedTicketTypeKey}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
  </div>
);

const TicketListPage = ({
  tickets,
  noMoreTickets,
  getTickets,
  onChangeSortType,
  onChangeSelectedType,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  sortTypes,
  ticketTypes,
  tsDate
}) => {
  const isOverview = window.innerWidth < 768; // small width
  return (
    <InfiniteScroll
      hasMore={!noMoreTickets}
      loadMore={() => getTickets(true)}
      initialLoad={!noMoreTickets}
      useWindow={false}
      threshold={90}>
      <Subtitle
        title={<T id="mytickets.subtitle" m="My Tickets" />}
        className={styles.subtitle}
        children={subtitleMenu({
          sortTypes,
          ticketTypes,
          selectedSortOrderKey,
          selectedTicketTypeKey,
          onChangeSelectedType,
          onChangeSortType
        })}
      />
      {tickets.length > 0 && (
        <>
          <div className={styles.tableHeader}>
            <div>
              <T id="tickets.table.header.status" m="Ticket Status" />
            </div>
            <div>
              <T id="tickets.table.header.price" m="Price" />
            </div>
            <div>
              <T id="tickets.table.header.reward" m="Reward" />
            </div>
            <div>
              <T id="tickets.table.header.votetime" m="Vote Time" />
            </div>
            <div>
              <T id="tickets.table.header.account" m="Account" />
            </div>
            <div>
              <T id="tickets.table.header.purchased" m="Voted" />
            </div>
          </div>
          <TxHistory
            {...{
              transactions: tickets,
              tsDate,
              mode: "stake",
              overview: isOverview
            }}
          />
        </>
      )}
      {!noMoreTickets ? (
        <LoadingMoreTicketsIndicator />
      ) : tickets.length > 0 ? (
        <NoMoreTicketsIndicator />
      ) : (
        <NoTicketsIndicator />
      )}
    </InfiniteScroll>
  );
};

export default TicketListPage;
