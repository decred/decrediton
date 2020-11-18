import { classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { RescanButton } from "buttons";
import { RescanProgress } from "indicators";
import LastBlockTime from "./LastBlockTime/LastBlockTime";
import SpvIcon from "./SpvIcon/SpvIcon";
import styles from "./MenuBottom.module.css";

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
    <div className={styles.bottomBar}>
      <SpvIcon isSPV={isSPV} />
      {rescanRequest && <RescanProgress />}
      {currentBlockHeight && !rescanRequest && (
        <>
          <RescanButton {...{ rescanRequest, rescanAttempt }} />
          <div className={styles.bottomBarContent}>
            <div className={styles.latestBlockWithPeers}>
              <div className={styles.latestBlock}>
                <div>
                  <T id="sidebar.latestBlock" m="Latest Block" />
                </div>
                <div className={styles.latestBlockNumber}>
                  &nbsp;{currentBlockHeight}
                </div>
                <div className={styles.latestBlockTime}>
                  <LastBlockTime lastBlockTimestamp={lastBlockTimestamp} />
                </div>
              </div>
              <div className={styles.peersCount}>
                <span className={styles.peersCountLabel}>
                  <T id="sidebar.peersCount" m="Peers" />
                </span>
                <span className={styles.peersCountValue}>
                  &nbsp;{peersCount}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

export default MenuBarExpanded;
