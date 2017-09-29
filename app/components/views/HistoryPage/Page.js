import React from "react";
import SideBar from "../../SideBar";
import TxHistory from "../../TxHistory";
import Balance from "../../Balance";
import Header from "../../Header";
import Select from "react-select";
import { FormattedMessage } from "react-intl";
import "../../../style/Layout.less";
import "../../../style/HistoryPage.less";

const Page = ({
  spendableTotalBalance,
  selectedType,
  txTypes,
  paginatedTxs,
  currentPage,
  totalPages,
  onChangeSelectedType,
  onPageBackward,
  onPageForward
}) => (
  <div className="page-body">
    <SideBar />
      <div className="page-view">
        <Header
          headerTitleOverview={<FormattedMessage id="history.availableBalanceTitle" defaultMessage="Available Balance" />}
          headerMetaOverview={<Balance amount={spendableTotalBalance} />}
        />
        <div className="page-content">
          <div className="history-content-title">
            <div className="history-content-title-text">
              <FormattedMessage id="history.title" defaultMessage="Recent Transactions" />
            </div>
            <div className="history-select-tx-types-area">
              <div className="history-select-tx-types-label"><FormattedMessage id="history.txTypeLabel" defaultMessage="Tx Type" />:</div>
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
                transactions={paginatedTxs}
              />
            ) : <p><FormattedMessage id="history.noTransactions" defaultMessage="No transactions" /> </p>}
          </div>
          <div className="history-content-title-buttons-area">
            <button
              className="history-content-title-buttons-left"
              disabled={currentPage < 1}
              onClick={onPageBackward}
            >&lt;</button>
            <span className="history-content-title-buttons-text">
              <FormattedMessage id="history.paginationPages" defaultMessage="{current} of {total}"
                values={{current: currentPage+1, total: totalPages}} />
            </span>
            <button
              className="history-content-title-buttons-right"
              disabled={(currentPage + 1) >= totalPages}
              onClick={onPageForward}
            >&gt;</button>
          </div>
        </div>
      </div>
  </div>
);

export default Page;
