import { useState } from "react";
import styles from "./EligibleTickets.module.css";
import { classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";

const EligibleTickets = ({ tickets }) => {
  const [isExapnded, setIsExpanded] = useState();
  const numOfTickets = tickets.length;
  const toggleExapndedHandler = () => setIsExpanded(!isExapnded);
  return (
    <div className={styles.wrapper} onClick={toggleExapndedHandler}>
      <div className={classNames(styles.header, isExapnded && styles.expanded)}>
        <div>
          <T
            id="proposals.detail.wallet.eligible.header"
            m="Tickets eligible for voting: "
          />
          <span className={styles.total}>{`${numOfTickets}`} total</span>
        </div>
        <div className={styles.arrow}></div>
      </div>
      {isExapnded && <div>Hellyeah</div>}
    </div>
  );
};

export default EligibleTickets;
