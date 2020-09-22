import { DecredLoading } from "indicators";
import { TxHistory } from "shared";
import { FormattedMessage as T } from "react-intl";
import { Link } from "react-router-dom";
import { classNames } from "pi-ui";
import styles from "./RecentTickets.module.css";
import sharedStyles from "../HomePage.module.css";

const RecentTickets = ({
  tickets,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber,
  goToMyTickets,
  tsDate
}) =>
  getTransactionsRequestAttempt ? (
    <DecredLoading />
  ) : (
    <div className={styles.ticketTxWrapper}>
      <div className={classNames(styles.homeContentTitle, sharedStyles.isRow)}>
        {tickets.length > 0 ? (
          <T id="home.ticketActivityTitle" m="Staking Activity" />
        ) : (
          <T id="home.noTickets.title" m="No tickets yet" />
        )}
        {tickets.length > 0 && (
          <div className={styles.homeContentLink}>
            <a onClick={goToMyTickets}>
              <T id="home.ticketActivityHistory" m="See all" /> &#8594;
            </a>
          </div>
        )}
      </div>
      {tickets.length > 0 ? (
        <TxHistory
          overview
          limit={rowNumber}
          {...{ getAccountsResponse, transactions: tickets, tsDate }}
        />
      ) : (
        <div className={styles.overviewNoTickets}>
          <Link to="/tutorial/staking" className={styles.whatIsStaking}>
            <T id="home.noTickets.staking" m="What is Staking (Proof-of-Stake)?" /> →
          </Link>
          <Link to="/tutorial/ticketLifecycle" className={styles.ticketLifeCycle}>
            <T id="home.noTickets.lifecycle" m="Learn About the Ticket Lifecycle" /> →
          </Link>
        </div>
      )}
    </div>
  );

export default RecentTickets;
