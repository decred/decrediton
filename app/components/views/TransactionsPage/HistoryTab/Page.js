import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Tooltip } from "shared";
import { TextInput } from "../../../inputs";
import TxHistory from "TxHistory";
import { LoadingMoreTransactionsIndicator, NoMoreTransactionsIndicator, NoTransactions } from "indicators";
import InfiniteScroll from "react-infinite-scroller";
import "style/HistoryPage.less";

const messages = defineMessages({
  filterByAddrPlaceholder: {
    id: "txhistory.filterByAddrPlaceholder",
    defaultMessage: "Filter by Address"
  },
});

const Page = ({
  sortTypes,
  txTypes,
  transactions,
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
}) => (
  <InfiniteScroll
    hasMore={!noMoreTransactions}
    loadMore={onLoadMoreTransactions}
    initialLoad={loadMoreThreshold > 90}
    useWindow={false}
    threshold={loadMoreThreshold}
  >
    <div className="history-content-title">
      <div className="history-content-title-text">
        <T id="history.title" m="Recent Transactions" />
      </div>
      <div className="history-select-tx-types-area">
        <div className="history-select-tx-types">
          <div className="history-search-tx">
            <TextInput
              type="text"
              placeholder={intl.formatMessage(messages.filterByAddrPlaceholder)}
              value={searchText}
              onChange={(e) => onChangeSearchText(e.target.value)}
            />
          </div>
          <Tooltip tipWidth={ 300 } text={<T id="transactions.sortby.tooltip" m="Sort By" />}>
            <EyeFilterMenu
              labelKey="label"
              keyField="value"
              options={sortTypes}
              selected={selectedSortOrderKey}
              onChange={onChangeSortType}
              className="sort-by"
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
      </div>
    </div>
    <div className="history-content-nest">
      {transactions.length > 0
        ? <TxHistory transactions={transactions} />
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
