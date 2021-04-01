import { FormattedMessage as T } from "react-intl";
import styles from "./VotedCheckmark.module.css";

const VotedCheckmark = () => (
  <div className={styles.votedCheckmark}>
    <T id="proposals.votedCheckmark.label" m="Voted" />
    <div className={styles.checkmark}></div>
  </div>
);

export default VotedCheckmark;
