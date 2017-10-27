import ErrorScreen from "../../../ErrorScreen";
import ReceivePage from "./Page";
import { service, receive } from "connectors";

@autobind
class Receive extends React.Component{
  render() {
    const { walletService } = this.props;
    const { onRequestAddress } = this;

    return !walletService ? <ErrorScreen /> :
      <ReceivePage {...{
        ...this.props,
        ...this.state,
        onRequestAddress
      }} />;
  }

  onRequestAddress () {
    const { getNextAddressAttempt, account } = this.props;
    getNextAddressAttempt(account.value);
  }
}

export default service(receive(Receive));
