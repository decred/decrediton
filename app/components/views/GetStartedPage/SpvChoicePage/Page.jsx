import TopLevelPrivacyOptions from "./TopLevelOptions";
import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

export default ({ isTestNet, ...props }) => (
  <div
    data-testid="getstarted-pagebody"
    className={classNames(
      styles.pageBody,
      styles.getstarted,
      isTestNet && styles.testnetBody
    )}>
    <div className={styles.getstartedNew}>
      <TopLevelPrivacyOptions {...props} />
    </div>
  </div>
);
