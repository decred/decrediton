import TxHistory from "TxHistory";
import EyeFilterMenu from "EyeFilterMenu";
import Paginator from "Paginator";
import { FormattedMessage as T } from "react-intl";
import "style/HistoryPage.less";

const Page = ({
                txTypes,
                transactions,
                onChangeSelectedType,
                onLoadMoreTransactions,
              }) => (
  <div className="tab-card">
    <div className="history-content-title">
      <div className="history-content-title-text">
        <T id="history.title" m="Recent Transactions" />
      </div>
      <div className="history-select-tx-types-area">
        <div className="history-select-tx-types">
          <EyeFilterMenu
            valueKey="value"
            labelKey="label"
            keyField="key"
            options={txTypes}
            onChange={onChangeSelectedType}
          />
        </div>
      </div>
    </div>
    <div className="history-content-nest">
      {transactions.length > 0 ? (
        <TxHistory
          transactions={transactions}
        />
      ) : <p><T id="history.noTransactions" m="No transactions" /></p>}
    </div>
    <button onClick={onLoadMoreTransactions}>MOAH TRANSACTIONS</button>
  </div>
);

export default Page;
