import styles from "./DescriptionHeader.module.css";

const DescriptionHeader = ({ description, actionButton }) => (
  <div className={styles.header}>
    <div className={styles.actionButton}>{actionButton}</div>
    {description}
  </div>
);

export default DescriptionHeader;
