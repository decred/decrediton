import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useTransactions() {
  const balanceSent = useSelector(sel.balanceSent);
  const balanceReceived = useSelector(sel.balanceReceived);
  const sentAndReceivedTransactions = useSelector(
    sel.sentAndReceivedTransactions
  );

  return {
    balanceSent,
    balanceReceived,
    sentAndReceivedTransactions
  };
}
