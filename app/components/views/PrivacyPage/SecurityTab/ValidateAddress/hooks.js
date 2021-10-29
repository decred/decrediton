import { useState } from "react";
import { useDispatch } from "react-redux";
import * as ca from "actions/ControlActions";
import { useIntl } from "react-intl";

export function useValidateAddress() {
  const intl = useIntl();
  const [validateAddressSuccess, setValidateAddressSuccess] = useState();
  const dispatch = useDispatch();

  const onValidateAddress = async (address) => {
    const resp = await dispatch(ca.validateAddress(address));
    setValidateAddressSuccess(resp);
    return resp;
  };

  return {
    intl,
    validateAddressSuccess,
    onValidateAddress
  };
}
