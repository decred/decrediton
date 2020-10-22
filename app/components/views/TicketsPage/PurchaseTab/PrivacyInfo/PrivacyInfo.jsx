import { PrivacyForm } from "shared";
import { FormattedMessage as T } from "react-intl";
import styles from "../PurchaseTab.module.css";

const StakeInfo = () => (
  <div className={styles.privacyArea}>
    <div className={styles.title}>
      <T id="stake.stackingOverview" m="Privacy Settings" />
    </div>
    <PrivacyForm className={styles.privacyForm} />
  </div>
);

export default StakeInfo;
