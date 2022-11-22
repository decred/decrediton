import { useState, useEffect } from "react";
import { defineMessages } from "react-intl";
import { useLNPage } from "../hooks";
import { useIntl } from "react-intl";
import * as sel from "selectors";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as lna from "actions/LNActions";

const messages = defineMessages({
  capacityError: {
    id: "ln.receiveTab.capacityError",
    defaultMessage: "Cannot request more than total Receive capacity"
  }
});

export function useReceiveTab() {
  const cancelInvoiceAttempt = useSelector(sel.lnCancelInvoiceAttempt);
  const [atomValue, setAtomValue] = useState(0);
  const [memo, setMemo] = useState("");
  const [value, setValue] = useState();
  const [isFormValid, setIsFormValid] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const intl = useIntl();

  const { invoices, tsDate, addInvoiceAttempt, addInvoice, cancelInvoice } =
    useLNPage();

  const onValueChanged = ({ atomValue }) => setAtomValue(atomValue);

  const onMemoChanged = (e) => {
    if (e.target.value.length > 639) {
      // This is the length limit for the memo field in a payment request.
      return;
    }

    setMemo(e.target.value);
  };

  const onAddInvoice = () => {
    addInvoice(memo, isNaN(atomValue) ? 0 : atomValue).then(() => {
      setMemo("");
      setValue("");
    });
  };

  const onCancelInvoice = ({ rHash }) => {
    cancelInvoice(rHash).then(() =>
      // close the modal
      setSelectedInvoice(null)
    );
  };

  const { maxInboundAmount } = useSelector(sel.lnChannelBalances);

  useEffect(() => {
    setAmountError("");
    if (atomValue < 0) {
      setIsFormValid(false);
    } else if (atomValue > maxInboundAmount) {
      setAmountError(intl.formatMessage(messages.capacityError));
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [atomValue, maxInboundAmount, intl]);

  const invoiceFilter = useSelector(sel.lnInvoiceFilter);

  const filteredLNInvoices = invoices
    .filter(
      (invoice) =>
        !invoiceFilter ||
        !invoiceFilter.type ||
        invoiceFilter.type === "all" ||
        invoiceFilter.type === invoice.status
    )
    .filter(
      (invoice) =>
        !invoiceFilter ||
        !invoiceFilter.search ||
        invoice.rHashHex
          .toLowerCase()
          .indexOf(invoiceFilter.search.toLowerCase()) !== -1
    )
    .sort((a, b) => {
      if (invoiceFilter && invoiceFilter.listDirection == "asc") {
        if (a.creationDate > b.creationDate) {
          return 1;
        }
        if (a.creationDate < b.creationDate) {
          return -1;
        }
      } else {
        if (a.creationDate < b.creationDate) {
          return 1;
        }
        if (a.creationDate > b.creationDate) {
          return -1;
        }
      }

      return 0;
    });

  const dispatch = useDispatch();

  const onChangeInvoiceFilter = useCallback(
    (newFilter) => dispatch(lna.changeInvoiceFilter(newFilter)),
    [dispatch]
  );

  const searchText = invoiceFilter?.search ?? "";
  const listDirection = invoiceFilter?.listDirection;
  const selectedInvoiceType = invoiceFilter?.type;

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
        const newFilter = { ...invoiceFilter, ...newFilterOpt };
        clearTimeout(isChangingFilterTimer);
        onChangeInvoiceFilter(newFilter);
        return newFilter;
      };
      setIsChangingFilterTimer(
        setTimeout(() => resolve(changeFilter(value)), 100)
      );
    });
  };

  return {
    invoices: filteredLNInvoices,
    tsDate,
    value,
    atomValue,
    memo,
    addInvoiceAttempt,
    onCancelInvoice,
    cancelInvoiceAttempt,
    onValueChanged,
    onMemoChanged,
    onAddInvoice,
    isFormValid,
    amountError,
    selectedInvoice,
    setSelectedInvoice,
    intl,
    searchText,
    listDirection,
    selectedInvoiceType,
    onChangeSelectedType,
    onChangeSortType,
    onChangeSearchText,
    onChangeInvoiceFilter
  };
}
