import { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sba from "../../actions/SidebarActions";

export function useSideBar() {
  const [isShowingAccounts, setIsShowingAccounts] = useState(false);

  const accountsListRef = useRef(null);

  const onAccountsListWheel = useCallback((e) =>
    accountsListRef.current.scrollBy({
      top: e.deltaY * 2,
      behavior: "smooth"
    })
    , []);

  const isTestNet = useSelector(sel.isTestNet);
  const balances = useSelector(sel.balances);
  const currentBlockHeight = useSelector(sel.currentBlockHeight);
  const lastBlockTimestamp = useSelector(sel.lastBlockTimestamp);
  const totalBalance = useSelector(sel.totalBalance);
  const expandSideBar = useSelector(sel.expandSideBar);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const getRunningIndicator = useSelector(sel.getRunningIndicator);
  const rescanRequest = useSelector(sel.rescanRequest);
  const isSPV = useSelector(sel.isSPV);
  const peersCount = useSelector(sel.getPeersCount);
  const uiAnimations = useSelector(sel.uiAnimations);

  const dispatch = useDispatch();

  const onExpandSideBar = useCallback(() => dispatch(sba.expandSideBar()), [
    dispatch
  ]);
  const onReduceSideBar = useCallback(() => dispatch(sba.reduceSideBar()), [
    dispatch
  ]);

  return {
    isShowingAccounts,
    onShowAccounts: () => setIsShowingAccounts(true),
    onHideAccounts: () => setIsShowingAccounts(false),
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
  };
}
