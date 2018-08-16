import Select from "react-select";
import { accountsSelect } from "connectors";
import { injectIntl, defineMessages, intlShape } from "react-intl";
import { Balance, LinkToAccounts } from "shared";

const messages = defineMessages({
  placeholder: {
    id: "accountsSelect.placeholder",
    defaultMessage: "Select account"
  },
});

@autobind
class AccountsSelect extends React.Component {

  static propTypes = {
    accountsType: PropTypes.oneOf([ "spending", "visible" ]),
    intl: intlShape.isRequired,
    className: PropTypes.string,
    showAccountsButton: PropTypes.bool,
    getAddressForSelected: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      account: props.account || props.defaultSpendingAccount,
      accounts: this.getAccountsToShow(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = null;

    if (this.props.account !== nextProps.account) {
      newState = { account: nextProps.account };
    }

    if ((this.props.spendingAccounts !== nextProps.spendingAccounts) ||
        (this.props.visibleAccounts !== nextProps.visibleAccounts) ||
        (this.props.accountsType !== nextProps.accountsType)) {
      newState = { accounts: this.getAccountsToShow(nextProps), ...newState };
      if (nextProps.account && !newState.account) {
        const newAccount = newState.accounts.find(a => a.value === nextProps.account.value);
        newState = { account: newAccount, ...newState };
      }
    }

    if (newState) {
      this.setState(newState);
    }
  }

  getAccountsToShow(nextProps) {
    let accountsPerType = {
      "spending": nextProps.spendingAccounts,
      "visible": nextProps.visibleAccounts
    };
    return accountsPerType[this.props.accountsType||"spending"];
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { className, showAccountsButton } = this.props;
    return (
      <div className={className}>
        <Select
          clearable={false}
          style={{ zIndex:"9" }}
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
          onInputKeyDown={this.selectKeyDown}
        />
        { showAccountsButton && <LinkToAccounts /> }
      </div>
    );
  }

  selectKeyDown(e) {
    const { onKeyDown } = this.props;

    switch(e.keyCode) {
    case 8:
    case 46:
      e.preventDefault();
      break;
    }
    onKeyDown && this.props.onKeyDown(e);
  }

  valueRenderer(option) {
    //return <span><span>{option.name}</span></span>;
    return (
      <div className="accounts-select-value">
        <div className="accounts-select-name">{option.name}</div>
        <div className="accounts-select-spendable">
          <Balance flat amount={option.spendable} />
        </div>
      </div>
    );
  }

  onChangeAccount(account) {
    this.props.onChange && this.props.onChange(account);
  }
}

export default accountsSelect(injectIntl(AccountsSelect));
