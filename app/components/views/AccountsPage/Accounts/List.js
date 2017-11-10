import React from "react";
import PropTypes from "prop-types";
import Header from "../../../Header";
import AccountRow from "./AccountRow";
import DecredLoading from "../../../DecredLoading";
import KeyBlueButton from "../../../KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import "../../../../style/Layout.less";
import "../../../../style/AccountsPage.less";
import BalanceOverviewInfoModal from "../../../BalanceOverviewInfoModal";
import PurchaseTicketsInfoButton from "../../../PurchaseTicketsInfoButton";

const AccountsList = ({
  accounts,
  isLoading,
  onShowAddAccount,
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
  <div className="page-view">
    <Header
      headerTitleOverview={<T id="accounts.title" m="Accounts" />}
      headerMetaOverview={
        <KeyBlueButton
          className="add-new-account-button"
          onClick={onShowAddAccount}>
          <T id="accounts.addNewButton" m="Add New" />
        </KeyBlueButton>
      }
    />
    {isShowingBalanceOverviewInfoModal ? <BalanceOverviewInfoModal closeModal={onCloseBalanceOverviewInfoModal} /> : null}
    <div className="page-content">
      {isLoading ? (
        <DecredLoading/>
      ) : (
        <div>
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
        </div>
      )}
    </div>
  </div>
);

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isShowingBalanceOverviewInfoModal: PropTypes.bool.isRequired,
  getNextAccountSuccess: PropTypes.object,
  getNextAccountError: PropTypes.object,
  renameAccountSuccess: PropTypes.object,
  renameAccountError: PropTypes.object,
  onShowAddAccount: PropTypes.func.isRequired,
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
