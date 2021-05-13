import styles from "./PageHeader.module.css";

const PageHeader = ({ title, optionalButton, description }) => (
  <div className={styles.header}>
    <div className={styles.title}>{title}</div>
    <div className={styles.description}>{description}</div>
    {optionalButton}
  </div>
);

export default PageHeader;
