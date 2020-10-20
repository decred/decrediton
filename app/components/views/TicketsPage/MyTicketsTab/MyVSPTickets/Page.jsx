import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle, Tooltip } from "shared";
import { EyeFilterMenu } from "buttons";
import style from "./MyTicketsTab.module.css";

const subtitleMenu = ({
  ticketTypes,
  selectedTicketTypeKey,
  onChangeSelectedType
}) => (
  <div className={style.ticketsButtons}>
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
  toggleIsLegacy
}) => {
  const isOverview = window.innerWidth < 768; // small width
  return (
    <>
      <div className={style.checkbox}>
        <div className={style.label}><T id="purchase.isLegacy.legacy.add" m="Is Legacy" /></div>
        <input id="box" type="checkbox" checked={false} onChange={() => toggleIsLegacy(true)} />
        <label htmlFor="box" className={style.checkboxLabel}></label>
      </div>
      <InfiniteScroll
        hasMore={!noMoreTickets}
        loadMore={() => getTickets(true)}
        initialLoad={!noMoreTickets}
        useWindow={false}
        threshold={90}>
        <Subtitle
          title={<T id="vsp.mytickets.subtitle" m="My VSP Tickets" />}
          className={style.subtitle}
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
            <div className={style.tableHeader}>
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
    </>
  );
};

export default TicketListPage;
