import { useState } from "react";
import styles from "./EligibleTickets.module.css";
import { classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { TxHistory } from "shared";

const EligibleTickets = ({ tickets, tsDate, voteChoice }) => {
  const [isExapnded, setIsExpanded] = useState();
  const numOfTickets = tickets.length;
  const hasTickets = numOfTickets > 0;
  const toggleExapndedHandler = () => setIsExpanded(!isExapnded);
  return (
    <div
      className={styles.wrapper}
      onClick={hasTickets && toggleExapndedHandler}>
      <div
        className={classNames(
          styles.header,
          isExapnded && styles.expanded,
          !hasTickets && styles.noTickets
        )}>
        <div>
          <T
            id="proposals.detail.wallet.eligible.header"
            m="Tickets eligible for voting: "
          />
          <span className={styles.total}>{`${numOfTickets}`} total</span>
        </div>
        <div className={styles.arrow}></div>
      </div>
      {isExapnded && hasTickets && (
        <div>
          <div className={styles.columnHeader}>
            <div>
              <T
                id="proposals.detail.wallet.eligible.headers.status"
                m="Ticket Status"
              />
            </div>
            <div>
              <T
                id="proposals.detail.wallet.eligible.header.preference"
                m="Vote Preference"
              />
            </div>
            <div>
              <T
                id="proposals.detail.wallet.eligible.headers.price"
                m="Price"
              />
            </div>
            <div>
              <T
                id="proposals.detail.wallet.eligible.headers.transaction"
                m="Transaction"
              />
            </div>
            <div>
              <T
                id="proposals.detail.wallet.eligible.headers.account"
                m="Account"
              />
            </div>
            <div>
              <T
                id="proposals.detail.wallet.eligible.headers.purchased"
                m="Purchased"
              />
            </div>
          </div>
          <TxHistory
            {...{
              transactions: tickets.map((ticket) => ({
                ...ticket,
                voteChoice
              })),
              tsDate,
              mode: "eligible"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EligibleTickets;
