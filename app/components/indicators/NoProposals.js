import { FormattedMessage as T } from "react-intl";
import styles from "./indicators.module.css";

export default () => (
  <div className={styles.noProposals}>
    <T id="noProposals.description" m="No Proposals Available" />
  </div>
);
