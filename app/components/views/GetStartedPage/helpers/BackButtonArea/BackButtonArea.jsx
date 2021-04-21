import { classNames } from "pi-ui";
import styles from "./BackButtonArea.module.css";

const BackButtonArea = ({ className, children }) => (
  <div className={classNames(className, styles.backButtonArea)}>{children}</div>
);

export default BackButtonArea;
