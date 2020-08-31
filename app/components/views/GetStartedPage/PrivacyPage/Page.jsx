import TopLevelPrivacyOptions from "./TopLevelOptions";
import CustomPrivacyOptions from "./CustomPrivacyOptions";
import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

export default ({ showCustomPrivacy, isTestNet, ...props }) => (
  <div
    data-testid="getstarted-pagebody"
    className={classNames(
      styles.pageBody,
      styles.getstarted,
      isTestNet && styles.testnetBody
    )}>
    <div className={styles.getstartedNew}>
      {!showCustomPrivacy ? (
        <TopLevelPrivacyOptions {...props} />
      ) : (
        <CustomPrivacyOptions {...props} />
      )}
    </div>
  </div>
);
