import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";

export function useAccounts() {
  const walletService = useSelector(sel.walletService);
  const accounts = useSelector(sel.sortedAccounts);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const nextAccountRequestAttempt = useSelector(
    sel.getNextAccountRequestAttempt
  );
  const renameAccountRequestAttempt = useSelector(
    sel.renameAccountRequestAttempt
  );
  const isLoading = nextAccountRequestAttempt || renameAccountRequestAttempt;
  const accountExtendedKey = useSelector(sel.accountExtendedKey);
  const walletName = useSelector(sel.getWalletName);
  const hasTickets = useSelector(sel.hasTickets);
  const allowSendFromUnmixed = useSelector(sel.getAllowSendFromUnmixed);

  const dispatch = useDispatch();

  const onRenameAccount = useCallback(
    (accountNumber, accountName) =>
      dispatch(ca.renameAccountAttempt(accountNumber, accountName)),
    [dispatch]
  );
  const onHideAccount = useCallback(
    (accountNumber) => dispatch(cla.hideAccount(accountNumber)),
    [dispatch]
  );
  const onShowAccount = useCallback(
    (accountNumber) => dispatch(cla.showAccount(accountNumber)),
    [dispatch]
  );
  const onGetAccountExtendedKey = useCallback(
    (accountNumber) => dispatch(ca.getAccountExtendedKeyAttempt(accountNumber)),
    [dispatch]
  );

  return {
    walletService,
    accounts,
    mixedAccount,
    changeAccount,
    isLoading,
    accountExtendedKey,
    walletName,
    hasTickets,
    allowSendFromUnmixed,
    onRenameAccount,
    onHideAccount,
    onShowAccount,
    onGetAccountExtendedKey
  };
}
