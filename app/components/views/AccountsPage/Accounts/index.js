import AccountsList from "./List";
import { accountsPageAccounts } from "connectors";

@autobind
class Accounts extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      accountNumDetailsShown: null,
    };
  }

  render() {
    return (
      <AccountsList
        {...{
          accounts: this.props.accounts,
          isLoading: this.props.isLoading,
          isCreateAccountDisabled: this.props.isCreateAccountDisabled,
          onGetNextAccountAttempt: this.onGetNextAccountAttempt,
          onGetAccountExtendedKey: this.props.onGetAccountExtendedKey,
          onHideAccount: this.props.onHideAccount,
          onShowAccount: this.props.onShowAccount,
          onRenameAccount: this.props.onRenameAccount,
          accountNumDetailsShown: this.state.accountNumDetailsShown,
          onShowAccountDetails: this.onShowAccountDetails,
          onHideAccountDetails: this.onHideAccountDetails,
          accountExtendedKey: this.props.accountExtendedKey
        }}
      />
    );
  }

  onGetNextAccountAttempt(privpass, name) {
    const { onGetNextAccountAttempt } = this.props;
    if (!privpass || !name) return;
    onGetNextAccountAttempt && onGetNextAccountAttempt(privpass, name);
  }

  onShowAccountDetails(accountNumDetailsShown) {
    this.setState({ accountNumDetailsShown });
  }

  onHideAccountDetails() {
    this.setState({ accountNumDetailsShown: null });
  }
}

export default accountsPageAccounts(Accounts);
