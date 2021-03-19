import { classNames } from "pi-ui";
import styles from "./DescriptionHeader.module.css";

const DescriptionHeader = ({ description, actionButton, className }) => (
  <div className={classNames(styles.header, className)}>
    <div className={styles.actionButton}>{actionButton}</div>
    {description}
  </div>
);

export default DescriptionHeader;
