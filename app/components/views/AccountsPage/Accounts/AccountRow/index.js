import Row from "./Row";
import AccountDetails from "./AccountDetails";
import RenameAccount from "./RenameAccount";
import { injectIntl } from "react-intl";

@autobind
class AccountRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingRenameAccount: false,
      renameAccountName: null,
      renameAccountNumber: this.props.account.accountNumber,
      hidden: this.props.account.hidden,
      hasFailedAttempt: false,
      showPubKey: false,
      isShowingDetails: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { account, accountNumDetailsShown } = prevProps;
    if (accountNumDetailsShown === this.props.accountNumDetailsShown) {
      return;
    }
    if (account.accountNumber !== this.props.accountNumDetailsShown) {
      this.setState({ isShowingDetails: false });
    }
    if (accountNumDetailsShown === account.accountNumber) {
      this.setState({ showPubKey: false });
    }
  }

  updateRenameAccountName(accountName) {
    if (accountName == "") {
      this.setState({ hasFailedAttempt: true });
    }
    this.setState({ renameAccountName: accountName });
  }

  renameAccount() {
    const { renameAccountName, renameAccountNumber } = this.state;
    if (!renameAccountName || renameAccountName == "") {
      this.setState({ hasFailedAttempt: true });
      return;
    }
    this.props.renameAccount(renameAccountNumber, renameAccountName);
    this.setState({ renameAccountName: null, isShowingRenameAccount: false });
  }

  showRenameAccount() {
    this.setState({ hasFailedAttempt: false, isShowingRenameAccount: true });
  }

  hideRenameAccount() {
    this.setState({ isShowingRenameAccount: false });
  }

  showAccount() {
    this.props.showAccount(this.props.account.accountNumber);
    this.setState({ hidden: false });
  }

  hideAccount() {
    this.props.hideAccount(this.props.account.accountNumber);
    this.setState({ hidden: true });
  }

  onShowPubKey() {
    this.props.onGetAccountExtendedKey(this.props.account.accountNumber);
    this.setState({ showPubKey: true });
  }

  onToggleShowDetails() {
    this.setState({ isShowingDetails: !this.state.isShowingDetails });
    this.state.isShowingDetails ? this.props.hideAccountDetails()
      : this.props.showAccountDetails(this.props.account.accountNumber);
  }

  getRenameAccountStyles () {
    const { account, intl } = this.props;
    const {
      updateRenameAccountName,
      renameAccount,
      hideRenameAccount,
    } = this;
    const { hasFailedAttempt, renameAccountName } = this.state;
    return (
      <RenameAccount
        {...{
          account,
          updateRenameAccountName,
          renameAccountName,
          renameAccount,
          hideRenameAccount,
          intl,
          hasFailedAttempt,
        }}
      />
    );
  }

  getAccountDetailsStyles() {
    const { account, accountExtendedKey } = this.props;
    const {
      showRenameAccount,
      showAccount,
      hideAccount,
      onShowPubKey,
    } = this;
    const { hidden, showPubKey } = this.state;
    return (
      <AccountDetails
        {...{
          account,
          showRenameAccount,
          hidden,
          hideAccount,
          showAccount,
          onShowPubKey,
          showPubKey,
          accountExtendedKey,
        }}
      />
    );
  }

  render() {
    const {
      getAccountDetailsStyles,
      getRenameAccountStyles,
      onToggleShowDetails,
    } = this;
    const {
      account,
      accountNumDetailsShown,
    } = this.props;
    const {
      isShowingRenameAccount,
      hidden,
      isShowingDetails,
    } = this.state;

    return (
      <Row
        {...{
          account,
          accountNumDetailsShown,
          isShowingRenameAccount,
          hidden,
          getRenameAccountStyles,
          getAccountDetailsStyles,
          onToggleShowDetails,
          isShowingDetails,
        }}
      />
    );
  }
}

export default injectIntl(AccountRow);
