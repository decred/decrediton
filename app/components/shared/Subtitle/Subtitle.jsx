import { classNames } from "pi-ui";
import styles from "./Subtitle.module.css";
import { DocButton } from "buttons";

export default ({ title, children, className, docUrl }) => (
  <div className={classNames(styles.tabbedPageSubtitle, className)}>
    <div className={styles.titleContainer}>
      {title}
      {docUrl && <DocButton className={styles.docButton} docUrl={docUrl} />}
    </div>
    {children}
  </div>
);
