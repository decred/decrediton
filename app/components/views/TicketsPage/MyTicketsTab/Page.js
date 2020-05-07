import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle, Tooltip } from "shared";
import { EyeFilterMenu } from "buttons";
import "style/MyTickets.less";

const subtitleMenu = ({
  sortTypes,
  ticketTypes,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  onChangeSelectedType,
  onChangeSortType
}) => (
  <div className="tickets-buttons-area">
    <Tooltip
      tipWidth={300}
      text={<T id="tickets.sortby.tooltip" m="Sort By" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="value"
        options={sortTypes}
        selected={selectedSortOrderKey}
        onChange={onChangeSortType}
        className="sort-by"
      />
    </Tooltip>
    <Tooltip
      tipWidth={300}
      text={<T id="tickets.tickettypes.tooltip" m="Ticket Status" />}>
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
  tsDate,
  loadMoreThreshold
}) => (
  <InfiniteScroll
    hasMore={!noMoreTickets}
    loadMore={getTickets}
    initialLoad={!noMoreTickets && loadMoreThreshold > 90}
    useWindow={false}
    threshold={90}>
    <Subtitle
      title={<T id="mytickets.subtitle" m="My Tickets" />}
      className={"is-row"}
      children={subtitleMenu({
        sortTypes,
        ticketTypes,
        selectedSortOrderKey,
        selectedTicketTypeKey,
        onChangeSelectedType,
        onChangeSortType
      })}
    />
    <div className="history-page-content-wrapper">
      {tickets.length > 0 && (
        <>
          <div className="my-tickets-table-header">
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
              <T id="tickets.table.header.purchased" m="Purchased" />
            </div>
          </div>
          <TxHistory {...{ transactions: tickets, tsDate, isStake: true }} />
        </>
      )}
    </div>
    {!noMoreTickets ? (
      <LoadingMoreTicketsIndicator />
    ) : tickets.length > 0 ? (
      <NoMoreTicketsIndicator />
    ) : (
      <NoTicketsIndicator />
    )}
  </InfiniteScroll>
);

export default TicketListPage;
