import styles from "./GetStarted.module.css";

const GetStarted = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  children
}) => (
  <div className={styles.header}>
    <div className={styles.top}>{headerTop}</div>
    <div className={styles.titleOverview}>{headerTitleOverview}</div>
    <div className={styles.metaOverview}>{headerMetaOverview}</div>
    {children}
  </div>
);

export default GetStarted;
