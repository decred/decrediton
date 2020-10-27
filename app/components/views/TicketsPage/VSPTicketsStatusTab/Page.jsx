import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle, Tooltip } from "shared";
import { EyeFilterMenu, PassphraseModalButton } from "buttons";
import style from "./MyTicketsTab.module.css";
import { VSP_FEE_PROCESS_ERRORED } from "constants";
import { SyncVSPFailedTickets } from "modals";

const subtitleMenu = ({
  ticketTypes,
  selectedTicketTypeKey,
  onChangeSelectedType
}) => (
    <div className={style.ticketsButtons}>
      <Tooltip
        tipWidth={300}
        text={<T id="vsptickets.tickettypes.tooltip" m="Ticket Status" />}>
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
  hasVSPTicketsError,
  account,
  setVSP,
  setAccount,
  onSyncVspTicketsRequest,
  isValid
}) => {
  const isOverview = window.innerWidth < 768; // small width
  return (
    <InfiniteScroll
      hasMore={!noMoreTickets}
      loadMore={() => getTickets(true)}
      initialLoad={!noMoreTickets}
      useWindow={false}
      threshold={0}>
      <Subtitle
        title={<T id="vsp.mytickets.subtitle" m="Live Tickets" />}
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
      {
        selectedTicketTypeKey == VSP_FEE_PROCESS_ERRORED && (
          <PassphraseModalButton
            {...{
              onSubmit: onSyncVspTicketsRequest,
              setVSP,
              account,
              setAccount,
              isValid
            }}
            disabled={!hasVSPTicketsError}
            modalTitle={
              <T id="myTicket.syncVSP" m="Sync Failed VSP Tickets" />
            }
            modalComponent={SyncVSPFailedTickets}
            buttonLabel={
              <T id="myTicket.syncVSP" m="Sync Failed VSP Tickets" />
            }
          />
        )
      }
      {tickets.length > 0 && (
        <>
          <div className={style.tableHeader}>
            <div>
              <T id="vsptickets.table.header.status" m="Ticket Status" />
            </div>
            <div>
              <T id="vsptickets.table.header.price" m="Price" />
            </div>
            <div>
            </div>
            <div>
            </div>
            <div>
              <T id="vsptickets.table.header.account" m="Fee Status" />
            </div>
            <div>
              <T id="vsptickets.table.header.purchased" m="Purchased" />
            </div>
          </div>
          <TxHistory
            {...{
              transactions: tickets,
              tsDate,
              mode: "liveStake",
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
