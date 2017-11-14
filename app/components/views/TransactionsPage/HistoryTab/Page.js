import TxHistory from "TxHistory";
import EyeFilterMenu from "EyeFilterMenu";
import Paginator from "Paginator";
import { FormattedMessage as T } from "react-intl";
import "style/HistoryPage.less";

const Page = ({
                txTypes,
                paginatedTxs,
                currentPage,
                totalPages,
                onChangeSelectedType,
                onPageChanged,
              }) => (
  <div className="tab-card">
    <div className="history-content-title">
      <div className="history-content-title-text">
        <T id="history.title" m="Recent Transactions" />
      </div>
      <div className="history-select-tx-types-area">
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
      <Paginator {...{totalPages, currentPage, onPageChanged}} />
    </div>
  </div>
);

export default Page;
