import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import ErrorScreen from "ErrorScreen";
import ReceivePage from "./ReceivePage";
import { DescriptionHeader } from "layout";
import { useService } from "hooks";
import { useReceiveTab } from "./hooks";

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

const ReceiveTab = () => {
  const { walletService } = useService();
  const { nextAddress, account, onGetNextAddressAttempt } = useReceiveTab();
  const [amount, setAmount] = useState({});

  const onRequestAddress = () => onGetNextAddressAttempt(account.value);
  const onValidateAmount = (data) => {
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
    setAmount({
      amount: value,
      amountAtomValue: atomValue,
      error: { amount: error }
    });
  };

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <ReceivePage
      {...{
        ...amount,
        nextAddress,
        onRequestAddress,
        onValidateAmount
      }}
    />
  );
};

export default ReceiveTab;
