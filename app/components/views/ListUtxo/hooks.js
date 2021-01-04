import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { listUnspentOutputs } from "actions/TransactionActions";

export function useListUtxo() {
  const dispatch = useDispatch();
  const onListUnspentOutputs = useCallback(
    (accountNum) => dispatch(listUnspentOutputs(accountNum)),
    [dispatch]
  );

  return {
    onListUnspentOutputs
  };
}
