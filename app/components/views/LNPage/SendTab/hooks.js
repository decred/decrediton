import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLNPage } from "../hooks";
import {
  PAYMENT_STATUS_FAILED,
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_CONFIRMED
} from "constants";
import { useIntl } from "react-intl";
import * as sel from "selectors";
import * as lna from "actions/LNActions";

export function useSendTab(setTimeout) {
  const [sendValueAtom, setSendValueAtom] = useState(0);
  const [payRequest, setPayRequest] = useState("");
  const [decodedPayRequest, setDecodedPayRequest] = useState(null);
  const [decodingError, setDecodingError] = useState(null);
  const [expired, setExpired] = useState(false);
  const [sending, setSendValue] = useState();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const paymentFilter = useSelector(sel.lnPaymentFilter);
  const intl = useIntl();

  const {
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    channelBalances,
    decodePayRequest,
    sendPayment
  } = useLNPage();

  const getPayments = useCallback(() => {
    const mergedPayments = [...payments].map((p) => {
      p.status = PAYMENT_STATUS_CONFIRMED;
      return p;
    });
    const findPayment = (paymentHash) =>
      mergedPayments.find((p) => p.paymentHash == paymentHash);

    Object.keys(outstandingPayments).forEach((ph) => {
      if (!findPayment(outstandingPayments[ph].decoded.paymentHash)) {
        mergedPayments.push({
          ...outstandingPayments[ph].decoded,
          creationDate: outstandingPayments[ph].decoded.timestamp,
          status: PAYMENT_STATUS_PENDING,
          valueAtoms: outstandingPayments[ph].decoded.numAtoms
        });
      }
    });

    failedPayments.forEach((payment) => {
      if (!findPayment(payment.decoded.paymentHash)) {
        mergedPayments.push({
          ...payment.decoded,
          creationDate: payment.decoded.timestamp,
          status: PAYMENT_STATUS_FAILED,
          valueAtoms: payment.decoded.numAtoms,
          paymentError:
            payment.paymentError &&
            payment.paymentError.charAt(0).toUpperCase() +
              payment.paymentError.slice(1)
        });
      }
    });

    return mergedPayments
      .filter(
        (payment) =>
          !paymentFilter ||
          !paymentFilter.type ||
          paymentFilter.type === "all" ||
          paymentFilter.type === payment.status
      )
      .filter(
        (payment) =>
          !paymentFilter ||
          !paymentFilter.search ||
          payment.paymentHash
            .toLowerCase()
            .indexOf(paymentFilter.search.toLowerCase()) !== -1
      )
      .sort((a, b) => {
        const at = a.timestamp || a.creationDate;
        const bt = b.timestamp || b.creationDate;
        if (paymentFilter && paymentFilter.listDirection == "asc") {
          if (at > bt) {
            return 1;
          }
          if (at < bt) {
            return -1;
          }
        } else {
          if (at < bt) {
            return 1;
          }
          if (at > bt) {
            return -1;
          }
        }
        return 0;
      });
  }, [payments, failedPayments, outstandingPayments, paymentFilter]);

  const checkExpired = useCallback(() => {
    if (!decodedPayRequest) return;
    const timeToExpire =
      (decodedPayRequest.timestamp + decodedPayRequest.expiry) * 1000 -
      Date.now();
    if (timeToExpire < 0) {
      setExpired(true);
    }
  }, [decodedPayRequest]);

  useEffect(() => {
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
        resp.paymentAddrHex = Buffer.from(resp.paymentAddr, "base64").toString(
          "hex"
        );
        setDecodedPayRequest(resp);
        setDecodingError(null);
        setExpired(expired);
      })
      .catch((error) => {
        setDecodedPayRequest(null);
        setDecodingError(String(error));
      });
  }, [payRequest, decodePayRequest, checkExpired, setTimeout]);

  const onPayRequestChanged = (payRequest) => {
    setPayRequest(payRequest.trim());
    setDecodedPayRequest(null);
    setExpired(false);
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

  const dispatch = useDispatch();

  const onChangePaymentFilter = useCallback(
    (newFilter) => dispatch(lna.changePaymentFilter(newFilter)),
    [dispatch]
  );

  const searchText = paymentFilter?.search ?? "";
  const listDirection = paymentFilter?.listDirection;
  const selectedPaymentType = paymentFilter?.type;

  const [isChangingFilterTimer, setIsChangingFilterTimer] = useState(null);

  const onChangeSelectedType = (type) => {
    onChangeFilter(type.value);
  };

  const onChangeSortType = (type) => {
    onChangeFilter({ listDirection: type.value });
  };

  const onChangeSearchText = (searchText) => {
    onChangeFilter({ search: searchText });
  };

  const onChangeFilter = (value) => {
    return new Promise((resolve) => {
      if (isChangingFilterTimer) {
        clearTimeout(isChangingFilterTimer);
      }
      const changeFilter = (newFilterOpt) => {
        const newFilter = { ...paymentFilter, ...newFilterOpt };
        clearTimeout(isChangingFilterTimer);
        onChangePaymentFilter(newFilter);
        return newFilter;
      };
      setIsChangingFilterTimer(
        setTimeout(() => resolve(changeFilter(value)), 100)
      );
    });
  };

  return {
    payments: getPayments(),
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
    intl,
    selectedPayment,
    setSelectedPayment,
    channelBalances,
    searchText,
    listDirection,
    selectedPaymentType,
    onChangeSelectedType,
    onChangeSortType,
    onChangeSearchText
  };
}
