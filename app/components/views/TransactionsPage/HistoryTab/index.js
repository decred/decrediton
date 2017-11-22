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
          transactions: this.getTransactions(),
          ...substruct({
            onChangeSelectedType: null,
            onLoadMoreTransactions: null
          }, this)
        }}
      />
    );
  }

  getTxTypes() {
    const types = TransactionDetails.TransactionType;
    return [
      {key: "all",      value: [],                       label: (<T id="transaction.type.all" m="All"/>)},
      {key: "regular",  value: [types.REGULAR],          label: (<T id="transaction.type.regular" m="Regular"/>)},
      {key: "ticket",   value: [types.TICKET_PURCHASE],  label: (<T id="transaction.type.tickets" m="Tickets"/>)},
      {key: "vote",     value: [types.VOTE],             label: (<T id="transaction.type.votes" m="Votes"/>)},
      {key: "revoke",   value: [types.REVOCATION],       label: (<T id="transaction.type.revokes" m="Revokes"/>)},
    ];
  }

  getTransactions() {
    return this.props.transactions;
  }

  onLoadMoreTransactions() {
    this.props.getTransactions();
  }

  onChangeSelectedType(type) {
    const newFilter = {
      ...this.props.transactionsFilter,
      types: type.value
    };
    this.props.changeTransactionsFilter(newFilter);
  }
}

export default historyPage(injectIntl(History));
