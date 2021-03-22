import { useSelector } from "react-redux";
import * as sel from "selectors";

export const useDetailedAccountsSelect = () => {
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);

  return {
    mixedAccount,
    changeAccount
  };
};
