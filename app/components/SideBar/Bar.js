// @flow
import React from "react";
import PropTypes from "prop-types";
import MenuLink from "../MenuLink";
import "../../style/Fonts.less";
import "../../style/SideBar.less";
import RescanProgress from "../RescanProgress";
import { FormattedMessage as T, FormattedRelative } from "react-intl";

const Bar = ({
  isTestNet,
  balances,
  synced,
  currentHeight,
  lastBlockDate,
  lastBlockIsRecent,
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
  { showingSidebarMenu &&
    <Aux>
      <div className="sidebar-menu-navigation">
        <MenuLink to="/home"><T id="menu.overview" m="Overview"/></MenuLink>
        <MenuLink to="/accounts"><T id="menu.accounts" m="Accounts"/></MenuLink>
        <MenuLink to="/transactions"><T id="menu.transactions" m="Transactions"/></MenuLink>
        <MenuLink to="/history"><T id="menu.history" m="History"/></MenuLink>
        <MenuLink to="/proofofstake"><T id="menu.tickets" m="Tickets"/></MenuLink>
        <MenuLink to="/security"><T id="menu.securitycenter" m="Security Center"/></MenuLink>
        <MenuLink to="/settings"><T id="menu.settings" m="Settings"/></MenuLink>
        <MenuLink to="/help"><T id="menu.help" m="Help"/></MenuLink>
        <div className="sidebar-menu-total-balance-extended" style={{ display: isShowingAccounts ? "block" : "none" }}>
          <div className="sidebar-menu-total-balance-extended-bottom">
            { balances.map(({ hidden, total, accountName }) => !hidden &&
            <div className="sidebar-menu-total-balance-extended-bottom-account" key={accountName}>
              <div className="sidebar-menu-total-balance-extended-bottom-account-name">{accountName}</div>
              <div className="sidebar-menu-total-balance-extended-bottom-account-number">{total / 100000000}</div>
            </div> )}
          </div>
        </div>
      </div>
      <div className="sidebar-menu-bottom">
        <div
          className="sidebar-menu-bottom-total-balance-short"
          onMouseEnter={rescanRequest ? null : onShowAccounts}
          onMouseLeave={rescanRequest ? null : onHideAccounts}
        >
          { rescanRequest ? <RescanProgress/> :
          <Aux>
            <div className="sidebar-menu-bottom-total-balance-short-separator"></div>
            <div className="sidebar-menu-bottom-total-balance-short-name"><T id="sidebar.totalBalance" m="Total Balance"/>:</div>
            <div className="sidebar-menu-bottom-total-balance-short-value">{totalBalance.toString()}</div>
          </Aux> }
        </div>
        <div className="sidebar-menu-bottom-latest-block">
          { currentHeight &&
          <Aux>
            <a className="sidebar-menu-bottom-latest-block-name">
              { synced ?
                <T id="sidebar.latestBlock" m="Latest Block" /> :
                <T id="sidebar.syncedToBlock" m="Synced to block" /> }
              <span className="sidebar-menu-bottom-latest-block-number"> {currentHeight}</span>
            </a>
            <div className="sidebar-menu-bottom-latest-block-time">
              { lastBlockDate && lastBlockIsRecent ?
                <T id="sidebar.lastBlockIsRecent" m="< 1 minute ago" /> :
                lastBlockDate && <FormattedRelative value={lastBlockDate} updateInterval={1*1000}/> }
            </div>
          </Aux> }
        </div>
      </div>
    </Aux> }
</div>
);

Bar.propTypes = {
  showingSidebarMenu: PropTypes.bool.isRequired,
};

export default Bar;
