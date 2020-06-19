// @flow
import MenuLinks from "../MenuLinks/MenuLinks";
import Logo from "./Logo/Logo";
import "style/SideBar.less";
import { classNames } from "pi-ui";
import style from "../SideBar.module.css";
import { useBar } from "./hooks";
import ExpandSideBar from "./MenuBottom/MenuBottomExpanded";
import AccountsList from "./AccountsList/AccountsList";
import CollapseSideBar from "./MenuBottom/MenuBottomCollapsed";

const Bar = ({
  isShowingAccounts,
  onShowAccounts,
  onHideAccounts
}) => {

  const {
    isTestNet,
    balances,
    currentBlockHeight,
    lastBlockTimestamp,
    totalBalance,
    expandSideBar,
    isWatchingOnly,
    sidebarOnBottom,
    accountMixerRunning,
    rescanRequest,
    onExpandSideBar,
    onReduceSideBar,
    rescanAttempt,
    rescanCancel
  } = useBar();

  return (
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
          <MenuLinks />
        </div>
      </div>
      <AccountsList {...{
        isShowingAccounts,
        balances
      }} />
      {expandSideBar ?
        <ExpandSideBar {...{
          isShowingAccounts,
          totalBalance,
          rescanRequest,
          currentBlockHeight,
          rescanAttempt,
          lastBlockTimestamp,
          onShowAccounts,
          onHideAccounts
        }} /> :
        <CollapseSideBar {...{
          rescanRequest,
          rescanAttempt,
          rescanCancel
        }}
        />}
    </div>
  );
};

export default Bar;
