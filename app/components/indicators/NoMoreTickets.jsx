import { FormattedMessage as T } from "react-intl";
import styles from "./indicators.module.css";

export default () => (
  <div className={styles.noMoreTicketsIndicator}>
    <T id="noMoreTickets.description" m="No More Tickets" />
  </div>
);
