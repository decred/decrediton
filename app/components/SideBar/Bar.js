// @flow
import { FormattedMessage as T } from "react-intl";
import { RescanProgress } from "indicators";
import MenuLinks from "./MenuLinks";
import Logo from "./Logo";
import LastBlockTime from "./LastBlockTime";
import { Balance } from "shared";
import { RescanButton, RescanCancelButton } from "buttons";
import "style/Fonts.less";
import "style/SideBar.less";
import cx from "classnames";

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
  rescanCancel
}) => (
  <div className={cx("sidebar", !expandSideBar && "sidebar-reduced", !expandSideBar && sidebarOnBottom && "sidebar-on-bottom")}>
    <Logo {...{ isTestNet, expandSideBar, sidebarOnBottom, onReduceSideBar, onExpandSideBar, isWatchingOnly }} />
    <div className="sidebar-main">
      <div className="sidebar-scroll">
        <MenuLinks {...{ expandSideBar, sidebarOnBottom }}/>
      </div>
      <div className="sidebar-menu-total-balance-extended" style={{ display: isShowingAccounts ? "flex" : "none" }}>
        <div className="sidebar-menu-total-balance-extended-bottom">
          { balances.map(({ hidden, total, accountName, accountNumber }) => !hidden &&
          <div className={cx("sidebar-menu-total-balance-extended-bottom-account", isImported(accountNumber) && "imported")} key={accountName}>
            <div className="sidebar-menu-total-balance-extended-bottom-account-name">
              {accountName === "default" ? <T id="sidebar.accounts.name.default" m="Primary Account" /> : accountName}:
            </div>
            <div className="sidebar-menu-total-balance-extended-bottom-account-number">{total ? <Balance hideCurrency amount={total}/> : 0}</div>
          </div> )}
        </div>
      </div>
    </div>
    {expandSideBar ?
      <div className="sidebar-menu-bottom">
        <div
          className="sidebar-menu-bottom-total-balance-short"
          onMouseEnter={rescanRequest ? null : onShowAccounts}
          onMouseLeave={rescanRequest ? null : onHideAccounts}
        >
          <div className={cx("sidebar-menu-bottom-total-balance-short-separator", isShowingAccounts && "showAccounts")}></div>
          <div className="sidebar-menu-bottom-total-balance-short-name"><T id="sidebar.totalBalance" m="Total Balance"/>:</div>
          <div className="sidebar-menu-bottom-total-balance-short-value"><Balance amount={totalBalance} /></div>
        </div>
        <div className="sidebar-menu-bottom-latest-block">
          { rescanRequest ? <RescanProgress/> : null }
          {(currentBlockHeight && !rescanRequest) &&
            <>
              <div className="rescan-button-area">
                <RescanButton {...{ rescanRequest, rescanAttempt }} />
              </div>
              <a className="sidebar-menu-bottom-latest-block-name">
                <T id="sidebar.latestBlock" m="Latest Block" />
                <span className="sidebar-menu-bottom-latest-block-number"> {currentBlockHeight}</span>
              </a>
              <div className="sidebar-menu-bottom-latest-block-time">
                <LastBlockTime lastBlockTimestamp={lastBlockTimestamp} />
              </div>
            </>}
        </div>
      </div> :
      <div className="sidebar-menu-bottom-latest-block">
        <div className="rescan-button-area">
          <RescanButton {...{ rescanRequest, rescanAttempt }} />
          {rescanRequest &&  <RescanCancelButton {...{ rescanRequest, rescanCancel }} />}
        </div>
      </div>
    }
  </div>
);

Bar.propTypes = {
  expandSideBar: PropTypes.bool.isRequired
};

export default Bar;
