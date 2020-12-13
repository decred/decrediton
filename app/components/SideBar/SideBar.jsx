import AccountsList from "./AccountsList/AccountsList";
import MenuBottomExpanded from "./MenuBottom/MenuBottomExpanded";
import MenuBottomCollapsed from "./MenuBottom/MenuBottomCollapsed";
import MenuLinks from "./MenuLinks/MenuLinks";
import Logo from "./Logo/Logo";
import style from "./SideBar.module.css";
import { classNames } from "pi-ui";
import { useSideBar } from "./hooks";
import { useRescan } from "hooks";

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
    getRunningIndicator,
    rescanRequest,
    onExpandSideBar,
    onReduceSideBar,
    isSPV,
    peersCount,
    accountsListRef,
    onAccountsListWheel,
    uiAnimations
  } = useSideBar();
  const { rescanAttempt, rescanCancel } = useRescan();

  return (
    <div
      className={classNames(
        style.sidebar,
        uiAnimations && style.animated,
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
          getRunningIndicator
        }}
      />
      <div
        className={classNames(
          style.sidebarMain,
          isShowingAccounts && style.isShowingAccounts
        )}>
        <MenuLinks />
        <AccountsList
          {...{
            isShowingAccounts,
            balances,
            accountsListRef
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
            isSPV,
            peersCount,
            onAccountsListWheel
          }}
        />
      ) : (
        <MenuBottomCollapsed
          {...{
            rescanRequest,
            rescanAttempt,
            rescanCancel,
            sidebarOnBottom,
            isSPV
          }}
        />
      )}
    </div>
  );
};

export default SideBar;
