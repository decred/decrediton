import { useState, useEffect } from "react";
import { defineMessages } from "react-intl";
import { useLNPage } from "../hooks";
import { useIntl } from "react-intl";
import * as sel from "selectors";
import { useSelector } from "react-redux";

const messages = defineMessages({
  capacityError: {
    id: "ln.receiveTab.capacityError",
    defaultMessage: "Cannot request more than total Receive capacity"
  }
});

export function useReceiveTab() {
  const [atomValue, setAtomValue] = useState(0);
  const [memo, setMemo] = useState("");
  const [lastPayRequest, setLastPayRequest] = useState("");
  const [value, setValue] = useState();
  const [lastError, setLastError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [amountError, setAmountError] = useState("");
  const intl = useIntl();

  const { invoices, tsDate, addInvoiceAttempt, addInvoice } = useLNPage();

  const onValueChanged = ({ atomValue }) => setAtomValue(atomValue);

  const onMemoChanged = (e) => {
    if (e.target.value.length > 639) {
      // This is the length limit for the memo field in a payment request.
      return;
    }

    setMemo(e.target.value);
  };

  const onAddInvoice = () => {
    setLastPayRequest("");
    setLastError(null);
    addInvoice(memo, atomValue)
      .then((payReq) => {
        setMemo("");
        setValue(0);
        setLastPayRequest(payReq.paymentRequest);
      })
      .catch((error) => {
        setLastError(error);
      });
  };

  const { maxInboundAmount } = useSelector(sel.lnChannelBalances);

  useEffect(() => {
    setAmountError("");
    if (isNaN(atomValue) || atomValue <= 0) {
      setIsFormValid(false);
    } else if (atomValue > maxInboundAmount) {
      setAmountError(intl.formatMessage(messages.capacityError));
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [atomValue, maxInboundAmount, intl]);

  return {
    invoices,
    tsDate,
    value,
    atomValue,
    memo,
    addInvoiceAttempt,
    lastPayRequest,
    lastError,
    onValueChanged,
    onMemoChanged,
    onAddInvoice,
    isFormValid,
    amountError,
    intl
  };
}
