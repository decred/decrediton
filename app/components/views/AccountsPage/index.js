import Page from "./Page";
import { accountsPage } from "connectors";

@autobind
class AccountsPage extends React.Component {
  constructor(props)  { super(props); }
  state = { isShowingAddAccount: false };

  onToggleAddAccount() { this.setState({ isShowingAddAccount: !this.state.isShowingAddAccount }); }

  render() {
    const { routes } = this.props;
    return (
      <Page
        {...{
          walletService: this.props.walletService,
          isShowingAddAccount: this.state.isShowingAddAccount,
          onToggleAddAccount: this.onToggleAddAccount,
          routes,
        }}
      />
    );
  }
}

export default accountsPage(AccountsPage);
