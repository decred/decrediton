import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Tooltip } from "pi-ui";
import { EyeFilterMenu, EyeFilterMenuWithSlider } from "buttons";
import { TextInput } from "inputs";
import { TxHistory, Subtitle } from "shared";
import {
  LoadingMoreTransactionsIndicator,
  NoMoreTransactionsIndicator,
  NoTransactions
} from "indicators";
import styles from "./HistoryPage.module.css";

const messages = defineMessages({
  filterByAddrOrHashPlaceholder: {
    id: "txhistory.filterByAddrOrHashPlaceholder",
    defaultMessage: "Filter by Address or Hash"
  }
});

const subtitleMenu = ({
  sortTypes,
  txTypes,
  selectedSortOrderKey,
  selectedTxTypeKeys,
  searchText,
  intl,
  onChangeSelectedType,
  onChangeSortType,
  onChangeSearchText,
  onChangeSliderValue,
  currencyDisplay,
  transactionsFilter,
  unitDivisor
}) => (
  <div className={styles.historyContainer}>
    <div className={styles.historySearchTx}>
      <TextInput
        id="filterByAddrOrHashInput"
        type="text"
        placeholder={intl.formatMessage(messages.filterByAddrOrHashPlaceholder)}
        value={searchText}
        onChange={(e) => onChangeSearchText(e.target.value)}
      />
    </div>
    <Tooltip
      contentClassName={styles.sortByTooltip}
      content={<T id="transactions.sortby.tooltip" m="Sort By" />}>
      <EyeFilterMenuWithSlider
        {...{ unitDivisor, currencyDisplay }}
        labelKey="label"
        keyField="value"
        options={sortTypes}
        selected={selectedSortOrderKey}
        onChange={onChangeSortType}
        type="sortBy"
        onChangeSlider={onChangeSliderValue}
        minFilterValue={transactionsFilter.minAmount}
        maxFilterValue={transactionsFilter.maxAmount}
      />
    </Tooltip>
    <Tooltip
      contentClassName={styles.typeTooltip}
      content={<T id="transactions.txtypes.tooltip" m="Transaction Type" />}>
      <EyeFilterMenu
        options={txTypes}
        selected={selectedTxTypeKeys}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
  </div>
);

const Page = ({
  tsDate,
  loadMoreThreshold,
  transactions,
  transactionsFilter,
  noMoreTransactions,
  selectedSortOrderKey,
  selectedTxTypeKeys,
  searchText,
  currencyDisplay,
  unitDivisor,
  txTypes,
  sortTypes,
  intl,
  onChangeSelectedType,
  onChangeSortType,
  onChangeSearchText,
  onLoadMoreTransactions,
  onChangeSliderValue,
  transactionsRequestAttempt
}) => (
  <>
    <Subtitle
      title={<T id="history.subtitle" m="Transaction History" />}
      className={styles.isRow}
      children={subtitleMenu({
        sortTypes,
        txTypes,
        selectedSortOrderKey,
        selectedTxTypeKeys,
        searchText,
        intl,
        onChangeSelectedType,
        onChangeSortType,
        onChangeSearchText,
        onChangeSliderValue,
        currencyDisplay,
        transactionsFilter,
        unitDivisor
      })}
    />
    <InfiniteScroll
      hasMore={!noMoreTransactions}
      loadMore={onLoadMoreTransactions}
      initialLoad={loadMoreThreshold > 90}
      useWindow={false}
      threshold={loadMoreThreshold}>
      <div
        className={styles.historyPageContent}
        data-testid="historyPageContent">
        {transactions.length > 0 ? (
          <TxHistory {...{ transactions, tsDate, mode: "regular" }} />
        ) : null}
      </div>
    </InfiniteScroll>
    {!noMoreTransactions ? (
      <LoadingMoreTransactionsIndicator
        onClick={() => !transactionsRequestAttempt && onLoadMoreTransactions()}
      />
    ) : transactions.length > 0 ? (
      <NoMoreTransactionsIndicator />
    ) : (
      <NoTransactions />
    )}
  </>
);

export default injectIntl(Page);
