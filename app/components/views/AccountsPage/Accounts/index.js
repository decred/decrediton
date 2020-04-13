import AccountsList from "./Page";
import { useState } from "react";
import ErrorScreen from "ErrorScreen";
import { accountsPage } from "connectors";
import "style/AccountsPage.less";

function AccountsPage({
  walletService, isCreateAccountDisabled, onGetNextAccountAttempt, accounts,
  onGetAccountExtendedKey, onHideAccount, onShowAccount, onRenameAccount,
  accountExtendedKey, isLoading, walletName, hasTickets
}) {
  return !walletService ?
    <ErrorScreen /> : <AccountsList {...{
      isCreateAccountDisabled, onGetNextAccountAttempt, accounts, isLoading,
      onGetAccountExtendedKey, onHideAccount, onShowAccount, onRenameAccount,
      accountExtendedKey, walletName, hasTickets
    }} />;
}

export default accountsPage(AccountsPage);
