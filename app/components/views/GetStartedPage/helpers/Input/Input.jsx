import { classNames } from "pi-ui";
import styles from "./Input.module.css";

const Input = ({ className, children }) => (
  <div className={classNames(className, styles.input)}>{children}</div>
);

export default Input;
