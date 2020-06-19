import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "../../../actions/ControlActions";
import * as sba from "../../../actions/SidebarActions";

export function useBar() {
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

  const onExpandSideBar = useCallback(() => sba.expandSideBar()(dispatch), [dispatch]);
  const onReduceSideBar = useCallback(() => sba.reduceSideBar()(dispatch), [dispatch]);
  const rescanAttempt = useCallback(() => ca.rescanAttempt()(dispatch), [dispatch]);
  const rescanCancel = useCallback(() => ca.rescanCancel()(dispatch), [dispatch]);

  return {
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
