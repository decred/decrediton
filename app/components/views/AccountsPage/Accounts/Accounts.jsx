import AccountsList from "./AccountsList";
import ErrorScreen from "ErrorScreen";
import { useAccounts } from "./hooks";

const Accounts = () => {
  const {
    walletService,
    accounts,
    mixedAccount,
    changeAccount,
    dexAccount,
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
        mixedAccount,
        changeAccount,
        dexAccount,
        isLoading,
        accountExtendedKey,
        walletName,
        hasTickets
      }}
    />
  );
};

export default Accounts;
