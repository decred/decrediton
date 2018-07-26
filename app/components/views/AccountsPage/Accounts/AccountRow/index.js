import Row from "./Row";
import AccountDetails from "./AccountDetails";
import RenameAccount from "./RenameAccount";
import { injectIntl } from "react-intl";

@autobind
class AccountRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingRenameAccount: false,
      renameAccountName: null,
      renameAccountNumber: this.props.account.accountNumber,
      hidden: this.props.account.hidden,
      hasFailedAttempt: false,
      showPubKey: false,
    };
  }

  componentWillUnmount() {
    this.setState(this.getInitialState());
  }

  componentWillReceiveProps(nextProps) {
    const { account, accountNumDetailsShown } = this.props;
    if (accountNumDetailsShown !== nextProps.accountNumDetailsShown && accountNumDetailsShown == account.accountNumber) {
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
      getNullStyles,
      getDefaultStyles,
      willEnter,
      willLeave,
      getRenameAccountStyles
    } = this;
    const {
      account,
      accountNumDetailsShown,
      hideAccountDetails,
      showAccountDetails
    } = this.props;
    const {
      isShowingRenameAccount,
      hidden
    } = this.state;
    const isShowingAccountDetails = accountNumDetailsShown !== null && accountNumDetailsShown == account.accountNumber ;

    return (
      <Row
        {...{
          account,
          hideAccountDetails,
          showAccountDetails,
          isShowingAccountDetails,
          isShowingRenameAccount,
          hidden,
          getRenameAccountStyles,
          getAccountDetailsStyles,
          getNullStyles,
          getDefaultStyles,
          willEnter,
          willLeave
        }}
      />
    );
  }
}

export default injectIntl(AccountRow);
