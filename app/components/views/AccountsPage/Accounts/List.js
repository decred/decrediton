import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import AccountRow from "./AccountRow";
import DecredLoading from "DecredLoading";
import KeyBlueButton from "KeyBlueButton";
import BalanceOverviewInfoModal from "BalanceOverviewInfoModal";
import PurchaseTicketsInfoButton from "PurchaseTicketsInfoButton";

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
  isShowingBalanceOverviewInfoModal,
  onShowBalanceOverviewInfoModal,
  onCloseBalanceOverviewInfoModal,
}) => (
  <Aux>
    <TabbedHeader {...{ routes }}>
      <KeyBlueButton onClick={onToggleAddAccount}>
        <T id="accounts.addNewButton" m="Add New" />
      </KeyBlueButton>
    </TabbedHeader>
    <div className="tabbed-page">
      { isShowingBalanceOverviewInfoModal ? <BalanceOverviewInfoModal closeModal={onCloseBalanceOverviewInfoModal} /> :
        isLoading ? <DecredLoading/> :
        <div className="tab-card">
          <div className="account-content-title">
            <div className="account-content-title-buttons-area">
              <PurchaseTicketsInfoButton onClick={onShowBalanceOverviewInfoModal} tooltipText={<T id="accounts.balanceInfo" m="Balance Information"/>}/>
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
  </Aux>
);

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isShowingBalanceOverviewInfoModal: PropTypes.bool.isRequired,
  onToggleAddAccount: PropTypes.func.isRequired,
  onShowAccount: PropTypes.func.isRequired,
  onHideAccount: PropTypes.func.isRequired,
  onRenameAccount: PropTypes.func.isRequired,
  onShowAccountDetails: PropTypes.func.isRequired,
  onHideAccountDetails: PropTypes.func.isRequired,
  accountNumDetailsShown: PropTypes.number,
  onShowBalanceOverviewInfoModal: PropTypes.func.isRequired,
  onCloseBalanceOverviewInfoModal: PropTypes.func.isRequired,
};

export default AccountsList;
