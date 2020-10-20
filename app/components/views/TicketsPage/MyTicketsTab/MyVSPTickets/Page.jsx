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
  toggleIsLegacy,
  hasVSPTicketsError,
  account,
  setVSP,
  setAccount,
  onSyncVspTicketsRequest,
  isValid
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
        threshold={0}>
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
                <T id="accounts.createNeededAcc" m="Sync Failed VSP Tickets" />
              }
              modalComponent={SyncVSPFailedTickets}
              buttonLabel={
                <T id="accounts.createNeededAcc" m="Sync Failed VSP Tickets" />
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
                <T id="vsptickets.table.header.reward" m="Reward" />
              </div>
              <div>
                <T id="vsptickets.table.header.votetime" m="Vote Time" />
              </div>
              <div>
                <T id="vsptickets.table.header.account" m="Account" />
              </div>
              <div>
                <T id="vsptickets.table.header.purchased" m="Purchased" />
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
