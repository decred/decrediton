import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { Link } from "react-router-dom";
import styles from "./TutorialsTab.module.css";

export const TutorialsTab = () => (
  <>
    <Subtitle title={<T id="tutorials.subtitle" m="Tutorials" />} />
    <div className={styles.overviewNoTickets}>
      <Link to="/tutorial/staking" className={styles.whatIsStaking}>
        <T id="tutorials.staking" m="What is Staking (Proof-of-Stake)?" /> →
      </Link>
      <Link to="/tutorial/ticketLifecycle" className={styles.ticketLifeCycle}>
        <T
          id="tutorials.ticketLifecycle"
          m="Learn About the Ticket Lifecycle"
        />{" "}
        →
      </Link>
    </div>
  </>
);
