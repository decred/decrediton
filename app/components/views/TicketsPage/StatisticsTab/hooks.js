import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sta from "actions/StatisticsActions";

export function useStatistics() {
  const ticketPoolSize = useSelector(sel.ticketPoolSize);
  const allStakePoolStats = useSelector(sel.networkStakePoolStatsList);
  const voteTimeStats = useSelector(sel.voteTimeStats);
  const getMyTicketsStatsRequest = useSelector(sel.getMyTicketsStatsRequest);
  const stakeRewardsStats = useSelector(sel.stakeRewardsStats);
  const dailyBalancesStats = useSelector(sel.fullDailyBalancesStats);
  const medianVoteTime = useSelector(sel.medianVoteTime);
  const averageVoteTime = useSelector(sel.averageVoteTime);
  const ninetyFifthPercentileVoteTime = useSelector(
    sel.ninetyFifthPercentileVoteTime
  );
  const hasTickets = useSelector(sel.hasTickets);
  const selectedStakePool = useSelector(sel.selectedStakePool);
  const ticketDataHeatmap = useSelector(sel.ticketDataHeatmap);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);

  const dispatch = useDispatch();
  const getMyTicketsStats = useCallback(
    () => dispatch(sta.getMyTicketsStats()),
    [dispatch]
  );
  const getTicketsHeatmapStats = useCallback(
    () => dispatch(sta.getTicketsHeatmapStats()),
    [dispatch]
  );

  const [statQueried, setStatQueried] = useState(false);

  useEffect(() => {
    if (
      !voteTimeStats &&
      !getMyTicketsStatsRequest &&
      hasTickets &&
      !statQueried
    ) {
      setStatQueried(true);
      getMyTicketsStats();
    }
  }, [
    voteTimeStats,
    getMyTicketsStatsRequest,
    hasTickets,
    getMyTicketsStats,
    statQueried
  ]);

  const [stakePool, setStakePool] = useState(() => {
    let stakePool = allStakePoolStats[0];
    if (selectedStakePool) {
      const idxSel = allStakePoolStats.findIndex(
        (s) => s.Host === selectedStakePool.Host
      );
      if (idxSel > -1) {
        stakePool = allStakePoolStats[idxSel];
      }
    }

    return stakePool;
  });

  return {
    hasStats: voteTimeStats && !getMyTicketsStatsRequest,
    ticketPoolSize,
    allStakePoolStats,
    voteTimeStats,
    getMyTicketsStatsRequest,
    stakeRewardsStats,
    dailyBalancesStats,
    medianVoteTime,
    averageVoteTime,
    ninetyFifthPercentileVoteTime,
    hasTickets,
    selectedStakePool,
    ticketDataHeatmap,
    getMyTicketsStats,
    getTicketsHeatmapStats,
    stakePool,
    setStakePool,
    sidebarOnBottom
  };
}
