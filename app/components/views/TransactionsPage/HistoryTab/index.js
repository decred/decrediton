import { substruct } from "fp";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./Page";
import { historyPage, balance } from "connectors";
import { injectIntl } from "react-intl";
import { TransactionDetails }  from "middleware/walletrpc/api_pb";
import { FormattedMessage as T } from "react-intl";
import { TRANSACTION_DIR_SENT, TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERED
} from "wallet/service";
import { DescriptionHeader } from "layout";
import { Balance } from "shared";
import noUiSlider from "nouislider";

export const HistoryTabHeader = historyPage(({ totalBalance }) =>
  <DescriptionHeader
    description={<T id="transactions.description.history" m="Total Balance: {totalBalance}"
      values={{ totalBalance: <Balance amount={totalBalance} classNameWrapper="header-small-balance"/> }} />
    }
  />
);

@autobind
class History extends React.Component {
  constructor(props) {
    super(props);
    const selectedTxTypeKey = this.selectedTxTypeFromFilter(props.transactionsFilter);
    const { search, listDirection } = props.transactionsFilter;
    this.state = {
      selectedTxTypeKey,
      selectedSortOrderKey: listDirection,
      searchText: search,
      minAmount: 0,
      maxAmount: 100,
      min: 0,
      max: 100,
      expandedSliderInfo: false,
      isChangingFilter: false,
      rangeSlider: null,
      isSortByExpanded: false,
      sliderShower: true,
    };
  }

  render() {
    // empirically defined to load 1 page of transactions in default height
    // and an additional page when window.innerHeight > default
    const loadMoreThreshold = 90 + Math.max(0, this.props.window.innerHeight - 765);
    const tsDate = this.props.tsDate;

    return  !this.props.walletService ? <ErrorScreen /> : (
      <HistoryPage
        {...{
          ...this.props,
          ...this.state,
          tsDate,
          loadMoreThreshold,
          txTypes: this.getTxTypes(),
          sortTypes: this.getSortTypes(),
          transactions: this.getTransactions(),
          ...substruct({
            onChangeSelectedType: null,
            onChangeSortType: null,
            onChangeSearchText: null,
            onLoadMoreTransactions: null,
            onChangeMaxValue: null,
            onChangeMinValue: null,
            onToggleSliderInfo: null,
            onToggleSortBy: null,
            onToggleSliderShower: null,
          }, this)
        }}
      />
    );
  }

