import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import { listUnspentOutputs } from "actions/TransactionActions";
import * as sel from "selectors";

export function useListUtxo() {
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const [unspentOutputs, setUnspentOutputs] = useState(null);
  const [account, setAccount] = useState(defaultSpendingAccount);

  const dispatch = useDispatch();
  const onListUnspentOutputs = useCallback(
    (accountNum) => dispatch(listUnspentOutputs(accountNum)),
    [dispatch]
  );
  useEffect(() => {
    if (!account) {
      return;
    }
    onListUnspentOutputs(account.value).then((outputs) =>
      setTimeout(() => {
        setUnspentOutputs(outputs);
      }, 200)
    );
  }, [onListUnspentOutputs, account]);

  return {
    unspentOutputs,
    account,
    setAccount
  };
}
