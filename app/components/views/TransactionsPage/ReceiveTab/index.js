import ErrorScreen from "ErrorScreen";
import ReceivePage from "./Page";
import { service, receive } from "connectors";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

export const ReceiveTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="transactions.description.receive"
        m="Each time you request a payment, create a new address to protect your privacy."
      />
    }
  />
);

@autobind
class Receive extends React.Component {
  render() {
    const { walletService } = this.props;
    const { onRequestAddress, onValidateAmount } = this;

    return !walletService ? (
      <ErrorScreen />
    ) : (
      <ReceivePage
        {...{
          ...this.props,
          ...this.state,
          onRequestAddress,
          onValidateAmount
        }}
      />
    );
  }

  onRequestAddress() {
    const { getNextAddressAttempt, account } = this.props;
    getNextAddressAttempt(account.value);
  }

  onValidateAmount(data) {
    const { value, atomValue } = data;

    let error;
    if (!atomValue || isNaN(atomValue)) {
      error = (
        <T id="receive.errors.invalidAmount" m="Please enter a valid amount" />
      );
    }
    if (atomValue <= 0) {
      error = (
        <T
          id="receive.errors.negativeAmount"
          m="Please enter a valid amount (> 0)"
        />
      );
    }

    this.setState({
      amount: value,
      amountAtomValue: atomValue,
      error: { amount: error }
    });
  }
}

export default service(receive(Receive));
