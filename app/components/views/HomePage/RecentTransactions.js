// @flow
import { home } from "connectors";
import { DecredLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const RecentTransactions = ({
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
}) => {
  return (
    getTransactionsRequestAttempt ? <DecredLoading /> :
      <Aux>
        <div className="home-content-title">
          <T id="home.recentTransactionsTitle" m="Recent Transactions" />
        </div>
        <div className="home-content-nest">
          {transactions.length > 0 ?
            <TxHistory limit={5} {...{ getAccountsResponse, transactions }} /> :
            <p><T id="home.noTransactions" m="No transactions" /></p>}
        </div>
      </Aux>
  );
};

export default home(RecentTransactions);
