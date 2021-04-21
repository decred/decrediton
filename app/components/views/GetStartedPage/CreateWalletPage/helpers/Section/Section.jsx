import { classNames } from "pi-ui";
import styles from "./Section.module.css";

const Section = ({ className, children }) => (
  <div className={classNames(className, styles.section)}>{children}</div>
);

export default Section;
