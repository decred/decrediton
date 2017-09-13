import React from "react";
import Header from "../../../Header";
import AccountRow from "./AccountRow";
import DecredLoading from "../../../DecredLoading";
import KeyBlueButton from "../../../KeyBlueButton";
import "../../../../style/Layout.less";
import "../../../../style/AccountsPage.less";


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
  accountNumDetailsShown
}) => (
  <div className="page-view">
    <Header
      headerTitleOverview="Accounts"
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
          Add New
        </KeyBlueButton>
      }
    />

    <div className="account-content">
      {isLoading ? (
        <DecredLoading/>
      ) : (
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
      )}
    </div>
  </div>
);

export default AccountsList;
