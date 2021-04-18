import { classNames } from "pi-ui";
import styles from "./FormContainer.module.css";

const FormContainer = ({ className, children }) => (
  <div className={classNames(className, styles.form)}>{children}</div>
);

export default FormContainer;
