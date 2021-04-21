import { classNames } from "pi-ui";
import styles from "./ContentContainer.module.css";

const ContentContainer = ({ className, children }) => (
  <div className={classNames(className, styles.contentContainer)}>
    {children}
  </div>
);

export default ContentContainer;
