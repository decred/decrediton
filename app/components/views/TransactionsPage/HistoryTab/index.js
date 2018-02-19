import { substruct } from "fp";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./Page";
import { historyPage } from "connectors";
import { injectIntl } from "react-intl";
import { TransactionDetails }  from "middleware/walletrpc/api_pb";
import { FormattedMessage as T } from "react-intl";
import { TRANSACTION_DIR_SENT, TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERED
} from "wallet/service";
import { DescriptionHeader } from "layout";
import { Balance } from "shared";

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
    const selectedTxTypeKey = this.selectedTxTypeFromFilter(this.props.transactionsFilter);
    const selectedSortOrderKey = this.props.transactionsFilter.listDirection;
    const searchText = this.props.transactionsFilter.search;
    this.state = { selectedTxTypeKey, selectedSortOrderKey, searchText };
  }

  render() {
    // empirically defined to load 1 page of transactions in default height
    // and an additional page when window.innerHeight > default
    const loadMoreThreshold = 90 + Math.max(0, this.props.window.innerHeight - 765);

    return  !this.props.walletService ? <ErrorScreen /> : (
      <HistoryPage
        {...{
          ...this.props,
          ...this.state,
          loadMoreThreshold,
          txTypes: this.getTxTypes(),
          sortTypes: this.getSortTypes(),
          transactions: this.getTransactions(),
          ...substruct({
            onChangeSelectedType: null,
            onChangeSortType: null,
            onChangeSearchText: null,
            onLoadMoreTransactions: null
          }, this)
        }}
      />
    );
  }

  getTxTypes() {
    const types = TransactionDetails.TransactionType;
    return [
      { key: "all",      value: { types: [],                      direction: null },  label: (<T id="transaction.type.all" m="All"/>) },
      { key: "regular",  value: { types: [ types.REGULAR ],         direction: null },  label: (<T id="transaction.type.regular" m="Regular"/>) },
      { key: "ticket",   value: { types: [ types.TICKET_PURCHASE ], direction: null },  label: (<T id="transaction.type.tickets" m="Tickets"/>) },
      { key: "vote",     value: { types: [ types.VOTE ],            direction: null },  label: (<T id="transaction.type.votes" m="Votes"/>) },
      { key: "revoke",   value: { types: [ types.REVOCATION ],      direction: null },  label: (<T id="transaction.type.revokes" m="Revokes"/>) },
      { key: "sent",     value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_SENT },       label: (<T id="transaction.type.sent" m="Sent"/>) },
      { key: "receiv",   value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_RECEIVED },   label: (<T id="transaction.type.received" m="Received"/>) },
      { key: "transf",   value: { types: [ types.REGULAR ],         direction: TRANSACTION_DIR_TRANSFERED }, label: (<T id="transaction.type.transfered" m="Transfered"/>) },
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
    const newFilter = {
      ...this.props.transactionsFilter,
      ...value
    };
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

  selectedTxTypeFromFilter(filter) {
    if (filter.types.length === 0) return "all";
    const types = this.getTxTypes();
    types.shift(); //drop "all" which doesn't have value.types
    return types.reduce((a, v) =>
      (v.value.types[0] === filter.types[0] && v.value.direction === filter.direction)
        ? v.key : a, null);

  }
}

export default historyPage(injectIntl(History));
