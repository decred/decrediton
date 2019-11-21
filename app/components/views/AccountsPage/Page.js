import { FormattedMessage as T } from "react-intl";
import { StandalonePage, StandaloneHeader } from "layout";
import AccountRow from "./AccountRow";
import { DecredLoading } from "indicators";
import { InfoDocModalButton, PassphraseModalButton } from "buttons";
import { AddAccountModal } from "modals";
import { WatchOnlyWarnNotification, Subtitle } from "shared";

const AccountsListHeader = ({ onGetNextAccountAttempt, isCreateAccountDisabled }) => <StandaloneHeader
  title={<T id="accounts.title" m=" Accounts" />}
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

const subtitleInfoIcon = () => (
  <div className="account-content-title-buttons-area">
    <InfoDocModalButton document="BalanceOverviewInfo" modalClassName="info-modal-fields" double draggable/>
  </div>
);

const subtitleWalletName = ({ walletName }) => (
  <span>
    <span className="wallet-name">{walletName}</span>
    <T id="accounts.subtitle" m="Accounts"/>
  </span>
);

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
  walletName,
  hasTickets
}) => (
  <StandalonePage header={<AccountsListHeader {...{ onGetNextAccountAttempt, isCreateAccountDisabled }} />}>
    { isLoading ? <DecredLoading/> :
      <>
        <Subtitle title={subtitleWalletName({ walletName })} className={"is-row"} children={subtitleInfoIcon()} />
        <div className="account-content-nest">
          {accounts.map(account => (
            <AccountRow {...{
              hasTickets, account, accountNumDetailsShown, onGetAccountExtendedKey, accountExtendedKey
            }}
            key={account.accountName}
            renameAccount={onRenameAccount}
            hideAccount={onHideAccount}
            showAccount={onShowAccount}
            showAccountDetails={onShowAccountDetails}
            hideAccountDetails={onHideAccountDetails}
            />
          ))}
        </div>
      </> }
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
  isCreateAccountDisabled: PropTypes.bool.isRequired
};

export default AccountsList;
