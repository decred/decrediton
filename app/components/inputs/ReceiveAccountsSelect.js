import AccountsSelect from "./AccountsSelect";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

function ReceiveAccountsSelect({ onChange }) {
  const dispatch = useDispatch();
  const getNextAddressAttempt = (value) =>
    dispatch(ca.getNextAddressAttempt(value));
  const mixedAccount = useSelector(sel.getMixedAccount);
  const account = useSelector(sel.nextAddressAccount);
  const onChangeAccount = (account) => {
    onChange && onChange(account);
    getNextAddressAttempt(account.value);
  };

  return (
    <AccountsSelect
      {...{
        onChange: onChangeAccount,
        accountsType: "visible",
        filterAccounts: [mixedAccount],
        account
      }}
    />
  );
}

export default ReceiveAccountsSelect;
