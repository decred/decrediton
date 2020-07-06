import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";

export function useAccounts() {
  const walletService = useSelector(sel.walletService);
  const accounts = useSelector(sel.sortedAccounts);
  const hiddenAccounts = useSelector(sel.hiddenAccounts);
  const isLoading = useSelector(sel.getNextAccountRequestAttempt) || useSelector(sel.renameAccountRequestAttempt);
  const accountExtendedKey = useSelector(sel.accountExtendedKey);
  const walletName = useSelector(sel.getWalletName);
  const hasTickets = useSelector(sel.hasTickets);

  const dispatch = useDispatch();

  const onRenameAccount = useCallback(() => dispach(ca.renameAccountAttempt()), [dispatch]);
  const onHideAccount = useCallback(() => dispach(cla.hideAccount()), [dispatch]);
  const onShowAccount = useCallback(() => dispach(cla.showAccount()), [dispatch]);
  const onGetAccountExtendedKey = useCallback(() => dispach(ca.getAccountExtendedKeyAttempt()), [dispatch]);

  return {
    walletService,
    accounts,
    hiddenAccounts,
    isLoading,
    accountExtendedKey,
    walletName,
    hasTickets,
    onRenameAccount,
    onHideAccount,
    onShowAccount,
    onGetAccountExtendedKey
  }
}
