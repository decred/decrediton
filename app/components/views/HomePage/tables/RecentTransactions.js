// @flow
import { home } from "connectors";
import { DecredLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";
import NoTransactionsLinks from "./NoTransactionsLinks";

const RecentTransactions = ({
  tickets,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber,
  goToTransactionHistory
}) => {
  const hasTxs = (transactions.length > 0) && (tickets.length > 0);
  return (
    getTransactionsRequestAttempt ? <DecredLoading /> :
      <Aux>
        <div className="home-content-title">
          {hasTxs
            ? <T id="home.recentTransactionsTitle" m="Recent Transactions" />
            : <T id="home.noTransactions.title" m="No transactions yet" /> }
        </div>
        <div className="home-content-nest">
          {transactions.length > 0 ? tickets.length > 0 ?
            <TxHistory overview limit={rowNumber} {...{ getAccountsResponse, transactions }} /> :
            <TxHistory limit={6} {...{ getAccountsResponse, transactions }} /> :
            <NoTransactionsLinks />}
        </div>
        <div className="home-content-link">
          <a onClick={goToTransactionHistory}><T id="home.recentTransactionsHistory" m="Go to all transactions" /> ></a>
        </div>
      </Aux>
  );
};

export default home(RecentTransactions);
