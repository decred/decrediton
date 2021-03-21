import { useState } from "react";
import * as sel from "selectors";
import { useSelector } from "react-redux";
import { useLNPage } from "../hooks";

export function useInvoicesTab() {
  const [atomValue, setAtomValue] = useState(0);
  const [memo, setMemo] = useState("");
  const [lastPayRequest, setLastPayRequest] = useState("");
  const [value, setValue] = useState();
  const [lastError, setLastError] = useState("");

  const { invoices, tsDate, addInvoiceAttempt, addInvoice } = useLNPage();

  const onValueChanged = ({ atomValue }) => {
    setAtomValue(atomValue);
  };

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

  const channelBalances = useSelector(sel.lnChannelBalances);

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
    channelBalances
  };
};


