import { classNames } from "pi-ui";
import styles from "./Title.module.css";

const Title = ({ className, children }) => (
  <div className={classNames(styles.title, className)}>{children}</div>
);

export default Title;
