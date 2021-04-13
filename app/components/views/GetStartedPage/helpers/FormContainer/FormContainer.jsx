import { classNames } from "pi-ui";
import styles from "./FormContainer.module.css";

const Input = ({ className, children }) => (
  <div className={classNames(className, styles.form)}>{children}</div>
);

export default Input;
