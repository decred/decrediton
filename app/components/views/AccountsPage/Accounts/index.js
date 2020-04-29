import AccountsList from "./Page";
import ErrorScreen from "ErrorScreen";
import { accountsPage } from "connectors";
import "style/AccountsPage.less";

function AccountsPage({
  walletService,
  accounts,
  accountExtendedKey,
  isLoading,
  walletName,
  hasTickets,
  onGetAccountExtendedKey,
  onHideAccount,
  onShowAccount,
  onRenameAccount
}) {
  return !walletService ? (
    <ErrorScreen />
  ) : (
    <AccountsList
      {...{
        onGetAccountExtendedKey,
        onHideAccount,
        onShowAccount,
        onRenameAccount,
        accounts,
        isLoading,
        accountExtendedKey,
        walletName,
        hasTickets
      }}
    />
  );
}

export default accountsPage(AccountsPage);
