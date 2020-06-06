// @flow
import { FormattedMessage as T } from "react-intl";
import { RescanProgress } from "indicators";
import MenuLinks from "./MenuLinks";
import Logo from "./Logo";
import LastBlockTime from "./LastBlockTime";
import { Balance } from "shared";
import { RescanButton, RescanCancelButton } from "buttons";
import "style/SideBar.less";
import { classNames } from "pi-ui";
import style from "./SideBar.module.css"

const isImported = (accountNumber) => accountNumber === Math.pow(2, 31) - 1;
const Bar = ({
  isTestNet,
  balances,
  currentBlockHeight,
  lastBlockTimestamp,
  totalBalance,
  isShowingAccounts,
  onShowAccounts,
  onHideAccounts,
  rescanRequest,
  rescanAttempt,
  expandSideBar,
  sidebarOnBottom,
  onExpandSideBar,
  onReduceSideBar,
  isWatchingOnly,
  rescanCancel,
  accountMixerRunning
}) => (
    <div
      className={classNames(
        style.sidebar,
        !expandSideBar && style.sidebarReduced,
        !expandSideBar && sidebarOnBottom && style.sidebarOnBottom
      )}>
      <Logo
        {...{
          isTestNet,
          expandSideBar,
          sidebarOnBottom,
          onReduceSideBar,
          onExpandSideBar,
          isWatchingOnly,
          accountMixerRunning
        }}
      />
      <div className={style.sidebarMain}>
        <div className={style.sidebarScroll}>
          <MenuLinks {...{ expandSideBar, sidebarOnBottom }} />
        </div>
        <div
          className={style.sidebarMenuTotalBalanceExtended}
          style={{ display: isShowingAccounts ? "flex" : "none" }}>
          <div className={style.sidebarMenuTotalBalanceExtendedBottom}>
            {balances.map(
              ({ hidden, total, accountName, accountNumber }) =>
                !hidden && (
                  <div
                    className={classNames(
                      style.sidebarMenuTotalBalanceExtendedBottomAccount,
                      isImported(accountNumber) && style.imported
                    )}
                    key={accountName}>
                    <div className={style.sidebarMenuTotalBalanceExtendedBottomAccountName}>
                      {accountName === "default" ? (
                        <T
                          id="sidebar.accounts.name.default"
                          m="Primary Account"
                        />
                      ) : (
                          accountName
                        )}
                    :
                  </div>
                    <div className={style.sidebarMenuTotalBalanceExtendedBottomAccountNumber}>
                      {total ? <Balance hideCurrency amount={total} /> : 0}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      {expandSideBar ? (
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
                <div className={style.rescanAreaButton}>
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
      ) : (
          <div className={style.sidebarMenuBottomLatestBlock}>
            <div className={style.rescanAreaButton}>
              <RescanButton {...{ rescanRequest, rescanAttempt }} />
              {rescanRequest && (
                <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
              )}
            </div>
          </div>
        )}
    </div>
  );

Bar.propTypes = {
  expandSideBar: PropTypes.bool.isRequired
};

export default Bar;
