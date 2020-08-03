import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import styles from "./TxHistory.module.css";

const Row = ({ pending, onClick, className, children, overview, eligible }) => (
  <div
    className={classNames(
      overview && pending && classNames("is-row", styles.overviewPending),
      overview && styles.overviewRow,
      !overview && classNames("is-row", styles.historyRow),
      eligible && styles.eligibleRow
    )}>
    <div className={classNames(styles.txInfo, className)} onClick={onClick}>
      <div className={styles.txRowWrapper}>{children}</div>
      {pending && (
        <Tooltip content={<T id="txHistory.Pending" m="Pending" />}>
          <div className={styles.pendingOverviewDetails} onClick={onClick} />
        </Tooltip>
      )}
    </div>
  </div>
);

export default Row;
