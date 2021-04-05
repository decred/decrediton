import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import { listUnspentOutputs } from "actions/TransactionActions";
import { useIntl } from "react-intl";
import * as sel from "selectors";

export function useListUtxo() {
  const intl = useIntl();
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
    intl,
    unspentOutputs,
    account,
    setAccount
  };
}
