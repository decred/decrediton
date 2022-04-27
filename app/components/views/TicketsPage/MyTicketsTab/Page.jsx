import { FormattedMessage as T, defineMessages } from "react-intl";
import { Tooltip, Paginator } from "pi-ui";
import InfiniteScroll from "react-infinite-scroller";
import {
  LoadingMoreTicketsIndicator,
  NoMoreTicketsIndicator,
  NoTicketsIndicator
} from "indicators";
import { TxHistory, Subtitle } from "shared";
import { EyeFilterMenu, QRModalButton } from "buttons";
import styles from "./MyTicketsTab.module.css";
import { TextInput } from "inputs";

const messages = defineMessages({
  filterByHashPlaceholder: {
    id: "txhistory.filterByHashPlaceholder",
    defaultMessage: "Filter by Hash"
  }
});

const subtitleMenu = ({
  intl,
  searchText,
  onChangeSearchText,
  sortTypes,
  ticketTypes,
  selectedSortOrderKey,
  selectedTicketTypeKey,
  onChangeSelectedType,
  onChangeSortType,
  QRs,
  loadingQRs,
  QRsPage,
  onQRPageClick,
  prepareQRs
}) => (
  <div className={styles.ticketsButtons}>
    <TextInput
      id="filterByHashInput"
      type="text"
      placeholder={intl.formatMessage(messages.filterByHashPlaceholder)}
      value={searchText}
      onChange={(e) => onChangeSearchText(e.target.value)}
    />
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
    <Tooltip
      contentClassName={styles.qrTooltip}
      content={<T id="tickets.qr.tooltip" m="Tickets QR" />}>
      <div className={styles.menuButton}>
        <QRModalButton
          className={styles.qrButton}
          modalTitle={<T id="tickets.qr.button" m="Active Tickets QR Code" />}
          pagesRemaining={QRs.length > 1 && `${QRsPage + 1}/${QRs.length}`}
          modalContent={
            QRs.length != 0 ? (
              <img src={QRs[QRsPage]} />
            ) : loadingQRs ? (
              <T id="tickets.qr.loading" m="Loading..." />
            ) : (
              <T
                id="tickets.qr.notickets"
                m="No active tickets in the current view."
              />
            )
          }
          onClick={prepareQRs}
          pages={
            QRs.length > 1 && (
              <Paginator
                className={styles.qrsPaginator}
                pageCount={QRs.length}
                onPageChange={onQRPageClick}
              />
            )
          }
        />
      </div>
    </Tooltip>
  </div>
);

const TicketListPage = ({
  intl,
  searchText,
  onChangeSearchText,
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
  QRs,
  loadingQRs,
  QRsPage,
  onQRPageClick,
  prepareQRs
}) => {
  const isOverview = window.innerWidth < 768; // small width
  return (
    <>
      <Subtitle
        title={<T id="mytickets.subtitle" m="My Tickets" />}
        className={styles.subtitle}
        children={subtitleMenu({
          intl,
          searchText,
          onChangeSearchText,
          sortTypes,
          ticketTypes,
          selectedSortOrderKey,
          selectedTicketTypeKey,
          onChangeSelectedType,
          onChangeSortType,
          QRs,
          loadingQRs,
          QRsPage,
          onQRPageClick,
          prepareQRs
        })}
      />
      {tickets.length > 0 && (
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
      )}
      <InfiniteScroll
        hasMore={!noMoreTickets}
        loadMore={() => getTickets()}
        initialLoad={!noMoreTickets}
        useWindow={false}
        threshold={90}
        data-testid="ticketHistoryPageContent">
        <TxHistory
          {...{
            transactions: tickets,
            tsDate,
            mode: "stake",
            overview: isOverview
          }}
        />
      </InfiniteScroll>
      {!noMoreTickets ? (
        <LoadingMoreTicketsIndicator getTickets={getTickets} />
      ) : tickets.length > 0 ? (
        <NoMoreTicketsIndicator />
      ) : (
        <NoTicketsIndicator />
      )}
    </>
  );
};

export default TicketListPage;
