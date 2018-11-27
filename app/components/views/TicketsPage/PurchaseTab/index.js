import { substruct, compose, eq, get } from "fp";
import { service, ticketsPage } from "connectors";
import PurchasePage from "./Page";
import { FormattedMessage as T } from "react-intl";
import WatchingOnlyWarnModal from "PseudoModal/WatchingOnlyWarn";

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

  componentDidMount() {
    if (!this.props.stakePool && this.props.stakePool) {
      this.setState({ stakePool: this.props.stakePool });
    }
  }

  render() {
    const { isTicketPurchaseTabDisabled } = this.props;
    return (
      <Aux>
        {
          isTicketPurchaseTabDisabled && <WatchingOnlyWarnModal />
        }
        <div className={ isTicketPurchaseTabDisabled ? "pseudo-modal-wrapper blur" : null }>
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
        </div>
      </Aux>
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
    onImportScript && onImportScript(privpass, script);
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
