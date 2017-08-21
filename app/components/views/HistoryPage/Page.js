// @flow
import React from "react";
import ErrorScreen from "../../ErrorScreen";
import SideBar from "../../SideBar";
import TxHistory from "../../TxHistory";
import Balance from "../../Balance";
import TxDetails from "./../TxDetails";
import Header from "../../Header";
import { HistoryStyles } from "../ViewStyles";
import Select from "react-select";

const Page = ({
  walletService,
  transactionDetails,
  detailType,
  spendableTotalBalance,
  selectedType,
  txTypes,
  paginatedTxs,
  currentPage,
  totalPages,
  getAccountsResponse,
  getNetworkResponse,
  onChangeSelectedType,
  onShowTxDetail,
  onClearTxDetail,
  onPageBackward,
  onPageForward
}) => (
  !walletService ? <ErrorScreen /> : (
    <div style={HistoryStyles.body}>
      <SideBar />
      {transactionDetails ? (
        <TxDetails
          tx={transactionDetails}
          clearTxDetails={onClearTxDetail}
          {...{ detailType, getAccountsResponse, getNetworkResponse}}
        />
      ) : (
        <div style={HistoryStyles.view}>
          <Header
            headerTitleOverview="Available Balance"
            headerMetaOverview={<Balance amount={spendableTotalBalance} />}
          />
          <div style={HistoryStyles.content}>
            <div style={HistoryStyles.contentTitle}>
              <div style={HistoryStyles.contentTitleText}>Recent Transactions</div>
              <div style={HistoryStyles.selectTxTypesArea}>
                <div style={HistoryStyles.selectTxTypesLabel}>Tx Type:</div>
                <div style={HistoryStyles.selectTxTypes}>
                  <Select
                    clearable={false}
                    style={{zIndex:"9"}}
                    onChange={onChangeSelectedType}
                    placeholder={"Select type..."}
                    multi={false}
                    value={selectedType}
                    valueKey="value" labelKey="label"
                    options={txTypes}/>
                </div>
              </div>
            </div>
            <div style={HistoryStyles.contentNest}>
              {paginatedTxs.length > 0 ? (
                <TxHistory
                  getAccountsResponse={getAccountsResponse}
                  mined={paginatedTxs}
                  showTxDetail={onShowTxDetail}
                />
              ) : <p>No transactions</p>}
            </div>
            <div style={HistoryStyles.contentTitleButtonsArea}>
              <button
                style={HistoryStyles.contentTitleButtonsLeft}
                disabled={currentPage < 1}
                onClick={onPageBackward}
              >&lt;</button>
              <span style={HistoryStyles.contentTitleButtonsText}>{currentPage + 1} of {totalPages}</span>
              <button
                style={HistoryStyles.contentTitleButtonsRight}
                disabled={(currentPage + 1) >= totalPages}
                onClick={onPageForward}
              >&gt;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
);

export default Page;
