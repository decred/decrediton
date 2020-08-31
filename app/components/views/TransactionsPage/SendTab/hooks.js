import { useState, useCallback, useEffect } from "react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as tza from "actions/TrezorActions";
import { baseOutput } from "./helpers";
import { useSelector, useDispatch } from "react-redux";

export function useSendTab() {  
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const unsignedTransaction = useSelector(sel.unsignedTransaction);
  const unsignedRawTx = useSelector(sel.unsignedRawTx);
  const estimatedFee = useSelector(sel.estimatedFee);
  const estimatedSignedSize = useSelector(sel.estimatedSignedSize);
  const unitDivisor = useSelector(sel.unitDivisor);
  const totalSpent = useSelector(sel.totalSpent);
  const nextAddress = useSelector(sel.nextAddress);
  const nextAddressAccount = useSelector(sel.nextAddressAccount);
  const constructTxLowBalance = useSelector(sel.constructTxLowBalance);
  const constructTxResponse = useSelector(sel.constructTxResponse);
  const publishTxResponse = useSelector(sel.publishTxResponse);
  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);
  const isTrezor = useSelector(sel.isTrezor);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const isSendingTransaction = useSelector(sel.isSendingTransaction);
  const isConstructingTransaction = useSelector(sel.isConstructingTransaction);
  const isTransactionsSendTabDisabled = useSelector(sel.isTransactionsSendTabDisabled);

  const dispatch = useDispatch();

  const attemptConstructTransaction = useCallback(
    (account, confirmations, outputs, all) => 
      dispatch(ca.constructTransactionAttempt(account, confirmations, outputs, all)),
    [dispatch]
  );

  const validateAddress = useCallback(
    (address) => dispatch(ca.validateAddress(address)),
    [dispatch]
  );

  const onAttemptSignTransaction = useCallback(
    (passphrase, rawTx) => 
      dispatch(ca.signTransactionAttempt(passphrase, rawTx)),
    [dispatch]
  );

  const onAttemptSignTransactionTrezor = useCallback(
    (rawUnsigTx, constructTxResponse) => 
      dispatch(tza.signTransactionAttemptTrezor(rawUnsigTx, constructTxResponse)),
    [dispatch]
  );

  const onClearTransaction = useCallback(
    () => dispatch(ca.clearTransaction),
    [dispatch]
  );

  const onGetNextAddressAttempt = useCallback(
    (account) => dispatch(ca.getNextAddressAttempt(account)),
    [dispatch]
  );

  return {
    defaultSpendingAccount,
    estimatedSignedSize,
    unsignedTransaction,
    unsignedRawTx,
    estimatedFee,
    unitDivisor,
    totalSpent,
    nextAddress,
    nextAddressAccount,
    constructTxLowBalance,
    constructTxResponse,
    publishTxResponse,
    notMixedAccounts,
    isTrezor,
    isWatchingOnly,
    isSendingTransaction,
    isConstructingTransaction,
    isTransactionsSendTabDisabled,

    attemptConstructTransaction,
    validateAddress,
    onAttemptSignTransaction,
    onAttemptSignTransactionTrezor,
    onClearTransaction,
    onGetNextAddressAttempt,
  };
}

export function useOutputs() {
  const [outputs, setOutputs] = useState([baseOutput()]);
  const [error, setError] = useState(false);

  // Check for errors in outputs
  useEffect(() => {
    outputs.forEach((o) => {
      if (
        !o.data.amount ||
        o.data.destination.length === 0 ||
        o.data.error.amount ||
        o.data.error.address
      ) {
        setError(true);
      }
    });
  }, [outputs]);

  const onAddOutput = () => {
    const newOutputs = [ ...outputs ];
    newOutputs.push({
      key: "output_" + outputs.length,
      data: baseOutput().data
    });
    setOutputs(newOutputs);
  };

  const onUpdateOutput = (o) => setOutputs(outputs.map((ol) => 
    ol.key === o.key ? { ...ol, data: o.data } : ol
  ));

  const onRemoveOutput = (index) => {
    const outs = [ ...outputs];
    outs.splice(index, 1);
    setOutputs(outs);
  };

  return {
    outputs,
    outputsError: error,
    onSetOutputs: setOutputs,
    onAddOutput,
    onUpdateOutput,
    onRemoveOutput
  };
}
