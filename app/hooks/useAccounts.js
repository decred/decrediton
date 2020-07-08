import { useCallback } from "react";
import { useDispatch } from "react-redux";
// import * as sel from "selectors";
import * as ca from "actions/ControlActions";

const useAccounts = () => {
  const dispatch = useDispatch();
  const onRenameAccount = useCallback(
    (acctIdx, newName) => dispatch(ca.renameAccountAttempt(acctIdx, newName)),
    [dispatch]
  );

  return { onRenameAccount };
};

export default useAccounts;
