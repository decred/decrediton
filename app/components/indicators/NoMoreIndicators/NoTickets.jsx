import { FormattedMessage as T } from "react-intl";
import styles from "./NoMoreIndicators.module.css";

export default () => (
  <div className={styles.noTicketsIndicator}>
    <T id="noTickets.description" m="No Tickets Found" />
  </div>
);
