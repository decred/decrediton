import { FormattedMessage as T } from "react-intl";
import { StandalonePage, StandaloneHeader } from "layout";
import AccountRow from "./AccountRow";
import { DecredLoading } from "indicators";
import { InfoDocModalButton, PassphraseModalButton } from "buttons";
import { AddAccountModal } from "modals";
import { WatchOnlyWarnNotification } from "shared";

const AccountsListHeader = ({ onGetNextAccountAttempt, isCreateAccountDisabled }) => <StandaloneHeader
  title={<T id="accounts.title" m="Accounts" />}
  description={<T id="accounts.description" m={"Accounts allow you to keep separate records of your DCR funds.\nTransferring DCR across accounts will create a transaction on the blockchain."}/>}
  iconClassName="accounts"
  actionButton={
    <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
      <PassphraseModalButton
        disabled={isCreateAccountDisabled}
        modalTitle={<T id="accounts.newAccountConfirmations" m="Create new account" />}
        modalComponent={AddAccountModal}
        onSubmit={onGetNextAccountAttempt}
        buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
      />
    </WatchOnlyWarnNotification>
  }
/>;

const AccountsList = ({
  accounts,
  isLoading,
  onGetNextAccountAttempt,
  onGetAccountExtendedKey,
  accountExtendedKey,
  onShowAccount,
  onHideAccount,
  onRenameAccount,
  onShowAccountDetails,
  onHideAccountDetails,
  accountNumDetailsShown,
  isCreateAccountDisabled,
}) => (
  <StandalonePage header={<AccountsListHeader {...{ onGetNextAccountAttempt, isCreateAccountDisabled }} />}>
    { isLoading ? <DecredLoading/> :
      <Aux>
        <div className="account-content-title-buttons-area">
          <InfoDocModalButton document="BalanceOverviewInfo" modalClassName="info-modal-fields" double/>
        </div>
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
              onGetAccountExtendedKey={onGetAccountExtendedKey}
              accountExtendedKey={accountExtendedKey}
            />
          ))}
        </div>
      </Aux> }
  </StandalonePage>
);

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onGetNextAccountAttempt: PropTypes.func.isRequired,
  onShowAccount: PropTypes.func.isRequired,
  onHideAccount: PropTypes.func.isRequired,
  onRenameAccount: PropTypes.func.isRequired,
  onShowAccountDetails: PropTypes.func.isRequired,
  onHideAccountDetails: PropTypes.func.isRequired,
  accountNumDetailsShown: PropTypes.number,
  isCreateAccountDisabled: PropTypes.bool.isRequired,
};

export default AccountsList;