  getTxTypes() {
    const types = TransactionDetails.TransactionType;
    return [
      { key: "all",      value: { types: [],                      direction: null },  label: (<T id="txFilter.type.all" m="All"/>) },
      { key: "regular",  value: { types: [ types.REGULAR ],         direction: null },  label: (<T id="txFilter.type.regular" m="Regular"/>) },
      { key: "ticket",   value: { types: [ types.TICKET_PURCHASE ], direction: null },  label: (<T id="txFilter.type.tickets" m="Tickets"/>) },
      { key: "vote",     value: { types: [ types.VOTE ],            direction: null },  label: (<T id="txFilter.type.votes" m="Votes"/>) },
      { key: "revoke",   value: { types: [ types.REVOCATION ],      direction: null },  label: (<T id="txFilter.type.revokes" m="Revokes"/>) },
      { key: "sent",     value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_SENT },       label: (<T id="txFilter.type.sent" m="Sent"/>) },
      { key: "receiv",   value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_RECEIVED },   label: (<T id="txFilter.type.received" m="Received"/>) },
      { key: "transf",   value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_TRANSFERED }, label: (<T id="txFilter.type.transfered" m="Transfered"/>) },
    ];
  }

  getSortTypes() {
    return [
      { value: "desc", label: (<T id="transaction.sortby.newest" m="Newest"/>) },
      { value: "asc", label: (<T id="transaction.sortby.oldest" m="Oldest"/>) }
    ];
  }

  getTransactions() {
    return this.props.transactions;
  }

  onLoadMoreTransactions() {
    this.props.getTransactions();
  }

  onChangeFilter(value) {
    const { isChangingFilterTimer } = this.state;
    if (isChangingFilterTimer) {
      clearTimeout(isChangingFilterTimer);
    }
    this.setState({ isChangingFilterTimer: setTimeout(() => this.changeFilter(value), 100) });
  }

  changeFilter(value) {
    const { isChangingFilterTimer } = this.state;
    const newFilter = {
      ...this.props.transactionsFilter,
      ...value
    };
    clearTimeout(isChangingFilterTimer)
    this.props.changeTransactionsFilter(newFilter);
  }

  onChangeSelectedType(type) {
    this.onChangeFilter(type.value);
    this.setState({ selectedTxTypeKey: type.key });
  }

  onChangeSortType(type) {
    this.onChangeFilter({ listDirection: type.value });
    this.setState({ selectedSortOrderKey: type.value });
  }

  onChangeSearchText(searchText) {
    this.onChangeFilter({ search: searchText });
    this.setState({ searchText });
  }

  onChangeMinAmount(minAmount) {
    const { unitDivisor, currencyDisplay } = this.props;
    this.setState({ minAmount });
    // this is needed because transactions at filter are all at atoms
    const amount = currencyDisplay === "DCR" ? minAmount*unitDivisor : amount;
    this.onChangeFilter({ minAmount: amount });
  }

  onChangeMaxAmount(maxAmount) {
    const { unitDivisor, currencyDisplay } = this.props;
    this.setState({ maxAmount });
    // this is needed because transactions at filter are all at atoms
    const amount = currencyDisplay === "DCR" ? maxAmount*unitDivisor : amount;
    this.onChangeFilter({ maxAmount: amount });
  }

  onToggleSliderShower(sliderShower) {
    this.setState({ sliderShower: !sliderShower });
  }

  onToggleSliderInfo(expandedSliderInfo) {
    this.setState({ expandedSliderInfo: !expandedSliderInfo });
  }

  onToggleSortBy(isSortByExpanded) {
    this.setState({ isSortByExpanded: !isSortByExpanded})

    if(!isSortByExpanded) {
      setTimeout(() => {
        const range = document.getElementById('min-max-slider');
    
        const { minAmount, maxAmount, min, max } = this.state;
        const toolTipFormatter = {
          to: (value) => {
            return value.toFixed(2);
          },
        }
    
        noUiSlider.create(range, {
          start: [minAmount, maxAmount],
          range: {
              'min': [min],
              'max': [max]
          },
          connect: true,
          tooltips: [true, toolTipFormatter],
        });
    
        range.noUiSlider.on('end', (values, handle) => {
          const value = values[handle];
          if (handle) {
            this.setState({ maxAmount: value });
          } else {
            this.setState({ minAmount: value });
          }
        });

        range.noUiSlider.on('update', (values, handle) => {
          const value = values[handle];
          if (handle) {
            this.onChangeMaxAmount(value)
          } else {
            this.onChangeMinAmount(value)
          }
        });
    
        this.setState({ rangeSlider: range })
      }, 25)
    }
  }

  onChangeMinValue(min) {
    const { rangeSlider, max } = this.state;
    this.setState({ min });
    rangeSlider.noUiSlider.updateOptions({
      range: {
          'min': [parseInt(min)],
          'max': [max]
      }
    });
  }

  onChangeMaxValue(max) {
    const { rangeSlider, min } = this.state;
    this.setState({ max });
    rangeSlider.noUiSlider.updateOptions({
      range: {
          'min': [min],
          'max': [parseInt(max)]
      }
    });
  }

  selectedTxTypeFromFilter(filter) {
    if (filter.types.length === 0) return "all";
    const types = this.getTxTypes();
    types.shift(); //drop "all" which doesn't have value.types
    return types.reduce((a, v) =>
      (v.value.types[0] === filter.types[0] && v.value.direction === filter.direction)
        ? v.key : a, null);
  }
}

export default balance(historyPage(injectIntl(History)));
