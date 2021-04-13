import { classNames } from "pi-ui";
import styles from "./ButtonsBar.module.css";

const ButtonsBar = ({ className, children }) => (
  <div className={classNames(className, styles.buttonsBar)}>{children}</div>
);

export default ButtonsBar;
