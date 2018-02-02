import ErrorScreen from "ErrorScreen";
import HomePage from "./Page";
import { service, home } from "connectors";
import {substruct} from "fp";

@autobind
class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
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

  componentDidMount() {
    if(!this.props.noMoreTransactions) {
      this.props.getTransactions();
    }
  }

  componentWillReceiveProps() {
    if(!this.props.noMoreTransactions) {
      this.props.getTransactions();
    }
  }

  render() {
    return this.props.walletService ? <HomePage
    {...{
      ...this.props,
      ...this.state,
      balanceChartData: this.formatBalanceData(this.props.spendableAndLockedByDay),
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

  formatBalanceData(spendableAndLockedByDay){
    console.log(spendableAndLockedByDay)
    const keys = Object.keys(spendableAndLockedByDay);
    let data = [];
    let newData = {};
    for(let i=0;i < keys.length; i++){
      const date = keys[i];
      const values = spendableAndLockedByDay[date];
      newData = {
        name: date,
        locked: values.lockedTotal,
        spendable: values.spendableTotal
      };
      data.push(newData);
    }
    console.log(data)
    return data;
    return [
      { name: 'Page A', uv: 4000, female: 2400, male: 2400 },
      { name: 'Page B', uv: 3000, female: 1398, male: 2210 },
      { name: 'Page C', uv: 2000, female: 9800, male: 2290 },
      { name: 'Page D', uv: 2780, female: 3908, male: 2000 },
      { name: 'Page E', uv: 1890, female: 4800, male: 2181 },
      { name: 'Page F', uv: 2390, female: 3800, male: 2500 },
      { name: 'Page G', uv: 3490, female: 4300, male: 2100 },
    ];
  }

}

export default service(home(Home));
