import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { RescanButton } from "buttons";
import { RescanProgress } from "indicators";
import LastBlockTime from "./LastBlockTime/LastBlockTime";
import styles from "./MenuBottom.module.css";
import { classNames, Tooltip } from "pi-ui";

const MenuBarExpanded = ({
  isShowingAccounts,
  totalBalance,
  rescanRequest,
  currentBlockHeight,
  rescanAttempt,
  lastBlockTimestamp,
  onShowAccounts,
  onHideAccounts,
  isSPV,
  peersCount,
  onAccountsListWheel
}) => (
  <div className={styles.bottom}>
    <div
      className={styles.short}
      onMouseEnter={rescanRequest ? null : onShowAccounts}
      onMouseLeave={rescanRequest ? null : onHideAccounts}
      onWheel={onAccountsListWheel}>
      <div
        className={classNames(
          styles.shortSeparator,
          isShowingAccounts && styles.showAccounts
        )}></div>
      <div className={styles.shortName}>
        <T id="sidebar.totalBalance" m="Total Balance" />:
      </div>
      <div className={styles.shortValue}>
        <Balance amount={totalBalance} />
      </div>
    </div>
    <div className={styles.latestBlock}>
      {rescanRequest ? <RescanProgress /> : null}
      {currentBlockHeight && !rescanRequest && (
        <>
          <div className={styles.rescanButtonArea}>
            <RescanButton {...{ rescanRequest, rescanAttempt }} />
          </div>
          <a className={styles.latestBlockName}>
            <T id="sidebar.latestBlock" m="Latest Block" />
            <span className={style.latestBlockNumber}>
              {currentBlockHeight}
            </span>
          </a>
          {isSPV && (
            <Tooltip content={<T id="sidebar.spvMode" m="SPV Mode" />}>
              <div className={styles.spvIcon} />
            </Tooltip>
          )}
          <div className={styles.latestBlockTime}>
            <LastBlockTime lastBlockTimestamp={lastBlockTimestamp} />
          </div>
        </>
      )}
    </div>
    <div className={styles.peersCount}>
      <span className={styles.peersCountLabel}>
        <T id="sidebar.peersCount" m="Peers" />
      </span>
      <span className={styles.peersCountValue}>&nbsp;{peersCount}</span>
    </div>
  </div>
);

export default MenuBarExpanded;
