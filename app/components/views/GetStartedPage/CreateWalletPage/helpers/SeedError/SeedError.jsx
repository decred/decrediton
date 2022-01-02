import styles from "./SeedError.module.css";
import { classNames } from "pi-ui";

const SeedError = ({ className, children }) => (
  <div className={classNames(styles.seedError, className)}>{children}</div>
);
export default SeedError;
