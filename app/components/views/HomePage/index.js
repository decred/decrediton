import ErrorScreen from "ErrorScreen";
import HomePage from "./Page";
import { service, home } from "connectors";
import {substruct} from "fp";

const TRANSACTIONS_LENGTH_AT_HOME = 5;

@autobind
class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    const {transactions, noMoreTransactions} = this.props;
    if(noMoreTransactions)
      return;
    if(transactions.length < TRANSACTIONS_LENGTH_AT_HOME) {
      this.props.getTransactions();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {transactions, noMoreTransactions} = nextProps;
    if(noMoreTransactions)
      return;
    if(transactions.length < TRANSACTIONS_LENGTH_AT_HOME) {
      this.props.getTransactions();
    }
  }

  getInitialState() {
    return {
      onCancelPassphraseRequest: null,
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null,
      isRequestingPassphrase: false
    };
  }

  render() {
    return this.props.walletService ? <HomePage
    {...{
      ...this.props,
      ...this.state,
      ...substruct({
        onShowRevokeTicket: null,
        onRequestPassphrase: null,
        onCancelPassphraseRequest: null,
      }, this)
    }} /> : <ErrorScreen />;
  }

  onRevokeTickets(privpass) {
    const { onRevokeTickets } = this.props;
    onRevokeTickets && onRevokeTickets(privpass);
    this.onCancelPassphraseRequest();
  }

  onRequestPassphrase(passphraseHeading, passphraseDescription, passphraseCallback) {
    this.setState({
      passphraseHeading,
      passphraseDescription,
      passphraseCallback,
      isRequestingPassphrase: true
    });
  }

  onShowRevokeTicket() {
    this.onRequestPassphrase("Enter Passphrase to Revoke Tickets", null, this.onRevokeTickets);
  }

  onCancelPassphraseRequest() {
    this.setState({
      isRequestingPassphrase: false,
      passphraseHeading: null,
      passphraseDescription: null,
      passphraseCallback: null
    });
  }

}

export default service(home(Home));
