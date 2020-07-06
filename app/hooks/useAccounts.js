import { useCallback } from "react";
import { useDispatch } from "react-redux";
// import * as sel from "selectors";
import * as ca from "actions/ControlActions";

const useAccounts = () => {
  const dispatch = useDispatch();
  const onRenameAccount = useCallback(
    () => dispatch(ca.renameAccountAttempt()),
    [dispatch]
  );

  return { onRenameAccount };
};

export default useAccounts;
