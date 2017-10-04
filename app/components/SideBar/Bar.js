// @flow
import React from "react";
import MenuLink from "../MenuLink";
import "../../style/Fonts.less";
import "../../style/SideBar.less";
import RescanProgress from "../RescanProgress";

const Bar = ({
  gettingStarted,
  errorPage,
  isTestNet,
  balances,
  synced,
  currentHeight,
  timeBackString,
  totalBalance,
  isShowingAccounts,
  onShowAccounts,
  onHideAccounts,
  rescanRequest,
  onBottomSidebarClick
}) => (
  <div className={"sidebar-menu " + (isTestNet ? "sidebar-testnet" : "sidebar-mainnet")}>
  <div className="sidebar-menu-logo"></div>
  {isTestNet ? <div className="sidebar-testnet-text">Testnet</div> : null}
  {(gettingStarted || errorPage) ? null : (
    <div>
      <div className="sidebar-menu-navigation">
        <MenuLink to="/home">Overview</MenuLink>
        <MenuLink to="/accounts">Accounts</MenuLink>
        <MenuLink to="/send">Send</MenuLink>
        <MenuLink to="/receive">Receive</MenuLink>
        <MenuLink to="/history">History</MenuLink>
        <MenuLink to="/proofofstake">Tickets</MenuLink>
        <MenuLink to="/settings">Settings</MenuLink>
        <MenuLink to="/help">Help</MenuLink>
      </div>
      <div className="sidebar-menu-total-balance-extended" id="sidebar-menu-total-balance-extended" style={{ display: isShowingAccounts ? "block" : "none" }}>
        <div className="sidebar-menu-total-balance-extended-bottom">
          {balances.map(({ hidden, total, accountName }) => hidden ? null : (
            <div className="sidebar-menu-total-balance-extended-bottom-account" key={accountName}>
              <div className="sidebar-menu-total-balance-extended-bottom-account-name">{accountName}</div>
              <div className="sidebar-menu-total-balance-extended-bottom-account-number">{total / 100000000}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-menu-bottom">
        <div
          className="sidebar-menu-bottom-total-balance-short"
          onMouseEnter={rescanRequest ? null : onShowAccounts}
          onMouseLeave={rescanRequest ? null : onHideAccounts}
          onClick={ onBottomSidebarClick }
        >
          {rescanRequest ?
          <RescanProgress/> :
          <div>
            <div className="sidebar-menu-bottom-total-balance-short-separator"></div>
            <div className="sidebar-menu-bottom-total-balance-short-name">Total balance:</div>
            <div className="sidebar-menu-bottom-total-balance-short-value">{totalBalance.toString()}</div>
          </div> }
        </div>
        <div className="sidebar-menu-bottom-latest-block">
          {currentHeight ? (
            <div>
              <a className="sidebar-menu-bottom-latest-block-name">
                {synced ? "Latest block: " : "Synced to block: "}
                <span className="sidebar-menu-bottom-latest-block-number">{currentHeight}</span>
              </a>
              <div className="sidebar-menu-bottom-latest-block-time">{timeBackString}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )}
</div>
);

export default Bar;
