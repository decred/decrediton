import ErrorScreen from "ErrorScreen";
import ReceivePage from "./Page";
import { service, receive } from "connectors";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

export const ReceiveTabHeader = () =>
  <DescriptionHeader
    description={<T id="transactions.description.receive" m="Each time you request a payment, create a new address to protect your privacy." />}
  />;

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
