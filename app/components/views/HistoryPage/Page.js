import React from "react";
import TxHistory from "../../TxHistory";
import Balance from "../../Balance";
import Header from "../../Header";
import Select from "react-select";
import { defineMessages, FormattedMessage as T, injectIntl } from "react-intl";
import "../../../style/Layout.less";
import "../../../style/HistoryPage.less";

const messages = defineMessages({
  typePlaceholder: {
    id: "history.txTypePlaceholder",
    defaultMessage: "Select type...",
  },
});

const Page = ({
                spendableTotalBalance,
                selectedType,
                txTypes,
                paginatedTxs,
                currentPage,
                totalPages,
                intl,
                onChangeSelectedType,
                onPageBackward,
                onPageForward,
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
          <div className="history-select-tx-types-label"><T id="history.txTypeLabel" m="Tx Type" />:</div>
          <div className="history-select-tx-types">
            <EyeFilterMenu
              valueKey="value" labelKey="label"
              options={txTypes}
              onChange={onChangeSelectedType}
              labelKey="label"
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
      <div className="history-content-title-buttons-area">
        <button
          className="history-content-title-buttons-left"
          disabled={currentPage < 1}
          onClick={onPageBackward}
        >&lt;</button>
        <span className="history-content-title-buttons-text">
              <T id="history.paginationPages" m="{current} of {total}"
                 values={{ current: currentPage + 1, total: totalPages }} />
            </span>
        <button
          className="history-content-title-buttons-right"
          disabled={(currentPage + 1) >= totalPages}
          onClick={onPageForward}
        >&gt;</button>
      </div>
    </div>
  </div>
);

export default Page;
