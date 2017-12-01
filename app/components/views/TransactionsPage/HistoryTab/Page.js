import TxHistory from "TxHistory";
import EyeFilterMenu from "EyeFilterMenu";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import SlateGrayButton from "SlateGrayButton";
import "style/HistoryPage.less";

const Page = ({
                sortTypes,
                txTypes,
                transactions,
                noMoreTransactions,
                onChangeSelectedType,
                onChangeSortType,
                onLoadMoreTransactions,
              }) => (
  <div className="tab-card">
    <div className="history-content-title">
      <div className="history-content-title-text">
        <T id="history.title" m="Recent Transactions" />
      </div>
      <div className="history-select-tx-types-area">
        <div className="history-select-tx-types">
          <Tooltip tipWidth={ 300 } text={<T id="transactions.sortby.tooltip" m="Sort By" />}>
            <EyeFilterMenu
              labelKey="label"
              keyField="value"
              options={sortTypes}
              onChange={onChangeSortType}
              className="sort-by"
            />
          </Tooltip>
          <Tooltip tipWidth={ 300 } text={<T id="transactions.txtypes.tooltip" m="Transaction Type" />}>
            <EyeFilterMenu
              labelKey="label"
              keyField="key"
              options={txTypes}
              onChange={onChangeSelectedType}
            />
          </Tooltip>
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
    {!noMoreTransactions
      ? <SlateGrayButton onClick={onLoadMoreTransactions}><T id="history.moreTransactions" m="More Transactions" /></SlateGrayButton>
      : null}
  </div>
);

export default Page;
