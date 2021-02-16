import styles from "./SimpleLoading.module.css";
import { classNames } from "pi-ui";

const SimpleLoading = ({ disabled }) => (
  <div className={classNames(styles.spinner, disabled && styles.disabled)}>
    <div className={styles.bounce1}></div>
    <div className={styles.bounce2}></div>
    <div className={styles.bounce3}></div>
  </div>
);

export default SimpleLoading;
