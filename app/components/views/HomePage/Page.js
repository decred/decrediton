// @flow
import React from "react";
import ReactToolTip from "react-tooltip";
import rescan from "../../../connectors/rescan";
import home from "../../../connectors/home";
import RescanProgress from "./RescanProgress";
import DecredLoading from "../../DecredLoading";
import KeyBlueButton from "../../KeyBlueButton";
import Balance from "../../Balance";
import SideBar from "../../SideBar";
import TxHistory from "../../TxHistory";
import Header from "../../Header";
import "../../fonts.css";
import "../../../style/HomePage.less";

const HomePage = ({
  synced,
  rescanRequest,
  spendableTotalBalance,
  rescanAttempt,
  mined,
  unmined,
  getTransactionsRequestAttempt,
  getAccountsResponse
}) => (
  <div className="home-body">
    <SideBar />
    <div className="home-view">
      {rescanRequest ? (
        <Header
          headerTitleOverview="Rescanning"
          headerMetaOverview={<RescanProgress/>}
        />
      ) : (
        <Header
          headerTop={synced ? null : (
            <div key="notSynced" className="home-view-notification-not-synced">
              The wallet is not fully synced yet. Note: Balances will not be accurate until syncing is complete.
            </div>
          )}
          headerTitleOverview="Available Balance"
          headerMetaOverview={
            <div>
              <Balance amount={spendableTotalBalance} />
              <div className="home-rescan-button-area" data-tip="Rescanning the blockchain may resolve some balance errors.">
                <KeyBlueButton onClick={() => rescanAttempt(0)}>Rescan</KeyBlueButton>
              </div>
              <ReactToolTip place="left" type="info" effect="solid"/>
            </div>
          }
        />
      )}
      {getTransactionsRequestAttempt ? (
        <div className="home-content"><DecredLoading/></div>
      ) : (
        <div className="home-content">
          <div className="home-content-title">
            <div className="home-content-title-text">Recent Transactions</div>
          </div>
          <div className="home-content-nest">
            {(mined.length > 0 || unmined.length > 0) ? (
              <TxHistory {...{ getAccountsResponse, mined, unmined }} />
            ) : (
              <p>No transactions</p>
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
