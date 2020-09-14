import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export function useValidateAddress() {
  const dispatch = useDispatch();
  const validateAddressError = useSelector(sel.validateAddressError);
  const validateAddressSuccess = useSelector(sel.validateAddressSuccess);
  const validateAddressRequestAttempt = useSelector(sel.validateAddressRequestAttempt);

  const onValidateAddress = useCallback(
    (address) => dispatch(ca.validateAddress(address)),
    [dispatch]
  );
  const onValidateAddressCleanStore = useCallback(
    () => dispatch(ca.validateAddressCleanStore),
    [dispatch]
  );

  return {
    validateAddressError,
    validateAddressSuccess,
    validateAddressRequestAttempt,
    onValidateAddress,
    onValidateAddressCleanStore
  };
}
