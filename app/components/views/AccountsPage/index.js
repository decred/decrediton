import Page from "./Page";
import { accountsPage } from "connectors";

@autobind
class AccountsPage extends React.Component {
  constructor(props)  { super(props); }
  state = { isShowingAddAccount: false };
  render() {
    const { routes } = this.props;
    return (
      <Page
        {...{
          walletService: this.props.walletService,
          routes,
        }}
      />
    );
  }
}

export default accountsPage(AccountsPage);
