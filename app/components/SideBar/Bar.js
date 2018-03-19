// @flow
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { RescanProgress } from "indicators";
import MenuLinks from "./MenuLinks";
import Logo from "./Logo";
import { Balance } from "shared";
import { RescanButton } from "buttons";
import "style/Fonts.less";
import "style/SideBar.less";

const Bar = ({
  isTestNet,
  balances,
  currentHeight,
  lastBlockDate,
  lastBlockIsRecent,
  totalBalance,
  isShowingAccounts,
  onShowAccounts,
  onHideAccounts,
  rescanRequest,
  rescanAttempt,
  showingSidebarMenu,
  expandSideBar,
  onExpandSideBar,
  onReduceSideBar,
}) => (
  <div className={(expandSideBar ? "sidebar-menu " : "sidebar-menu-reduced ") + (isTestNet ? "sidebar-testnet" : "sidebar-mainnet")}>
    <Logo {...{ isTestNet, expandSideBar, onReduceSideBar, onExpandSideBar }} />
    <Aux show={ showingSidebarMenu }>
      <div className="sidebar-main">
        <div className="sidebar-scroll">
          <MenuLinks {...{ expandSideBar }}/>
        </div>
        <div className="sidebar-menu-total-balance-extended" style={{ display: isShowingAccounts ? "flex" : "none" }}>
          <div className="sidebar-menu-total-balance-extended-bottom">
            { balances.map(({ hidden, total, accountName }) => !hidden &&
            <div className="sidebar-menu-total-balance-extended-bottom-account" key={accountName}>
              <div className="sidebar-menu-total-balance-extended-bottom-account-name">{accountName}</div>
              <div className="sidebar-menu-total-balance-extended-bottom-account-number">{total / 100000000}</div>
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
            <div className="sidebar-menu-bottom-total-balance-short-separator"></div>
            <div className="sidebar-menu-bottom-total-balance-short-name"><T id="sidebar.totalBalance" m="Total Balance"/>:</div>
            <div className="sidebar-menu-bottom-total-balance-short-value"><Balance amount={totalBalance} /></div>
          </div>
          <div className="sidebar-menu-bottom-latest-block">
            { rescanRequest ? <RescanProgress/> : null }
            <Aux show={ currentHeight && !rescanRequest }>
              <div className="rescan-button-area">
                <RescanButton {...{ rescanRequest, rescanAttempt }} />
              </div>
              <a className="sidebar-menu-bottom-latest-block-name">
                <T id="sidebar.latestBlock" m="Latest Block" />
                <span className="sidebar-menu-bottom-latest-block-number"> {currentHeight}</span>
              </a>
              <div className="sidebar-menu-bottom-latest-block-time">
                { lastBlockDate && lastBlockIsRecent ?
                  <T id="sidebar.lastBlockIsRecent" m="< 1 minute ago" /> :
                  lastBlockDate && <FormattedRelative value={lastBlockDate} updateInterval={1*1000}/> }
              </div>
            </Aux>
          </div>
        </div> :
        <div className="sidebar-menu-bottom-latest-block">
          <div className="rescan-button-area">
            <RescanButton {...{ rescanRequest, rescanAttempt }} />
          </div>
        </div>
      }
    </Aux>
  </div>
);

Bar.propTypes = {
  showingSidebarMenu: PropTypes.bool.isRequired,
};

export default Bar;
