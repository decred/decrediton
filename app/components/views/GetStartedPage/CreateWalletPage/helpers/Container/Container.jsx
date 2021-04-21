import { classNames } from "pi-ui";
import styles from "./Container.module.css";

const Container = ({ className, children }) => (
  <div className={classNames(className, styles.container)}>{children}</div>
);

export default Container;
