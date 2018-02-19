import Row from "./Row";
import { spring } from "react-motion";
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
      renameAccountNameError: null,
      renameAccountNumber: this.props.account.accountNumber,
      hidden: this.props.account.hidden,
    };
  }

  updateRenameAccountName(accountName) {
    if (accountName !== "") {
      this.setState({ renameAccountName: accountName, renameAccountNameError: null });
    }
  }

  renameAccount() {
    var checkErrors = false;
    if (this.state.renameAccountName == "") {
      this.setState({ renameAccountNameError: "*You must enter an account name" });
      checkErrors = true;
    }
    if (checkErrors) {
      return;
    }
    this.props.renameAccount(this.state.renameAccountNumber, this.state.renameAccountName);
    this.setState({ renameAccountName: null, isShowingRenameAccount: false });
  }

  showRenameAccount() {
    this.setState({ isShowingRenameAccount: true });
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

  getDefaultStyles() {
    return [ { key: "output_0",style: { height: 0, opacity: 0 } } ];
  }

  getNullStyles () {
    return [ {
      data: <div />,
      key: "output_0",
      style: {
        height: spring(0, { stiffness: 90, damping: 16 }),
        opacity: spring(0, { stiffness: 30, damping: 15 }),
      }
    } ];
  }

  getRenameAccountStyles () {
    const { account, intl } = this.props;
    const {
      updateRenameAccountName,
      renameAccount,
      hideRenameAccount,
    } = this;
    const { renameAccountNameError, renameAccountName } = this.state;
    return [ {
      data: <RenameAccount
        {...{
          account,
          updateRenameAccountName,
          renameAccountName,
          renameAccount,
          hideRenameAccount,
          intl,
          renameAccountNameError,
        }}
      />,
      key: "output_0",
      style: {
        height: spring(140, { stiffness: 110, damping: 14 }),
        opacity: spring(1, { stiffness: 65, damping: 35 }),
      }
    } ];
  }

  getAccountDetailsStyles() {
    const { account } = this.props;
    const {
      showRenameAccount,
      showAccount,
      hideAccount,
    } = this;
    const { hidden } = this.state;
    return [ {
      data: <AccountDetails
        {...{
          account,
          showRenameAccount,
          hidden,
          hideAccount,
          showAccount,
        }}
      />,
      key: "output_0",
      style: {
        height: spring(280, { stiffness: 110, damping: 14 }),
        opacity: spring(1, { stiffness: 65, damping: 35 }),
      }
    } ];
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
