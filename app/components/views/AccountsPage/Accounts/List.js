import React from "react";
import CircularProgress from "material-ui/CircularProgress";
import Header from "../../../Header";
import AccountRow from "./AccountRow";
import KeyBlueButton from "../../../KeyBlueButton";
import { AccountStyles } from "../../ViewStyles.js";


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
  <div style={AccountStyles.view}>
    <Header
      headerTitleOverview="Accounts"
      headerTop={[
        (getNextAccountError !== null) ? (
          <div
            key="accountError"
            style={AccountStyles.viewNotificationError}
          ><div
            style={AccountStyles.contentNestAddressDeleteIcon}
            onClick={onClearNewAccountError}
          ></div>{getNextAccountError}</div>
        ) : (
          <div key="accountError" ></div>
        ),

        (getNextAccountSuccess !== null) ? (
          <div
            key="accountSuccess"
            style={AccountStyles.viewNotificationSuccess}
          ><div
            style={AccountStyles.contentNestAddressDeleteIcon}
            onClick={onClearNewAccountSuccess}
          ></div>{getNextAccountSuccess}</div>
        ) : (
          <div key="accountSuccess" ></div>
        ),

        (renameAccountSuccess !== null) ? (
          <div
            key="renameAccountSuccess"
            style={AccountStyles.viewNotificationSuccess}
          ><div
            style={AccountStyles.contentNestAddressDeleteIcon}
            onClick={onClearRenameAccountSuccess}
          ></div>{renameAccountSuccess}</div>
        ) : (
          <div key="renameAccountSuccess" ></div>
        ),

        (renameAccountError !== null) ? (
          <div
            key="renameAccountError"
            style={AccountStyles.viewNotificationError}
          ><div
            style={AccountStyles.contentNestAddressDeleteIcon}
            onClick={onClearRenameAccountError}
          ></div>{renameAccountError}</div>
        ) : (
          <div key="renameAccountError" ></div>
        )
      ]}
      headerMetaOverview={
        <KeyBlueButton
          style={AccountStyles.contentAddNewAccount}
          onClick={onShowAddAccount}>
          Add New
        </KeyBlueButton>
      }
    />

    <div style={AccountStyles.content}>
      {isLoading ? (
        <div style={AccountStyles.content}>
          <CircularProgress style={AccountStyles.loading} size={125} thickness={6}/>
        </div>
      ) : (
        <div style={AccountStyles.contentNest}>
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
