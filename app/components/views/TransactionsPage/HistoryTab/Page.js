import { EyeFilterMenu, EyeFilterMenuWithSlider } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Tooltip, Subtitle } from "shared";
import { TextInput } from "inputs";
import TxHistory from "TxHistory";
import { LoadingMoreTransactionsIndicator, NoMoreTransactionsIndicator, NoTransactions } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import "style/HistoryPage.less";

const messages = defineMessages({
  filterByAddrPlaceholder: {
    id: "txhistory.filterByAddrPlaceholder",
    defaultMessage: "Filter by Address"
  }
});

const subtitleMenu = ({ sortTypes, txTypes, selectedSortOrderKey, selectedTxTypeKey,
  searchText, intl, onChangeSelectedType, onChangeSortType, onChangeSearchText, onChangeSliderValue,
  currencyDisplay, transactionsFilter, unitDivisor }) => (
  <div className="history-select-tx-types-area">
    <div className="history-search-tx">
      <TextInput
        type="text"
        placeholder={intl.formatMessage(messages.filterByAddrPlaceholder)}
        value={searchText}
        onChange={(e) => onChangeSearchText(e.target.value)}
      />
    </div>
    <Tooltip tipWidth={ 300 } text={<T id="transactions.sortby.tooltip" m="Sort By" />}>
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
    <Tooltip tipWidth={ 300 } text={<T id="transactions.txtypes.tooltip" m="Transaction Type" />}>
      <EyeFilterMenu
        labelKey="label"
        keyField="key"
        options={txTypes}
        selected={selectedTxTypeKey}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
  </div>
);

const Page = ({
  sortTypes,
  txTypes,
  transactions,
  tsDate,
  selectedSortOrderKey,
  selectedTxTypeKey,
  searchText,
  loadMoreThreshold,
  noMoreTransactions,
  intl,
  onChangeSelectedType,
  onChangeSortType,
  onChangeSearchText,
  onLoadMoreTransactions,
  onChangeSliderValue,
  currencyDisplay,
  transactionsFilter,
  unitDivisor
}) => (
  <InfiniteScroll
    hasMore={!noMoreTransactions}
    loadMore={onLoadMoreTransactions}
    initialLoad={loadMoreThreshold > 90}
    useWindow={false}
    threshold={loadMoreThreshold}
  >
    <Subtitle title={<T id="history.subtitle" m="Transaction History"/>} className={"is-row"}
      children={subtitleMenu({ sortTypes, txTypes, selectedSortOrderKey, selectedTxTypeKey,
        searchText, intl, onChangeSelectedType, onChangeSortType, onChangeSearchText, onChangeSliderValue,
        currencyDisplay, transactionsFilter, unitDivisor })} />
    <div className="history-page-content-wrapper">
      {transactions.length > 0
        ? <TxHistory {...{ transactions, tsDate }} />
        : null }
    </div>
    {!noMoreTransactions
      ? <LoadingMoreTransactionsIndicator />
      : transactions.length > 0
        ? <NoMoreTransactionsIndicator />
        : <NoTransactions />
    }
  </InfiniteScroll>
);

export default injectIntl(Page);
