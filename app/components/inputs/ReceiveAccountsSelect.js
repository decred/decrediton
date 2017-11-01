import { Component } from "react";
import { autobind } from "core-decorators";
import AccountsSelect from "./AccountsSelect";
import receiveAccountsSelect from "connectors/receiveAccountsSelect";

@autobind
class ReceiveAccountsSelect extends Component {

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
    this.props.getNextAddressAttempt(account.value);
  }
}

export default receiveAccountsSelect(ReceiveAccountsSelect);
