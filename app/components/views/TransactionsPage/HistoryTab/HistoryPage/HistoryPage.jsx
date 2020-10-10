import { EyeFilterMenu, EyeFilterMenuWithSlider } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Tooltip, Subtitle } from "shared";
import { TextInput } from "inputs";
import { TxHistory } from "shared";
import {
  LoadingMoreTransactionsIndicator,
  NoMoreTransactionsIndicator,
  NoTransactions
} from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./HistoryPage.module.css";
// XXX replace with .css file (include noUi slider styles)
import "style/HistoryPage.less";

const messages = defineMessages({
  filterByAddrPlaceholder: {
    id: "txhistory.filterByAddrPlaceholder",
    defaultMessage: "Filter by Address"
  }
});

const subtitleMenu = ({
  sortTypes,
  txTypes,
  selectedSortOrderKey,
  selectedTxTypeKey,
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
        type="text"
        placeholder={intl.formatMessage(messages.filterByAddrPlaceholder)}
        value={searchText}
        onChange={(e) => onChangeSearchText(e.target.value)}
      />
    </div>
    <Tooltip
      tipWidth={300}
      text={<T id="transactions.sortby.tooltip" m="Sort By" />}>
      <EyeFilterMenuWithSlider
        {...{ unitDivisor, currencyDisplay }}
        labelKey="label"
        keyField="value"
        options={sortTypes}
        selected={selectedSortOrderKey}
        onChange={onChangeSortType}
        className="sort-by"
        onChangeSlider={onChangeSliderValue}
        minFilterValue={transactionsFilter.minAmount}
        maxFilterValue={transactionsFilter.maxAmount}
      />
    </Tooltip>
    <Tooltip
      tipWidth={300}
      text={<T id="transactions.txtypes.tooltip" m="Transaction Type" />}>
      <EyeFilterMenu
        options={txTypes}
        selected={selectedTxTypeKey}
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
  selectedTxTypeKey,
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
  onChangeSliderValue
}) => (
  <>
    <Subtitle
      title={<T id="history.subtitle" m="Transaction History" />}
      className={styles.isRow}
      children={subtitleMenu({
        sortTypes,
        txTypes,
        selectedSortOrderKey,
        selectedTxTypeKey,
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
      threshold={loadMoreThreshold}
    >
      <div className={styles.historyPageContent}>
        {transactions.length > 0 ? (
          <TxHistory {...{ transactions, tsDate, mode: "regular" }} />
        ) : null}
      </div>
    </InfiniteScroll>
    {!noMoreTransactions ? (
      <LoadingMoreTransactionsIndicator />
    ) : transactions.length > 0 ? (
      <NoMoreTransactionsIndicator />
    ) : (
      <NoTransactions />
    )}
  </>
);

export default injectIntl(Page);
