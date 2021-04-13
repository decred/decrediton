import { classNames } from "pi-ui";
import styles from "./Label.module.css";

const Label = ({ className, children }) => (
  <div className={classNames(className, styles.label)}>{children}</div>
);

export default Label;
