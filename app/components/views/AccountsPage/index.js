import Page from "./Page";
import { accountsPage } from "connectors";

@autobind
class AccountsPage extends React.Component {
  constructor(props)  { super(props); }
  state = { isShowingAddAccount: false };

  componentWillMount() { this.clear(); }

  clear() {
    this.props.onClearNewAccountSuccess();
    this.props.onClearNewAccountError();
    this.props.onClearRenameAccountSuccess();
    this.props.onClearRenameAccountError();
  }

  onToggleAddAccount() {
    this.setState({ isShowingAddAccount: !this.state.isShowingAddAccount });
    this.clear();
  }

  render() {
    return (
      <Page
        {...{
          walletService: this.props.walletService,
          isShowingAddAccount: this.state.isShowingAddAccount,
          onToggleAddAccount: this.onToggleAddAccount,
        }}
      />
    );
  }
}

export default accountsPage(AccountsPage);
