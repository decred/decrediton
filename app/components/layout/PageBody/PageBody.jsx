import { classNames } from "pi-ui";
import styles from "./PageBody.module.css";

const PageBody = ({ className, getStarted, children, isTestNet, ...props }) => (
  <div
    {...props}
    className={classNames(
      styles.pageBody,
      getStarted && styles.getstarted,
      isTestNet && styles.testnetBody,
      className
    )}>
    {children}
  </div>
);

export default PageBody;
