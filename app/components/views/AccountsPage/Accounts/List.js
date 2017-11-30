import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import AccountRow from "./AccountRow";
import DecredLoading from "DecredLoading";
import KeyBlueButton from "KeyBlueButton";
import InfoModalButton from "InfoModalButton";
import { BalanceOverviewModalContent } from "modals";

const AccountsList = ({
  routes,
  accounts,
  isLoading,
  onToggleAddAccount,
  onShowAccount,
  onHideAccount,
  onRenameAccount,
  onShowAccountDetails,
  onHideAccountDetails,
  accountNumDetailsShown,
}) => (
  <Aux>
    <TabbedHeader {...{ routes }}>
      <KeyBlueButton onClick={onToggleAddAccount}>
        <T id="accounts.addNewButton" m="Add New" />
      </KeyBlueButton>
    </TabbedHeader>
    <div className="tabbed-page">
      <div className="tab-content">
      { isLoading ? <DecredLoading/> :
        <div className="tab-card">
          <div className="account-content-title">
            <div className="account-content-title-buttons-area">
              <InfoModalButton
                modalTitle={<h1><T id="accounts.balanceInfo" m="Balance Information" /></h1>}
                modalContent={<BalanceOverviewModalContent />}
              />
            </div>
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
  onToggleAddAccount: PropTypes.func.isRequired,
  onShowAccount: PropTypes.func.isRequired,
  onHideAccount: PropTypes.func.isRequired,
  onRenameAccount: PropTypes.func.isRequired,
  onShowAccountDetails: PropTypes.func.isRequired,
  onHideAccountDetails: PropTypes.func.isRequired,
  accountNumDetailsShown: PropTypes.number,
};

export default AccountsList;
