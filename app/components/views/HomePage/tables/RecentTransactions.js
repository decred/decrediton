// @flow
import { home } from "connectors";
import { DecredLoading } from "indicators";
import { FormattedMessage as T } from "react-intl";
import "style/HomePage.less";
import NoTransactionsLinks from "./NoTransactionsLinks";
import { TxHistory } from "shared";

const RecentTransactions = ({
  transactions,
  getTransactionsRequestAttempt,
  rowNumber,
  goToTransactionHistory,
  tsDate
}) => {
  const hasTxs = transactions.length > 0;
  return getTransactionsRequestAttempt ? (
    <DecredLoading />
  ) : (
    <div>
      <div className="home-content-title is-row">
        {hasTxs ? (
          <T id="home.recentTransactionsTitle" m="Recent Transactions" />
        ) : (
          <T id="home.noTransactions.title" m="No transactions yet" />
        )}
        {hasTxs && (
          <div className="home-content-link">
            <a onClick={goToTransactionHistory}>
              <T id="home.recentTransactionsHistory" m="See all" /> &#8594;
            </a>
          </div>
        )}
      </div>
      <div className="home-content-nest">
        {transactions.length > 0 ? (
          <TxHistory
            {...{ transactions, tsDate, overview: true, limit: rowNumber }}
          />
        ) : (
          <NoTransactionsLinks />
        )}
      </div>
    </div>
  );
};

export default home(RecentTransactions);
