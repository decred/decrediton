import { classNames } from "pi-ui";
import styles from "./Subtitle.module.css";

export default ({ title, children, className }) => (
  <div className={classNames(styles.tabbedPageSubtitle, className)}>
    {title}
    {children}
  </div>
);
