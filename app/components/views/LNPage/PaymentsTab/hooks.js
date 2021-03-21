import { useState, useCallback, useRef } from "react";
import { useLNPage } from "../hooks";

export function usePaymentsTab(setTimeout, clearTimeout) {
  const [sendValueAtom, setSendValueAtom] = useState(0);
  const [payRequest, setPayRequest] = useState("");
  const [decodedPayRequest, setDecodedPayRequest] = useState(null);
  const [decodingError, setDecodingError] = useState(null);
  const [expired, setExpired] = useState(false);
  const [sending, setSendValue] = useState();
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);

  const lastDecodeTimer = useRef(null);

  const {
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    channelBalances,
    decodePayRequest,
    sendPayment
  } = useLNPage();

  const onToggleShowDetails = useCallback(
    (paymentHash) => {
      setSelectedPaymentDetails(paymentHash);
      setIsShowingDetails(!isShowingDetails);
    },
    [isShowingDetails]
  );

  const checkExpired = () => {
    if (!decodedPayRequest) return;
    const timeToExpire =
      (decodedPayRequest.timestamp + decodedPayRequest.expiry) * 1000 -
      Date.now();
    if (timeToExpire < 0) {
      setExpired(true);
    }
  };

  const decodePayRequestCallback = () => {
    lastDecodeTimer.current = null;
    if (!payRequest) {
      setDecodingError(null);
      setDecodedPayRequest(null);
      return;
    }
    decodePayRequest(payRequest)
      .then((resp) => {
        const timeToExpire = (resp.timestamp + resp.expiry) * 1000 - Date.now();
        const expired = timeToExpire < 0;
        if (!expired) {
          setTimeout(checkExpired, timeToExpire + 1000);
        }
        setDecodedPayRequest(resp);
        setDecodingError(null);
        setExpired(expired);
      })
      .catch((error) => {
        setDecodedPayRequest(null);
        setDecodingError(error);
      });
  };

  const onPayRequestChanged = (e) => {
    setPayRequest(("" + e.target.value).trim());
    setDecodedPayRequest(null);
    setExpired(false);
    if (lastDecodeTimer.current) {
      clearTimeout(lastDecodeTimer.current);
    }
    lastDecodeTimer.current = setTimeout(decodePayRequestCallback, 1000);
  };

  const onSendValueChanged = ({ atomValue }) => {
    setSendValueAtom(atomValue);
  };

  const onSendPayment = () => {
    if (!payRequest || !decodedPayRequest) {
      return;
    }
    setPayRequest("");
    setDecodedPayRequest(null);
    setSendValue(0);
    sendPayment(payRequest, sendValueAtom);
  };

  return {
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    payRequest,
    decodedPayRequest,
    decodingError,
    expired,
    sending,
    sendValueAtom,
    onPayRequestChanged,
    onSendPayment,
    onSendValueChanged,
    isShowingDetails,
    selectedPaymentDetails,
    onToggleShowDetails,
    channelBalances
  };
}
