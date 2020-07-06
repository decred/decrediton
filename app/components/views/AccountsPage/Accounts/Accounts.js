import AccountsList from "./Page";
import ErrorScreen from "ErrorScreen";
import { accountsPage } from "connectors";
import { useAccounts } from "./hooks";

function AccountsPage() {
  const {
    walletService,
    accounts,
    // hiddenAccounts,
    isLoading,
    accountExtendedKey,
    walletName,
    hasTickets,
    onRenameAccount,
    onHideAccount,
    onShowAccount,
    onGetAccountExtendedKey
  } = useAccounts();

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

export default AccountsPage;
