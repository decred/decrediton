import Select from "react-select";
import { accountsSelect } from "connectors";
import { injectIntl, defineMessages } from "react-intl";
import { Balance, LinkToAccounts } from "shared";

const messages = defineMessages({
  placeholder: {
    id: "accountsSelect.placeholder",
    defaultMessage: "Select account"
  }
});

// XXX some of this component styling is found in `style/ReactSelectGlobal` 
// and could be moved to a css module when this component is refactored
@autobind
class AccountsSelect extends React.Component {
  static propTypes = {
    accountsType: PropTypes.oneOf(["spending", "visible"]),
    className: PropTypes.string,
    showAccountsButton: PropTypes.bool,
    getAddressForSelected: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
      accounts: this.getAccountsToShow(props)
    };
  }

  componentDidUpdate(prevProps) {
    let newState = null;

    if (prevProps.account !== this.props.account) {
      newState = { account: this.props.account };
    }

    if (
      prevProps.spendingAccounts !== this.props.spendingAccounts ||
      prevProps.visibleAccounts !== this.props.visibleAccounts ||
      prevProps.accountsType !== this.props.accountsType
    ) {
      newState = { accounts: this.getAccountsToShow(this.props), ...newState };
      if (this.props.account && !newState.account) {
        const newAccount = newState.accounts.find(
          (a) => a.value === this.props.account.value
        );
        newState = { account: newAccount, ...newState };
      }
    }

    if (newState) {
      this.setState(newState);
    }
  }

  getAccountsToShow(nextProps) {
    const { filterAccounts } = nextProps;
    const accountsPerType = {
      spending: nextProps.spendingAccounts,
      visible: nextProps.visibleAccounts
    };
    // If we have a mixed account, we show visible accounts as default instead
    // of spending, because our mixed account can be empty, but still desired
    // to be spent.
    const type = this.props.mixedAccount ? "visible" : "spending";
    let filteredAccounts = accountsPerType[this.props.accountsType || type];
    // filterAccounts remove accounts if needed. This is usefull to remove accounts
    // which are not supposed to be shown, for example, mixed accounts in privacy wallets
    if (Array.isArray(filterAccounts)) {
      filteredAccounts = filteredAccounts.filter(
        ({ value }) => !filterAccounts.includes(value)
      );
    }
    return filteredAccounts;
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { className, showAccountsButton, disabled } = this.props;
    return (
      <div className={"is-row " + className}>
        <Select
          disabled={disabled}
          clearable={false}
          style={{ zIndex: "9" }}
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
        {showAccountsButton && <LinkToAccounts />}
      </div>
    );
  }

  selectKeyDown(e) {
    const { onKeyDown } = this.props;

    switch (e.keyCode) {
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
        {!this.props.hideSpendable && (
          <div className="accounts-select-spendable">
            <Balance flat amount={option.spendable} />
          </div>
        )}
      </div>
    );
  }

  onChangeAccount(account) {
    this.props.onChange && this.props.onChange(account);
  }
}

export default accountsSelect(injectIntl(AccountsSelect));
