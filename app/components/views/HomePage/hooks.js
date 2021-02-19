import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";

export function useHomePage() {
  const dispatch = useDispatch();
  const getTransactionsRequestAttempt = useSelector(
    sel.getTransactionsRequestAttempt
  );
  const getAccountsResponse = useSelector(sel.getAccountsResponse);
  const spendableTotalBalance = useSelector(sel.spendableTotalBalance);
  const transactions = useSelector(sel.homeHistoryTransactions);
  const tickets = useSelector(sel.homeHistoryTickets);
  const revokeTicketsError = useSelector(sel.revokeTicketsError);
  const revokeTicketsSuccess = useSelector(sel.revokeTicketsSuccess);
  const totalBalance = useSelector(sel.totalBalance);
  const tsDate = useSelector(sel.tsDate);

  const onRevokeTickets = (passphrase) =>
    dispatch(ca.revokeTicketsAttempt(passphrase));

  const goToMyTickets = () => dispatch(cla.goToMyTickets());

  const goToTransactionHistory = () => dispatch(cla.goToTransactionHistory());

  return {
    getTransactionsRequestAttempt,
    getAccountsResponse,
    spendableTotalBalance,
    transactions,
    tickets,
    revokeTicketsError,
    revokeTicketsSuccess,
    totalBalance,
    tsDate,
    onRevokeTickets,
    goToMyTickets,
    goToTransactionHistory
  };
}
