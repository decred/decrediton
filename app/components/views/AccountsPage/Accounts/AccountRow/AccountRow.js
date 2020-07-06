import Row from "./Row";
import AccountDetails from "./AccountDetails";
import RenameAccount from "./RenameAccount";
import { useIntl } from "react-intl";
import { useAccountRow } from "./hooks";

const AccountRow = ({
  account,
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
    onToggleShowDetails
  } = useAccountRow(
    account,
    accountNumDetailsShown,
    renameAccount,
    showAccount,
    hideAccount,
    onGetAccountExtendedKey
  );

  const intl = useIntl();

  function getRenameAccountStyles() {
    return (
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
  }

  function getAccountDetailsStyles() {
    return (
      <AccountDetails
        {...{
          account,
          showRenameAccount,
          hidden,
          hideAccount: hideAccountCallback,
          showAccount: showAccountCallback,
          onTogglePubkey,
          showPubKey,
          accountExtendedKey
        }}
      />
    );
  }

  return (
    <Row
      {...{
        account,
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
