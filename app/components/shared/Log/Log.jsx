import { classNames } from "pi-ui";
import styles from "./Log.module.css";

const Logs = ({ expanded, onShowLog, onHideLog, log, title }) =>
  !expanded ? (
    <div className={classNames(styles.logArea, styles.hidden)}>
      <div
        className={classNames(styles.title, styles.hidden)}
        onClick={onShowLog}>
        {title}
      </div>
    </div>
  ) : (
    <div className={classNames(styles.logArea, styles.expanded)}>
      <div
        className={classNames(styles.title, styles.expanded)}
        onClick={onHideLog}>
        {title}
      </div>
      <div className={styles.logs}>
        <textarea rows="30" value={log} disabled />
      </div>
    </div>
  );

export default Logs;
