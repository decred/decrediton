import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { RescanButton } from "buttons";
import { RescanProgress } from "indicators";
import LastBlockTime from "./LastBlockTime/LastBlockTime";
import style from "./MenuBottom.module.css";
import { classNames } from "pi-ui";

const MenuBarExpanded = ({
  isShowingAccounts,
  totalBalance,
  rescanRequest,
  currentBlockHeight,
  rescanAttempt,
  lastBlockTimestamp,
  onShowAccounts,
  onHideAccounts
}) => (
  <div className={style.sidebarMenuBottom}>
    <div
      className={style.sidebarMenuBottomTotalBalanceShort}
      onMouseEnter={rescanRequest ? null : onShowAccounts}
      onMouseLeave={rescanRequest ? null : onHideAccounts}>
      <div
        className={classNames(
          style.sidebarMenuBottomTotalBalanceShortSeparator,
          isShowingAccounts && style.showAccounts
        )}></div>
      <div className={style.sidebarMenuBottomTotalBalanceShortName}>
        <T id="sidebar.totalBalance" m="Total Balance" />:
      </div>
      <div className={style.sidebarMenuBottomTotalBalanceShortValue}>
        <Balance amount={totalBalance} />
      </div>
    </div>
    <div className={style.sidebarMenuBottomLatestBlock}>
      {rescanRequest ? <RescanProgress /> : null}
      {currentBlockHeight && !rescanRequest && (
        <>
          <div className={style.rescanButtonArea}>
            <RescanButton {...{ rescanRequest, rescanAttempt }} />
          </div>
          <a className={style.sidebarMenuBottomLatestBlockName}>
            <T id="sidebar.latestBlock" m="Latest Block" />
            <span className={style.sidebarMenuBottomLatestBlockNumber}>
              {" "}
              {currentBlockHeight}
            </span>
          </a>
          <div className={style.sidebarMenuBottomLatestBlockTime}>
            <LastBlockTime lastBlockTimestamp={lastBlockTimestamp} />
          </div>
        </>
      )}
    </div>
  </div>
);

export default MenuBarExpanded;
