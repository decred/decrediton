import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { RescanButton } from "buttons";
import { RescanProgress } from "indicators";
import LastBlockTime from "./LastBlockTime/LastBlockTime";
import style from "./MenuBottom.module.css";
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
  isSPV
}) => (
  <div className={style.bottom}>
    <div
      className={style.short}
      onMouseEnter={rescanRequest ? null : onShowAccounts}
      onMouseLeave={rescanRequest ? null : onHideAccounts}>
      <div
        className={classNames(
          style.shortSeparator,
          isShowingAccounts && style.showAccounts
        )}></div>
      <div className={style.shortName}>
        <T id="sidebar.totalBalance" m="Total Balance" />:
      </div>
      <div className={style.shortValue}>
        <Balance amount={totalBalance} />
      </div>
    </div>
    <div className={style.latestBlock}>
      {rescanRequest ? <RescanProgress /> : null}
      {currentBlockHeight && !rescanRequest && (
        <>
          <div className={style.rescanButtonArea}>
            <RescanButton {...{ rescanRequest, rescanAttempt }} />
          </div>
          <a className={style.latestBlockName}>
            <T id="sidebar.latestBlock" m="Latest Block" />
            <span className={style.latestBlockNumber}>
              {" "}
              {currentBlockHeight}
            </span>
          </a>
          {isSPV && (
            <Tooltip content={<T id="sidebar.spvMode" m="SPV Mode" />}>
              <div className={style.spvIcon} />
            </Tooltip>
          )}
          <div className={style.latestBlockTime}>
            <LastBlockTime lastBlockTimestamp={lastBlockTimestamp} />
          </div>
        </>
      )}
    </div>
  </div>
);

export default MenuBarExpanded;
