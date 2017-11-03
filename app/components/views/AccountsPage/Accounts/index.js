import AccountsList from "./List";
import accountsPageAccounts from "connectors";

@autobind
class Accounts extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      accountNumDetailsShown: null,
      isShowingBalanceOverviewInfoModal: false,
    };
  }

  render() {
    return (
      <AccountsList
        {...{
          accounts: this.props.accounts,
          isLoading: this.props.isLoading,
          isShowingBalanceOverviewInfoModal: this.state.isShowingBalanceOverviewInfoModal,
          onHideAccount: this.props.onHideAccount,
          onShowAccount: this.props.onShowAccount,
          onRenameAccount: this.props.onRenameAccount,
          accountNumDetailsShown: this.state.accountNumDetailsShown,
          onShowAccountDetails: this.onShowAccountDetails,
          onHideAccountDetails: this.onHideAccountDetails,
          onToggleAddAccount: this.props.onToggleAddAccount,
          onShowBalanceOverviewInfoModal: this.onShowBalanceOverviewInfoModal,
          onCloseBalanceOverviewInfoModal: this.onCloseBalanceOverviewInfoModal,
        }}
      />
    );
  }

  onShowAccountDetails(accountNumDetailsShown) {
    this.setState({ accountNumDetailsShown });
  }

  onShowBalanceOverviewInfoModal() {
    this.setState({ isShowingBalanceOverviewInfoModal: true });
  }

  onCloseBalanceOverviewInfoModal() {
    this.setState({ isShowingBalanceOverviewInfoModal: false });
  }

  onHideAccountDetails() {
    this.setState({ accountNumDetailsShown: null });
  }
}

export default accountsPageAccounts(Accounts);
