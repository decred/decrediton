import styles from "../ProposalDetails.module.css";
import { showCheck } from "helpers";

const OverviewField = showCheck(({ label, value }) => (
  <div className={styles.overviewField}>
    <div className={styles.label}>{label}:</div>
    <div className={styles.value}>{value}</div>
  </div>
));

export default OverviewField;
