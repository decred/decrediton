import { NavLink as Link, Switch, Route, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import VoteTimeChartPage from "./charts/VoteTime";
import StakeROIChartPage from "./charts/StakeROI";
import { DecredLoading } from "indicators";

const ChartLink = ({ to, icon, children }) =>
  <Link to={to} activeClassName="my-tickets-active-chart-link">
    <span className={[ "icon", icon ].join(" ")}></span>
    <div>{children}</div>
  </Link>;

const TicketsStatsPage = ({ getMyTicketsStatsRequest, hasStats }) => (
  <Aux>
    <div className="my-tickets-stats-links">
      <ChartLink to="/tickets/statistics/voteTime" icon="vote-time"><T id="mytickets.stats.voteTime" m="Vote Time" /></ChartLink>
      <ChartLink to="/tickets/statistics/roi" icon="roi"><T id="mytickets.stats.roi" m="ROI" /></ChartLink>
    </div>

    {getMyTicketsStatsRequest ? <DecredLoading /> : null}

    <div className="my-tickets-charts">
      <Switch>
        <Route path="/tickets/statistics/voteTime" component={VoteTimeChartPage} />
        <Route path="/tickets/statistics/roi" component={StakeROIChartPage} />
        {hasStats ? <Redirect from="/tickets/statistics" exact to="/tickets/statistics/voteTime" /> : null}
      </Switch>
    </div>

  </Aux>
);

export default TicketsStatsPage;
