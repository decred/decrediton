const electron = require("electron");
const dialog = electron.remote.dialog;
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { lnPage } from "connectors";
import Page from "./Page";

export const WalletTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.wallet"
        m="On-chain balance and actions of the LN Wallet"
      />
    }
  />
);

@autobind
class WalletTab extends React.Component {
  constructor(props) {
    super(props);
    setTimeout(() => this.props.updateWalletBalances(), 1000);
    this.state = {
      amount: 0,
      account: props.defaultAccount,
      actionsEnabled: false,
      isShowingBackupInfo: false
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
    this.props
      .fundWallet(this.state.amount, this.state.account.value, passphrase)
      .then(() => {
        this.setState({ sending: false, amount: 0, actionsEnabled: false });
      })
      .catch(() => {
        this.setState({ sending: false });
      });
  }

  onWithdrawWallet() {
    this.setState({ sending: true });
    this.props
      .withdrawWallet(this.state.amount, this.state.account.value)
      .then(() => {
        this.setState({ sending: false, amount: 0, actionsEnabled: false });
      })
      .catch(() => {
        this.setState({ sending: false });
      });
  }

  onToggleShowBackupInfo() {
    this.setState({ isShowingBackupInfo: !this.state.isShowingBackupInfo });
  }

  async onBackup() {
    const opts = {
      options: {
        showOverwriteConfirmation: true
      }
    };
    const { filePath } = await dialog.showSaveDialog(opts);
    if (!filePath) {
      return;
    }

    await this.props.exportBackup(filePath);
  }

  async onVerifyBackup() {
    const { filePaths } = await dialog.showOpenDialog();
    const filePath = filePaths[0];
    if (!filePath) {
      return;
    }

    await this.props.verifyBackup(filePath);
  }

  render() {
    const {
      confirmedBalance,
      unconfirmedBalance,
      totalBalance
    } = this.props.walletBalances;
    const {
      account,
      amount,
      actionsEnabled,
      sending,
      isShowingBackupInfo
    } = this.state;
    const { alias, identityPubkey } = this.props.info;
    const { scbPath, scbUpdatedTime, tsDate } = this.props;
    const {
      onChangeAmount,
      onChangeAccount,
      onFundWallet,
      onWithdrawWallet,
      onToggleShowBackupInfo,
      onBackup,
      onVerifyBackup
    } = this;

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
        isShowingBackupInfo={isShowingBackupInfo}
        tsDate={tsDate}
        scbPath={scbPath}
        scbUpdatedTime={scbUpdatedTime}
        onChangeAmount={onChangeAmount}
        onChangeAccount={onChangeAccount}
        onFundWallet={onFundWallet}
        onWithdrawWallet={onWithdrawWallet}
        onToggleShowBackupInfo={onToggleShowBackupInfo}
        onBackup={onBackup}
        onVerifyBackup={onVerifyBackup}
      />
    );
  }
}

export default lnPage(WalletTab);
