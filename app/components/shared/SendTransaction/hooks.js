import { useState, useCallback } from "react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import { baseOutput } from "./helpers";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { usePrevious } from "hooks";
import { compose, get, eq } from "lodash/fp";

export function useSendTransaction() {
  const defaultSpendingAccount = useSelector(
    sel.defaultSpendingAccount,
    shallowEqual
  );
  const unsignedTransaction = useSelector(sel.unsignedTransaction);
  const unsignedRawTx = useSelector(sel.unsignedRawTx);
  const estimatedFee = useSelector(sel.estimatedFee);
  const estimatedSignedSize = useSelector(sel.estimatedSignedSize);
  const totalSpent = useSelector(sel.totalSpent);
  const nextAddress = useSelector(sel.nextAddress);
  const getNextAddressResponse = useSelector(sel.getNextAddressResponse);
  const visibleAccounts = useSelector(sel.visibleAccounts);

  const nextAddressAccountNumber = getNextAddressResponse
    ? getNextAddressResponse.accountNumber
    : null;

  const nextAddressAccount = visibleAccounts.find(
    compose(eq(nextAddressAccountNumber), get("value"))
  );
  const constructTxLowBalance = useSelector(sel.constructTxLowBalance);
  const publishTxResponse = useSelector(sel.publishTxResponse);
  const notMixedAccounts = useSelector(
    sel.getNotMixedAcctIfAllowed,
    shallowEqual
  );
  const isTrezor = useSelector(sel.isTrezor);
  const isLedger = useSelector(sel.isLedger);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const isConstructingTransaction = useSelector(sel.isConstructingTransaction);
  const constructTxRequestAttempt = useSelector(sel.constructTxRequestAttempt);

  const dispatch = useDispatch();

  const attemptConstructTransaction = useCallback(
    (account, confirmations, outputs, all) =>
      dispatch(
        ca.constructTransactionAttempt(account, confirmations, outputs, all)
      ),
    [dispatch]
  );

  const validateAddress = (address) => dispatch(ca.validateAddress(address));

  const onClearTransaction = () => dispatch(ca.clearTransaction());

  const onGetNextAddressAttempt = useCallback(
    (account) => dispatch(ca.getNextAddressAttempt(account)),
    [dispatch]
  );

  const getRunningIndicator = useSelector(sel.getRunningIndicator);
  return {
    defaultSpendingAccount,
    unsignedTransaction,
    unsignedRawTx,
    nextAddress,
    nextAddressAccount,
    estimatedFee,
    estimatedSignedSize,
    constructTxLowBalance,
    publishTxResponse,
    totalSpent,
    notMixedAccounts,
    isTrezor,
    isLedger,
    isWatchingOnly,
    isConstructingTransaction,
    attemptConstructTransaction,
    validateAddress,
    onClearTransaction,
    onGetNextAddressAttempt,
    getRunningIndicator,
    constructTxRequestAttempt
  };
}

export function useOutputs() {
  const [outputs, setOutputs] = useState([baseOutput()]);
  const prevOutputs = usePrevious(outputs);

  const onAddOutput = () => {
    const newOutputs = [...outputs];
    newOutputs.push({
      key: "output_" + outputs.length,
      data: baseOutput().data
    });
    setOutputs(newOutputs);
  };

  const onUpdateOutput = (o) =>
    setOutputs(
      outputs.map((ol) => (ol.key === o.key ? { ...ol, data: o.data } : ol))
    );

  const onRemoveOutput = (index) => {
    const outs = [...outputs];
    outs.splice(index, 1);
    setOutputs(outs);
  };

  return {
    outputs,
    onAddOutput,
    onUpdateOutput,
    onRemoveOutput,
    onSetOutputs: setOutputs,
    prevOutputs
  };
}
