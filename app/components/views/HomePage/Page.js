// @flow
import React from "react";
import ReactToolTip from "react-tooltip";
import rescan from "../../../connectors/rescan";
import home from "../../../connectors/home";
import DecredLoading from "../../DecredLoading";
import KeyBlueButton from "../../KeyBlueButton";
import Balance from "../../Balance";
import SideBar from "../../SideBar";
import TxHistory from "../../TxHistory";
import Header from "../../Header";
import { FormattedMessage } from "react-intl";
import "../../../style/Layout.less";
import "../../../style/Fonts.less";
import "../../../style/HomePage.less";

const HomePage = ({
  synced,
  spendableTotalBalance,
  rescanAttempt,
  rescanRequest,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse
}) => (
  <div className="page-body">
    <SideBar />
    <div className="page-view">
      <Header
        headerTop={synced ? null : (
          <div key="notSynced" className="home-view-notification-not-synced">
            <FormattedMessage id="home.notSyncedInfo" defaultMessage="The wallet is not fully synced yet. Note: Balances will not be accurate until syncing is complete." />
          </div>
        )}
        headerTitleOverview={<FormattedMessage id="home.availableBalanceTitle" defaultMessage="Available Balance" />}
        headerMetaOverview={
          <div>
            <Balance amount={spendableTotalBalance} />
            <div className="home-rescan-button-area" data-html={true} data-tip="Rescanning may help resolve some balance errors.<br><br><b>Note:</b> This scans the entire blockchain for transactions,<br>but does not re-download it.">
              <KeyBlueButton disabled={rescanRequest} onClick={() => rescanAttempt(0)}>
                <FormattedMessage id="home.rescanBtn" defaultMessage="Rescan Blockchain" />
              </KeyBlueButton>
            </div>
            <ReactToolTip disable={rescanRequest ? true : false} place="left" type="info" effect="solid"/>
          </div>
        }
      />
      {getTransactionsRequestAttempt ? (
        <div className="page-content"><DecredLoading/></div>
      ) : (
        <div className="page-content">
          <div className="home-content-title">
            <div className="home-content-title-text">
              <FormattedMessage id="home.recentTransactionsTitle" defaultMessage="Recent Transactions" />
            </div>
          </div>
          <div className="home-content-nest">
            {(transactions.length > 0) ? (
              <TxHistory {...{ getAccountsResponse, transactions }} />
            ) : (
              <p><FormattedMessage id="home.noTransactions" defaultMessage="No transactions" /></p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
