import { FormattedMessage as T } from "react-intl";
import styles from "./indicators.module.css";

export default () => (
  <div className={styles.noTicketsIndicator}>
    <T id="noTickets.description" m="No Tickets Found" />
  </div>
);
