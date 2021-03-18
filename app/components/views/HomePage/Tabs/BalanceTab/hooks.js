import { useSelector } from "react-redux";
import * as sel from "selectors";

export function useBalance() {
  const lockedTotalBalance = useSelector(sel.lockedTotalBalance);
  const spendableTotalBalance = useSelector(sel.spendableTotalBalance);
  const unconfirmedTotalBalance = useSelector(sel.unconfirmedTotalBalance);
  const spendableAndLockedBalance = useSelector(sel.spendableAndLockedBalance);
  const lockedByTicketsTotalBalance = useSelector(
    sel.lockedByTicketsTotalBalance
  );

  const immatureRewardTotalBalance = useSelector(
    sel.immatureRewardTotalBalance
  );
  const immatureStakeGenerationTotalBalance = useSelector(
    sel.immatureStakeGenerationTotalBalance
  );
  const votingAuthorityTotalBalance = useSelector(
    sel.votingAuthorityTotalBalance
  );

  return {
    lockedTotalBalance,
    spendableTotalBalance,
    spendableAndLockedBalance,
    unconfirmedTotalBalance,
    lockedByTicketsTotalBalance,
    immatureRewardTotalBalance,
    immatureStakeGenerationTotalBalance,
    votingAuthorityTotalBalance
  };
}
