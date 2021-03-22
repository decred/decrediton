import styles from "./StandalonePageBody.module.css";

const StandalonePageBody = ({ children }) => (
  <div className={styles.body}>{children}</div>
);

export default StandalonePageBody;
