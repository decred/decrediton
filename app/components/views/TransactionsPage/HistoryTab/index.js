import { substruct } from "fp";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./Page";
import { historyPage, balance } from "connectors";
import { injectIntl } from "react-intl";
import { TransactionDetails }  from "middleware/walletrpc/api_pb";
import { FormattedMessage as T } from "react-intl";
import { TRANSACTION_DIR_SENT, TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
} from "wallet/service";
import { DescriptionHeader } from "layout";
import { Balance } from "shared";

export const HistoryTabHeader = historyPage(({ totalBalance }) =>
  <DescriptionHeader
    description={<T id="transactions.description.history" m="Total Balance: {totalBalance}"
      values={{ totalBalance: <Balance flat amount={totalBalance} classNameWrapper="header-small-balance"/> }} />
    }
  />
);

@autobind
class History extends React.Component {
  constructor(props) {
    super(props);
    const selectedTxTypeKey = this.selectedTxTypeFromFilter(this.props.transactionsFilter);
    const { search, listDirection } = props.transactionsFilter;
    this.state = { selectedTxTypeKey,
      selectedSortOrderKey: listDirection,
      searchText: search,
      isChangingFilterTimer: null,
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
            onChangeSliderValue: null,
            onLoadMoreTransactions: null
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
      { key: "transf",   value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_TRANSFERRED }, label: (<T id="txFilter.type.transfered" m="Transfered"/>) },
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
    clearTimeout(isChangingFilterTimer);
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

  onChangeSliderValue(value, minOrMax) {
    const { unitDivisor, currencyDisplay } = this.props;
    // this is needed because transactions at filter are all at atoms
    const amount = currencyDisplay === "DCR" ? value*unitDivisor : value;

    if(minOrMax === "min") {
      this.onChangeFilter({ minAmount: amount });
    } else if (minOrMax === "max") {
      this.onChangeFilter({ maxAmount: amount });
    }
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
