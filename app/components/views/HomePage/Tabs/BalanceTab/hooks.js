import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useBalance() {
  const lockedTotalBalance = useSelector(sel.lockedBalance);
  const spendableTotalBalance = useSelector(sel.spendableTotalBalance);
  const unconfirmedTotalBalance = useSelector(sel.unconfirmedTotalBalance);
  const spendableAndLockedBalance = useSelector(sel.spendableAndLockedBalance);

  return {
    lockedTotalBalance,
    spendableTotalBalance,
    spendableAndLockedBalance,
    unconfirmedTotalBalance
  };
}
