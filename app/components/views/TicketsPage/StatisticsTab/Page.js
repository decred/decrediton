import { NavLink as Link, Switch, Route, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import VoteTimeChartPage from "./charts/VoteTime";
import StakeRewardsChartPage from "./charts/StakeRewards";
import StakePoolStats from "./charts/StakePoolStats";
import { DecredLoading, NoStats } from "indicators";
import { Tooltip } from "shared";

const TicketsStatsPage = ({ getMyTicketsStatsRequest, hasStats, hasTickets, allStakePoolStats }) => {
  if (!hasTickets && allStakePoolStats.length === 0) return <NoStats />;
  return (
    <Aux>
      <div className="tabbed-page-subtitle"><T id="statistics.subtitle" m="Statistics"/>
        <div className="my-tickets-stats-links">
          { allStakePoolStats.length > 0 &&
            <Tooltip text={<T id="mytickets.statistics.stakepoolstats.title" m="Stake Pool" />}>
              <Link to="/tickets/statistics/stakepool" activeClassName="my-tickets-active-chart-link stakepool" className="stakepool"/>
            </Tooltip>
          }
          { hasStats &&
            <Aux>
              <Tooltip text={<T id="mytickets.statistics.stakerewards.link" m="Stake Rewards" />}>
                <Link to="/tickets/statistics/stakerewards" activeClassName="my-tickets-active-chart-link stakerewards" className="stakerewards"/>
              </Tooltip>
              <Tooltip text={<T id="mytickets.statistics.votetime.link" m="Vote Time" />}>
                <Link to="/tickets/statistics/voteTime" activeClassName="my-tickets-active-chart-link vote-time" className="vote-time"/>
              </Tooltip>
            </Aux>
          }
        </div>
      </div>
      <div className="my-tickets-charts">
        {getMyTicketsStatsRequest ? <DecredLoading /> :
          <Switch>
            <Route path="/tickets/statistics/voteTime" component={VoteTimeChartPage} />
            <Route path="/tickets/statistics/stakerewards" component={StakeRewardsChartPage} />
            <Route path="/tickets/statistics/stakepool" component={StakePoolStats} />
            {hasStats || allStakePoolStats.length > 0 ? <Redirect from="/tickets/statistics" exact to={allStakePoolStats.length > 0 ? "/tickets/statistics/stakepool" : hasStats ? "/tickets/statistics/stakerewards" : ""}/> : null}
          </Switch>
        }
      </div>
    </Aux>);
};

export default TicketsStatsPage;
