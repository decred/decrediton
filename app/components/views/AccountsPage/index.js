import Page from "./Page";
import { accountsPage } from "connectors";

@autobind
class AccountsPage extends React.Component {
  constructor(props)  { super(props); }
  state = { isShowingAddAccount: false };
  render() {
    return (
      <Page
        {...{
          walletService: this.props.walletService,
        }}
      />
    );
  }
}

export default accountsPage(AccountsPage);
