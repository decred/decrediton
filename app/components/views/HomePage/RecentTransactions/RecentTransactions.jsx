import { DecredLoading } from "indicators";
import { FormattedMessage as T } from "react-intl";
import { ExternalLink } from "shared";
import { Link } from "react-router-dom";
import { TxHistory } from "shared";
import { classNames } from "pi-ui";
import styles from "./RecentTransactions.module.css";
import sharedStyles from "../HomePage.module.css";

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
    <div className={styles.wrapper}>
      <div className={classNames(sharedStyles.isRow, styles.homeContentTitle)}>
        {hasTxs ? (
          <T id="home.recentTransactionsTitle" m="Recent Transactions" />
        ) : (
          <T id="home.noTransactions.title" m="No transactions yet" />
        )}
        {hasTxs && (
          <div className={styles.homeContentLink}>
            <a onClick={goToTransactionHistory}>
              <T id="home.recentTransactionsHistory" m="See all" /> &#8594;
            </a>
          </div>
        )}
      </div>
      <div>
        {transactions.length > 0 ? (
          <TxHistory
            {...{ transactions, tsDate, overview: true, limit: rowNumber }}
          />
        ) : (
          <div className={styles.overviewNoTransactions}>
            <Link to="/transactions/receive" className={styles.receive}>
              <T
                id="home.noTransactions.receiveLink"
                m="Generate a DCR Address for receiving funds"
              />{" "}
              →
            </Link>
            <ExternalLink
              href="https://decred.org/exchanges"
              className={styles.buy}>
              <T
                id="home.noTransactions.buyFromExchanges"
                m="Buy Decred from Exchanges"
              />{" "}
              →
            </ExternalLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
