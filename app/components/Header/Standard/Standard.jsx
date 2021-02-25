import styles from "./Standard.module.css";

const Standard = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  children
}) => (
  <div>
    <div className={styles.top}>{headerTop}</div>
    <div className={styles.titleOverview}>{headerTitleOverview}</div>
    <div className={styles.metaOverview}>{headerMetaOverview}</div>
    {children}
  </div>
);

export default Standard;
