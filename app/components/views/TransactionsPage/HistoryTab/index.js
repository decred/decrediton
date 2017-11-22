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

@autobind
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      selectedType: "Regular",
      transactionDetails: null
    };
  }

  render() {
    return  !this.props.walletService ? <ErrorScreen /> : (
      <HistoryPage
        {...{
          ...this.props,
          ...this.state,
          txTypes: this.getTxTypes(),
          sortTypes: this.getSortTypes(),
          transactions: this.getTransactions(),
          ...substruct({
            onChangeSelectedType: null,
            onChangeSortType: null,
            onLoadMoreTransactions: null
          }, this)
        }}
      />
    );
  }

  getTxTypes() {
    const types = TransactionDetails.TransactionType;
    return [
      {key: "all",      value: {},                       label: (<T id="transaction.type.all" m="All"/>)},
      {key: "regular",  value: {types: [types.REGULAR], direction: null},          label: (<T id="transaction.type.regular" m="Regular"/>)},
      {key: "ticket",   value: {types: [types.TICKET_PURCHASE], direction: null},  label: (<T id="transaction.type.tickets" m="Tickets"/>)},
      {key: "vote",     value: {types: [types.VOTE], direction: null},             label: (<T id="transaction.type.votes" m="Votes"/>)},
      {key: "revoke",   value: {types: [types.REVOCATION], direction: null},       label: (<T id="transaction.type.revokes" m="Revokes"/>)},
      {key: "sent",     value: {types: [types.REGULAR], direction: TRANSACTION_DIR_SENT},       label: (<T id="transaction.type.sent" m="Sent"/>)},
      {key: "received",     value: {types: [types.REGULAR], direction: TRANSACTION_DIR_RECEIVED},       label: (<T id="transaction.type.received" m="Received"/>)},
      {key: "transfered",     value: {types: [types.REGULAR], direction: TRANSACTION_DIR_TRANSFERED},       label: (<T id="transaction.type.transfered" m="Transfered"/>)},
    ];
  }

  getSortTypes() {
    return [
      {value: "desc", label: (<T id="transaction.sortby.newest" m="Newest"/>)},
      {value: "asc", label: (<T id="transaction.sortby.oldest" m="Oldest"/>)}
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
  }

  onChangeSortType(type) {
    this.onChangeFilter({listDirection: type.value});
  }
}

export default historyPage(injectIntl(History));
