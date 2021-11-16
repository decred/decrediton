import { classNames } from "pi-ui";
import styles from "./PageBody.module.css";
import { usePageBody } from "./hooks";

const PageBody = ({ className, getStarted, children, isTestNet, ...props }) => {
  const { pageBodyScrollHandler } = usePageBody();
  return (
    <div
      {...props}
      onScroll={pageBodyScrollHandler}
      className={classNames(
        styles.pageBody,
        getStarted && styles.getstarted,
        isTestNet && styles.testnetBody,
        className
      )}>
      {children}
    </div>
  );
};

export default PageBody;
