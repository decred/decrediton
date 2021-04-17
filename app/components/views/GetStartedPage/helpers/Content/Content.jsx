import { classNames } from "pi-ui";
import styles from "./Content.module.css";

const Content = ({ className, children }) => (
  <div className={classNames(styles.content, className)}>{children}</div>
);

export default Content;
