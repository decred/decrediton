import React from "react";
import SideBar from "../../SideBar";
import TxHistory from "../../TxHistory";
import Balance from "../../Balance";
import TxDetails from "./../TxDetails";
import Header from "../../Header";
import Select from "react-select";
import "../../../style/HistoryPage.less";

const Page = ({
  network,
  transactionDetails,
  spendableTotalBalance,
  selectedType,
  txTypes,
  paginatedTxs,
  currentPage,
  totalPages,
  getAccountsResponse,
  onChangeSelectedType,
  onShowTxDetail,
  onClearTxDetail,
  onPageBackward,
  onPageForward
}) => (
  <div className="history-body">
    <SideBar />
    {transactionDetails ? (
      <TxDetails tx={transactionDetails} {...{ getAccountsResponse, onClearTxDetail }} />
    ) : (
      <div className="history-view">
        <Header
          headerTitleOverview="Available Balance"
          headerMetaOverview={<Balance amount={spendableTotalBalance} />}
        />
        <div className="history-content">
          <div className="history-content-title">
            <div className="history-content-title-text">Recent Transactions</div>
            <div className="history-select-tx-types-area">
              <div className="history-select-tx-types-label">Tx Type:</div>
              <div className="history-select-tx-types">
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
          <div className="history-content-nest">
            {paginatedTxs.length > 0 ? (
              <TxHistory
                getAccountsResponse={getAccountsResponse}
                mined={paginatedTxs}
                showTxDetail={onShowTxDetail}
                network={network}
              />
            ) : <p>No transactions</p>}
          </div>
          <div className="history-content-title-buttons-area">
            <button
              className="history-content-title-buttons-left"
              disabled={currentPage < 1}
              onClick={onPageBackward}
            >&lt;</button>
            <span className="history-content-title-buttons-text">{currentPage + 1} of {totalPages}</span>
            <button
              className="history-content-title-buttons-right"
              disabled={(currentPage + 1) >= totalPages}
              onClick={onPageForward}
            >&gt;</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default Page;
