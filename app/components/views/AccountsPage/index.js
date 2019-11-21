import AccountsList from "./Page";
import ErrorScreen from "ErrorScreen";
import { accountsPage } from "connectors";
import "style/AccountsPage.less";

@autobind
class AccountsPage extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      isShowingAddAccount: false,
      accountNumDetailsShown: null
    };
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

  render() {
    const {
      walletService, isCreateAccountDisabled, onGetNextAccountAttempt, accounts,
      onGetAccountExtendedKey, onHideAccount, onShowAccount, onRenameAccount,
      accountExtendedKey, isLoading, walletName, hasTickets
    } = this.props;
    const { accountNumDetailsShown } = this.state;
    const { onShowAccountDetails, onHideAccountDetails } = this;
    return !walletService ?
      <ErrorScreen/> : <AccountsList {...{
        isCreateAccountDisabled, onGetNextAccountAttempt, accounts, isLoading,
        onGetAccountExtendedKey, onHideAccount, onShowAccount, onRenameAccount,
        accountExtendedKey, accountNumDetailsShown, onShowAccountDetails,
        onHideAccountDetails, walletName, hasTickets
      }}/>;
  }
}

export default accountsPage(AccountsPage);
