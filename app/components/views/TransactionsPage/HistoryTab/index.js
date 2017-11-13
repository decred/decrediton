import { substruct } from "fp";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./Page";
import { historyPage } from "connectors";
import { injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  All: {
    id: "transaction.type.all",
    defaultMessage: "All"
  },
  Regular: {
    id: "transaction.type.regular",
    defaultMessage: "Regular"
  },
  Tickets: {
    id: "transaction.type.tickets",
    defaultMessage: "Tickets"
  },
  Votes: {
    id: "transaction.type.votes",
    defaultMessage: "Votes"
  },
  Revokes: {
    id: "transaction.type.revokes",
    defaultMessage: "Revokes"
  },
  Unmined: {
    id: "transaction.type.unmined",
    defaultMessage: "Unmined"
  }
});

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
    //const { formatMessage } = this.props.intl;
    // TODO: get from api_pb
    // REGULAR: 0,
    // COINBASE: 4,
    // TICKET_PURCHASE: 1,
    // VOTE: 2,
    // REVOCATION: 3
    return [
      {value: [0], label: "Regular"},
      {value: [4], label: "Coinbase"},
      {value: [1], label: "Ticket"},
      {value: [2], label: "Vote"},
      {value: [3], label: "Revocation"},
    ];
    // return Object.keys(this.props.transactions)
    //   .filter(key => this.props.transactions[key].length > 0)
    //   .map(name => {
    //     return ({ value: name, label: formatMessage(messages[name]) }); });
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
    // const { currentPage } = this.state;
    // const { txPerPage } = this.props;
    // const start = currentPage * txPerPage;
    // return this.getTxs().slice(start, start + txPerPage);
    return this.props.transactions;
  }

  onLoadMoreTransactions() {
    this.props.getTransactions();
  }

  onPageChanged(newPage) {
    this.setState({ currentPage: newPage });
  }

  onChangeSelectedType(type) {
    // this.setState({
    //   selectedType: type.value,
    //   currentPage: 0
    // });
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
