// @flow
import React from "react";
import arrowUpLightBlue from "../icons/arrow-up-light-blue.svg";
import menulogo from "../icons/menu-logo.svg";
import MenuLink from "../MenuLink";
import "../fonts.css";

const styles = {
  menu:{
    position: "relative",
    overflow: "hidden",
    width: "298px",
    height: "100%",
    paddingBottom: "54px",
    float: "left",
    backgroundColor: "#0c1e3e",
  },
  menuLogo:{
    position: "relative",
    zIndex: "3",
    height: "60px",
    marginTop: "20px",
    backgroundColor: "#0c1e3e",
    backgroundImage: `url(${menulogo})`,
    backgroundPosition: "58px 50%",
    backgroundSize: "auto 30px",
    backgroundRepeat: "no-repeat",
  },
  testnetText: {
    color: "white",
    textAlign: "center",
    fontSize: "18px",
    height: "46px",
    fontFamily: "Inconsolata, monospace",
  },
  menuNavigation:{
    position: "absolute",
    left: "0px",
    top: "106px",
    right: "0px",
    bottom: "122px",
    zIndex: "1",
    overflow: "auto",
  },

  menuTotalBalanceExtended: {
    position: "absolute",
    left: "0px",
    top: "106px",
    right: "0px",
    bottom: "157px",
    zIndex: "2",
    overflow: "auto",
    backgroundColor: "rgba(9, 24, 45, .8)",
    transition: "all 100ms cubic-bezier(.86, 0, .07, 1)",
  },
  menuTotalBalanceExtendedHidden: {
    display: "none",
    position: "absolute",
    left: "0px",
    top: "106px",
    right: "0px",
    bottom: "157px",
    zIndex: "2",
    overflow: "auto",
    backgroundColor: "rgba(9, 24, 45, .8)",
    transition: "all 100ms cubic-bezier(.86, 0, .07, 1)",
  },
  menuTotalBalanceExtendedBottom: {
    position: "absolute",
    left: "0px",
    right: "0px",
    bottom: "0px",
    overflow: "auto",
    maxHeight: "100%",
    paddingRight: "18px",
    paddingLeft: "18px",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  menuTotalBalanceExtendedBottomAccount: {
    display: "block",
    height: "44px",
    paddingTop: "24px",
    alignSelf: "stretch",
    flex: "0 0 auto",
  },
  menuTotalBalanceExtendedBottomAccountName: {
    float: "left",
    color: "#69d5f7",
    fontSize: "13px",
    lineHeight: "10px",
    textAlign: "left",
  },
  menuTotalBalanceExtendedBottomAccountNumber: {
    float: "right",
    fontFamily: "Inconsolata, monospace",
    color: "#2ed8a3",
    fontSize: "15px",
    lineHeight: "10px",
    textAlign: "right",
  },
  menuBottom: {
    position: "absolute",
    left: "0px",
    right: "0px",
    bottom: "0px",
    zIndex: "2",
  },
  menuBottomTotalBalanceShort: {
    position: "relative",
    height: "56px",
    paddingTop: "14px",
    paddingRight: "18px",
    paddingLeft: "18px",
    backgroundColor: "#0c1e3e",
    cursor: "pointer",
  },
  menuBottomTotalBalanceShortSeperator: {
    height: "7px",
    marginBottom: "15px",
    borderBottom: "1px solid #69d5f7",
    backgroundImage: `url(${arrowUpLightBlue})`,
    backgroundPosition: "50% 0px",
    backgroundRepeat: "no-repeat",
  },
  menuBottomTotalBalanceShortName: {
    float: "left",
    color: "#69d5f7",
    fontSize: "13px",
    lineHeight: "10px",
    textAlign: "left",
    textDecoration: "none",
  },
  menuBottomTotalBalanceShortValue: {
    float: "right",
    fontFamily: "Inconsolata, monospace",
    color: "#2ed8a3",
    fontSize: "13px",
    lineHeight: "10px",
    textAlign: "right",
  },
  menuBottomLatestBlock: {
    position: "relative",
    height: "89px",
    paddingTop: "14px",
    paddingRight: "18px",
    paddingLeft: "18px",
    backgroundColor: "#09182d",
  },
  menuBottomLatestBlockName: {
    float: "left",
    color: "#69d5f7",
    fontSize: "13px",
    lineHeight: "10px",
    textAlign: "left",
    textDecoration: "none",
  },
  menuBottomLatestBlockNumber: {
    fontFamily: "Inconsolata, monospace",
    color: "#2ed8a3",
  },
  menuBottomLatestBlockTime: {
    float: "right",
    color: "#69d5f7",
    fontSize: "13px",
    lineHeight: "10px",
    textAlign: "right",
    textDecoration: "none",
  },
  sidebarHelp: {
    display: "block",
    height: "215px",
    marginTop: "20px",
    paddingLeft: "18px",
    paddingRight: "18px",
  },
  sidebarHelpTitle: {
    borderTop: "1px solid #69d5f7",
    borderBottom: "1px solid #69d5f7",
    paddingLeft: "5px",
    display: "block",
    height: "38px",
    paddingTop: "15px",
    color: "#c4cbd2",
    fontSize: "18px",
    textAlign: "left",
    textDecoration: "none",
    textTransform: "capitalize",
  },
};

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
  onHideAccounts
}) => (
  <div style={styles.menu}>
    <div style={styles.menuLogo}></div>
    {isTestNet ? <div style={styles.testnetText}>Testnet</div> : null}
    {(gettingStarted || errorPage) ? null : (
      <div>
        <div style={styles.menuNavigation}>
          <MenuLink to="/home">Overview</MenuLink>
          <MenuLink to="/accounts">Accounts</MenuLink>
          <MenuLink to="/send">Send</MenuLink>
          <MenuLink to="/receive">Receive</MenuLink>
          <MenuLink to="/history">History</MenuLink>
          <MenuLink to="/proofofstake">Tickets</MenuLink>
          <MenuLink to="/settings">Settings</MenuLink>
          <MenuLink to="/help">Help</MenuLink>
        </div>
        <div style={isShowingAccounts ? styles.menuTotalBalanceExtended : styles.menuTotalBalanceExtendedHidden }>
          <div style={styles.menuTotalBalanceExtendedBottom}>
            {balances.map(({ hidden, total, accountName }) => hidden ? null : (
              <div style={styles.menuTotalBalanceExtendedBottomAccount} key={accountName}>
                <div style={styles.menuTotalBalanceExtendedBottomAccountName}>{accountName}</div>
                <div style={styles.menuTotalBalanceExtendedBottomAccountNumber}>{total / 100000000}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.menuBottom}>
          <div
            style={styles.menuBottomTotalBalanceShort}
            onMouseEnter={onShowAccounts}
            onMouseLeave={onHideAccounts}
          >
            <div style={styles.menuBottomTotalBalanceShortSeperator}></div>
            <div style={styles.menuBottomTotalBalanceShortName}>Total balance:</div>
            <div style={styles.menuBottomTotalBalanceShortValue}>{totalBalance.toString()}</div>
          </div>
          {currentHeight ? (
            <div style={styles.menuBottomLatestBlock}>
              <a style={styles.menuBottomLatestBlockName}>
                {synced ? "Latest block: " : "Synced to block: "}
                <span style={styles.menuBottomLatestBlockNumber}>{currentHeight}</span>
              </a>
              <div style={styles.menuBottomLatestBlockTime}>{timeBackString}</div>
            </div>
          ) : null}
        </div>
      </div>
    )}
  </div>
);

export default Bar;
