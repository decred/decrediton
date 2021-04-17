import { classNames } from "pi-ui";
import styles from "./PrivacyOptions.module.css";

const PrivacyOptions = ({ className, children }) => (
  <div className={classNames(className, styles.options)}>
    {children}
  </div>
);

export default PrivacyOptions;
