import { classNames } from "pi-ui";
import styles from "./SubTitle.module.css";

const SubTitle = ({ className, children }) => (
  <div className={classNames(styles.subTitle, className)}>{children}</div>
);

export default SubTitle;
