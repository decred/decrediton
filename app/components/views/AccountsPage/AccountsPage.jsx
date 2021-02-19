import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import AccountsList from "./Accounts/Accounts";
import { PassphraseModalButton } from "buttons";
import { AddAccountModal } from "modals";
import { WatchOnlyWarnNotification } from "shared";
import { useAccountsPage } from "./hooks";

const AccountsPageHeader = React.memo(
  ({ isCreateAccountDisabled, onGetNextAccountAttempt }) => (
    <StandaloneHeader
      title={<T id="accounts.title" m="Accounts" />}
      description={
        <T
          id="accounts.description"
          m={
            "Accounts allow you to keep separate records of your DCR funds.\nTransferring DCR across accounts will create a transaction on the blockchain."
          }
        />
      }
      iconClassName={"accounts"}
      actionButton={
        <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
          <PassphraseModalButton
            disabled={isCreateAccountDisabled}
            modalTitle={
              <T id="accounts.newAccountConfirmations" m="Create new account" />
            }
            modalComponent={AddAccountModal}
            onSubmit={onGetNextAccountAttempt}
            buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
          />
        </WatchOnlyWarnNotification>
      }
    />
  )
);

const AccountsPage = () => {
  const {
    isCreateAccountDisabled,
    onGetNextAccountAttempt
  } = useAccountsPage();

  return (
    <StandalonePage
      header={
        <AccountsPageHeader
          {...{ isCreateAccountDisabled, onGetNextAccountAttempt }}
        />
      }>
      <AccountsList />
    </StandalonePage>
  );
};

export default AccountsPage;
