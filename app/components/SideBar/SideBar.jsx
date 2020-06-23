import MenuLinks from "./MenuLinks/MenuLinks";
import Logo from "./Logo/Logo";
import { classNames } from "pi-ui";
import style from "./SideBar.module.css";
import { useSideBar } from "./hooks";
import MenuBottomExpanded from "./MenuBottom/MenuBottomExpanded";
import AccountsList from "./AccountsList/AccountsList";
import MenuBottomCollapsed from "./MenuBottom/MenuBottomCollapsed";

const SideBar = () => {
  const {
    isShowingAccounts,
    onShowAccounts,
    onHideAccounts,
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
  } = useSideBar();

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
        <AccountsList
          {...{
            isShowingAccounts,
            balances
          }}
        />
      </div>
      {expandSideBar ? (
        <MenuBottomExpanded
          {...{
            isShowingAccounts,
            totalBalance,
            rescanRequest,
            currentBlockHeight,
            rescanAttempt,
            lastBlockTimestamp,
            onShowAccounts,
            onHideAccounts
          }}
        />
      ) : (
        <MenuBottomCollapsed
          {...{
            rescanRequest,
            rescanAttempt,
            rescanCancel,
            sidebarOnBottom
          }}
        />
      )}
    </div>
  );
};

export default SideBar;
