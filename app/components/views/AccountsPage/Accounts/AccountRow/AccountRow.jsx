import AccountRowContent from "./AccountRowContent";
import AccountDetails from "./AccountDetails";
import RenameAccount from "./RenameAccount";
import { useAccountRow } from "./hooks";

const AccountRow = ({
  account,
  mixedAccount,
  dexAccount,
  accountNumDetailsShown,
  renameAccount,
  showAccount,
  hideAccount,
  onGetAccountExtendedKey,
  accountExtendedKey,
  hasTickets
}) => {
  const {
    isShowingRenameAccount,
    renameAccountName,
    hidden,
    hasFailedAttempt,
    showPubKey,
    isShowingDetails,
    updateRenameAccountName,
    renameAccountCallback,
    showRenameAccount,
    hideRenameAccount,
    showAccountCallback,
    hideAccountCallback,
    onTogglePubkey,
    onToggleShowDetails,
    intl
  } = useAccountRow(
    account,
    accountNumDetailsShown,
    renameAccount,
    showAccount,
    hideAccount,
    onGetAccountExtendedKey
  );

  const getRenameAccountStyles = () => (
    <RenameAccount
      {...{
        account,
        updateRenameAccountName,
        renameAccountName,
        renameAccount: renameAccountCallback,
        hideRenameAccount,
        intl,
        hasFailedAttempt
      }}
    />
  );

  const getAccountDetailsStyles = () => (
    <AccountDetails
      {...{
        account,
        showRenameAccount,
        dexAccount,
        hidden,
        hideAccount: hideAccountCallback,
        showAccount: showAccountCallback,
        onTogglePubkey,
        showPubKey,
        accountExtendedKey
      }}
    />
  );

  return (
    <AccountRowContent
      {...{
        account,
        mixedAccount,
        accountNumDetailsShown,
        isShowingRenameAccount,
        hidden,
        getRenameAccountStyles,
        getAccountDetailsStyles,
        onToggleShowDetails,
        isShowingDetails,
        hasTickets
      }}
    />
  );
};

export default AccountRow;
