import { classNames } from "pi-ui";
import styles from "./SeedArea.module.css";

const SeedArea = ({ className, children }) => (
  <div className={classNames(styles.seedArea, className)}>{children}</div>
);
export default SeedArea;
