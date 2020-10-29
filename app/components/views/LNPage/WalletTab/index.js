const electron = require("electron");
const dialog = electron.remote.dialog;
import fs from "fs";
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
      confirmFileOverwrite: null
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

  async onConfirmFileOverwrite() {
    const filePath = this.state.confirmFileOverwrite;
    if (!filePath) {
      return;
    }
    this.setState({ confirmFileOverwrite: null });
    await this.props.exportBackup(filePath);
  }

  onCancelFileOverwrite() {
    this.setState({ confirmFileOverwrite: null });
  }

  async onBackup() {
    this.setState({ confirmFileOverwrite: null });

    const { filePath } = await dialog.showSaveDialog();
    if (!filePath) {
      return;
    }

    // If this file already exists, show the confirmation modal.
    if (fs.existsSync(filePath)) {
      this.setState({ confirmFileOverwrite: filePath });
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
      confirmFileOverwrite
    } = this.state;
    const { alias, identityPubkey } = this.props.info;
    const { scbPath, scbUpdatedTime, tsDate } = this.props;
    const {
      onChangeAmount,
      onChangeAccount,
      onFundWallet,
      onWithdrawWallet,
      onBackup,
      onVerifyBackup,
      onCancelFileOverwrite,
      onConfirmFileOverwrite
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
        tsDate={tsDate}
        scbPath={scbPath}
        scbUpdatedTime={scbUpdatedTime}
        confirmFileOverwrite={confirmFileOverwrite}
        onChangeAmount={onChangeAmount}
        onChangeAccount={onChangeAccount}
        onFundWallet={onFundWallet}
        onWithdrawWallet={onWithdrawWallet}
        onBackup={onBackup}
        onVerifyBackup={onVerifyBackup}
        onCancelFileOverwrite={onCancelFileOverwrite}
        onConfirmFileOverwrite={onConfirmFileOverwrite}
      />
    );
  }
}

export default lnPage(WalletTab);
