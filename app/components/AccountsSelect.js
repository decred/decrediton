import React, { Component } from "react";
import { autobind } from "core-decorators";
import Select from "react-select";
import { PropTypes } from "prop-types";
import accountsSelect from "../connectors/accountsSelect";

@autobind
class AccountsSelect extends Component {

  static propTypes = {
    accountsType: PropTypes.oneOf(["spending", "visible"])
  };

  constructor(props) {
    super(props);
    let accountsPerType = {
      "spending": this.props.spendingAccounts,
      "visible": this.props.visibleAccounts
    };
    this.state = {
      account: this.props.defaultSpendingAccount,
      accounts: accountsPerType[this.props.accountsType||"spending"]
    };
  }

  render() {
    return (
      <Select
        clearable={false}
        style={{zIndex:"9"}}
        placeholder={"Select account..."}
        multi={false}
        value={this.state.account}
        valueKey="value"
        labelKey="label"
        options={this.state.accounts}
        valueRenderer={this.valueRenderer}
        optionRenderer={this.valueRenderer}
        onChange={this.onChangeAccount}
        className="accounts-select"
      />
    );
  }

  valueRenderer(option) {
    //return <span><span>{option.name}</span></span>;
    return (
      <span>
        <span className="accounts-select-name">{option.name}</span>
        <span className="accounts-select-spendable">({option.spendableAndUnit})</span>
      </span>
    );
  }

  onChangeAccount(account) {
    this.setState({ account: account });
    this.props.onChange(account);
  }
}

export default accountsSelect(AccountsSelect);
