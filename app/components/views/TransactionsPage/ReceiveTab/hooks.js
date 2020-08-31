import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export function useReceiveTab() {
  const nextAddress = useSelector(sel.nextAddress);
  const account = useSelector(sel.nextAddressAccount);

  const dispatch = useDispatch();

  const onGetNextAddressAttempt = useCallback(
    (accountNumber) => dispatch(ca.getNextAddressAttempt(accountNumber)),
    [dispatch]
  );


  return {
    nextAddress,
    account,
    onGetNextAddressAttempt
  };
}
