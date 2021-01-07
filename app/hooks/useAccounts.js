import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

const useAccounts = () => {
  const dispatch = useDispatch();
  const mixedAccount = useSelector(sel.getMixedAccountName);
  const onRenameAccount = useCallback(
    (acctIdx, newName) => dispatch(ca.renameAccountAttempt(acctIdx, newName)),
    [dispatch]
  );

  return { onRenameAccount, mixedAccount };
};

export default useAccounts;
