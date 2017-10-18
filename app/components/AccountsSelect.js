import React, { Component } from "react";
import { autobind } from "core-decorators";
import Select from "react-select";
import { PropTypes } from "prop-types";
import accountsSelect from "../connectors/accountsSelect";
import { injectIntl, defineMessages, intlShape } from "react-intl";
import Balance from "./Balance";

const messages = defineMessages({
  placeholder: {
    id: "accountsSelect.placeholder",
    defaultMessage: "Select account"
  }
});

@autobind
class AccountsSelect extends Component {

  static propTypes = {
    accountsType: PropTypes.oneOf(["spending", "visible"]),
    intl: intlShape.isRequired
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
    const { formatMessage } = this.props.intl;
    return (
      <Select
        clearable={false}
        style={{zIndex:"9"}}
        placeholder={formatMessage(messages.placeholder)}
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
      <div className="accounts-select-value">
        <div className="accounts-select-name">{option.name}</div>
        <div className="accounts-select-spendable">
          (<Balance amount={option.spendable} />)
        </div>
      </div>
    );
  }

  onChangeAccount(account) {
    this.setState({ account: account });
    this.props.onChange(account);
  }
}

export default accountsSelect(injectIntl(AccountsSelect));
