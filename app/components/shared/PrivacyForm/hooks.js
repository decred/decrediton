import { useSelector } from "react-redux";
import * as sel from "selectors";

export function usePrivacyForm() {
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);

  const accounts = useSelector(sel.sortedAccounts);

  const getAccountName = (n) => {
    const account = accounts.find(({ accountNumber }) => accountNumber === n);
    return account ? account.accountName : null;
  };

  const mixedAccountName = getAccountName(mixedAccount);
  const changeAccountName = getAccountName(changeAccount);
  const mixedAccountBranch = useSelector(sel.getMixedAccountBranch);

  return {
    mixedAccountName,
    changeAccountName,
    mixedAccountBranch
  };
}
