// @flow
import React from "react";
import PropTypes from "prop-types";
import MenuLink from "../MenuLink";
import "../../style/Fonts.less";
import "../../style/SideBar.less";
import RescanProgress from "../RescanProgress";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { tsToDate } from "../../helpers/dateFormat";

const Bar = ({
  isTestNet,
  balances,
  synced,
  currentHeight,
  lastBlockTimestamp,
  totalBalance,
  isShowingAccounts,
  onShowAccounts,
  onHideAccounts,
  rescanRequest,
  showingSidebarMenu,
}) => (
  <div className={"sidebar-menu " + (isTestNet ? "sidebar-testnet" : "sidebar-mainnet")}>
  <div className="sidebar-menu-logo"></div>
  {isTestNet ? <div className="sidebar-testnet-text">Testnet</div> : null}
  {(!showingSidebarMenu) ? null : (
    <div>
      <div className="sidebar-menu-navigation">
        <MenuLink to="/home"><T id="menu.overview" m="Overview"/></MenuLink>
        <MenuLink to="/accounts"><T id="menu.accounts" m="Accounts"/></MenuLink>
        <MenuLink to="/send"><T id="menu.send" m="Send"/></MenuLink>
        <MenuLink to="/receive"><T id="menu.receive" m="Receive"/></MenuLink>
        <MenuLink to="/history"><T id="menu.history" m="History"/></MenuLink>
        <MenuLink to="/proofofstake"><T id="menu.tickets" m="Tickets"/></MenuLink>
        <MenuLink to="/security">Security Center</MenuLink>
        <MenuLink to="/settings"><T id="menu.settings" m="Settings"/></MenuLink>
        <MenuLink to="/help"><T id="menu.help" m="Help"/></MenuLink>
      </div>
      <div className="sidebar-menu-total-balance-extended" style={{ display: isShowingAccounts ? "block" : "none" }}>
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
        >
          {rescanRequest ?
          <RescanProgress/> :
          <div>
            <div className="sidebar-menu-bottom-total-balance-short-separator"></div>
            <div className="sidebar-menu-bottom-total-balance-short-name"><T id="sidebar.totalBalance" m="Total Balance"/>:</div>
            <div className="sidebar-menu-bottom-total-balance-short-value">{totalBalance.toString()}</div>
          </div> }
        </div>
        <div className="sidebar-menu-bottom-latest-block">
          {currentHeight ? (
            <div>
              <a className="sidebar-menu-bottom-latest-block-name">
                {synced
                  ? <T id="sidebar.latestBlock" m="Latest Block" />
                  : <T id="sidebar.syncedToBlock" m="Synced to block" /> }:
                <span className="sidebar-menu-bottom-latest-block-number"> {currentHeight}</span>
              </a>
              <div className="sidebar-menu-bottom-latest-block-time">
                {lastBlockTimestamp
                  ? <FormattedRelative
                    value={tsToDate(lastBlockTimestamp)}
                    updateInterval={30*1000}/>
                  : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )}
</div>
);

Bar.propTypes = {
  showingSidebarMenu: PropTypes.bool.isRequired,
};

export default Bar;
