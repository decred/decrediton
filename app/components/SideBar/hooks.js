import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "../../actions/ControlActions";
import * as sba from "../../actions/SidebarActions";

export function useSideBar() {
  const [isShowingAccounts, setIsShowingAccounts] = useState(false);

  const onShowAccounts = useCallback(() => {
    setIsShowingAccounts(true);
  }, [setIsShowingAccounts]);

  const onHideAccounts = useCallback(() => {
    setIsShowingAccounts(false);
  }, [setIsShowingAccounts]);

  const isTestNet = useSelector(sel.isTestNet);
  const balances = useSelector(sel.balances);
  const currentBlockHeight = useSelector(sel.currentBlockHeight);
  const lastBlockTimestamp = useSelector(sel.lastBlockTimestamp);
  const totalBalance = useSelector(sel.totalBalance);
  const expandSideBar = useSelector(sel.expandSideBar);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const rescanRequest = useSelector(sel.rescanRequest);

  const dispatch = useDispatch();

  const onExpandSideBar = useCallback(() => dispatch(sba.expandSideBar()), [dispatch]);
  const onReduceSideBar = useCallback(() => dispatch(sba.reduceSideBar()), [dispatch]);
  const rescanAttempt = useCallback(() => dispatch(ca.rescanAttempt()), [dispatch]);
  const rescanCancel = useCallback(() => dispatch(ca.rescanCancel()), [dispatch]);

  return {
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
  };
}
