import { NavLink as Link, Switch, Route, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import VoteTimeChartPage from "./charts/VoteTime";
import StakeROIChartPage from "./charts/StakeROI";

const LoadingStatsIndicator = () => <div>Loading Stats...</div>;

const TicketsStatsPage = ({ getMyTicketsStatsRequest, hasStats }) => (
  <Aux>
    <div className="tickets-stats-links">
      <Link to="/tickets/statistics/voteTime"><T id="mytickets.stats.voteTime" m="Vote Time" /></Link>
      <Link to="/tickets/statistics/roi"><T id="mytickets.stats.roi" m="ROI" /></Link>
    </div>

    {getMyTicketsStatsRequest ? <LoadingStatsIndicator /> : null}

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
