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
    let accountsPerType = {
      "spending": this.props.spendingAccounts,
      "visible": this.props.visibleAccounts
    };
    this.state = {
      account: props.account || props.defaultSpendingAccount,
      accounts: accountsPerType[this.props.accountsType||"spending"]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.account !== nextProps.account) {
      this.setState({ account: nextProps.account });
    }
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

  selectKeyDown (e) {
    switch(e.keyCode) {
    case 8:
    case 46:
      e.preventDefault();
      break;
    }
  }

  valueRenderer(option) {
    //return <span><span>{option.name}</span></span>;
    return (
      <div className="accounts-select-value">
        <div className="accounts-select-name">{option.name}</div>
        <div className="accounts-select-spendable">
          (<Balance flat amount={option.spendable} />)
        </div>
      </div>
    );
  }

  onChangeAccount(account) {
    this.props.onChange && this.props.onChange(account);
  }
}

export default accountsSelect(injectIntl(AccountsSelect));
