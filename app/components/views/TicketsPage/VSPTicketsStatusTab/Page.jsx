import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import { Tooltip } from "pi-ui";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle } from "shared";
import { EyeFilterMenu, PassphraseModalButton } from "buttons";
import styles from "./MyTicketsTab.module.css";
import { SyncVSPFailedTickets } from "modals";

const subtitleMenu = ({
  ticketTypes,
  selectedTicketTypeKey,
  onChangeSelectedType
}) => (
  <div className={styles.ticketsButtons}>
    <Tooltip
      contentClassName={styles.ticketStatusTooltip}
      content={<T id="vsptickets.tickettypes.tooltip" m="Ticket Status" />}>
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
  getLiveTickets,
  onChangeSortType,
  onChangeSelectedType,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  sortTypes,
  ticketTypes,
  tsDate,
  hasVSPTicketsError,
  account,
  setVSP,
  setAccount,
  onSyncVspTicketsRequest,
  isValid,
  noMoreLiveTickets,
  isSyncingTickets,
  vsp,
  availableVSPs
}) => {
  const isOverview = window.innerWidth < 768; // small width
  const loadMoreThreshold = 90 + Math.max(0, window.innerHeight - 765);

  return (
    <>
      <Subtitle
        title={<T id="vsp.mytickets.subtitle" m="Live Tickets" />}
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
      {hasVSPTicketsError && (
        <PassphraseModalButton
          {...{
            onSubmit: onSyncVspTicketsRequest,
            setVSP,
            value: vsp,
            account,
            setAccount,
            isValid,
            options: availableVSPs
          }}
          loading={isSyncingTickets}
          disabled={!hasVSPTicketsError || isSyncingTickets}
          modalTitle={<T id="myTicket.syncVSP" m="Sync Failed VSP Tickets" />}
          modalComponent={SyncVSPFailedTickets}
          buttonLabel={<T id="myTicket.syncVSP" m="Sync Failed VSP Tickets" />}
        />
      )}
      {tickets.length > 0 && (
        <>
          <div className={styles.tableHeader}>
            <div>
              <T id="vsptickets.table.header.status" m="Ticket Status" />
            </div>
            <div>
              <T id="vsptickets.table.header.price" m="Price" />
            </div>
            <div></div>
            <div></div>
            <div>
              <T id="vsptickets.table.header.account" m="Fee Status" />
            </div>
            <div>
              <T id="vsptickets.table.header.purchased" m="Purchased" />
            </div>
          </div>
        </>
      )}
      <InfiniteScroll
        hasMore={!noMoreTickets}
        loadMore={() => getLiveTickets()}
        initialLoad={!noMoreTickets}
        useWindow={false}
        threshold={loadMoreThreshold}
        data-testid="VSPTicketHistoryPageContent">
        <TxHistory
          {...{
            transactions: tickets,
            tsDate,
            mode: "liveStake",
            overview: isOverview
          }}
        />
      </InfiniteScroll>
      {!noMoreLiveTickets && !noMoreTickets ? (
        <LoadingMoreTicketsIndicator
          isLiveTickets
          getTickets={getLiveTickets}
        />
      ) : tickets.length > 0 ? (
        <NoMoreTicketsIndicator />
      ) : (
        <NoTicketsIndicator />
      )}
    </>
  );
};

export default TicketListPage;
