import { useState, useCallback } from "react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import { baseOutput } from "./helpers";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { usePrevious } from "hooks";

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
  const nextAddressAccount = useSelector(sel.nextAddressAccount, shallowEqual);
  const constructTxLowBalance = useSelector(sel.constructTxLowBalance);
  const publishTxResponse = useSelector(sel.publishTxResponse);
  const notMixedAccounts = useSelector(
    sel.getNotMixedAcctIfAllowed,
    shallowEqual
  );
  const isTrezor = useSelector(sel.isTrezor);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const isConstructingTransaction = useSelector(sel.isConstructingTransaction);
  const visibleAccounts = useSelector(sel.visibleAccounts);

  const dispatch = useDispatch();

  const attemptConstructTransaction = useCallback((account, confirmations, outputs, all) =>
    dispatch(
      ca.constructTransactionAttempt(account, confirmations, outputs, all)
    ), [dispatch]);

  const validateAddress = (address) => dispatch(ca.validateAddress(address));

  const onClearTransaction = useCallback(() => dispatch(ca.clearTransaction()), [dispatch]);

  const onGetNextAddressAttempt = useCallback((account) =>
    dispatch(ca.getNextAddressAttempt(account)), [dispatch]);

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
    isWatchingOnly,
    isConstructingTransaction,
    visibleAccounts,
    attemptConstructTransaction,
    validateAddress,
    onClearTransaction,
    onGetNextAddressAttempt,
    getRunningIndicator
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
