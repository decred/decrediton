import { FormattedMessage as T } from "react-intl";
import styles from "./indicators.module.css";

export default () => (
  <div className={styles.noStatsIndicator}>
    <T id="noStats.description" m="No Statistics Available" />
  </div>
);
