import { EyeFilterMenu } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { Tooltip } from "shared";
import { TextInput, SlideRanger, NumericInput } from "inputs";
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
  step,
  onChangeMinValue,
  onChangeMaxValue,
  onChangeStepValue,
  minAmount,
  maxAmount,
  onChangeMinAmount,
  onChangeMaxAmount,
  expandedSliderInfo,
  onToggleSliderInfo,
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
          <div className="history-select-tx-amounts-area">
            <div className="history-select-tx-amounts">
              <div className="history-select-tx-min-amount"> 
                <div><T id="history.minAmount" m="Min Amount" /></div>
                <SlideRanger step={step} min={min} max={max} value={minAmount} onChange={onChangeMinAmount} />
              </div>
              <div className="history-select-tx-max-amount">
                <T id="history.maxAmount" m="Max Amount" />
                <SlideRanger step={step} min={min} max={max} value={maxAmount} onChange={onChangeMaxAmount} />
              </div>
              <span onClick={() => onToggleSliderInfo(expandedSliderInfo)} className="history-select-tx-kebab"></span>
            </div>
            {
              expandedSliderInfo && (
                <div className="history-select-tx-slider-info">
                  <div>
                    <T id="history.min.value" m="Slider min Value" />:
                    <NumericInput value={min} onChange={(e) => onChangeMinValue(e.target.value)} />
                  </div>
                  <div>
                    <T id="history.max.value" m="Slider max Value" />:
                    <NumericInput value={max} onChange={(e) => onChangeMaxValue(e.target.value)} />
                  </div>
                  <div>
                    <T id="history.step.value" m="Step Value" />:
                    <NumericInput value={step} onChange={(e) => onChangeStepValue(e.target.value)} />
                  </div>
                </div>
              )
            }
          </div>
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
