import { classNames } from "pi-ui";
import styles from "./Row.module.css";

const Row = ({ className, children }) => (
  <div className={classNames(className, styles.row)}>{children}</div>
);

export default Row;
