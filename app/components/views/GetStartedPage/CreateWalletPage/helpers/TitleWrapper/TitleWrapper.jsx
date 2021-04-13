import { classNames } from "pi-ui";
import styles from "./TitleWrapper.module.css";

const TitleWrapper = ({ children, title }) => (
  <div className={classNames(styles.titleWrapper, "flex-row")}>
    <div className={styles.title}>{title}</div>
    {children}
  </div>
);

export default TitleWrapper;
