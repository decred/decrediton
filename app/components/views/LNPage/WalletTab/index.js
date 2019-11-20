import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { lnPage } from "connectors";
import Page from "./Page";

export const WalletTabHeader = () =>
  <DescriptionHeader
    description={<T id="ln.description.wallet" m="On-chain balance and actions of the LN Wallet" />}
  />;

@autobind
class WalletTab extends React.Component {
  constructor(props)  {
    super(props);
    setTimeout( () => this.props.updateWalletBalances(), 1000);
    this.state = {
      amount: 0,
      account: props.defaultAccount,
      actionsEnabled: false
    };
  }

  onChangeAmount(amount) {
    const actionsEnabled = amount > 0 && this.state.account;
    this.setState({ amount, actionsEnabled });
  }

  onChangeAccount(account) {
    const actionsEnabled = this.state.amount > 0 && account;
    this.setState({ account, actionsEnabled });
  }

  onFundWallet(passphrase) {
    this.setState({ sending: true });
    this.props.fundWallet(this.state.amount, this.state.account.value, passphrase)
      .then(() => { this.setState({ sending: false, amount: 0, actionsEnabled: false }); })
      .catch(() => { this.setState({ sending: false }); });
  }

  onWithdrawWallet() {
    this.setState({ sending: true });
    this.props.withdrawWallet(this.state.amount, this.state.account.value)
      .then(() => { this.setState({ sending: false, amount: 0, actionsEnabled: false }); })
      .catch(() => { this.setState({ sending: false }); });
  }

  render() {
    const { confirmedBalance, unconfirmedBalance,
      totalBalance } = this.props.walletBalances;
    const { account, amount, actionsEnabled, sending } = this.state;
    const { alias, identityPubkey } = this.props.info;
    const { onChangeAmount, onChangeAccount, onFundWallet,
      onWithdrawWallet } = this;

    return (
      <Page
        alias={alias}
        identityPubkey={identityPubkey}
        confirmedBalance={confirmedBalance}
        unconfirmedBalance={unconfirmedBalance}
        account={account}
        amount={amount}
        totalBalance={totalBalance}
        actionsEnabled={actionsEnabled && !sending}
        onChangeAmount={onChangeAmount}
        onChangeAccount={onChangeAccount}
        onFundWallet={onFundWallet}
        onWithdrawWallet={onWithdrawWallet}
      />
    );
  }
}

export default lnPage(WalletTab);
