import { substruct } from "fp";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./Page";
import { historyPage } from "connectors";
import { injectIntl } from "react-intl";
import { TransactionDetails }  from "middleware/walletrpc/api_pb";
import { FormattedMessage as T } from "react-intl";

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
          paginatedTxs: this.getPaginatedTxs(),
          totalPages: this.getTotalPages(),
          ...substruct({
            onChangeSelectedType: null,
            onShowTxDetail: null,
            onClearTxDetail: null,
            onPageChanged: null,
            onLoadMoreTransactions: null
          }, this)
        }}
      />
    );
  }

  getTxTypes() {
    const types = TransactionDetails.TransactionType;
    return [
      {value: [],                       label: (<T id="transaction.type.all" m="All"/>)},
      {value: [types.REGULAR],          label: (<T id="transaction.type.regular" m="Regular"/>)},
      {value: [types.TICKET_PURCHASE],  label: (<T id="transaction.type.tickets" m="Tickets"/>)},
      {value: [types.VOTE],             label: (<T id="transaction.type.votes" m="Votes"/>)},
      {value: [types.REVOCATION],       label: (<T id="transaction.type.revokes" m="Revokes"/>)},
    ];
  }

  getTxs() {
    const { selectedType } = this.state;
    const { transactions } = this.props;
    return transactions[selectedType] || [];
  }

  getTotalPages() {
    const { txPerPage } = this.props;
    const allTxs = this.getTxs();
    return (allTxs.length > 0) ? Math.ceil(allTxs.length / txPerPage) : 1;
  }

  getPaginatedTxs() {
    return this.props.transactions;
  }

  onLoadMoreTransactions() {
    this.props.getTransactions();
  }

  onPageChanged(newPage) {
    this.setState({ currentPage: newPage });
  }

  onChangeSelectedType(type) {
    const newFilter = {
      ...this.props.transactionsFilter,
      types: type.value
    };
    this.props.changeTransactionsFilter(newFilter);
  }

  onShowTxDetail(transactionDetails) {
    this.setState({ transactionDetails });
  }

  onClearTxDetail() {
    this.setState({ transactionDetails: null });
  }
}

export default historyPage(injectIntl(History));
