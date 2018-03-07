import { VoteTimeChart } from "charts";
import { myTicketsCharts }  from "connectors";
import { FormattedMessage as T } from "react-intl";

const VoteTimeChartPage = ({ voteTimeStats, medianVoteTime, ninetyFifthPercentileVoteTime }) => {
  return (
    <Aux>
      <div className="my-tickets-stats-chart">
        <VoteTimeChart data={voteTimeStats}  />
      </div>
      <div className="my-tickets-stats-indicators">
        <div>
          <T id="mytickets.statistics.votetime.median"
            m="Median vote time: {value, plural, =0 {in the same day} one { within one day } other {within # days} }"
            values={{ value: medianVoteTime }} />
        </div>
        <div>
          <T id="mytickets.statistics.votetime.ninetyfifthpercentile"
            m="95% of tickets voted {value, plural, =0 {in the same day} one { within one day } other {within # days} }"
            values={{ value: ninetyFifthPercentileVoteTime }} />
        </div>
      </div>
    </Aux>
  );
};

export default myTicketsCharts(VoteTimeChartPage);
