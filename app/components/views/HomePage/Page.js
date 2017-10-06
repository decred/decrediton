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
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "../../../style/Layout.less";
import "../../../style/Fonts.less";
import "../../../style/HomePage.less";

const messages = defineMessages({
  rescanBtnTip: {
    id: "home.rescanBtn.tip",
    defaultMessage: `Rescanning may help resolve some balance errors.
      <br><br>Note: This scans the entire blockchain for transactions,
      but does not re-download it.`
  }
});

const HomePage = ({
  synced,
  spendableTotalBalance,
  rescanAttempt,
  rescanRequest,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  intl
}) => (
  <div className="page-body">
    <SideBar />
    <div className="page-view">
      <Header
        headerTop={synced ? null : (
          <div key="notSynced" className="home-view-notification-not-synced">
            <T id="home.notSyncedInfo" m="The wallet is not fully synced yet. Note: Balances will not be accurate until syncing is complete." />
          </div>
        )}
        headerTitleOverview={<T id="home.availableBalanceTitle" m="Available Balance" />}
        headerMetaOverview={
          <div>
            <Balance amount={spendableTotalBalance} />
            <div className="home-rescan-button-area"
              data-multiline={true}
              data-tip={intl.formatMessage(messages.rescanBtnTip)}>
              <KeyBlueButton disabled={rescanRequest} onClick={() => rescanAttempt(0)}>
                <T id="home.rescanBtn" m="Rescan Blockchain" />
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
              <T id="home.recentTransactionsTitle" m="Recent Transactions" />
            </div>
          </div>
          <div className="home-content-nest">
            {(transactions.length > 0) ? (
              <TxHistory {...{ getAccountsResponse, transactions }} />
            ) : (
              <p><T id="home.noTransactions" m="No transactions" /></p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default home(rescan(injectIntl(HomePage)));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
