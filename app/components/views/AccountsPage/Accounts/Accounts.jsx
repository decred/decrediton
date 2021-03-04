import AccountsList from "./AccountsList";
import ErrorScreen from "ErrorScreen";
import { useAccounts } from "./hooks";

const Accounts = () => {
  const {
    walletService,
    accounts,
    mixedAccount,
    changeAccount,
    isLoading,
    accountExtendedKey,
    walletName,
    hasTickets,
    allowSendFromUnmixed,
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
        isLoading,
        accountExtendedKey,
        walletName,
        hasTickets,
        allowSendFromUnmixed
      }}
    />
  );
};

export default Accounts;
