import AccountsList from "./AccountsList/AccountsList";
import MenuBottomExpanded from "./MenuBottom/MenuBottomExpanded";
import MenuBottomCollapsed from "./MenuBottom/MenuBottomCollapsed";
import MenuLinks from "./MenuLinks/MenuLinks";
import Logo from "./Logo/Logo";
import style from "./SideBar.module.css";
import { classNames } from "pi-ui";
import { useSideBar } from "./hooks";

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
    rescanCancel,
    isSPV
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
            onHideAccounts,
            isSPV
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
