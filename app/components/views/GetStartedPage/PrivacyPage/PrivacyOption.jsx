import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

const PrivacyOption = ({ title, description, icon, onClick }) => (
  <div className={styles.privacyOption} onClick={onClick}>
    <div className={classNames(styles.privacyOptionIcon, styles[icon])} />
    <div className={styles.privacyTextContainer}>
      <div className={styles.privacyOptionTitle}>{title}</div>
      <div className={styles.privacyOptionDescription}>{description}</div>
    </div>
  </div>
);

export default PrivacyOption;
