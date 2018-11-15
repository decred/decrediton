import ticketAutoBuyer from "connectors/ticketAutoBuyer";
import { substruct, compose, eq, get } from "fp";
import { injectIntl } from "react-intl";
import TicketAutoBuyerForm from "./Form";

@autobind
class TicketAutoBuyer extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      ...this.getCurrentSettings(),
      isScrollingDown: false,
      canNotEnableAutobuyer: false,
      balanceToMaintainError: false,
      stakePool: this.props.ticketBuyerSettings ? this.props.ticketBuyerSettings.stakepool : this.props.stakePool,
      account: this.props.ticketBuyerSettings ? this.props.ticketBuyerSettings.account : this.props.account,
      balanceToMaintain: this.props.ticketBuyerSettings ? this.props.ticketBuyerSettings.balanceToMaintain : 0,
    };
  }

  componentDidUpdate() {
    const { isHidingDetails } = this.state;
    if(!isHidingDetails) {
      this.scrollToBottom();
    }
  }

  scrollTo(element, to, duration) {
    const { isScrollingDown } = this.state;
    if (!isScrollingDown)
      return;
    if (duration <= 0) {
      this.setState({ isScrollingDown: false });
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;

    let intervelId = setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      this.scrollTo(element, to, duration - 10);
      clearTimeout(intervelId);
      intervelId = null;
    }, 10);
  }

  scrollToBottom () {
    const content = document.querySelector(".tab-content");
    this.scrollTo(content, content.scrollHeight, 150);
  }

  render() {
    const changeBalanceToMaintain = e => this.onChangeBalanceToMaintain(e);
    const changeAccount = e => this.onChangeAccount(e);
    const changeStakePool = e => this.onChangeStakePool(e);
    return (
      <TicketAutoBuyerForm
        {...{
          isTicketAutoBuyerConfigDirty: this.getIsDirty(),
          formatMessage: this.props.intl.formatMessage,
          onChangeBalanceToMaintain: changeBalanceToMaintain,
          changeAccount,
          changeStakePool,
          account: this.getAccount(),
          stakePool: this.getStakePool(),
          ...this.props,
          ...this.state,
          ...substruct({
            onStartAutoBuyer: null,
          }, this)
        }}
      />
    );
  }

  getValueInAtoms(value) {
    const { currencyDisplay } = this.props;
    if (currencyDisplay === "DCR")
      return value * 100000000;
    return value;
  }

  getCurrentSettings() {
    return substruct({
      balanceToMaintain: null,
    }, this.props);
  }

  onChangeStakePool(stakePool) {
    this.setState({ stakePool });
  }

  onChangeAccount(account) {
    this.setState({ account });
  }

  getIsDirty() {
    const settings = this.getCurrentSettings();
    return !!Object.keys(settings).find(key => this.state[key] !== settings[key]);
  }

  getAccount() {
    const account = this.state.account;
    return this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
  }

  getStakePool() {
    const pool = this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  onChangeBalanceToMaintain(balanceToMaintain) {
    const balanceToMaintainInAtoms = this.getValueInAtoms(balanceToMaintain);

    const balanceToMaintainError = (
      isNaN(balanceToMaintainInAtoms) ||
      balanceToMaintainInAtoms < 0
    ) || !balanceToMaintain;

    this.setState({
      balanceToMaintain: balanceToMaintain,
      balanceToMaintainError: balanceToMaintainError
    });
  }

  onStartAutoBuyer(passphrase) {
    const { onEnableTicketAutoBuyer } = this.props;
    onEnableTicketAutoBuyer && onEnableTicketAutoBuyer(
      passphrase,
      this.getAccount(),
      this.state.balanceToMaintain,
      this.getStakePool()
    );
  }

  getErrors() {
    const { balanceToMaintainError } = this.state;

    if (balanceToMaintainError) {
      this.setState({
        canNotEnableAutobuyer: true
      });
      return true;
    }

    this.setState({
      canNotEnableAutobuyer: false
    });
    return false;
  }

}

export default ticketAutoBuyer(injectIntl(TicketAutoBuyer));
