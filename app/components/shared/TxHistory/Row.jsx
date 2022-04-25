import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import styles from "./TxHistory.module.css";

const Row = ({
  pending,
  onClick,
  className,
  children,
  overview,
  eligible,
  active
}) => (
  <div
    className={classNames(
      overview && pending && classNames("flex-row", styles.overviewPending),
      overview && styles.overviewRow,
      !overview && classNames("flex-row", styles.historyRow),
      eligible && styles.eligibleRow,
      active && styles.activeRow
    )}>
    <div className={classNames(styles.txInfo, className)} onClick={onClick}>
      <div className={styles.txRowWrapper}>{children}</div>
      {pending && (
        <>
          {overview && (
            <div className={styles.pendingLabel}>
              <T id="txhistory.pending" m="Pending" />
            </div>
          )}
          <Tooltip content={<T id="txHistory.Pending" m="Pending" />}>
            <div className={styles.pendingOverviewDetails} onClick={onClick} />
          </Tooltip>
        </>
      )}
    </div>
  </div>
);

export default Row;
