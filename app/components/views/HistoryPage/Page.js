import React from "react";
import TxHistory from "../../TxHistory";
import Balance from "../../Balance";
import Header from "../../Header";
import EyeFilterMenu from "../../EyeFilterMenu";
import Paginator from "../../Paginator";
import { FormattedMessage as T } from "react-intl";
import "../../../style/Layout.less";
import "../../../style/HistoryPage.less";

const Page = ({
                spendableTotalBalance,
                txTypes,
                paginatedTxs,
                currentPage,
                totalPages,
                onChangeSelectedType,
                onPageChanged,
                onLoadMoreTransactions
              }) => (
  <div className="page-view">
    <Header
      headerTitleOverview={<T id="history.availableBalanceTitle" m="Available Balance" />}
      headerMetaOverview={<Balance amount={spendableTotalBalance} />}
    />
    <div className="page-content">
      <div className="history-content-title">
        <div className="history-content-title-text">
          <T id="history.title" m="Recent Transactions" />
        </div>
        <div className="history-select-tx-types-area">
          <div className="history-select-tx-types">
            <EyeFilterMenu
              valueKey="value"
              labelKey="label"
              options={txTypes}
              onChange={onChangeSelectedType}
            />
          </div>
        </div>
      </div>
      <div className="history-content-nest">
        {paginatedTxs.length > 0 ? (
          <TxHistory
            transactions={paginatedTxs}
          />
        ) : <p><T id="history.noTransactions" m="No transactions" /></p>}
      </div>
      <button onClick={onLoadMoreTransactions}> MOAH TRANSACTIONS </button>
      <div className="history-content-title-buttons-area">
        <Paginator {...{totalPages, currentPage, onPageChanged}} />
      </div>
    </div>
  </div>
);

export default Page;
