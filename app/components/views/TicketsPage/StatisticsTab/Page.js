import { NavLink as Link, Switch, Route, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import VoteTimeChartPage from "./charts/VoteTime";
import StakeRewardsChartPage from "./charts/StakeRewards";
import StakePoolStats from "./charts/StakePoolStats";
import { DecredLoading, NoStats } from "indicators";
import { Tooltip } from "shared";

const TicketsStatsPage = ({ getMyTicketsStatsRequest, hasStats, allTickets }) => {
  if (allTickets.length === 0) return <NoStats />;
  return (
    <Aux>
      <div className="tabbed-page-subtitle"><T id="statistics.subtitle" m="Statistics"/>
        {hasStats ?
          <div className="my-tickets-stats-links">
            <Tooltip text={<T id="mytickets.statistics.votetime.title" m="Vote Time" />}>
              <Link to="/tickets/statistics/voteTime" activeClassName="my-tickets-active-chart-link vote-time" className="vote-time"/>
            </Tooltip>
            <Tooltip text={<T id="mytickets.statistics.stakerewards.title" m="Stake Rewards" />}>
              <Link to="/tickets/statistics/stakerewards" activeClassName="my-tickets-active-chart-link stakerewards" className="stakerewards"/>
            </Tooltip>
            <Tooltip text={<T id="mytickets.statistics.stakepoolstats.title" m="Stake Pool Stats" />}>
              <Link to="/tickets/statistics/stakepool" activeClassName="my-tickets-active-chart-link stakerewards" className="stakerewards"/>
            </Tooltip>
          </div> :
          <div />
        }
      </div>
      <div className="my-tickets-charts">
        {getMyTicketsStatsRequest ? <DecredLoading /> :
          <Switch>
            <Route path="/tickets/statistics/voteTime" component={VoteTimeChartPage} />
            <Route path="/tickets/statistics/stakerewards" component={StakeRewardsChartPage} />
            <Route path="/tickets/statistics/stakepool" component={StakePoolStats} />
            {hasStats ? <Redirect from="/tickets/statistics" exact to="/tickets/statistics/voteTime" /> : null}
          </Switch>
        }
      </div>
    </Aux>);
};

export default TicketsStatsPage;
