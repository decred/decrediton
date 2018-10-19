import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Tooltip } from "shared";
import { TextInput, NumericInput } from "inputs";
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
  min,
  max,
  onChangeMinValue,
  onChangeMaxValue,
  expandedSliderInfo,
  onToggleSliderInfo,
  onToggleSortBy,
  isSortByExpanded,
  currencyDisplay,
  minAmount,
  maxAmount,
  onToggleSliderShower,
  sliderShower,
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
        <T id="history.title" m="Transaction History" />
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
            <div className="sort-by" onClick={() => onToggleSortBy(isSortByExpanded)}>
              <div className="sort-by-icon">
              </div>
            </div>
          </Tooltip>
          {
            isSortByExpanded && (
              <div className="sort-by-menu-items">
                <div className="sort-menu-wrapper">
                  {
                    sortTypes.map((sortType, index) =>
                      <div key={ index } onClick={() => onChangeSortType(sortType)}
                        className= {
                          [ selectedSortOrderKey === sortType.value && "selected", "context-menu-item" ].join(" ")
                        }
                      >{sortType.label}</div>
                    )
                  }
                </div>
                <div className="history-slider-wrapper">
                  <div className="history-amount-range-label"><T id="history.amount.range" m="Amount Range" /></div>
                  <div id="min-max-slider" className="min-max-slider"></div>
                  <div className="history-select-tx-amounts-area">
                    <div className="history-select-tx-amounts">
                      <span onClick={() => onToggleSliderInfo(expandedSliderInfo)} className="history-select-tx-kebab"></span>
                    </div>
                    {
                      expandedSliderInfo && (
                        <div className="history-select-tx-slider-info">
                          <div>
                            <T id="history.min.value" m="Slider min" />:
                            <NumericInput value={min} onChange={(e) => onChangeMinValue(e.target.value)} />
                          </div>
                          <div>
                            <T id="history.max.value" m="Slider max" />:
                            <NumericInput value={max} onChange={(e) => onChangeMaxValue(e.target.value)} />
                          </div>
                        </div>
                      )
                    }
                  </div>
                  {
                    sliderShower && (
                      <div className="history-slider-value-shower">
                        {minAmount} {currencyDisplay} - {maxAmount} {currencyDisplay}
                        <div className="history-slider-value-shower-closer"
                          onClick={() => onToggleSliderShower(sliderShower)}></div>
                      </div>
                    )
                  }

                </div>
              </div>
            )
          }
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
    <div className="history-content-nest"
      style = {{ display: transactions.length == 0 ? "none" : "initial" }} >
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
