import AccountsSelect from "./AccountsSelect";
import { receiveAccountsSelect } from "connectors";

@autobind
class ReceiveAccountsSelect extends React.Component {

  render() {
    return (
      <AccountsSelect {...{
        ...this.props,
        onChange: this.onChangeAccount,
        accountsType: "visible"
      }} />
    );
  }

  onChangeAccount(account) {
    this.props.onChange && this.props.onChange(account);
    this.props.getNextAddressAttempt(account.value);
  }
}

export default receiveAccountsSelect(ReceiveAccountsSelect);
