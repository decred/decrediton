import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export function useAccountsPage() {
  const dispatch = useDispatch();
  const isCreateAccountDisabled = useSelector(sel.isWatchingOnly);
  const onGetNextAccountAttempt = useCallback((passphrase, name) =>
    dispatch(ca.getNextAccountAttempt(passphrase, name)), [dispatch]);

  return {
    isCreateAccountDisabled,
    onGetNextAccountAttempt
  };
}
