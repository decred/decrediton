import { substruct, compose, eq, get } from "fp";
import { service, ticketsPage } from "connectors";
import ErrorScreen from "ErrorScreen";
import PurchasePage from "./Page";
import { FormattedMessage as T } from "react-intl";

@autobind
class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      account: this.props.defaultSpendingAccount,
      stakePool: this.props.stakePool,
      isShowingStakePools: !this.props.stakePool,
      isShowingVotingPrefs: false,
      isShowingImportScript: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.stakePool && nextProps.stakePool) {
      this.setState({ stakePool: nextProps.stakePool });
    }
  }

  render() {
    return (!this.props.walletService || !this.props.ticketBuyerService) ? <ErrorScreen /> : (
      <PurchasePage
        {...{
          ...this.props,
          ...this.state,
          stakePool: this.getStakePool(),
          account: this.getAccount(),
          ...substruct({
            onChangeStakePool: null,
            onChangeAccount: null,
            onShowImportScript: null,
            onShowRevokeTicket: null,
            onCancelImportScript: null,
            onToggleTicketStakePool: null,
            onShowStakePoolConfig: null,
            onHideStakePoolConfig: null,
            onImportScript: null,
            onRevokeTickets: null,
          }, this)
        }}
      />
    );
  }

  onToggleTicketStakePool(side) {
    this.setState({
      isShowingVotingPrefs: (side === "right") ? true : false,
      purchaseTicketsStakePoolConfig: false
    });
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool ? this.props.stakePool : this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  getAccount() {
    const account = this.props.onChangeAccount ? this.props.account : this.state.account;
    return this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
  }

  onChangeStakePool(stakePool) {
    const { onChangeStakePool } = this.props;
    this.setState({ stakePool });
    onChangeStakePool && onChangeStakePool(stakePool);
  }

  onChangeAccount(account) {
    const { onChangeAccount } = this.props;
    this.setState({ account });
    onChangeAccount && onChangeAccount(account);
  }

  onImportScript(privpass, script) {
    const { onImportScript } = this.props;
    onImportScript && onImportScript(privpass, script, true, 0, null);
  }

  onRevokeTickets(privpass) {
    const { onRevokeTickets } = this.props;
    onRevokeTickets && onRevokeTickets(privpass);
  }

  onShowStakePoolConfig() {
    this.setState({ isShowingStakePools: true });
  }

  onHideStakePoolConfig() {
    this.setState({ isShowingStakePools: false });
  }

  onShowRevokeTicket() {
    this.onRequestPassphrase(
      <T id="stake.revokeTicketsPassphrase" m="Enter Passphrase to Revoke Tickets" />,
      null, this.onRevokeTickets);
  }

  onShowImportScript() {
    this.setState({ isShowingImportScript: true });
  }

  onCancelImportScript() {
    this.setState({ isShowingImportScript: false });
  }
}

export default service(ticketsPage(Purchase));
