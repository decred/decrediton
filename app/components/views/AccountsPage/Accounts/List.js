import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import AccountRow from "./AccountRow";
import { DecredLoading } from "indicators";
import { InfoModalButton, PassphraseModalButton } from "buttons";
import { BalanceOverviewModalContent, AddAccountModalContent } from "modals";

const AccountsList = ({
  routes,
  accounts,
  isLoading,
  onGetNextAccountAttempt,
  onShowAccount,
  onHideAccount,
  onRenameAccount,
  onShowAccountDetails,
  onHideAccountDetails,
  accountNumDetailsShown,
}) => (
  <Aux>
    <TabbedHeader {...{ routes }}>
      <PassphraseModalButton
        modalTitle={<T id="accounts.newAccountConfirmations" m="Create new account" />}
        modalComponent={AddAccountModalContent}
        className="content-send"
        onSubmit={onGetNextAccountAttempt}
        buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
      />
    </TabbedHeader>
    <div className="tabbed-page">
      <div className="tab-content">
      { isLoading ? <DecredLoading/> :
        <div className="tab-card">
          <div className="account-content-title-buttons-area">
            <InfoModalButton
              modalTitle={<h1><T id="accounts.balanceInfo" m="Balance Information" /></h1>}
              modalContent={<BalanceOverviewModalContent />}
            />
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
              />
            ))}
          </div>
        </div> }
      </div>
    </div>
  </Aux>
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
};

export default AccountsList;
