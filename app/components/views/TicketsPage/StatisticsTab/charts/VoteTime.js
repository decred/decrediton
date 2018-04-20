import { VoteTimeChart } from "charts";
import { myTicketsCharts }  from "connectors";
import { FormattedMessage as T } from "react-intl";

const VoteTimeChartPage = ({ voteTimeStats, averageVoteTime, medianVoteTime, ninetyFifthPercentileVoteTime }) => {
  return (
    <Aux>
      <div className="my-tickets-stats-chart">
        <VoteTimeChart data={voteTimeStats}  />
      </div>
      <div className="my-tickets-stats-indicators">
        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.votetime.average.label" m="Average vote time:" />
          </div>
          <div className="my-tickets-stats-indicators-value">
            <T id="mytickets.statistics.votetime.average.value" m="{value, plural, =0 {in the same day} one { within one day } other {within # days} }"
              values={{ value: averageVoteTime }} />
          </div>
        </div>

        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.votetime.median.label" m="Median vote time:" />
          </div>
          <div className="my-tickets-stats-indicators-value">
            <T id="mytickets.statistics.votetime.median.value" m="{value, plural, =0 {in the same day} one { within one day } other {within # days} }"
              values={{ value: medianVoteTime }} />
          </div>
        </div>

        <div className="my-tickets-stats-indicators-row">
          <div className="my-tickets-stats-indicators-label">
            <T id="mytickets.statistics.votetime.ninetyfifthpercentile.label" m="95% of tickets voted:" />
          </div>
          <div className="my-tickets-stats-indicators-value">
            <T id="mytickets.statistics.votetime.ninetyfifthpercentile.value" m="{value, plural, =0 {in the same day} one { within one day } other {within # days} }"
              values={{ value: ninetyFifthPercentileVoteTime }} />
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default myTicketsCharts(VoteTimeChartPage);
