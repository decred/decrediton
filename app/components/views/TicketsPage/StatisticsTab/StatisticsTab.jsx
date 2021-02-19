import { NavLink as Link, Switch, Route, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import VoteTimeChartPage from "./charts/VoteTime";
import StakeRewardsChartPage from "./charts/StakeRewards";
import HeatmapStats from "./Heatmap/Heatmap";
import StakePoolStats from "./charts/StakePoolStats";
import { DecredLoading, NoStats } from "indicators";
import { Tooltip, Subtitle } from "shared";
import { useStatistics } from "./hooks.js";
import styles from "./Statistics.module.css";
import { classNames } from "pi-ui";

const subtitleMenu = ({ allStakePoolStats, hasStats }) => (
  <div className={styles.myTicketsStatsLinks}>
    {allStakePoolStats.length > 0 && (
      <Tooltip
        text={<T id="mytickets.statistics.stakepoolstats.title" m="VSP" />}>
        <Link
          to="/tickets/statistics/stakepool"
          activeClassName={classNames(
            styles.myTicketsActiveChartLink,
            styles.stakepool
          )}
          className={styles.stakepool}
        />
      </Tooltip>
    )}
    {hasStats && (
      <>
        <Tooltip
          text={
            <T id="mytickets.statistics.stakerewards.link" m="Stake Rewards" />
          }>
          <Link
            to="/tickets/statistics/stakerewards"
            activeClassName={classNames(
              styles.myTicketsActiveChartLink,
              styles.stakerewards
            )}
            className={styles.stakerewards}
          />
        </Tooltip>
        <Tooltip
          text={<T id="mytickets.statistics.votetime.link" m="Vote Time" />}>
          <Link
            to="/tickets/statistics/voteTime"
            activeClassName={classNames(
              styles.myTicketsActiveChartLink,
              styles.voteTime
            )}
            className={styles.voteTime}
          />
        </Tooltip>
        <Tooltip
          text={<T id="mytickets.statistics.heatmap.link" m="Heatmap" />}>
          <Link
            to="/tickets/statistics/heatmap"
            activeClassName={classNames(
              styles.myTicketsActiveChartLink,
              styles.heatmapIcon
            )}
            className={styles.heatmapIcon}
          />
        </Tooltip>
      </>
    )}
  </div>
);

const StatisticsTab = () => {
  const {
    getMyTicketsStatsRequest,
    hasStats,
    hasTickets,
    allStakePoolStats
  } = useStatistics();

  if (!hasTickets && allStakePoolStats.length === 0) return <NoStats />;
  return (
    <>
      <Subtitle
        title={<T id="statistics.subtitle" m="Statistics" />}
        className={styles.isRow}
        children={subtitleMenu({ allStakePoolStats, hasStats })}
      />
      <div className={styles.charts}>
        {getMyTicketsStatsRequest ? (
          <DecredLoading className={styles.newLogoAnimation} />
        ) : (
          <Switch>
            <Route
              path="/tickets/statistics/voteTime"
              component={VoteTimeChartPage}
            />
            <Route
              path="/tickets/statistics/stakerewards"
              component={StakeRewardsChartPage}
            />
            <Route
              path="/tickets/statistics/stakepool"
              component={StakePoolStats}
            />
            <Route
              path="/tickets/statistics/heatmap"
              component={HeatmapStats}
            />
            {hasStats || allStakePoolStats.length > 0 ? (
              <Redirect
                from="/tickets/statistics"
                exact
                to={
                  allStakePoolStats.length > 0
                    ? "/tickets/statistics/stakepool"
                    : hasStats
                    ? "/tickets/statistics/stakerewards"
                    : ""
                }
              />
            ) : null}
          </Switch>
        )}
      </div>
    </>
  );
};

export default StatisticsTab;
