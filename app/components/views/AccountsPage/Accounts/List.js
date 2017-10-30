import Header from "../../../Header";
import AccountRow from "./AccountRow";
import DecredLoading from "../../../DecredLoading";
import KeyBlueButton from "../../../KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/AccountsPage.less";
import BalanceOverviewInfoModal from "../../../BalanceOverviewInfoModal";
import { Icon } from "shared";

const AccountsList = ({
  accounts,
  isLoading,
  getNextAccountSuccess,
  onClearNewAccountError,
  getNextAccountError,
  onClearNewAccountSuccess,
  renameAccountSuccess,
  onClearRenameAccountSuccess,
  renameAccountError,
  onClearRenameAccountError,
  onShowAddAccount,
  onShowAccount,
  onHideAccount,
  onRenameAccount,
  onShowAccountDetails,
  onHideAccountDetails,
  accountNumDetailsShown,
  isShowingBalanceOverviewInfoModal,
  onShowBalanceOverviewInfoModal,
  onCloseBalanceOverviewInfoModal,
}) => (
  <Aux>
    <Header
      headerTitleOverview={<T id="accounts.title" m="Accounts" />}
      headerTop={[
        (getNextAccountError !== null) ? (
          <div
            key="accountError"
            className="account-view-notification-error"
          ><div
            className="account-nest-address-delete-icon"
            onClick={onClearNewAccountError}
          ></div>{getNextAccountError}</div>
        ) : (
          <div key="accountError" ></div>
        ),

        (getNextAccountSuccess !== null) ? (
          <div
            key="accountSuccess"
            className="account-view-notification-success"
          ><div
            className="account-nest-address-delete-icon"
            onClick={onClearNewAccountSuccess}
          ></div>{getNextAccountSuccess}</div>
        ) : (
          <div key="accountSuccess" ></div>
        ),

        (renameAccountSuccess !== null) ? (
          <div
            key="renameAccountSuccess"
            className="account-view-notification-success"
          ><div
            className="account-nest-address-delete-icon"
            onClick={onClearRenameAccountSuccess}
          ></div>{renameAccountSuccess}</div>
        ) : (
          <div key="renameAccountSuccess" ></div>
        ),

        (renameAccountError !== null) ? (
          <div
            key="renameAccountError"
            className="account-view-notification-error"
          ><div
            className="account-nest-address-delete-icon"
            onClick={onClearRenameAccountError}
          ></div>{renameAccountError}</div>
        ) : (
          <div key="renameAccountError" ></div>
        )
      ]}
      headerMetaOverview={
        <KeyBlueButton
          className="add-new-account-button"
          onClick={onShowAddAccount}>
          <T id="accounts.addNewButton" m="Add New" />
        </KeyBlueButton>
      }
    />
    {isShowingBalanceOverviewInfoModal && <BalanceOverviewInfoModal closeModal={onCloseBalanceOverviewInfoModal} /> }
    <div className="page-content">
      { isLoading ? <DecredLoading/> :
      <Aux>
        <div className="account-content-title">
          <div className="account-content-title-buttons-area">
            <Icon i="info" onClick={onShowBalanceOverviewInfoModal} tooltip={<T id="accounts.balanceInfo" m="Balance Information"/>} />
          </div>
        </div>
        <div className="account-content-nest">
          {accounts.map(account => (
            <AccountRow
              key={account.accountName}
              account={account}
              accountNumDetailsShown={accountNumDetailsShown}
              renameAccount={onRenameAccount}
              hideAccount={onHideAccount}
              showAccount={onShowAccount}
              showAccountDetails={onShowAccountDetails}
              hideAccountDetails={onHideAccountDetails}
            />
          ))}
        </div>
      </Aux> }
    </div>
  </Aux>
);

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isShowingBalanceOverviewInfoModal: PropTypes.bool.isRequired,
  getNextAccountSuccess: PropTypes.object,
  onClearNewAccountError: PropTypes.func.isRequired,
  getNextAccountError: PropTypes.object,
  onClearNewAccountSuccess: PropTypes.func.isRequired,
  renameAccountSuccess: PropTypes.object,
  onClearRenameAccountSuccess: PropTypes.func.isRequired,
  renameAccountError: PropTypes.object,
  onClearRenameAccountError: PropTypes.func.isRequired,
  onShowAddAccount: PropTypes.func.isRequired,
  onShowAccount: PropTypes.func.isRequired,
  onHideAccount: PropTypes.func.isRequired,
  onRenameAccount: PropTypes.func.isRequired,
  onShowAccountDetails: PropTypes.func.isRequired,
  onHideAccountDetails: PropTypes.func.isRequired,
  accountNumDetailsShown: PropTypes.number,
  onShowBalanceOverviewInfoModal: PropTypes.func.isRequired,
  onCloseBalanceOverviewInfoModal: PropTypes.func.isRequired,
};

export default AccountsList;
