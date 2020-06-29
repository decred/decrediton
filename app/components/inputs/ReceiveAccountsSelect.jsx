import { useCallback } from "react";
import AccountsSelect from "./AccountsSelect";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

function ReceiveAccountsSelect({ onChange, className, showAccountsButton }) {
  const dispatch = useDispatch();
  const mixedAccount = useSelector(sel.getMixedAccount);
  const account = useSelector(sel.nextAddressAccount);

  const getNextAddressAttempt = useCallback(
    (value) => dispatch(ca.getNextAddressAttempt(value)),
    [dispatch]
  );
  const onChangeAccount = useCallback(
    (account) => {
      onChange && onChange(account);
      getNextAddressAttempt(account.value);
    },
    [getNextAddressAttempt, onChange]
  );

  return (
    <AccountsSelect
      {...{
        showAccountsButton,
        className,
        onChange: onChangeAccount,
        accountsType: "visible",
        filterAccounts: [mixedAccount],
        account
      }}
    />
  );
}

export default ReceiveAccountsSelect;
