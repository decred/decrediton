import styles from "./DataLine.module.css";

const DataLine = ({ children }) => (
  <div className={styles.spec}>
    <div className={styles.specName}>{children[0]}</div>
    <div className={styles.specValue}>{children[1]}</div>
  </div>
);

export default DataLine;
