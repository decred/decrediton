import { VoteTimeChart } from "charts";
import { myTicketsCharts }  from "connectors";

const VoteTimeChartPage = ({ voteTimeStats }) =>
  <div>
    <VoteTimeChart data={voteTimeStats}  />
  </div>;

export default myTicketsCharts(VoteTimeChartPage);
